import Link from "next/link";
import { prisma } from "@/config/prisma";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type ProductPageProps = { id: number };

export async function ProductPage({ id }: ProductPageProps) {
  const producto = await prisma.productos.findUnique({
    where: { id },
  });

  if (!producto) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/shop" className="text-sm text-neutral-600 hover:underline">
        ← Volver
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl bg-neutral-100">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${producto.imagen ?? "/images/placeholder.jpg"})`,
            }}
          />
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{producto.nombre}</h1>

          {producto.descripcion ? (
            <p className="mt-2 text-neutral-600">{producto.descripcion}</p>
          ) : (
            <p className="mt-2 text-neutral-600">Sin descripción por el momento.</p>
          )}

          <p className="mt-6 text-2xl font-medium">
            ${producto.precio?.toString() ?? "—"} MXN
          </p>

          <AddToCartButton
            id={producto.id}
            name={producto.nombre}
            price={producto.precio?.toString() ?? 0}
            image={producto.imagen ?? null}
          />
        </div>
      </div>
    </main>
  );
}
