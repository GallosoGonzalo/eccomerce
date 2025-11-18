Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    // Categorías
    const categories = [
      { name: 'Smartphones', slug: 'smartphones', description: 'Los últimos smartphones', active: true },
      { name: 'Laptops', slug: 'laptops', description: 'Laptops y notebooks', active: true },
      { name: 'Cámaras', slug: 'camaras', description: 'Cámaras profesionales', active: true },
      { name: 'Smartwatches', slug: 'smartwatches', description: 'Relojes inteligentes', active: true },
      { name: 'Audífonos', slug: 'audifonos', description: 'Audífonos y headphones', active: true },
      { name: 'Mochilas', slug: 'mochilas', description: 'Mochilas y bolsos', active: true },
      { name: 'Tablets', slug: 'tablets', description: 'Tablets y iPads', active: true },
      { name: 'Cafeteras', slug: 'cafeteras', description: 'Cafeteras y máquinas de café', active: true },
    ]

    // Insertar categorías
    const catResponse = await fetch(`${supabaseUrl}/rest/v1/categories`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey!,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(categories)
    })

    const insertedCategories = await catResponse.json()

    // Productos
    const products = [
      { category_id: insertedCategories[0].id, name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-s24-ultra', description: 'Smartphone con pantalla AMOLED de 6.8 pulgadas, cámara de 200MP', price: 1299, original_price: 1499, stock: 25, image_url: '/images/smartphone_7.jpg', featured: true, active: true },
      { category_id: insertedCategories[0].id, name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', description: 'El último iPhone con chip A17 Pro y cámara triple', price: 1399, original_price: 1599, stock: 15, image_url: '/images/smartphone_8.jpg', featured: true, active: true },
      { category_id: insertedCategories[0].id, name: 'Google Pixel 8 Pro', slug: 'google-pixel-8-pro', description: 'Android puro con la mejor cámara computacional', price: 999, stock: 30, image_url: '/images/smartphone_4.jpg', featured: false, active: true },
      
      { category_id: insertedCategories[1].id, name: 'MacBook Pro 16" M3', slug: 'macbook-pro-16-m3', description: 'Laptop profesional con chip M3, 16GB RAM, 512GB SSD', price: 2499, original_price: 2799, stock: 12, image_url: '/images/laptop_8.jpg', featured: true, active: true },
      { category_id: insertedCategories[1].id, name: 'Dell XPS 15', slug: 'dell-xps-15', description: 'Laptop premium con Intel i9, 32GB RAM, pantalla 4K', price: 2199, stock: 18, image_url: '/images/laptop_7.jpg', featured: true, active: true },
      { category_id: insertedCategories[1].id, name: 'HP Pavilion 14', slug: 'hp-pavilion-14', description: 'Laptop ligera para trabajo y estudio, Intel i5, 8GB RAM', price: 699, original_price: 899, stock: 40, image_url: '/images/laptop_2.jpg', featured: false, active: true },
      
      { category_id: insertedCategories[2].id, name: 'Nikon D850', slug: 'nikon-d850', description: 'Cámara DSLR profesional 45.7MP, grabación 4K', price: 2999, stock: 8, image_url: '/images/camera_7.jpg', featured: true, active: true },
      { category_id: insertedCategories[2].id, name: 'Canon EOS R5', slug: 'canon-eos-r5', description: 'Cámara mirrorless 45MP con estabilización 8K', price: 3899, stock: 5, image_url: '/images/camera_1.jpg', featured: false, active: true },
      { category_id: insertedCategories[2].id, name: 'Nikon D780', slug: 'nikon-d780', description: 'Cámara versátil para foto y video', price: 2299, original_price: 2599, stock: 10, image_url: '/images/camera_4.jpg', featured: false, active: true },
      
      { category_id: insertedCategories[3].id, name: 'Apple Watch Series 9', slug: 'apple-watch-series-9', description: 'Smartwatch con GPS, monitor de salud y fitness', price: 429, original_price: 499, stock: 35, image_url: '/images/smartwatch_9.jpg', featured: true, active: true },
      { category_id: insertedCategories[3].id, name: 'Samsung Galaxy Watch 6', slug: 'samsung-galaxy-watch-6', description: 'Reloj inteligente con Wear OS, seguimiento de sueño', price: 349, stock: 28, image_url: '/images/smartwatch_6.jpg', featured: false, active: true },
      { category_id: insertedCategories[3].id, name: 'Garmin Forerunner 965', slug: 'garmin-forerunner-965', description: 'Reloj deportivo con GPS y análisis avanzado', price: 599, stock: 20, image_url: '/images/smartwatch_5.jpg', featured: false, active: true },
      
      { category_id: insertedCategories[4].id, name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', description: 'Audífonos con cancelación de ruido premium', price: 399, original_price: 449, stock: 45, image_url: '/images/headphones_3.webp', featured: true, active: true },
      { category_id: insertedCategories[4].id, name: 'Bose QuietComfort Ultra', slug: 'bose-qc-ultra', description: 'Audífonos inalámbricos con audio espacial', price: 429, stock: 30, image_url: '/images/headphones_6.webp', featured: false, active: true },
      { category_id: insertedCategories[4].id, name: 'AirPods Max', slug: 'airpods-max', description: 'Audífonos over-ear de Apple con audio espacial', price: 549, stock: 22, image_url: '/images/headphones_4.png', featured: false, active: true },
      
      { category_id: insertedCategories[5].id, name: 'The North Face Borealis', slug: 'north-face-borealis', description: 'Mochila urbana con compartimento para laptop', price: 99, original_price: 129, stock: 60, image_url: '/images/backpack_7.jpg', featured: false, active: true },
      { category_id: insertedCategories[5].id, name: 'Osprey Daylite Plus', slug: 'osprey-daylite-plus', description: 'Mochila ligera para excursiones', price: 75, stock: 50, image_url: '/images/backpack_8.jpg', featured: false, active: true },
      { category_id: insertedCategories[5].id, name: 'Patagonia Black Hole 25L', slug: 'patagonia-black-hole', description: 'Mochila resistente al agua para aventuras', price: 139, stock: 35, image_url: '/images/backpack_3.jpg', featured: false, active: true },
      
      { category_id: insertedCategories[6].id, name: 'iPad Pro 12.9"', slug: 'ipad-pro-12-9', description: 'Tablet profesional con chip M2 y pantalla Liquid Retina', price: 1099, original_price: 1299, stock: 20, image_url: '/images/tablet_0.jpg', featured: true, active: true },
      { category_id: insertedCategories[6].id, name: 'Samsung Galaxy Tab S9', slug: 'samsung-tab-s9', description: 'Tablet Android premium con S Pen incluido', price: 799, stock: 25, image_url: '/images/tablet_1.jpg', featured: false, active: true },
      { category_id: insertedCategories[6].id, name: 'iPad Air', slug: 'ipad-air', description: 'Tablet versátil para trabajo y entretenimiento', price: 599, stock: 40, image_url: '/images/tablet_2.jpg', featured: false, active: true },
      
      { category_id: insertedCategories[7].id, name: 'Nespresso Vertuo Plus', slug: 'nespresso-vertuo-plus', description: 'Cafetera de cápsulas con tecnología Centrifusion', price: 179, original_price: 229, stock: 55, image_url: '/images/coffee_maker_1.jpg', featured: false, active: true },
      { category_id: insertedCategories[7].id, name: 'Breville Barista Express', slug: 'breville-barista-express', description: 'Máquina de espresso con molinillo integrado', price: 699, stock: 15, image_url: '/images/coffee_maker_7.jpg', featured: false, active: true },
      { category_id: insertedCategories[7].id, name: 'Moccamaster KBG', slug: 'moccamaster-kbg', description: 'Cafetera de filtro premium hecha a mano', price: 349, stock: 12, image_url: '/images/coffee_maker_9.png', featured: false, active: true },
    ]

    // Insertar productos
    const prodResponse = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey!,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(products)
    })

    const insertedProducts = await prodResponse.json()

    return new Response(
      JSON.stringify({ 
        success: true,
        categories: insertedCategories.length,
        products: insertedProducts.length,
        message: 'Datos de ejemplo creados exitosamente'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
