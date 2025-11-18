# Schema de Base de Datos - Ecommerce Azul

## Tablas del Sistema

### 1. profiles
Perfiles de usuarios extendiendo auth.users
- id: UUID (PK, referencia a auth.users)
- email: TEXT
- full_name: TEXT
- phone: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- is_admin: BOOLEAN (default false)

### 2. categories
Categorías de productos
- id: UUID (PK)
- name: TEXT
- slug: TEXT (UNIQUE)
- description: TEXT
- image_url: TEXT
- created_at: TIMESTAMP

### 3. products
Productos del catálogo
- id: UUID (PK)
- category_id: UUID (referencia manual a categories)
- name: TEXT
- slug: TEXT (UNIQUE)
- description: TEXT
- price: DECIMAL(10,2)
- original_price: DECIMAL(10,2) (precio sin descuento)
- stock: INTEGER
- image_url: TEXT
- images: JSONB (array de URLs adicionales)
- featured: BOOLEAN (default false)
- active: BOOLEAN (default true)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

### 4. carts
Carritos de compra (uno activo por usuario)
- id: UUID (PK)
- user_id: UUID (referencia manual a auth.users, NULLABLE para invitados)
- session_id: TEXT (para carritos de invitados)
- status: TEXT (active, abandoned, converted)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

### 5. cart_items
Items en el carrito
- id: UUID (PK)
- cart_id: UUID (referencia manual a carts)
- product_id: UUID (referencia manual a products)
- quantity: INTEGER
- price: DECIMAL(10,2) (precio al momento de agregar)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

### 6. orders
Pedidos confirmados
- id: UUID (PK)
- user_id: UUID (referencia manual a auth.users)
- order_number: TEXT (UNIQUE, generado)
- status: TEXT (pending, processing, shipped, delivered, cancelled)
- subtotal: DECIMAL(10,2)
- tax: DECIMAL(10,2)
- shipping: DECIMAL(10,2)
- total: DECIMAL(10,2)
- shipping_address: JSONB
- payment_method: TEXT
- payment_status: TEXT (pending, paid, failed)
- notes: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

### 7. order_items
Items del pedido
- id: UUID (PK)
- order_id: UUID (referencia manual a orders)
- product_id: UUID (referencia manual a products)
- product_name: TEXT (snapshot)
- quantity: INTEGER
- price: DECIMAL(10,2)
- subtotal: DECIMAL(10,2)
- created_at: TIMESTAMP

### 8. addresses
Direcciones de envío guardadas
- id: UUID (PK)
- user_id: UUID (referencia manual a auth.users)
- full_name: TEXT
- phone: TEXT
- address_line1: TEXT
- address_line2: TEXT
- city: TEXT
- state: TEXT
- postal_code: TEXT
- country: TEXT
- is_default: BOOLEAN (default false)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

## Políticas RLS

Todas las tablas tendrán RLS habilitado con políticas que permitan:
- anon y service_role para operaciones desde Edge Functions
- Lectura pública para products y categories
- Operaciones de usuario autenticado para carritos y pedidos
