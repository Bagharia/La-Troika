// Test de connexion frontend-backend
const testConnection = async () => {
    try {
        console.log('🧪 Test de connexion frontend-backend...');
        
        // Test 1: Connexion de base
        const baseResponse = await fetch('http://localhost:5000');
        console.log('✅ Serveur accessible:', baseResponse.ok);
        
        // Test 2: Test d'inscription
        const registerData = {
            firstName: 'Test',
            lastName: 'Frontend',
            email: `test${Date.now()}@frontend.com`,
            password: 'test123',
            phone: '0123456789',
            address: {
                street: '123 Rue Test',
                city: 'Paris',
                postalCode: '75001',
                country: 'France'
            }
        };
        
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        
        const registerResult = await registerResponse.json();
        console.log('✅ Inscription testée:', registerResponse.ok);
        console.log('Message:', registerResult.message);
        
        if (registerResponse.ok) {
            // Test 3: Test de connexion avec le compte créé
            const loginData = {
                email: registerData.email,
                password: registerData.password
            };
            
            const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
            
            const loginResult = await loginResponse.json();
            console.log('✅ Connexion testée:', loginResponse.ok);
            console.log('Message:', loginResult.message);
        }
        
    } catch (error) {
        console.error('❌ Erreur de connexion:', error.message);
    }
};

// Exécuter le test
testConnection();
