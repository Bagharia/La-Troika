const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
    try {
        console.log('🧪 Test des routes API...\n');

        // Test 1: Santé de l'API
        console.log('1️⃣ Test santé de l\'API...');
        try {
            const response = await axios.get(`${BASE_URL}/test/health`);
            console.log('✅ Santé API:', response.data);
        } catch (error) {
            console.log('❌ Erreur santé API:', error.message);
        }

        // Test 2: Création d'utilisateur
        console.log('\n2️⃣ Test création utilisateur...');
        try {
            const response = await axios.post(`${BASE_URL}/test/user`);
            console.log('✅ Utilisateur créé:', response.data.message);
        } catch (error) {
            console.log('❌ Erreur création utilisateur:', error.response?.data?.message || error.message);
        }

        // Test 3: Création de produit
        console.log('\n3️⃣ Test création produit...');
        try {
            const response = await axios.post(`${BASE_URL}/test/product`);
            console.log('✅ Produit créé:', response.data.message);
        } catch (error) {
            console.log('❌ Erreur création produit:', error.response?.data?.message || error.message);
        }

        // Test 4: Création de commande
        console.log('\n4️⃣ Test création commande...');
        try {
            const response = await axios.post(`${BASE_URL}/test/order`);
            console.log('✅ Commande créée:', response.data.message);
        } catch (error) {
            console.log('❌ Erreur création commande:', error.response?.data?.message || error.message);
        }

        // Test 5: Récupération des données
        console.log('\n5️⃣ Test récupération des données...');
        try {
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                axios.get(`${BASE_URL}/test/users`),
                axios.get(`${BASE_URL}/test/products`),
                axios.get(`${BASE_URL}/test/orders`)
            ]);
            
            console.log(`✅ Utilisateurs: ${usersRes.data.count}`);
            console.log(`✅ Produits: ${productsRes.data.count}`);
            console.log(`✅ Commandes: ${ordersRes.data.count}`);
        } catch (error) {
            console.log('❌ Erreur récupération données:', error.response?.data?.message || error.message);
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

// Vérifier si axios est installé
try {
    require('axios');
    testAPI();
} catch (error) {
    console.log('⚠️ Axios n\'est pas installé. Installation...');
    const { execSync } = require('child_process');
    try {
        execSync('npm install axios', { stdio: 'inherit' });
        console.log('✅ Axios installé !');
        testAPI();
    } catch (installError) {
        console.error('❌ Erreur installation axios:', installError.message);
    }
}
