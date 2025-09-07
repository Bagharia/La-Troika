const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';

async function testAuthAPI() {
    try {
        console.log('🔐 Test de l\'API d\'authentification...\n');

        let token = null;
        let user = null;

        // Test 1: Inscription
        console.log('1️⃣ Test inscription...');
        try {
            const registerData = {
                firstName: 'Test',
                lastName: 'Utilisateur',
                email: `test${Date.now()}@latroika.com`,
                password: 'motdepasse123',
                phone: '0123456789',
                address: {
                    street: '123 Rue Test',
                    city: 'Paris',
                    postalCode: '75001',
                    country: 'France'
                }
            };

            const response = await axios.post(`${BASE_URL}/register`, registerData);
            console.log('✅ Inscription réussie:', response.data.message);
            console.log('Utilisateur:', response.data.user.email);
            console.log('Token reçu:', response.data.token ? '✅' : '❌');
            
            token = response.data.token;
            user = response.data.user;
        } catch (error) {
            console.log('❌ Erreur inscription:', error.response?.data?.message || error.message);
        }

        // Test 2: Connexion
        console.log('\n2️⃣ Test connexion...');
        try {
            const loginData = {
                email: user?.email || 'test@latroika.com',
                password: 'motdepasse123'
            };

            const response = await axios.post(`${BASE_URL}/login`, loginData);
            console.log('✅ Connexion réussie:', response.data.message);
            console.log('Utilisateur:', response.data.user.email);
            console.log('Token reçu:', response.data.token ? '✅' : '❌');
            
            token = response.data.token;
        } catch (error) {
            console.log('❌ Erreur connexion:', error.response?.data?.message || error.message);
        }

        // Test 3: Vérification du token
        if (token) {
            console.log('\n3️⃣ Test vérification token...');
            try {
                const response = await axios.post(`${BASE_URL}/verify`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('✅ Token valide:', response.data.message);
                console.log('Utilisateur:', response.data.user.email);
            } catch (error) {
                console.log('❌ Erreur vérification token:', error.response?.data?.message || error.message);
            }
        }

        // Test 4: Récupération du profil
        if (token) {
            console.log('\n4️⃣ Test récupération profil...');
            try {
                const response = await axios.get(`${BASE_URL}/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('✅ Profil récupéré:', response.data.message);
                console.log('Nom:', response.data.user.firstName, response.data.user.lastName);
            } catch (error) {
                console.log('❌ Erreur récupération profil:', error.response?.data?.message || error.message);
            }
        }

        // Test 5: Mise à jour du profil
        if (token) {
            console.log('\n5️⃣ Test mise à jour profil...');
            try {
                const updateData = {
                    firstName: 'Test Modifié',
                    lastName: 'Utilisateur Modifié',
                    phone: '0987654321'
                };

                const response = await axios.put(`${BASE_URL}/profile`, updateData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('✅ Profil mis à jour:', response.data.message);
                console.log('Nouveau nom:', response.data.user.firstName, response.data.user.lastName);
            } catch (error) {
                console.log('❌ Erreur mise à jour profil:', error.response?.data?.message || error.message);
            }
        }

        // Test 6: Changement de mot de passe
        if (token) {
            console.log('\n6️⃣ Test changement mot de passe...');
            try {
                const passwordData = {
                    currentPassword: 'motdepasse123',
                    newPassword: 'nouveaumotdepasse456'
                };

                const response = await axios.put(`${BASE_URL}/password`, passwordData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('✅ Mot de passe changé:', response.data.message);
            } catch (error) {
                console.log('❌ Erreur changement mot de passe:', error.response?.data?.message || error.message);
            }
        }

        // Test 7: Déconnexion
        if (token) {
            console.log('\n7️⃣ Test déconnexion...');
            try {
                const response = await axios.post(`${BASE_URL}/logout`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('✅ Déconnexion réussie:', response.data.message);
            } catch (error) {
                console.log('❌ Erreur déconnexion:', error.response?.data?.message || error.message);
            }
        }

        // Test 8: Test avec token invalide
        console.log('\n8️⃣ Test token invalide...');
        try {
            const response = await axios.get(`${BASE_URL}/me`, {
                headers: {
                    'Authorization': 'Bearer token_invalide'
                }
            });
            console.log('❌ Erreur attendue:', response.data.message);
        } catch (error) {
            console.log('✅ Erreur token invalide (attendu):', error.response?.data?.message || error.message);
        }

        console.log('\n🎉 Tests d\'authentification terminés !');

    } catch (error) {
        console.error('❌ Erreur générale:', error.message);
    }
}

testAuthAPI();
