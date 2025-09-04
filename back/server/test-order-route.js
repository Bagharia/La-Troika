const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testOrderRoute() {
    try {
        console.log('🧪 Test de la route de création de commandes...\n');

        // Test création de commande
        console.log('📦 Test création commande via API...');
        try {
            const response = await axios.post(`${BASE_URL}/test/order`);
            console.log('✅ Commande créée:', response.data.message);
            console.log('Numéro de commande:', response.data.orderNumber);
        } catch (error) {
            console.log('❌ Erreur création commande:', error.response?.data?.message || error.message);
            if (error.response?.data?.error) {
                console.log('Détails de l\'erreur:', error.response.data.error);
            }
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

testOrderRoute();
