const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function debugTest() {
    try {
        console.log('🔌 Connexion à MongoDB...');
        console.log('URI:', process.env.MONGO_URI);
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connecté !');

        // Test 1: Création d'utilisateur
        console.log('\n👤 Test création utilisateur...');
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
            console.log('✅ Utilisateur créé:', savedUser.toSafeObject());
        } catch (error) {
            console.log('❌ Erreur création utilisateur:', error.message);
        }

        // Test 2: Création de produit
        console.log('\n🛍️ Test création produit...');
        try {
            const testProduct = new Product({
                name: 'Sac à main cuir premium',
                description: 'Magnifique sac en cuir véritable',
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
                features: ['Doublure en tissu', 'Poches intérieures'],
                tags: ['cuir', 'premium', 'élégant'],
                isOnSale: true,
                salePercentage: 30,
                shipping: {
                    weight: 0.8,
                    freeShipping: true
                }
            });
            const savedProduct = await testProduct.save();
            console.log('✅ Produit créé:', savedProduct.name);
        } catch (error) {
            console.log('❌ Erreur création produit:', error.message);
        }

        // Test 3: Création de commande
        console.log('\n📦 Test création commande...');
        try {
            const user = await User.findOne();
            const product = await Product.findOne();
            
            if (!user || !product) {
                console.log('❌ Utilisateur ou produit manquant pour créer une commande');
            } else {
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
                console.log('✅ Commande créée:', savedOrder.orderNumber);
            }
        } catch (error) {
            console.log('❌ Erreur création commande:', error.message);
        }

        // Affichage des données
        console.log('\n📊 Données dans la base:');
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        console.log(`👤 Utilisateurs: ${userCount}`);
        console.log(`🛍️ Produits: ${productCount}`);
        console.log(`📦 Commandes: ${orderCount}`);

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Connexion fermée');
    }
}

debugTest();
