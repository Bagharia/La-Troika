import { Link } from 'react-router-dom';
import UserNav from './UserNav';

const Navbar = () => {
    return (
        <>
            {/* Barre de livraison gratuite - Fixe en haut */}
            <div className="bg-black text-white text-center py-2 px-4 font-semibold text-xs md:text-sm">
                🚚 Livraison gratuite à partir de 40€ | Commandez maintenant !
            </div>

            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-gray-800">La Troika</h1>
                        </Link>
                        
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
                        <UserNav />
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
