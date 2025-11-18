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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const { orderId, paymentIntentId, status } = await req.json()

    if (!orderId || !paymentIntentId) {
      return new Response(
        JSON.stringify({ error: 'orderId y paymentIntentId son requeridos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Actualizar estado de la orden
    const orderStatus = status === 'succeeded' ? 'processing' : 'payment_failed'
    const paymentStatus = status === 'succeeded' ? 'paid' : 'failed'

    const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}`, {
      method: 'PATCH',
      headers: {
        'apikey': serviceKey!,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        status: orderStatus,
        payment_status: paymentStatus,
        payment_method: 'stripe',
        updated_at: new Date().toISOString(),
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Error updating order: ${error}`)
    }

    const order = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true,
        order: order[0],
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
