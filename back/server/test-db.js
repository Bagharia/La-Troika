const mongoose = require('mongoose');
require('dotenv').config();

// Import des modèles
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

async function testDatabase() {
    try {
        // Connexion à MongoDB
        console.log('🔌 Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connecté avec succès !');

        // Test création d'un utilisateur
        console.log('\n👤 Test création utilisateur...');
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

        // Test création d'un produit
        console.log('\n🛍️ Test création produit...');
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

        // Test récupération des données
        console.log('\n📊 Test récupération des données...');
        const users = await User.find().select('-password');
        const products = await Product.find();
        console.log(`✅ ${users.length} utilisateurs trouvés`);
        console.log(`✅ ${products.length} produits trouvés`);

        // Nettoyage des données de test
        console.log('\n🧹 Nettoyage des données de test...');
        await User.deleteOne({ email: 'test@latroika.com' });
        await Product.deleteOne({ name: 'Sac à main cuir premium' });
        console.log('✅ Données de test supprimées');

        console.log('\n🎉 Tous les tests sont passés avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
    } finally {
        // Fermer la connexion
        await mongoose.connection.close();
        console.log('🔌 Connexion MongoDB fermée');
        process.exit(0);
    }
}

// Vérifier que MONGO_URI est défini
if (!process.env.MONGO_URI) {
    console.error('❌ Erreur : MONGO_URI n\'est pas défini dans le fichier .env');
    process.exit(1);
}

// Lancer les tests
testDatabase();
