import { Link } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export function CartPage() {
  const { items, total, loading, updateQuantity, removeItem } = useCart()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">
            Agrega productos para comenzar tu compra
          </p>
          <Link
            to="/catalog"
            className="inline-block bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-secondary transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4"
            >
              {/* Image */}
              <Link to={`/product/${item.product?.slug}`} className="flex-shrink-0">
                <img
                  src={item.product?.image_url || '/placeholder.jpg'}
                  alt={item.product?.name}
                  className="w-24 h-24 object-contain bg-gray-100 rounded"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product?.slug}`}
                  className="font-semibold text-gray-900 hover:text-brand-primary line-clamp-2"
                >
                  {item.product?.name}
                </Link>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${item.price.toLocaleString()}
                </p>

                {/* Quantity controls */}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                      disabled={item.quantity >= (item.product?.stock || 0)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-red-700 flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Eliminar</span>
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-xl font-bold">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Productos ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span className="font-semibold">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-semibold text-success">Gratis</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-brand-primary">${total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-brand-primary text-white py-3 rounded-lg text-center font-semibold hover:bg-brand-secondary transition-colors mb-4"
            >
              Continuar compra
            </Link>

            <Link
              to="/catalog"
              className="block w-full text-center text-brand-primary hover:underline"
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
