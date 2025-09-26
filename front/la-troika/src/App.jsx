import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApiTestPage from './pages/ApiTestPage';
import ProductManagerPage from './pages/ProductManagerPage';
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Route principale */}
            <Route path="/" element={<HomePage />} />
            
            {/* Route unique pour tous les produits avec catégorie optionnelle */}
            <Route path="/produits" element={<ProductsPage />} />
            <Route path="/produits/:category" element={<ProductsPage />} />
            
            {/* Route produit individuel */}
            <Route path="/produit/:id" element={<div>Page Produit (à créer)</div>} />
            
            {/* Route panier */}
            <Route path="/panier" element={<div>Panier (à créer)</div>} />
            
            {/* Route connexion */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Route inscription */}
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Route test API */}
            <Route path="/test-api" element={<ApiTestPage />} />
            
            {/* Route gestionnaire de produits */}
            <Route path="/gestion-produits" element={<ProductManagerPage />} />
            
            {/* Route 404 - Page non trouvée */}
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;