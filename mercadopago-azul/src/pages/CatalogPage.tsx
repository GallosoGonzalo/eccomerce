import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { fetchCategories, fetchProducts } from '@/lib/api'
import type { Category, Product } from '@/lib/types'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const searchQuery = searchParams.get('search') || ''
  const categorySlug = searchParams.get('category') || ''
  const sortBy = searchParams.get('sort') || 'newest'

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [searchQuery, categorySlug, sortBy])

  const loadCategories = async () => {
    const data = await fetchCategories()
    setCategories(data)
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const sortParams: { sort?: string; order?: 'asc' | 'desc' } = {}
      switch (sortBy) {
        case 'price-asc':
          sortParams.sort = 'price'
          sortParams.order = 'asc'
          break
        case 'price-desc':
          sortParams.sort = 'price'
          sortParams.order = 'desc'
          break
        case 'name':
          sortParams.sort = 'name'
          sortParams.order = 'asc'
          break
        default:
          sortParams.sort = 'createdAt'
          sortParams.order = 'desc'
      }

      const { items } = await fetchProducts({
        search: searchQuery || undefined,
        category: categorySlug || undefined,
        ...sortParams
      })

      setProducts(items)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams)
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    setSearchParams(params)
    setShowFilters(false)
  }

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', sort)
    setSearchParams(params)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los productos'}
          </h1>
          <p className="text-gray-600">{products.length} productos encontrados</p>
        </div>

        {/* Mobile filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`
          lg:w-64 flex-shrink-0
          ${showFilters ? 'fixed inset-0 bg-white z-50 p-4 overflow-y-auto' : 'hidden lg:block'}
        `}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold">Filtros</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Categorías */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Categorías</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`block w-full text-left px-3 py-2 rounded ${
                  !categorySlug ? 'bg-brand-light text-brand-primary' : 'hover:bg-gray-100'
                }`}
              >
                Todas
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    categorySlug === category.slug
                      ? 'bg-brand-light text-brand-primary'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ordenar por */}
          <div>
            <h3 className="font-bold mb-3">Ordenar por</h3>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
