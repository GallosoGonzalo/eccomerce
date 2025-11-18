import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ylrmihthwjpcxmacbyvv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlscm1paHRod2pwY3htYWNieXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjExMDAsImV4cCI6MjA3ODAzNzEwMH0.RFpFUCTmLdAKp1wO8jZZFDCgEk_G7SlQ5nclBQMw4qE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las tablas
export interface Product {
  id: string
  category_id?: string
  name: string
  slug: string
  description?: string
  price: number
  original_price?: number
  stock: number
  image_url?: string
  images?: string[]
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  active: boolean
  created_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}

export interface Cart {
  id: string
  user_id?: string
  session_id?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  status: string
  total: number
  subtotal: number
  shipping_cost: number
  shipping_address_id?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_admin: boolean
  created_at: string
}
