const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testDeleteAPI() {
    try {
        console.log('🧪 Test de l\'API de suppression de produits...\n');

        // Test 1: Récupérer tous les produits
        console.log('1️⃣ Récupération des produits...');
        try {
            const response = await axios.get(`${BASE_URL}/test/products`);
            const products = response.data.products;
            console.log(`✅ ${products.length} produits récupérés`);
            
            if (products.length > 0) {
                const firstProduct = products[0];
                console.log(`📦 Premier produit: ${firstProduct.name} (ID: ${firstProduct._id})`);
                
                // Test 2: Supprimer le premier produit
                console.log('\n2️⃣ Test suppression du premier produit...');
                try {
                    const deleteResponse = await axios.delete(`${BASE_URL}/test/product/${firstProduct._id}`);
                    console.log('✅ Produit supprimé:', deleteResponse.data.message);
                    console.log('Produit supprimé:', deleteResponse.data.deletedProduct.name);
                } catch (error) {
                    console.log('❌ Erreur suppression:', error.response?.data?.message || error.message);
                }
                
                // Test 3: Vérifier que le produit a été supprimé
                console.log('\n3️⃣ Vérification de la suppression...');
                try {
                    const verifyResponse = await axios.get(`${BASE_URL}/test/products`);
                    console.log(`✅ ${verifyResponse.data.count} produits restants`);
                } catch (error) {
                    console.log('❌ Erreur vérification:', error.response?.data?.message || error.message);
                }
            } else {
                console.log('⚠️ Aucun produit à supprimer');
            }
        } catch (error) {
            console.log('❌ Erreur récupération produits:', error.response?.data?.message || error.message);
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

testDeleteAPI();
