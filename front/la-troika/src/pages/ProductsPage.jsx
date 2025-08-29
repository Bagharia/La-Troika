import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';

const ProductsPage = () => {
    const { category } = useParams(); // Récupère la catégorie depuis l'URL
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('tous');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [sortBy, setSortBy] = useState('popularity');

    // Données d'exemple pour tous les produits
    const allProducts = [
        // Produits Femmes
        {
            id: 1,
            name: "Sac à main cuir premium",
            price: 89.99,
            category: "femmes",
            subcategory: "sacs",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
            description: "Sac élégant en cuir véritable, parfait pour toutes les occasions",
            brand: "La Troika"
        },
        {
            id: 2,
            name: "Portefeuille cuir marron",
            price: 45.99,
            category: "femmes",
            subcategory: "portefeuilles",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
            description: "Portefeuille compact et fonctionnel",
            brand: "La Troika"
        },
        {
            id: 3,
            name: "Trousse de maquillage",
            price: 32.99,
            category: "femmes",
            subcategory: "accessoires",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
            description: "Trousse pratique et élégante",
            brand: "La Troika"
        },
        // Produits Hommes
        {
            id: 4,
            name: "Portefeuille cuir noir",
            price: 59.99,
            category: "hommes",
            subcategory: "portefeuilles",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
            description: "Portefeuille élégant pour homme",
            brand: "La Troika"
        },
        {
            id: 5,
            name: "Ceinture cuir marron",
            price: 39.99,
            category: "hommes",
            subcategory: "ceintures",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
            description: "Ceinture en cuir véritable",
            brand: "La Troika"
        },
        // Accessoires
        {
            id: 6,
            name: "Clés de voiture",
            price: 25.99,
            category: "accessoires",
            subcategory: "petits-accessoires",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
            description: "Porte-clés élégant",
            brand: "La Troika"
        }
    ];

    const categories = [
        { id: 'tous', name: 'Toutes les catégories', color: 'gray' },
        { id: 'femmes', name: 'Femmes', color: 'pink' },
        { id: 'hommes', name: 'Hommes', color: 'blue' },
        { id: 'accessoires', name: 'Accessoires', color: 'green' }
    ];

    const subcategories = {
        femmes: ['sacs', 'portefeuilles', 'accessoires'],
        hommes: ['portefeuilles', 'ceintures', 'accessoires'],
        accessoires: ['petits-accessoires', 'trousses', 'porte-clés']
    };

    // Filtrage des produits
    const filteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategory === 'tous' || product.category === selectedCategory;
        const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
        return categoryMatch && priceMatch;
    });

    // Tri des produits
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    // Mise à jour de l'URL quand les filtres changent
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategory !== 'tous') params.set('category', selectedCategory);
        if (priceRange[0] !== 0) params.set('minPrice', priceRange[0]);
        if (priceRange[1] !== 500) params.set('maxPrice', priceRange[1]);
        if (sortBy !== 'popularity') params.set('sort', sortBy);
        setSearchParams(params);
    }, [selectedCategory, priceRange, sortBy, setSearchParams]);

    // Récupération des paramètres depuis l'URL au chargement
    useEffect(() => {
        const urlCategory = searchParams.get('category');
        const urlMinPrice = searchParams.get('minPrice');
        const urlMaxPrice = searchParams.get('maxPrice');
        const urlSort = searchParams.get('sort');

        if (urlCategory) setSelectedCategory(urlCategory);
        if (urlMinPrice) setPriceRange(prev => [parseInt(urlMinPrice), prev[1]]);
        if (urlMaxPrice) setPriceRange(prev => [prev[0], parseInt(urlMaxPrice)]);
        if (urlSort) setSortBy(urlSort);
    }, [searchParams]);

    const getCategoryTitle = () => {
        const cat = categories.find(c => c.id === selectedCategory);
        return cat ? cat.name : 'Tous nos produits';
    };

    const getCategoryDescription = () => {
        switch (selectedCategory) {
            case 'femmes':
                return 'Découvrez notre sélection de sacs, portefeuilles et accessoires élégants pour femmes';
            case 'hommes':
                return 'Portefeuilles, ceintures et accessoires masculins de qualité';
            case 'accessoires':
                return 'Petite maroquinerie et accessoires de mode pour tous';
            default:
                return 'Explorez notre collection complète de maroquinerie';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header de la page */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {getCategoryTitle()}
                    </h1>
                    <p className="text-gray-600">
                        {getCategoryDescription()}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar avec filtres */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h3 className="font-semibold text-lg text-gray-800 mb-4">Filtres</h3>
                            
                            {/* Filtre par catégorie principale */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">Catégorie</h4>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                selectedCategory === cat.id
                                                    ? `bg-${cat.color}-100 text-${cat.color}-800 border border-${cat.color}-200`
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filtre par prix */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">Prix</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>{priceRange[0]}€</span>
                                        <span>{priceRange[1]}€</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Tri */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">Trier par</h4>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="popularity">Popularité</option>
                                    <option value="price-asc">Prix croissant</option>
                                    <option value="price-desc">Prix décroissant</option>
                                    <option value="name">Nom A-Z</option>
                                </select>
                            </div>

                            {/* Reset des filtres */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('tous');
                                    setPriceRange([0, 500]);
                                    setSortBy('popularity');
                                }}
                                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    </div>

                    {/* Grille des produits */}
                    <div className="lg:col-span-3">
                        {/* Résultats */}
                        <div className="mb-6">
                            <p className="text-gray-600">
                                {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Grille */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sortedProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            {product.brand}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-xs text-gray-500 mb-1 uppercase">{product.subcategory}</p>
                                        <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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

                        {/* Message si aucun produit */}
                        {sortedProducts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Aucun produit trouvé avec ces critères</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('tous');
                                        setPriceRange([0, 500]);
                                        setSortBy('popularity');
                                    }}
                                    className="mt-4 text-blue-600 hover:text-blue-700"
                                >
                                    Voir tous les produits
                                </button>
                            </div>
                        )}
                    </div>
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

export default ProductsPage; 