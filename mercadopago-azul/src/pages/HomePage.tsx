import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Product, Category } from '@/lib/supabase'
import { ProductCard } from '@/components/ProductCard'
import { ChevronRight, TrendingUp, Package, Shield, Truck } from 'lucide-react'

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .eq('featured', true)
          .limit(8),
        supabase
          .from('categories')
          .select('*')
          .limit(6),
      ])

      if (productsRes.data) setFeaturedProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Los mejores productos al mejor precio
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Descubre miles de productos con envío rápido y seguro. Tu marketplace de confianza.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver todos los productos
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-brand-light p-3 rounded-lg">
                <Truck className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Envío rápido</h3>
                <p className="text-gray-600 text-sm">Recibe tus productos en 24-48 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-brand-light p-3 rounded-lg">
                <Shield className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Compra segura</h3>
                <p className="text-gray-600 text-sm">Protegemos tu información y tus pagos</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-brand-light p-3 rounded-lg">
                <Package className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Devoluciones fáciles</h3>
                <p className="text-gray-600 text-sm">30 días para cambios y devoluciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Categorías</h2>
              <Link to="/catalog" className="text-brand-primary hover:underline flex items-center">
                Ver todas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(category => (
                <Link
                  key={category.id}
                  to={`/catalog?category=${category.slug}`}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-brand-primary hover:shadow-md transition-all text-center"
                >
                  <div className="text-3xl mb-2">{category.image_url || '📦'}</div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-brand-primary" />
              <h2 className="text-3xl font-bold">Productos destacados</h2>
            </div>
            <Link to="/catalog" className="text-brand-primary hover:underline flex items-center">
              Ver todos
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
