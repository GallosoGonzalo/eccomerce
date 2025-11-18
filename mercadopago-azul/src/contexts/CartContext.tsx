import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Cart, CartItem, Product } from '@/lib/supabase'
import { useAuth } from './AuthContext'

interface CartContextType {
  cart: Cart | null
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Obtener o crear sesión de carrito
  const getSessionId = () => {
    let sessionId = localStorage.getItem('cart_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('cart_session_id', sessionId)
    }
    return sessionId
  }

  // Cargar carrito
  useEffect(() => {
    loadCart()
  }, [user])

  const loadCart = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('carts')
        .select('*')
        .eq('status', 'active')

      if (user) {
        query = query.eq('user_id', user.id)
      } else {
        const sessionId = getSessionId()
        query = query.eq('session_id', sessionId)
      }

      const { data: cartData, error: cartError } = await query.single()

      if (cartError && cartError.code !== 'PGRST116') {
        throw cartError
      }

      if (cartData) {
        setCart(cartData)
        await loadCartItems(cartData.id)
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const loadCartItems = async (cartId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('cart_id', cartId)

    if (error) {
      console.error('Error loading cart items:', error)
      setItems([])
    } else {
      setItems(data || [])
    }
  }

  const createCart = async () => {
    const cartData: any = {
      status: 'active',
    }

    if (user) {
      cartData.user_id = user.id
    } else {
      cartData.session_id = getSessionId()
    }

    const { data, error } = await supabase
      .from('carts')
      .insert(cartData)
      .select()
      .single()

    if (error) throw error
    
    setCart(data)
    return data
  }

  const addToCart = async (productId: string, quantity: number) => {
    try {
      let currentCart = cart
      if (!currentCart) {
        currentCart = await createCart()
      }

      // Obtener precio del producto
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('price')
        .eq('id', productId)
        .single()

      if (productError) throw productError

      // Verificar si el producto ya está en el carrito
      const existingItem = items.find(item => item.product_id === productId)

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: currentCart.id,
            product_id: productId,
            quantity,
            price: product.price,
          })
          .select(`
            *,
            product:products(*)
          `)
          .single()

        if (error) throw error
        setItems([...items, data])
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(itemId)
        return
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error

      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ))
    } catch (error) {
      console.error('Error updating quantity:', error)
      throw error
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItems(items.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing item:', error)
      throw error
    }
  }

  const clearCart = async () => {
    try {
      if (!cart) return

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)

      if (error) throw error

      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      items,
      itemCount,
      total,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }}>
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
