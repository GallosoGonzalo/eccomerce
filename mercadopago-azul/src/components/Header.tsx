import { Link } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MP</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline">MarketPlace</span>
          </Link>

          {/* Search bar - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:text-brand-primary">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{profile?.full_name || 'Mi cuenta'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-brand-primary"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-sm hover:text-brand-primary">
                  Iniciar sesión
                </Link>
                <Link
                  to="/signup"
                  className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-secondary transition-colors"
                >
                  Crear cuenta
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative hover:text-brand-primary">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search bar - mobile */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </form>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/catalog" className="text-gray-700 hover:text-brand-primary">
                Productos
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-brand-primary">
                    Mi cuenta
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left text-gray-700 hover:text-brand-primary"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-brand-primary">
                    Iniciar sesión
                  </Link>
                  <Link to="/signup" className="text-gray-700 hover:text-brand-primary">
                    Crear cuenta
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
