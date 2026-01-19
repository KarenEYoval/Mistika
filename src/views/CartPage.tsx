"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowLeft, Minus, Plus, ShoppingBag, Trash2, X, CreditCard } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalQuantity,
  } = useCart();

  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  const shippingCost = 150; // Standard shipping
  const tax = totalPrice * 0.16; // 16% IVA
  const finalTotal = totalPrice + shippingCost + tax;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-black">
      <header className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white px-6 py-8 shadow-[0_18px_40px_rgba(0,0,0,0.08)] sm:px-8">
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-black/50">
              Mistika / Carrito
            </p>
            <h1 className="mt-2 inline-flex items-center gap-3 text-3xl font-semibold tracking-[0.1em] sm:text-4xl">
              <ShoppingBag size={26} aria-hidden="true" />
              Carrito
            </h1>
            <p className="mt-2 text-sm text-black/60">
              {totalQuantity} artículos
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowClearModal(true)}
              type="button"
              className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black/60 transition hover:bg-black/5"
            >
              Vaciar
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:translate-y-[-1px]"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Seguir comprando
            </Link>
          </div>
        </div>
      </header>

      {cart.length === 0 ? (
        <section className="mt-8 grid place-items-center rounded-[28px] border border-dashed border-black/10 bg-white p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-black/5">
            <ShoppingBag size={28} aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="mt-2 max-w-md text-sm text-black/60">
            Descubre nuestras velas artesanales y llena tu espacio de calma.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Explorar catálogo
          </Link>
        </section>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="space-y-4">
            {cart.map((it, index) => {
              const quantity = Math.max(1, Number(it.quantity) || 1);
              const itemTotal = (Number(it.priceNumber) || 0) * quantity;

              return (
                <article
                  key={it.name}
                  className="relative overflow-hidden rounded-[24px] border border-black/10 bg-white p-4 shadow-[0_16px_36px_rgba(0,0,0,0.08)] card-reveal sm:p-5"
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4 sm:flex-[1.2]">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${it.imageUrl ?? "/images/products/placeholder.jpg"})`,
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-lg font-semibold leading-snug line-clamp-2">
                          {it.name}
                        </p>
                        <p className="mt-1 text-sm text-black/60">
                          ${Number(it.priceNumber || 0).toFixed(2)} MXN
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-2 py-1.5">
                        <button
                          type="button"
                          aria-label={`Disminuir cantidad de ${it.name}`}
                          onClick={() =>
                            updateQuantity(it.name, Math.max(1, quantity - 1))
                          }
                          className="grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white text-black transition hover:scale-[1.03]"
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) =>
                            updateQuantity(
                              it.name,
                              Number(e.target.value) || 1,
                            )
                          }
                          className="w-12 bg-transparent text-center text-sm font-semibold text-black"
                        />
                        <button
                          type="button"
                          aria-label={`Aumentar cantidad de ${it.name}`}
                          onClick={() => updateQuantity(it.name, quantity + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white text-black transition hover:scale-[1.03]"
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>

                      <div className="min-w-[120px] text-right">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-black/50">
                          Total
                        </p>
                        <p className="text-lg font-semibold">
                          ${itemTotal.toFixed(2)} MXN
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(it.name)}
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black/60 transition hover:bg-black/5"
                        aria-label={`Quitar ${it.name} del carrito`}
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-[24px] border border-black/10 bg-white p-6 shadow-[0_16px_36px_rgba(0,0,0,0.08)]">
            <p className="text-[11px] uppercase tracking-[0.4em] text-black/50">
              Resumen
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Tu pedido</h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-black/60">Artículos</span>
                <span className="font-semibold">{totalQuantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/60">Subtotal</span>
                <span className="font-semibold">${totalPrice.toFixed(2)} MXN</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/60">Envío (Estándar)</span>
                <span className="font-semibold">${shippingCost.toFixed(2)} MXN</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-black/60">IVA (16%)</span>
                <span className="font-semibold">${tax.toFixed(2)} MXN</span>
              </div>
              <div className="border-t border-black/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-[0.1em]">Total</span>
                  <span className="text-xl font-bold">${finalTotal.toFixed(2)} MXN</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:translate-y-[-1px]"
            >
              <CreditCard size={16} aria-hidden="true" />
              Proceder al pago
            </button>
          </aside>
        </div>
      )}

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCheckout(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
                  className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="mb-2">
                    <p className="text-xs uppercase tracking-[0.4em] text-black/50">
                      Finalizar compra
                    </p>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-[0.05em] sm:text-3xl">
                    Completar pedido
                  </h2>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-black/5 text-black/60 transition hover:bg-black/10"
                  aria-label="Cerrar"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              <CheckoutForm totalPrice={totalPrice} onClose={() => setShowCheckout(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clear cart confirmation modal */}
      <AnimatePresence>
        {showClearModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowClearModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
            >
              <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                {/* Close button */}
                <button
                  onClick={() => setShowClearModal(false)}
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-black/5 text-black/60 transition hover:bg-black/10"
                  aria-label="Cerrar"
                >
                  <X size={16} aria-hidden="true" />
                </button>

                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-black/5">
                  <AlertTriangle size={32} className="text-black/70" aria-hidden="true" />
                </div>

                {/* Title */}
                <h2 className="mb-3 text-center text-2xl font-semibold tracking-[0.05em]">
                  ¿Vaciar carrito?
                </h2>

                {/* Description */}
                <p className="mb-8 text-center text-sm leading-relaxed text-black/70">
                  Esta acción eliminará todos los artículos de tu carrito. Esta acción no se puede deshacer.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearModal(false)}
                    type="button"
                    className="flex-1 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-black/5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleClearCart}
                    type="button"
                    className="flex-1 rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Vaciar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
