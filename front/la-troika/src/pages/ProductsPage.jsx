import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

const ProductsPage = () => {
    const { category } = useParams(); // Récupère la catégorie depuis l'URL
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('tous');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));
            params.set('sort', sortBy);
            params.set('order', order);
            if (selectedCategory !== 'tous') params.set('category', selectedCategory);
            if (priceRange[0] !== 0) params.set('minPrice', String(priceRange[0]));
            if (priceRange[1] !== 500) params.set('maxPrice', String(priceRange[1]));

            const res = await fetch(`http://localhost:5000/products?${params.toString()}`);
            const data = await res.json();
            if (res.ok && data && Array.isArray(data.items)) {
                setItems(data.items);
                setTotal(data.total);
                setPages(data.pages);
            } else if (Array.isArray(data)) {
                // fallback (ancienne API sans pagination)
                setItems(data);
                setTotal(data.length);
                setPages(1);
            } else {
                setItems([]);
                setTotal(0);
                setPages(0);
            }
        } catch (e) {
            console.error('Erreur chargement produits', e);
            setItems([]);
            setTotal(0);
            setPages(0);
        }
        setLoading(false);
    };

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

    // Charger depuis l'API quand filtres/pagination changent
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, priceRange, sortBy, order, page, limit]);

    // Mise à jour de l'URL quand les filtres changent
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategory !== 'tous') params.set('category', selectedCategory);
        if (priceRange[0] !== 0) params.set('minPrice', priceRange[0]);
        if (priceRange[1] !== 500) params.set('maxPrice', priceRange[1]);
        if (sortBy !== 'createdAt') params.set('sort', sortBy);
        if (order !== 'desc') params.set('order', order);
        if (page !== 1) params.set('page', String(page));
        if (limit !== 12) params.set('limit', String(limit));
        setSearchParams(params);
    }, [selectedCategory, priceRange, sortBy, order, page, limit, setSearchParams]);

    // Récupération des paramètres depuis l'URL au chargement
    useEffect(() => {
        const urlCategory = searchParams.get('category');
        const urlMinPrice = searchParams.get('minPrice');
        const urlMaxPrice = searchParams.get('maxPrice');
        const urlSort = searchParams.get('sort');
        const urlOrder = searchParams.get('order');
        const urlPage = searchParams.get('page');
        const urlLimit = searchParams.get('limit');

        if (urlCategory) setSelectedCategory(urlCategory);
        if (urlMinPrice) setPriceRange(prev => [parseInt(urlMinPrice), prev[1]]);
        if (urlMaxPrice) setPriceRange(prev => [prev[0], parseInt(urlMaxPrice)]);
        if (urlSort) setSortBy(urlSort);
        if (urlOrder) setOrder(urlOrder);
        if (urlPage) setPage(parseInt(urlPage));
        if (urlLimit) setLimit(parseInt(urlLimit));
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
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600">
                                {total} produit{total > 1 ? 's' : ''} au total
                            </p>
                            <div className="flex gap-2 items-center">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="createdAt">Plus récents</option>
                                    <option value="price">Prix</option>
                                    <option value="name">Nom</option>
                                </select>
                                <select
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="desc">Desc</option>
                                    <option value="asc">Asc</option>
                                </select>
                                <select
                                    value={limit}
                                    onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value)); }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value={12}>12</option>
                                    <option value={24}>24</option>
                                    <option value={48}>48</option>
                                </select>
                            </div>
                        </div>

                        {/* Grille */}
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Chargement...</div>
                        ) : (
                            <ProductList items={items} />
                        )}

                        {/* Message si aucun produit */}
                        {!loading && items.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Aucun produit trouvé avec ces critères</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('tous');
                                        setPriceRange([0, 500]);
                                        setSortBy('createdAt');
                                        setOrder('desc');
                                        setPage(1);
                                    }}
                                    className="mt-4 text-blue-600 hover:text-blue-700"
                                >
                                    Voir tous les produits
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="mt-8 flex justify-center items-center gap-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="px-3 py-2 border rounded disabled:opacity-50"
                                >
                                    Précédent
                                </button>
                                <span className="text-sm text-gray-600">Page {page} / {pages}</span>
                                <button
                                    disabled={page >= pages}
                                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                                    className="px-3 py-2 border rounded disabled:opacity-50"
                                >
                                    Suivant
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