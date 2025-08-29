import { useState } from 'react';
import { Link } from 'react-router-dom';

const FemmesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('tous');

    // Données d'exemple pour les produits femmes
    const products = [
        {
            id: 1,
            name: "Sac à main cuir premium",
            price: 89.99,
            category: "sacs",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
            description: "Sac élégant en cuir véritable, parfait pour toutes les occasions"
        },
        {
            id: 2,
            name: "Portefeuille cuir marron",
            price: 45.99,
            category: "portefeuilles",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
            description: "Portefeuille compact et fonctionnel"
        },
        {
            id: 3,
            name: "Trousse de maquillage",
            price: 32.99,
            category: "accessoires",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            description: "Trousse pratique et élégante"
        }
    ];

    const categories = [
        { id: 'tous', name: 'Tous les produits' },
        { id: 'sacs', name: 'Sacs' },
        { id: 'portefeuilles', name: 'Portefeuilles' },
        { id: 'accessoires', name: 'Accessoires' }
    ];

    const filteredProducts = selectedCategory === 'tous' 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header de la page */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Maroquinerie Femme
                    </h1>
                    <p className="text-gray-600">
                        Découvrez notre sélection de sacs, portefeuilles et accessoires élégants
                    </p>
                </div>
            </div>

            {/* Filtres par catégorie */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap gap-3">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === category.id
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grille des produits */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Image du produit */}
                            <div className="relative h-64">
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Informations du produit */}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-800">
                                        {product.price}€
                                    </span>
                                    <Link 
                                        to={`/produit/${product.id}`}
                                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                                    >
                                        Voir détails
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bouton retour */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <Link 
                    to="/"
                    className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
};

export default FemmesPage; 