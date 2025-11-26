import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@/lib/types'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      setIsAdding(true)
      await addToCart(product.id, 1)
      alert('Producto agregado al carrito')
    } catch (error) {
      console.error('Error:', error)
      alert('Error al agregar al carrito')
    } finally {
      setIsAdding(false)
    }
  }

  const image = product.images?.[0] ?? '/placeholder.jpg'

  return (
    <Link to={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm text-gray-700 mb-2 line-clamp-2 group-hover:text-brand-primary">
            {product.name}
          </h3>

          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toLocaleString()}
            </span>
          </div>

          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-secondary transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isAdding ? 'Agregando...' : 'Agregar'}</span>
            </button>
          ) : (
            <div className="w-full bg-gray-200 text-gray-600 py-2 rounded-lg text-center">
              Sin stock
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
