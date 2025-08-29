// Routes de test pour vérifier les modèles
const express = require('express');
const router = express.Router();

// Import des modèles
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

// ===== ROUTES DE TEST USER =====

// Test création d'un utilisateur
router.post('/test/user', async (req, res) => {
    try {
        const testUser = new User({
            firstName: 'Test',
            lastName: 'Utilisateur',
            email: 'test@latroika.com',
            password: 'motdepasse123',
            phone: '0123456789',
            address: {
                street: '123 Rue Test',
                city: 'Paris',
                postalCode: '75001'
            }
        });

        const savedUser = await testUser.save();
        res.status(201).json({
            message: '✅ Utilisateur de test créé avec succès !',
            user: savedUser.toSafeObject()
        });
    } catch (error) {
        res.status(400).json({
            message: '❌ Erreur lors de la création de l\'utilisateur de test',
            error: error.message
        });
    }
});

// Test récupération des utilisateurs
router.get('/test/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            message: '✅ Utilisateurs récupérés avec succès !',
            count: users.length,
            users: users
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de la récupération des utilisateurs',
            error: error.message
        });
    }
});

// ===== ROUTES DE TEST PRODUCT =====

// Test création d'un produit
router.post('/test/product', async (req, res) => {
    try {
        const testProduct = new Product({
            name: 'Sac à main cuir premium',
            description: 'Magnifique sac en cuir véritable, parfait pour toutes les occasions',
            shortDescription: 'Sac cuir premium élégant',
            price: 89.99,
            originalPrice: 129.99,
            category: 'femmes',
            subcategory: 'sacs',
            brand: 'La Troika',
            stock: 25,
            images: [{
                url: 'https://example.com/sac1.jpg',
                alt: 'Sac à main cuir noir',
                isMain: true
            }],
            colors: [{
                name: 'Noir',
                code: '#000000',
                available: true
            }],
            sizes: [{
                name: 'Unique',
                available: true
            }],
            materials: ['Cuir véritable', 'Laiton'],
            features: ['Doublure en tissu', 'Poches intérieures', 'Fermeture à clapet'],
            tags: ['cuir', 'premium', 'élégant', 'sacs'],
            isOnSale: true,
            salePercentage: 30,
            shipping: {
                weight: 0.8,
                freeShipping: true
            }
        });

        const savedProduct = await testProduct.save();
        res.status(201).json({
            message: '✅ Produit de test créé avec succès !',
            product: savedProduct
        });
    } catch (error) {
        res.status(400).json({
            message: '❌ Erreur lors de la création du produit de test',
            error: error.message
        });
    }
});

// Test récupération des produits
router.get('/test/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({
            message: '✅ Produits récupérés avec succès !',
            count: products.length,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de la récupération des produits',
            error: error.message
        });
    }
});

// ===== ROUTES DE TEST CART =====

// Test création d'un panier
router.post('/test/cart', async (req, res) => {
    try {
        // Récupérer un utilisateur et un produit existants
        const user = await User.findOne();
        const product = await Product.findOne();
        
        if (!user || !product) {
            return res.status(400).json({
                message: '❌ Créez d\'abord un utilisateur et un produit'
            });
        }

        const testCart = new Cart({
            user: user._id,
            items: [{
                product: product._id,
                quantity: 2,
                selectedColor: { name: 'Noir', code: '#000000' },
                price: product.price,
                originalPrice: product.originalPrice
            }],
            shippingAddress: {
                firstName: user.firstName,
                lastName: user.lastName,
                street: user.address.street,
                city: user.address.city,
                postalCode: user.address.postalCode,
                country: user.address.country,
                phone: user.phone
            },
            shippingMethod: {
                name: 'Livraison standard',
                price: 0,
                estimatedDays: '2-3 jours'
            }
        });

        const savedCart = await testCart.save();
        
        // Populate les références pour l'affichage
        await savedCart.populate('user', 'firstName lastName email');
        await savedCart.populate('items.product', 'name price images');

        res.status(201).json({
            message: '✅ Panier de test créé avec succès !',
            cart: savedCart,
            subtotal: savedCart.getSubtotal(),
            total: savedCart.getTotal(),
            itemCount: savedCart.getItemCount()
        });
    } catch (error) {
        res.status(400).json({
            message: '❌ Erreur lors de la création du panier de test',
            error: error.message
        });
    }
});

// Test récupération des paniers
router.get('/test/carts', async (req, res) => {
    try {
        const carts = await Cart.find()
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name price images');
            
        res.json({
            message: '✅ Paniers récupérés avec succès !',
            count: carts.length,
            carts: carts
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de la récupération des paniers',
            error: error.message
        });
    }
});

// ===== ROUTES DE TEST ORDER =====

// Test création d'une commande
router.post('/test/order', async (req, res) => {
    try {
        // Récupérer un utilisateur et un produit existants
        const user = await User.findOne();
        const product = await Product.findOne();
        
        if (!user || !product) {
            return res.status(400).json({
                message: '❌ Créez d\'abord un utilisateur et un produit'
            });
        }

        const testOrder = new Order({
            user: user._id,
            items: [{
                product: product._id,
                quantity: 2,
                price: product.price,
                originalPrice: product.originalPrice,
                totalPrice: product.price * 2,
                selectedColor: { name: 'Noir', code: '#000000' }
            }],
            paymentMethod: 'card',
            subtotal: product.price * 2,
            tax: (product.price * 2) * 0.20,
            shippingCost: 0,
            total: (product.price * 2) * 1.20,
            shippingAddress: {
                firstName: user.firstName,
                lastName: user.lastName,
                street: user.address.street,
                city: user.address.city,
                postalCode: user.address.postalCode,
                country: user.address.country,
                phone: user.phone
            },
            shippingMethod: {
                name: 'Livraison standard',
                price: 0,
                estimatedDays: '2-3 jours'
            }
        });

        const savedOrder = await testOrder.save();
        
        // Populate les références pour l'affichage
        await savedOrder.populate('user', 'firstName lastName email');
        await savedOrder.populate('items.product', 'name price images');

        res.status(201).json({
            message: '✅ Commande de test créée avec succès !',
            order: savedOrder,
            orderNumber: savedOrder.orderNumber,
            status: savedOrder.getDeliveryStatus(),
            paymentStatus: savedOrder.getPaymentStatus()
        });
    } catch (error) {
        res.status(400).json({
            message: '❌ Erreur lors de la création de la commande de test',
            error: error.message
        });
    }
});

// Test récupération des commandes
router.get('/test/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name price images');
            
        res.json({
            message: '✅ Commandes récupérées avec succès !',
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de la récupération des commandes',
            error: error.message
        });
    }
});

// ===== ROUTE DE TEST GÉNÉRALE =====

// Test de santé générale de l'API
router.get('/test/health', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const cartCount = await Cart.countDocuments();
        const orderCount = await Order.countDocuments();

        res.json({
            message: '🏥 État de santé de l\'API La Troika',
            status: '✅ Opérationnel',
            database: '✅ Connecté',
            counts: {
                users: userCount,
                products: productCount,
                carts: cartCount,
                orders: orderCount
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Problème de santé de l\'API',
            error: error.message
        });
    }
});

module.exports = router; 