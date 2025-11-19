# Arquitectura NestJS + Prisma

```
[React App]
    |
    v
[HTTP API - NestJS]
  |-- AuthModule (JWT, Passport)
  |-- CatalogModule (Products/Categories)
  |-- CartModule (carts + items)
  |-- OrdersModule (checkout + order state)
  |-- PaymentsModule (Stripe intents + webhook)
  |-- StorageModule (uploads firmadas)
  |-- UsersModule (perfiles + RBAC)
  |-- PrismaModule (PostgreSQL ORM)
```

- **Auth flow**: Signup/Login → JWT emitido por `AuthService`. `JwtStrategy` hidrata el usuario con `profile.isAdmin` para los guards.
- **Catálogo**: `CatalogService` ejecuta filtros, orden y paginación con Prisma. Solo `RolesGuard` permite mutaciones administradoras.
- **Carrito/Órdenes**: `CartService` usa `cartId=userId`. `OrdersService` genera órdenes `pending`, calcula total y limpia el carrito.
- **Pagos Stripe**: `PaymentsService` crea `PaymentIntent` y persiste `providerId`. Webhook valida firma y llama `OrdersService.markAsPaid`.
- **Storage**: Carga autenticada (admins) hacia disco local (puede cambiar a S3/minio). URLs públicas simples (`/uploads`).
- **Infra**: Docker Compose inicia Postgres + API. Prisma schema modela 8 tablas originales, `prisma/seed.ts` replica categorías/productos/usuario admin.
- **Tests**: Jest asegura guardas (no autenticados vs admin) y webhook Stripe actualiza órdenes.
