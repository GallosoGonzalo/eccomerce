import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { User, Package, MapPin } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { listOrders } from '@/lib/api'
import type { Order } from '@/lib/types'

export function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadOrders()
  }, [user])

  const loadOrders = async () => {
    try {
      const data = await listOrders()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login?redirect=/profile" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10'
      case 'pending':
        return 'text-warning bg-warning/10'
      case 'cancelled':
        return 'text-destructive bg-destructive/10'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'processing':
        return 'En proceso'
      case 'shipped':
        return 'Enviado'
      case 'completed':
        return 'Completado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi cuenta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-brand-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{user.displayName}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm">
                <Package className="w-5 h-5 text-brand-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">Pedidos totales</p>
                  <p className="text-gray-600">{orders.length}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold">Direcciones guardadas</p>
                  <p className="text-gray-600">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Mis pedidos</h2>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aún no tienes pedidos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-brand-primary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                      <p className="text-sm text-gray-600">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg">${order.total.toLocaleString()}</p>
                      <button className="text-brand-primary hover:underline text-sm">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
