import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || ""
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || ""

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("RAZORPAY_KEY_ID present:", !!RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET present:", !!RAZORPAY_KEY_SECRET);

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return new Response(JSON.stringify({ error: "Razorpay keys are not configured in Supabase Secrets." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const body = await req.json()
    console.log("Request Body:", JSON.stringify(body));
    const { action, amount, currency = "INR", razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (action === "create_order") {
      const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          receipt: `receipt_${Date.now()}`,
        }),
      })

      const order = await response.json()
      if (!response.ok) {
        console.error("Razorpay API Error:", order);
        throw new Error(order.error?.description || "Failed to create order");
      }

      return new Response(JSON.stringify(order), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === "verify_payment") {
      const crypto = await import("node:crypto")
      const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id)
      const generated_signature = hmac.digest("hex")

      if (generated_signature === razorpay_signature) {
        return new Response(JSON.stringify({ status: "success" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      } else {
        return new Response(JSON.stringify({ status: "failure" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  } catch (error) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
