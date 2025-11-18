import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre nosotros */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Sobre nosotros</h3>
            <p className="text-sm">
              Tu marketplace de confianza para encontrar los mejores productos al mejor precio.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-brand-primary">Productos</Link></li>
              <li><Link to="/about" className="hover:text-brand-primary">Acerca de</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary">Contacto</Link></li>
              <li><Link to="/help" className="hover:text-brand-primary">Ayuda</Link></li>
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Políticas</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-brand-primary">Términos y condiciones</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-primary">Privacidad</Link></li>
              <li><Link to="/shipping" className="hover:text-brand-primary">Envíos</Link></li>
              <li><Link to="/returns" className="hover:text-brand-primary">Devoluciones</Link></li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-primary">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-brand-primary">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-brand-primary">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-brand-primary">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>2025 MarketPlace. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
