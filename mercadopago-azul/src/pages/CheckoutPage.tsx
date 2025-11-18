import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { supabase } from '@/lib/supabase'
import { CreditCard, Lock } from 'lucide-react'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert('Debes iniciar sesión para completar la compra')
      navigate('/login?redirect=/checkout')
      return
    }

    try {
      setLoading(true)

      // Crear dirección
      const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          is_default: true,
        })
        .select()
        .single()

      if (addressError) throw addressError

      // Crear orden
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total,
          subtotal: total,
          shipping_cost: 0,
          shipping_address_id: addressData.id,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Crear items de la orden
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Limpiar carrito
      await clearCart()

      // Redirigir a confirmación
      alert('Compra realizada con éxito')
      navigate('/profile')
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Error al procesar la compra. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <button
          onClick={() => navigate('/catalog')}
          className="text-brand-primary hover:underline"
        >
          Ir al catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos de contacto */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Datos de contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">Teléfono</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Dirección de envío</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Dirección</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ciudad</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Estado</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Código Postal</label>
                  <input
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                Método de pago
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Número de tarjeta
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nombre del titular
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Fecha de vencimiento
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Resumen</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-brand-primary">${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-secondary transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Lock className="w-5 h-5" />
                <span>{loading ? 'Procesando...' : 'Pagar ahora'}</span>
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                Tu pago está protegido con encriptación de nivel bancario
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
