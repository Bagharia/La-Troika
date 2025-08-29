import { useState } from 'react';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image du produit */}
            <div className="relative overflow-hidden h-64">
                <img 
                    src={product.image} 
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                        isHovered ? 'scale-110' : 'scale-100'
                    }`}
                />
                {/* Badge de promotion si applicable */}
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        -{product.discount}%
                    </div>
                )}
                {/* Bouton favoris */}
                <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Informations du produit */}
            <div className="p-4">
                {/* Catégorie */}
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                
                {/* Nom du produit */}
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>
                
                {/* Prix */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {product.oldPrice && (
                            <span className="text-gray-400 line-through text-sm">
                                {product.oldPrice}€
                            </span>
                        )}
                        <span className="text-xl font-bold text-gray-800">
                            {product.price}€
                        </span>
                    </div>
                    
                    {/* Note étoiles */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <svg 
                                key={i} 
                                className={`w-4 h-4 ${
                                    i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                    </div>
                </div>
                
                {/* Bouton d'ajout au panier */}
                <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    Ajouter au panier
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
