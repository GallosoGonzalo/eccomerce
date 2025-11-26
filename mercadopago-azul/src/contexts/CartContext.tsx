import { createContext, useContext, useEffect, useState } from 'react'
import {
  addCartItem,
  clearCartItems,
  fetchCart,
  fetchProductById,
  removeCartItem,
  updateCartItem
} from '@/lib/api'
import type { CartItem } from '@/lib/types'
import { useAuth } from './AuthContext'

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  loading: boolean
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)
const GUEST_CART_KEY = 'mp_guest_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [migrated, setMigrated] = useState(false)

  useEffect(() => {
    if (token) {
      migrateGuestCart()
    } else {
      loadGuestCart()
    }
  }, [token])

  const loadGuestCart = () => {
    const stored = localStorage.getItem(GUEST_CART_KEY)
    if (stored) {
      setItems(JSON.parse(stored))
    } else {
      setItems([])
    }
    setLoading(false)
  }

  const saveGuestCart = (data: CartItem[]) => {
    setItems(data)
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(data))
  }

  const migrateGuestCart = async () => {
    setLoading(true)
    try {
      if (!migrated) {
        const stored = localStorage.getItem(GUEST_CART_KEY)
        if (stored) {
          const guestItems: CartItem[] = JSON.parse(stored)
          for (const item of guestItems) {
            await addCartItem(item.productId, item.quantity)
          }
          localStorage.removeItem(GUEST_CART_KEY)
          setMigrated(true)
        }
      }
      await refreshRemoteCart()
    } catch (error) {
      console.error('Error loading cart', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const refreshRemoteCart = async () => {
    const cart = await fetchCart()
    setItems(cart?.items ?? [])
  }

  const addToCart = async (productId: string, quantity: number) => {
    if (!token) {
      const product = await fetchProductById(productId)
      if (!product) throw new Error('Producto no encontrado')

      const existing = items.find(item => item.productId === productId)
      if (existing) {
        const updated = items.map(item =>
          item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item
        )
        saveGuestCart(updated)
      } else {
        const newItems = [
          ...items,
          { id: crypto.randomUUID(), productId, quantity, product }
        ]
        saveGuestCart(newItems)
      }
      return
    }

    await addCartItem(productId, quantity)
    await refreshRemoteCart()
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!token) {
      if (quantity <= 0) {
        await removeItem(itemId)
        return
      }
      const updated = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
      saveGuestCart(updated)
      return
    }

    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    await updateCartItem(itemId, quantity)
    await refreshRemoteCart()
  }

  const removeItem = async (itemId: string) => {
    if (!token) {
      const remaining = items.filter(item => item.id !== itemId)
      saveGuestCart(remaining)
      return
    }

    await removeCartItem(itemId)
    await refreshRemoteCart()
  }

  const clearCart = async () => {
    if (!token) {
      localStorage.removeItem(GUEST_CART_KEY)
      setItems([])
      return
    }

    await clearCartItems()
    await refreshRemoteCart()
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
