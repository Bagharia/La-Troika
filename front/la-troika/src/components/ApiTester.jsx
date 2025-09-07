import { useState } from 'react';

const ApiTester = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:5000');

  // Fonction pour ajouter un résultat
  const addResult = (test, success, data, error = null) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Test de base
  const testBasicConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/`);
      const data = await response.text();
      addResult('Test de connexion de base', true, data);
    } catch (error) {
      addResult('Test de connexion de base', false, null, error.message);
    }
    setLoading(false);
  };

  // Test création utilisateur
  const testCreateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/test/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      addResult('Création utilisateur de test', true, data);
    } catch (error) {
      addResult('Création utilisateur de test', false, null, error.message);
    }
    setLoading(false);
  };

  // Test récupération utilisateurs
  const testGetUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/test/users`);
      const data = await response.json();
      addResult('Récupération utilisateurs', true, data);
    } catch (error) {
      addResult('Récupération utilisateurs', false, null, error.message);
    }
    setLoading(false);
  };

  // Test création produit
  const testCreateProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/test/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      addResult('Création produit de test', true, data);
    } catch (error) {
      addResult('Création produit de test', false, null, error.message);
    }
    setLoading(false);
  };

  // Test récupération produits
  const testGetProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/test/products`);
      const data = await response.json();
      addResult('Récupération produits', true, data);
    } catch (error) {
      addResult('Récupération produits', false, null, error.message);
    }
    setLoading(false);
  };

  // Test création panier
  const testCreateCart = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/test/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      addResult('Création panier de test', true, data);
    } catch (error) {
      addResult('Création panier de test', false, null, error.message);
    }
    setLoading(false);
  };

  // Test récupération paniers
  const testGetCarts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/test/carts`);
      const data = await response.json();
      addResult('Récupération paniers', true, data);
    } catch (error) {
      addResult('Récupération paniers', false, null, error.message);
    }
    setLoading(false);
  };

  // Test création commande
  const testCreateOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/test/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      addResult('Création commande de test', true, data);
    } catch (error) {
      addResult('Création commande de test', false, null, error.message);
    }
    setLoading(false);
  };

  // Test récupération commandes
  const testGetOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/test/orders`);
      const data = await response.json();
      addResult('Récupération commandes', true, data);
    } catch (error) {
      addResult('Récupération commandes', false, null, error.message);
    }
    setLoading(false);
  };

  // Test complet
  const runAllTests = async () => {
    setResults([]);
    await testBasicConnection();
    await testCreateUser();
    await testGetUsers();
    await testCreateProduct();
    await testGetProducts();
    await testCreateCart();
    await testGetCarts();
    await testCreateOrder();
    await testGetOrders();
  };

  // Nettoyer les résultats
  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧪 Testeur d'API - La Troika
        </h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de l'API :
          </label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="http://localhost:5000"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <button
            onClick={testBasicConnection}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            🔌 Test Connexion
          </button>
          
          <button
            onClick={testCreateUser}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            👤 Créer Utilisateur
          </button>
          
          <button
            onClick={testGetUsers}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            📋 Récupérer Utilisateurs
          </button>
          
          <button
            onClick={testCreateProduct}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            🛍️ Créer Produit
          </button>
          
          <button
            onClick={testGetProducts}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            📦 Récupérer Produits
          </button>
          
          <button
            onClick={testCreateCart}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            🛒 Créer Panier
          </button>
          
          <button
            onClick={testGetCarts}
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            📋 Récupérer Paniers
          </button>
          
          <button
            onClick={testCreateOrder}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            📦 Créer Commande
          </button>
          
          <button
            onClick={testGetOrders}
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            📋 Récupérer Commandes
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-md font-semibold disabled:opacity-50"
          >
            🚀 Lancer Tous les Tests
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-semibold"
          >
            🗑️ Nettoyer Résultats
          </button>
        </div>

        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Test en cours...</span>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📊 Résultats des Tests ({results.length})
        </h2>
        
        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun test n'a encore été exécuté. Cliquez sur un bouton pour commencer !
          </p>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    {result.success ? '✅' : '❌'} {result.test}
                  </h3>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                
                {result.success ? (
                  <div className="mt-2">
                    <pre className="text-sm text-gray-700 bg-gray-100 p-3 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-red-600 font-medium">Erreur : {result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTester;
