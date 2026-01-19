"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/components/common/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}
