import { Link } from 'react-router-dom';

const ProductList = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-64 bg-gray-100">
            <img
              src={(product.images && product.images[0]?.url) || 'https://via.placeholder.com/600x400?text=Produit'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Produit'; }}
            />
            {product.brand && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {product.brand}
              </div>
            )}
          </div>

          <div className="p-4">
            {product.subcategory && (
              <p className="text-xs text-gray-500 mb-1 uppercase">{product.subcategory}</p>
            )}
            <h3 className="font-semibold text-lg text-gray-800 mb-2">{product.name}</h3>
            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-800">{product.price}€</span>
              <Link
                to={`/produit/${product._id}`}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Voir détails
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;


