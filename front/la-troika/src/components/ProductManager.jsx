import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProductManager = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'femmes',
    subcategory: 'sacs'
  });

  const apiUrl = 'http://localhost:5000';

  // Charger les produits
  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/products`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
    setLoading(false);
  };

  // Créer un nouveau produit
  const createProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newProduct), // ✅ Envoyer les données du formulaire
      });
      if (response.ok) {
        setNewProduct({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: 'femmes',
          subcategory: 'sacs',
          brand: ''
        });
        loadProducts(); // Recharger la liste
        alert('✅ Produit créé avec succès !');
      } else {
        const data = await response.json().catch(() => ({}));
        alert(`❌ Échec création produit: ${data.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      alert('❌ Erreur lors de la création du produit');
    }
    setLoading(false);
  };

  // Supprimer un produit
  const deleteProduct = async (productId, productName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" ?`)) {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          }
        });
        const data = await response.json();
        
        if (response.ok) {
          loadProducts(); // Recharger la liste
          alert(`✅ Produit "${productName}" supprimé avec succès !`);
        } else {
          alert(`❌ Erreur: ${data.message || 'Erreur lors de la suppression'}`);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('❌ Erreur lors de la suppression du produit');
      }
      setLoading(false);
    }
  };

  // Charger les produits au montage du composant
  useEffect(() => {
    loadProducts();
  }, []);

  // Accès réservé aux admins
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
          Accès réservé aux administrateurs.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🛍️ Gestionnaire de Produits - La Troika
        </h1>

        {/* Formulaire de création */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Ajouter un nouveau produit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit
              </label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Sac à main cuir premium"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="89.99"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <input
                type="text"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Troika"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="femmes">Femmes</option>
                <option value="hommes">Hommes</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Description détaillée du produit..."
              />
            </div>
          </div>
          
          <button
            onClick={createProduct}
            disabled={loading || !newProduct.name || !newProduct.price || !newProduct.brand}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            ➕ Ajouter le produit
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={loadProducts}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            🔄 Actualiser
          </button>
          
          {/* Bouton de produit test retiré (non nécessaire en prod) */}

          {products.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Êtes-vous sûr de vouloir supprimer tous les produits (${products.length}) ?`)) {
                  alert('⚠️ Fonctionnalité de suppression en masse à implémenter');
                }
              }}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold disabled:opacity-50"
            >
              🗑️ Supprimer Tout
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        )}
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📦 Liste des Produits ({products.length})
        </h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun produit trouvé. Créez votre premier produit !
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {product.name}
                  </h3>
                                     <button
                     onClick={() => deleteProduct(product._id, product.name)}
                     className="text-red-500 hover:text-red-700 text-sm p-1 rounded hover:bg-red-50 transition-colors"
                     title="Supprimer"
                     disabled={loading}
                   >
                     🗑️
                   </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    {product.price}€
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  {product.subcategory && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded ml-1">
                      {product.subcategory}
                    </span>
                  )}
                </div>
                
                {product.isOnSale && (
                  <div className="mt-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                      🔥 En promotion (-{product.salePercentage}%)
                    </span>
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

export default ProductManager;
