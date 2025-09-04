const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function testOrderCreation() {
    try {
        console.log('🔌 Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connecté !');

        // Récupérer un utilisateur et un produit existants
        const user = await User.findOne();
        const product = await Product.findOne();
        
        console.log('👤 Utilisateur trouvé:', user ? user.email : 'Aucun');
        console.log('🛍️ Produit trouvé:', product ? product.name : 'Aucun');
        
        if (!user || !product) {
            console.log('❌ Utilisateur ou produit manquant');
            return;
        }

        console.log('\n📦 Test création commande...');
        try {
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

            console.log('📋 Données de la commande:');
            console.log('- User ID:', testOrder.user);
            console.log('- Product ID:', testOrder.items[0].product);
            console.log('- Subtotal:', testOrder.subtotal);
            console.log('- Total:', testOrder.total);

            const savedOrder = await testOrder.save();
            console.log('✅ Commande créée:', savedOrder.orderNumber);
            
        } catch (error) {
            console.log('❌ Erreur création commande:', error.message);
            console.log('Détails:', error);
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Connexion fermée');
    }
}

testOrderCreation();
