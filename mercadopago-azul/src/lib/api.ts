import { AuthUser, Cart, CartItem, Category, Order, Product, ProductList } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
const TOKEN_KEY = 'mp_api_token'

const toNumber = (value: any) => (typeof value === 'number' ? value : Number(value ?? 0))

const baseProduct = (raw: any): Product => ({
  id: raw.id ?? '',
  name: raw.name ?? 'Producto',
  description: raw.description ?? '',
  price: toNumber(raw.price),
  stock: raw.stock ?? 0,
  images: raw.images ?? [],
  slug: raw.slug ?? raw.id ?? '',
  categoryId: raw.categoryId ?? raw.category_id ?? '',
  category: raw.category
    ? {
        id: raw.category.id ?? '',
        name: raw.category.name ?? '',
        slug: raw.category.slug ?? '',
        createdAt: raw.category.createdAt ?? raw.category.created_at
      }
    : undefined,
  createdAt: raw.createdAt ?? raw.created_at,
  updatedAt: raw.updatedAt ?? raw.updated_at
})

const normalizeCartItem = (raw: any): CartItem => ({
  id: raw.id ?? '',
  productId: raw.productId ?? raw.product_id ?? '',
  quantity: raw.quantity ?? 0,
  product: baseProduct(raw.product ?? { ...raw, slug: raw.productId ?? raw.product_id ?? '' })
})

const normalizeOrder = (raw: any): Order => ({
  id: raw.id ?? '',
  status: raw.status ?? 'pending',
  total: toNumber(raw.total),
  createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
  items: raw.items?.map((item: any) => ({
    id: item.id ?? '',
    productId: item.productId ?? item.product_id ?? '',
    quantity: item.quantity ?? 0,
    unitPrice: toNumber(item.unitPrice ?? item.unit_price),
    product: item.product ? baseProduct(item.product) : undefined
  }))
})

async function apiFetch<T>(
  path: string,
  { method = 'GET', body, auth = false }: { method?: string; body?: any; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  const token = getAuthToken()
  if (auth) {
    if (!token) throw new Error('Sesión no autenticada')
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Error ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const getAuthToken = () =>
  typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)

export const setAuthToken = (token: string) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export const clearAuthToken = () => {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export const authSignup = (email: string, password: string, displayName: string) =>
  apiFetch<{ accessToken: string; user: AuthUser }>('/auth/signup', {
    method: 'POST',
    body: { email, password, displayName }
  })

export const authLogin = (email: string, password: string) =>
  apiFetch<{ accessToken: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: { email, password }
  })

export const authMe = () => apiFetch<AuthUser>('/auth/me', { auth: true })

export const fetchCategories = async (): Promise<Category[]> => {
  const data = await apiFetch<any[]>('/categories')
  return data.map(cat => ({
    id: cat.id ?? '',
    name: cat.name ?? '',
    slug: cat.slug ?? '',
    createdAt: cat.createdAt ?? cat.created_at
  }))
}

export const fetchProducts = async (params: {
  search?: string
  category?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
} = {}): Promise<ProductList> => {
  const query = new URLSearchParams()
  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  if (params.sort) query.set('sort', params.sort)
  if (params.order) query.set('order', params.order)
  if (params.page) query.set('page', params.page.toString())
  if (params.limit) query.set('limit', params.limit.toString())

  const qs = query.toString()
  const data = await apiFetch<ProductList>(`/products${qs ? `?${qs}` : ''}`)
  return {
    items: data.items.map(baseProduct),
    meta: data.meta
  }
}

export const fetchProductBySlug = async (slug: string) => {
  const data = await apiFetch<Product | null>(`/products/slug/${slug}`)
  return data ? baseProduct(data) : null
}

export const fetchProductById = async (id: string) => {
  const data = await apiFetch<Product | null>(`/products/${id}`)
  return data ? baseProduct(data) : null
}

export const fetchCart = async (): Promise<Cart | null> => {
  const data = await apiFetch<any>('/cart', { auth: true })
  if (!data) return null

  return {
    userId: data.userId ?? data.user_id ?? '',
    items: (data.items ?? []).map(normalizeCartItem)
  }
}

export const addCartItem = (productId: string, quantity: number) =>
  apiFetch('/cart/items', { method: 'POST', body: { productId, quantity }, auth: true })

export const updateCartItem = (id: string, quantity: number) =>
  apiFetch(`/cart/items/${id}`, { method: 'PATCH', body: { quantity }, auth: true })

export const removeCartItem = (id: string) => apiFetch(`/cart/items/${id}`, { method: 'DELETE', auth: true })

export const clearCartItems = () => apiFetch('/cart', { method: 'DELETE', auth: true })

export const createOrder = async () => normalizeOrder(await apiFetch('/orders', { method: 'POST', auth: true }))

export const listOrders = async () => {
  const data = await apiFetch<any[]>('/orders', { auth: true })
  return data.map(normalizeOrder)
}
