const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function finalTest() {
    try {
        console.log('🎯 Test final du backend La Troika...\n');
        
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connecté !');

        // Test 1: Création d'utilisateur
        console.log('\n👤 Test création utilisateur...');
        const timestamp = Date.now();
        const testUser = new User({
            firstName: 'Test',
            lastName: 'Utilisateur',
            email: `test${timestamp}@latroika.com`,
            password: 'motdepasse123',
            phone: '0123456789',
            address: {
                street: '123 Rue Test',
                city: 'Paris',
                postalCode: '75001'
            }
        });
        const savedUser = await testUser.save();
        console.log('✅ Utilisateur créé:', savedUser.email);

        // Test 2: Création de produit
        console.log('\n🛍️ Test création produit...');
        const testProduct = new Product({
            name: `Produit Test ${timestamp}`,
            description: 'Description du produit de test',
            shortDescription: 'Produit de test',
            price: 99.99,
            originalPrice: 129.99,
            category: 'femmes',
            subcategory: 'sacs',
            brand: 'La Troika',
            stock: 10,
            images: [{
                url: 'https://example.com/test.jpg',
                alt: 'Image de test',
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
            materials: ['Cuir'],
            features: ['Test'],
            tags: ['test'],
            isOnSale: true,
            salePercentage: 20,
            shipping: {
                weight: 0.5,
                freeShipping: true
            }
        });
        const savedProduct = await testProduct.save();
        console.log('✅ Produit créé:', savedProduct.name);

        // Test 3: Création de commande
        console.log('\n📦 Test création commande...');
        const testOrder = new Order({
            user: savedUser._id,
            items: [{
                product: savedProduct._id,
                quantity: 1,
                price: savedProduct.price,
                originalPrice: savedProduct.originalPrice,
                totalPrice: savedProduct.price,
                selectedColor: { name: 'Noir', code: '#000000' }
            }],
            paymentMethod: 'card',
            subtotal: savedProduct.price,
            tax: savedProduct.price * 0.20,
            shippingCost: 0,
            total: savedProduct.price * 1.20,
            shippingAddress: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                street: savedUser.address.street,
                city: savedUser.address.city,
                postalCode: savedUser.address.postalCode,
                country: savedUser.address.country,
                phone: savedUser.phone
            },
            shippingMethod: {
                name: 'Livraison standard',
                price: 0,
                estimatedDays: '2-3 jours'
            }
        });
        const savedOrder = await testOrder.save();
        console.log('✅ Commande créée:', savedOrder.orderNumber);

        // Affichage des résultats
        console.log('\n📊 Résumé des tests:');
        console.log(`👤 Utilisateur: ${savedUser.email}`);
        console.log(`🛍️ Produit: ${savedProduct.name} (${savedProduct.price}€)`);
        console.log(`📦 Commande: ${savedOrder.orderNumber} (${savedOrder.total}€)`);

        console.log('\n🎉 Tous les tests sont passés avec succès !');
        console.log('✅ Votre backend fonctionne parfaitement !');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Connexion fermée');
    }
}

finalTest();
