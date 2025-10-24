"use client"

import { XichuanHeader } from "./components/xichuan-header"
import { XichuanHero } from "./components/xichuan-hero"
import { XichuanMenu } from "./components/xichuan-menu"
import { XichuanAbout } from "./components/xichuan-about"
import { XichuanCart } from "./components/xichuan-cart"
import { XichuanFooter } from "./components/xichuan-footer"
import { useCart } from "./providers/cart-provider"

export default function XichuanNoodlesPage() {
  const { isCartOpen, closeCart } = useCart()

  return (
    <div className="min-h-screen bg-background">
      <XichuanHeader />
      
      <main>
        <XichuanHero />
        <XichuanMenu />
        <XichuanAbout />
      </main>

      <XichuanFooter />
      
      <XichuanCart 
        isOpen={isCartOpen}
        onClose={closeCart}
      />
    </div>
  )
}