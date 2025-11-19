import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const categories = [
  { name: 'Smartphones', slug: 'smartphones' },
  { name: 'Laptops', slug: 'laptops' },
  { name: 'Cámaras', slug: 'camaras' },
  { name: 'Smartwatches', slug: 'smartwatches' },
  { name: 'Audífonos', slug: 'audifonos' },
  { name: 'Mochilas', slug: 'mochilas' },
  { name: 'Tablets', slug: 'tablets' },
  { name: 'Cafeteras', slug: 'cafeteras' }
];

const products = [
  {
    name: 'Pixel Azul 8',
    slug: 'pixel-azul-8',
    categorySlug: 'smartphones',
    description: 'Smartphone con Android y cámara dual',
    price: 799.0,
    stock: 12,
    images: ['https://placehold.co/600x400?text=Pixel8']
  },
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    categorySlug: 'smartphones',
    description: 'El último iPhone con chip A17',
    price: 1199.0,
    stock: 10,
    images: ['https://placehold.co/600x400?text=iPhone15']
  },
  {
    name: 'Galaxy Fold Z',
    slug: 'galaxy-fold-z',
    categorySlug: 'smartphones',
    description: 'Pantalla plegable y stylus',
    price: 1499.0,
    stock: 6,
    images: ['https://placehold.co/600x400?text=Fold']
  },
  {
    name: 'MacBook Air M3',
    slug: 'macbook-air-m3',
    categorySlug: 'laptops',
    description: 'Laptop ultraligera con chip M3',
    price: 1599.0,
    stock: 8,
    images: ['https://placehold.co/600x400?text=AirM3']
  },
  {
    name: 'ThinkPad X1 Carbon',
    slug: 'thinkpad-x1-carbon',
    categorySlug: 'laptops',
    description: 'Laptop empresarial resistente',
    price: 1899.0,
    stock: 5,
    images: ['https://placehold.co/600x400?text=ThinkPad']
  },
  {
    name: 'Dell XPS 13',
    slug: 'dell-xps-13',
    categorySlug: 'laptops',
    description: 'Laptop con pantalla InfinityEdge',
    price: 1399.0,
    stock: 9,
    images: ['https://placehold.co/600x400?text=XPS13']
  },
  {
    name: 'Canon EOS R6',
    slug: 'canon-eos-r6',
    categorySlug: 'camaras',
    description: 'Cámara mirrorless full-frame',
    price: 2499.0,
    stock: 4,
    images: ['https://placehold.co/600x400?text=EOSR6']
  },
  {
    name: 'Sony A7 IV',
    slug: 'sony-a7-iv',
    categorySlug: 'camaras',
    description: 'Cámara profesional 4K',
    price: 2699.0,
    stock: 7,
    images: ['https://placehold.co/600x400?text=A7IV']
  },
  {
    name: 'Fujifilm X100VI',
    slug: 'fujifilm-x100vi',
    categorySlug: 'camaras',
    description: 'Compacta premium con lente fijo',
    price: 1899.0,
    stock: 3,
    images: ['https://placehold.co/600x400?text=X100']
  },
  {
    name: 'Apple Watch Ultra',
    slug: 'apple-watch-ultra',
    categorySlug: 'smartwatches',
    description: 'Reloj para deportes extremos',
    price: 999.0,
    stock: 10,
    images: ['https://placehold.co/600x400?text=WatchUltra']
  },
  {
    name: 'Garmin Fenix 7',
    slug: 'garmin-fenix-7',
    categorySlug: 'smartwatches',
    description: 'GPS multideporte',
    price: 899.0,
    stock: 6,
    images: ['https://placehold.co/600x400?text=Fenix7']
  },
  {
    name: 'Fitbit Sense 2',
    slug: 'fitbit-sense-2',
    categorySlug: 'smartwatches',
    description: 'Salud y bienestar 24/7',
    price: 349.0,
    stock: 15,
    images: ['https://placehold.co/600x400?text=Sense2']
  },
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    categorySlug: 'audifonos',
    description: 'Cancelación de ruido líder',
    price: 399.0,
    stock: 20,
    images: ['https://placehold.co/600x400?text=XM5']
  },
  {
    name: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    categorySlug: 'audifonos',
    description: 'Audio espacial con ANC',
    price: 299.0,
    stock: 18,
    images: ['https://placehold.co/600x400?text=AirPods']
  },
  {
    name: 'Bose QC Ultra',
    slug: 'bose-qc-ultra',
    categorySlug: 'audifonos',
    description: 'Cómodos y con modo aware',
    price: 349.0,
    stock: 16,
    images: ['https://placehold.co/600x400?text=BoseQC']
  },
  {
    name: 'Mochila Peak Design',
    slug: 'mochila-peak-design',
    categorySlug: 'mochilas',
    description: 'Para fotógrafos viajeros',
    price: 329.0,
    stock: 11,
    images: ['https://placehold.co/600x400?text=Peak']
  },
  {
    name: 'Mochila Herschel',
    slug: 'mochila-herschel',
    categorySlug: 'mochilas',
    description: 'Estilo clásico',
    price: 129.0,
    stock: 25,
    images: ['https://placehold.co/600x400?text=Herschel']
  },
  {
    name: 'Mochila Fjallraven',
    slug: 'mochila-fjallraven',
    categorySlug: 'mochilas',
    description: 'Icono sueco',
    price: 149.0,
    stock: 19,
    images: ['https://placehold.co/600x400?text=Fjallraven']
  },
  {
    name: 'iPad Pro 13',
    slug: 'ipad-pro-13',
    categorySlug: 'tablets',
    description: 'Pantalla OLED y M4',
    price: 1299.0,
    stock: 9,
    images: ['https://placehold.co/600x400?text=iPadPro']
  },
  {
    name: 'Samsung Tab S9',
    slug: 'samsung-tab-s9',
    categorySlug: 'tablets',
    description: 'Incluye S-Pen',
    price: 999.0,
    stock: 12,
    images: ['https://placehold.co/600x400?text=TabS9']
  },
  {
    name: 'Surface Go 4',
    slug: 'surface-go-4',
    categorySlug: 'tablets',
    description: 'Híbrido Windows',
    price: 699.0,
    stock: 14,
    images: ['https://placehold.co/600x400?text=SurfaceGo']
  },
  {
    name: 'Cafetera Breville Barista',
    slug: 'breville-barista',
    categorySlug: 'cafeteras',
    description: 'Espresso semi automática',
    price: 899.0,
    stock: 6,
    images: ['https://placehold.co/600x400?text=Breville']
  },
  {
    name: 'Cafetera Nespresso Vertuo',
    slug: 'nespresso-vertuo',
    categorySlug: 'cafeteras',
    description: 'Cápsulas individuales',
    price: 249.0,
    stock: 20,
    images: ['https://placehold.co/600x400?text=Vertuo']
  },
  {
    name: 'Cafetera Chemex Set',
    slug: 'chemex-set',
    categorySlug: 'cafeteras',
    description: 'Método pour-over',
    price: 129.0,
    stock: 15,
    images: ['https://placehold.co/600x400?text=Chemex']
  }
];

async function main() {
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  await prisma.category.createMany({ data: categories });

  for (const product of products) {
    const category = categories.find((c) => c.slug === product.categorySlug);
    const categoryRecord = await prisma.category.findFirst({
      where: { slug: category?.slug }
    });
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        categoryId: categoryRecord!.id
      }
    });
  }

  const adminPassword = await hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      profile: {
        create: {
          displayName: 'Admin',
          isAdmin: true
        }
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
