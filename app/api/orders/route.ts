import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/mail/sendMail";
import { requireAdminAuth } from "@/lib/auth/api-helper";

/**
 * GET /api/orders
 * Fetch orders with pagination and optional status filter
 * Query params: page (default: 1), limit (default: 20), status (optional)
 * Requires admin authentication with full signature verification
 */
export async function GET(request: NextRequest) {
  // Verificar autenticación con validación completa de firma
  const auth = await requireAdminAuth(request);
  if (!auth.success) {
    return auth.response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = searchParams.get("status");
    
    const currentPage = Math.max(1, page);
    const pageSize = Math.min(Math.max(1, limit), 100);
    const skip = (currentPage - 1) * pageSize;

    // Build where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // Get total count for pagination metadata
    const total = await prisma.orders.count({ where });
    
    // Fetch paginated orders with items
    const orders = await prisma.orders.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Create a new order
 * Public route - customers can create orders
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order items are required",
        },
        { status: 400 }
      );
    }

    const normalizedItems = rawItems.map((item: any) => {
      const productId = Number(item.productId);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitPriceRaw = Number(item.unitPrice);
      const unitPrice = Number.isFinite(unitPriceRaw) ? unitPriceRaw : 0;

      return {
        productId,
        quantity,
        unitPrice,
        productName: typeof item.productName === "string" ? item.productName : "",
      };
    });

    const invalidItems = normalizedItems.filter(
      (item) => !Number.isFinite(item.productId) || item.productId <= 0
    );
    if (invalidItems.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product in order items",
        },
        { status: 400 }
      );
    }

    const groupedItems = new Map<number, { productId: number; quantity: number }>();
    for (const item of normalizedItems) {
      const existing = groupedItems.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        groupedItems.set(item.productId, {
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    const productIds = Array.from(groupedItems.keys());
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true, isActive: true, name: true },
    });
    const productMap = new Map(products.map((product) => [product.id, product]));

    const missingProducts = productIds.filter((id) => !productMap.has(id));
    if (missingProducts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Some products were not found",
          missingProductIds: missingProducts,
        },
        { status: 400 }
      );
    }

    const inactiveProducts = productIds.filter((id) => {
      const product = productMap.get(id);
      return product ? !product.isActive : false;
    });
    if (inactiveProducts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Some products are not available",
          inactiveProductIds: inactiveProducts,
        },
        { status: 409 }
      );
    }

    const insufficientStock = productIds
      .map((id) => {
        const product = productMap.get(id)!;
        const requested = groupedItems.get(id)!.quantity;
        if (product.stock < requested) {
          return {
            productId: id,
            name: product.name,
            available: product.stock,
            requested,
          };
        }
        return null;
      })
      .filter(Boolean);
    if (insufficientStock.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient stock for some products",
          items: insufficientStock,
        },
        { status: 409 }
      );
    }

    // Calculate totals
    const subtotal = normalizedItems.reduce(
      (sum: number, item: any) => sum + item.unitPrice * item.quantity,
      0
    );
    
    // Calculate shipping cost based on method
    const shippingCosts: Record<string, number> = {
      standard: 150.0,
      express: 250.0,
      overnight: 500.0,
    };
    const shippingCost = shippingCosts[body.shippingMethod || "standard"] || 150.0;
    
    // Calculate tax (16% IVA in Mexico)
    const tax = subtotal * 0.16;
    const totalAmount = subtotal + shippingCost + tax;

    // Generate order number (format: MIST-YYYYMMDD-XXXX)
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MIST-${dateStr}-${randomNum}`;

    const orderItems = normalizedItems.map((item) => {
      const product = productMap.get(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
        productName: product?.name || item.productName || "",
      };
    });

    // Create order with items and update stock atomically
    const order = await prisma.$transaction(async (tx) => {
      for (const item of groupedItems.values()) {
        const updateResult = await tx.products.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updateResult.count === 0) {
          throw new Error("STOCK_CONFLICT");
        }
      }

      return tx.orders.create({
        data: {
          orderNumber,
          status: "pending",
          totalAmount,
          subtotal,
          shippingCost,
          tax,
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone || null,
          shippingStreet: body.shippingAddress.street,
          shippingCity: body.shippingAddress.city,
          shippingState: body.shippingAddress.state,
          shippingZip: body.shippingAddress.zip,
          shippingCountry: body.shippingAddress.country || "México",
          billingStreet: body.billingAddress?.street || null,
          billingCity: body.billingAddress?.city || null,
          billingState: body.billingAddress?.state || null,
          billingZip: body.billingAddress?.zip || null,
          billingCountry: body.billingAddress?.country || null,
          shippingMethod: body.shippingMethod || "standard",
          paymentMethod: body.paymentMethod || null,
          paymentStatus: "pending",
          notes: body.notes || null,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      });
    });

    // Send order confirmation email (don't fail the request if email fails)
    try {
      const formatPrice = (price: number | string) => {
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        if (isNaN(numPrice)) return "$0.00 MXN";
        return `$${numPrice.toFixed(2)} MXN`;
      };

      const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("es-MX", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      // Build shipping address string
      const shippingAddress = [
        order.shippingStreet,
        `${order.shippingCity}, ${order.shippingState} ${order.shippingZip}`,
        order.shippingCountry,
      ]
        .filter(Boolean)
        .join("\n");

      // Build order URL with secure token
      const { generateOrderDetailUrl } = await import("@/lib/order-token");
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const orderUrl = generateOrderDetailUrl(order.id, order.orderNumber, baseUrl);

      await sendMail({
        type: "order-confirmation",
        to: order.customerEmail,
        payload: {
          name: order.customerName,
          orderNumber: order.orderNumber,
          orderDate: formatDate(order.createdAt),
          totalAmount: Number(order.totalAmount),
          items: order.items.map((item: any) => ({
            name: item.productName,
            quantity: item.quantity,
            price: Number(item.unitPrice),
          })),
          shippingAddress,
          orderUrl,
        },
      });

      console.log(`[Orders] Order confirmation email sent to ${order.customerEmail}`);
    } catch (emailError) {
      // Log error but don't fail the request
      console.error("[Orders] Failed to send order confirmation email:", emailError);
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_CONFLICT") {
      return NextResponse.json(
        {
          success: false,
          error: "Stock changed during checkout. Please try again.",
        },
        { status: 409 }
      );
    }
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }
}
