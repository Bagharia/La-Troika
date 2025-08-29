import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css'

function App() {
  return (
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
          <Route path="/connexion" element={<LoginPage />} />
          
          {/* Route inscription */}
          <Route path="/inscription" element={<RegisterPage />} />
          
          {/* Route 404 - Page non trouvée */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;