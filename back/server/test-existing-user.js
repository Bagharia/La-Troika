const axios = require('axios');
const BASE_URL = 'http://localhost:5000/api/auth';

async function testExistingUser() {
    try {
        console.log('🧪 Test de connexion avec un utilisateur existant...\n');
        
        // Test 1: Créer un utilisateur de test
        console.log('1️⃣ Création d\'un utilisateur de test...');
        const registerData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'testuser@latroika.com',
            password: 'password123',
            phone: '0123456789',
            address: {
                street: '123 Rue Test',
                city: 'Paris',
                postalCode: '75001',
                country: 'France'
            }
        };
        
        try {
            const registerResponse = await axios.post(`${BASE_URL}/register`, registerData);
            console.log('✅ Utilisateur créé:', registerResponse.data.message);
            console.log('Email:', registerResponse.data.user.email);
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.message?.includes('déjà utilisé')) {
                console.log('ℹ️ Utilisateur existe déjà, on continue...');
            } else {
                console.log('❌ Erreur création:', error.response?.data?.message || error.message);
                return;
            }
        }
        
        // Test 2: Connexion avec cet utilisateur
        console.log('\n2️⃣ Test de connexion...');
        const loginData = {
            email: 'testuser@latroika.com',
            password: 'password123'
        };
        
        try {
            const loginResponse = await axios.post(`${BASE_URL}/login`, loginData);
            console.log('✅ Connexion réussie:', loginResponse.data.message);
            console.log('Utilisateur:', loginResponse.data.user.email);
            console.log('Token reçu:', loginResponse.data.token ? '✅' : '❌');
            
            const token = loginResponse.data.token;
            
            // Test 3: Vérification du token
            console.log('\n3️⃣ Vérification du token...');
            const verifyResponse = await axios.post(`${BASE_URL}/verify`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('✅ Token valide:', verifyResponse.data.message);
            
        } catch (error) {
            console.log('❌ Erreur connexion:', error.response?.data?.message || error.message);
            if (error.response?.data?.error) {
                console.log('Détails:', error.response.data.error);
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

testExistingUser();
