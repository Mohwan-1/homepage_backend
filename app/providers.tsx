'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { CartProvider } from '@/contexts/cart-context';
import { FirebaseInit } from '@/lib/firebase-init';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FirebaseInit />
        {children}
      </CartProvider>
    </AuthProvider>
  );
}