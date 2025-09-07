const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function debugUser() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connecté à MongoDB');

        // Chercher l'utilisateur
        console.log('\n🔍 Recherche de l\'utilisateur testuser@latroika.com...');
        const user = await User.findOne({ email: 'testuser@latroika.com' }).select('+password');
        
        if (!user) {
            console.log('❌ Utilisateur non trouvé');
            return;
        }

        console.log('✅ Utilisateur trouvé:');
        console.log('- ID:', user._id);
        console.log('- Email:', user.email);
        console.log('- Prénom:', user.firstName);
        console.log('- Nom:', user.lastName);
        console.log('- Mot de passe hashé:', user.password ? 'Présent' : 'Absent');
        console.log('- Longueur du hash:', user.password ? user.password.length : 'N/A');

        // Test de comparaison de mot de passe
        console.log('\n🔐 Test de comparaison de mot de passe...');
        try {
            const isValid = await user.comparePassword('password123');
            console.log('✅ Comparaison réussie:', isValid);
        } catch (error) {
            console.log('❌ Erreur comparaison:', error.message);
        }

        // Créer un nouvel utilisateur pour tester
        console.log('\n🆕 Création d\'un nouvel utilisateur de test...');
        const newUser = new User({
            firstName: 'Debug',
            lastName: 'Test',
            email: `debug${Date.now()}@test.com`,
            password: 'password123',
            phone: '0123456789'
        });

        await newUser.save();
        console.log('✅ Nouvel utilisateur créé:', newUser.email);

        // Test de connexion avec le nouvel utilisateur
        console.log('\n🔐 Test de connexion avec le nouvel utilisateur...');
        const loginUser = await User.findOne({ email: newUser.email }).select('+password');
        const isValid = await loginUser.comparePassword('password123');
        console.log('✅ Connexion test:', isValid);

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Déconnecté de MongoDB');
    }
}

debugUser();
