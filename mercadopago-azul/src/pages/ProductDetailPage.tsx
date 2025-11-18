import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, Product } from '@/lib/supabase'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Minus, Plus, ChevronLeft, Package, Shield, Truck } from 'lucide-react'

export function ProductDetailPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (slug) loadProduct()
  }, [slug])

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    try {
      setAdding(true)
      await addToCart(product.id, quantity)
      alert('Producto agregado al carrito')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al agregar al carrito')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link to="/catalog" className="text-brand-primary hover:underline">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const hasDiscount = product.original_price && product.original_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link to="/catalog" className="flex items-center text-brand-primary hover:underline mb-6">
        <ChevronLeft className="w-4 h-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="bg-gray-100 rounded-lg p-8">
          <img
            src={product.image_url || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-auto object-contain max-h-96"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.original_price!.toLocaleString()}
                  </span>
                  <span className="bg-success text-white px-2 py-1 rounded text-sm font-bold">
                    -{discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-2">Descripción</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {/* Stock */}
          <div className="mb-6">
            <p className={`text-sm ${product.stock > 0 ? 'text-success' : 'text-destructive'}`}>
              {product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Sin stock'}
            </p>
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">Cantidad</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Add to cart button */}
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-brand-primary text-white py-4 rounded-lg text-lg font-semibold hover:bg-brand-secondary transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 mb-4"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{adding ? 'Agregando...' : 'Agregar al carrito'}</span>
            </button>
          ) : (
            <div className="w-full bg-gray-200 text-gray-600 py-4 rounded-lg text-lg font-semibold text-center mb-4">
              Sin stock
            </div>
          )}

          {/* Benefits */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-start space-x-3">
              <Truck className="w-6 h-6 text-brand-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">Envío rápido</p>
                <p className="text-sm text-gray-600">Recibe tu pedido en 24-48 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-brand-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">Compra protegida</p>
                <p className="text-sm text-gray-600">Protegemos tu información y tus pagos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Package className="w-6 h-6 text-brand-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">Devoluciones gratis</p>
                <p className="text-sm text-gray-600">30 días para cambios y devoluciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
