import header from '../assets/header.jpeg'
import { Link } from 'react-router-dom'

function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Barre de livraison gratuite - Fixe en haut */}
            <div className="bg-black text-white text-center py-2 px-4 font-semibold text-xs md:text-sm">
                🚚 Livraison gratuite à partir de 40€ | Commandez maintenant !
            </div>

            {/* Navigation principale */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-gray-800">La Troika</h1>
                        </div>
                        
                        {/* Navigation centrale */}
                        <div className="hidden md:flex space-x-8">
                            <Link to="/produits" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Tous nos produits
                            </Link>
                            <Link to="/produits/femmes" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Femmes
                            </Link>
                            <Link to="/produits/hommes" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Hommes
                            </Link>
                            <Link to="/produits/accessoires" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Accessoires
                            </Link>
                        </div>
                        
                        {/* Actions utilisateur */}
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-600 hover:text-gray-900 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 p-2 relative">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    0
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section avec image de fond */}
            <div className="relative h-[500px] md:h-[600px]">
                <img src={header} alt="Maroquinerie La Troika" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-4xl md:text-6xl font-bold mb-4">
                            Maroquinerie d'Exception
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                            Découvrez notre sélection de sacs, portefeuilles et accessoires de luxe
                        </p>
                        <button className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                            Découvrir nos produits
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Catégories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Nos Catégories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Catégorie Femmes */}
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
                        <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Maroquinerie Femme</h4>
                        <p className="text-gray-600 mb-4">Sacs, portefeuilles et accessoires élégants</p>
                        <button className="text-pink-600 font-semibold hover:text-pink-700">
                            Découvrir →
                        </button>
                    </div>

                    {/* Catégorie Hommes */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
                        <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Maroquinerie Homme</h4>
                        <p className="text-gray-600 mb-4">Portefeuilles, ceintures et accessoires masculins</p>
                        <button className="text-blue-600 font-semibold hover:text-blue-700">
                            Découvrir →
                        </button>
                    </div>

                    {/* Catégorie Accessoires */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg text-center hover:shadow-lg transition-shadow">
                        <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-2">Accessoires</h4>
                        <p className="text-gray-600 mb-4">Petite maroquinerie et accessoires de mode</p>
                        <button className="text-green-600 font-semibold hover:text-green-700">
                            Découvrir →
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Avantages */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Pourquoi Choisir La Troika ?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Livraison Gratuite</h4>
                            <p className="text-gray-600 text-sm">À partir de 40€ d'achat</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Qualité Garantie</h4>
                            <p className="text-gray-600 text-sm">Produits authentiques et durables</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Livraison Rapide</h4>
                            <p className="text-gray-600 text-sm">Sous 24-48h en France</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Service Client</h4>
                            <p className="text-gray-600 text-sm">Support 7j/7 disponible</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
