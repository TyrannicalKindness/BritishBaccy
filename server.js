// server.js

const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
// Serve static files (HTML, images, etc) from the project directory
app.use(express.static(path.join(__dirname)));

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  // Map your products to Stripe line items
  const line_items = items.map(item => ({
    price_data: {
      currency: 'gbp',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100), // price in pence
    },
    quantity: item.quantity || 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success.html`,
      cancel_url: `${process.env.DOMAIN}/cancel.html`,
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'britishbaccy-singlefileORIG.html'));
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
