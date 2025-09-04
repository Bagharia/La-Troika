const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testProductAPI() {
    try {
        console.log('🧪 Test de l\'API de création de produits...\n');

        // Test 1: Créer un produit avec des données du formulaire
        console.log('1️⃣ Test création produit avec données du formulaire...');
        try {
            const productData = {
                name: 'Sac à main élégant',
                description: 'Un magnifique sac en cuir véritable',
                price: 129.99,
                stock: 15,
                category: 'femmes',
                subcategory: 'sacs'
            };

            const response = await axios.post(`${BASE_URL}/test/product`, productData);
            console.log('✅ Produit créé:', response.data.message);
            console.log('Nom du produit:', response.data.product.name);
            console.log('Prix:', response.data.product.price);
        } catch (error) {
            console.log('❌ Erreur création produit:', error.response?.data?.message || error.message);
        }

        // Test 2: Créer un produit de test (sans données)
        console.log('\n2️⃣ Test création produit de test...');
        try {
            const response = await axios.post(`${BASE_URL}/test/product`, {});
            console.log('✅ Produit de test créé:', response.data.message);
        } catch (error) {
            console.log('❌ Erreur création produit test:', error.response?.data?.message || error.message);
            if (error.response?.data?.error) {
                console.log('Détails de l\'erreur:', error.response.data.error);
            }
        }

        // Test 3: Récupérer tous les produits
        console.log('\n3️⃣ Test récupération des produits...');
        try {
            const response = await axios.get(`${BASE_URL}/test/products`);
            console.log(`✅ ${response.data.count} produits récupérés`);
        } catch (error) {
            console.log('❌ Erreur récupération produits:', error.response?.data?.message || error.message);
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

testProductAPI();
