/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Sistema de diseño azul inspirado en MercadoPago
				brand: {
					primary: '#0066FF',      // Azul primario para CTAs principales
					secondary: '#004FC4',    // Azul secundario
					light: '#EBF3FF',        // Azul claro para fondos
					dark: '#003399',         // Azul oscuro
				},
				border: '#E5E7EB',
				input: '#E5E7EB',
				ring: '#0066FF',
				background: '#FFFFFF',
				foreground: '#1F2937',
				primary: {
					DEFAULT: '#0066FF',
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#F3F4F6',
					foreground: '#1F2937',
				},
				accent: {
					DEFAULT: '#EBF3FF',
					foreground: '#0066FF',
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF',
				},
				success: {
					DEFAULT: '#10B981',
					foreground: '#FFFFFF',
				},
				warning: {
					DEFAULT: '#F59E0B',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#F3F4F6',
					foreground: '#6B7280',
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1F2937',
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1F2937',
				},
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px',
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
				'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					from: { opacity: 0, transform: 'translateY(10px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
