const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  quantity: Joi.number().min(0).required(),
  price: Joi.number().min(0).required(),
  barcode: Joi.string().allow('').optional()
});

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

// GET all products (with pagination, search, and filter)
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Building the query object
    let query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Determine sorting
    let sortObj = { createdAt: -1 };
    if (req.query.sort === 'priceAsc') sortObj = { price: 1 };
    if (req.query.sort === 'priceDesc') sortObj = { price: -1 };
    if (req.query.sort === 'quantityAsc') sortObj = { quantity: 1 };
    if (req.query.sort === 'quantityDesc') sortObj = { quantity: -1 };

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    // Get total count for frontend pagination
    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST add a new product
router.post('/', protect, async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, category, quantity, price, barcode } = req.body;
  try {
    const product = await Product.create({ name, category, quantity, price, barcode });
    if (product.quantity <= 5) await sendLowStockEmail(product);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a product
router.put('/:id', protect, async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, category, quantity, price, barcode } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, quantity, price, barcode },
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