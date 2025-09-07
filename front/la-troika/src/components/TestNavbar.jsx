import { Link, useLocation } from 'react-router-dom';

const TestNavbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white hover:text-gray-300">
              🏠 La Troika
            </Link>
            
            <div className="flex space-x-4">
              <Link
                to="/test-api"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/test-api')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                🧪 Testeur API
              </Link>
              
              <Link
                to="/gestion-produits"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/gestion-produits')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                🛍️ Gestion Produits
              </Link>
              
              <Link
                to="/produits"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/produits')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                📦 Produits
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              🔌 API: localhost:5000
            </span>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TestNavbar;
