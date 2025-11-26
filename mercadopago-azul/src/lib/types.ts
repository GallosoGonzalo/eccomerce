export interface AuthUser {
  id: string
  email: string
  displayName: string
  isAdmin: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  createdAt?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  images: string[]
  slug: string
  categoryId: string
  category?: Category
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product
}

export interface Cart {
  userId: string
  items: CartItem[]
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  product?: Product
}

export interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items?: OrderItem[]
}

export interface ProductList {
  items: Product[]
  meta: {
    total: number
    page: number
    limit: number
  }
}
