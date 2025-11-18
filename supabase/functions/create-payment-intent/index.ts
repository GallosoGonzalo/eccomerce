Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { orderId, amount, currency = 'usd' } = await req.json()

    // Validar datos
    if (!orderId || !amount) {
      return new Response(
        JSON.stringify({ error: 'orderId y amount son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: 'Stripe no está configurado. Contacta al administrador.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Crear Payment Intent con Stripe
    const paymentIntent = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'amount': Math.round(amount * 100).toString(), // Stripe usa centavos
        'currency': currency,
        'metadata[order_id]': orderId,
      }),
    })

    if (!paymentIntent.ok) {
      const error = await paymentIntent.text()
      throw new Error(`Stripe error: ${error}`)
    }

    const paymentData = await paymentIntent.json()

    return new Response(
      JSON.stringify({
        clientSecret: paymentData.client_secret,
        paymentIntentId: paymentData.id,
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
