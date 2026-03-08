const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const protect = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');

// Email alert function
const sendLowStockEmail = async (product) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `⚠️ Low Stock Alert: ${product.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #ff6b6b;">⚠️ Low Stock Alert!</h2>
          <p>The following product is running low on stock:</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr style="background: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Product</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${product.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Category</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${product.category}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Remaining Qty</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd; color: #ff6b6b;"><strong>${product.quantity}</strong></td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #888;">Please restock soon!</p>
        </div>
      `,
    });
  } catch (err) {
    console.log('Email error:', err.message);
  }
};

// GET all products
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST add a new product
router.post('/', protect, async (req, res) => {
  const { name, category, quantity, price } = req.body;
  try {
    const product = await Product.create({ name, category, quantity, price });
    if (product.quantity <= 5) await sendLowStockEmail(product);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a product
router.put('/:id', protect, async (req, res) => {
  const { name, category, quantity, price } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, quantity, price },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.quantity <= 5) await sendLowStockEmail(product);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a product
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;