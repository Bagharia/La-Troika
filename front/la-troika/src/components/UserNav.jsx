import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const UserNav = () => {
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    if (isAuthenticated && user) {
        return (
            <div className="flex items-center space-x-4">
                {/* Profil utilisateur */}
                <div className="relative group">
                    <button className="text-gray-600 hover:text-gray-900 p-2 flex items-center space-x-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm font-medium">{user.firstName}</span>
                    </button>
                    
                    {/* Menu déroulant */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <Link to="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            👤 Mon profil
                        </Link>
                        <Link to="/commandes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            📦 Mes commandes
                        </Link>
                        <Link to="/favoris" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            ❤️ Mes favoris
                        </Link>
                        <hr className="my-1" />
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            🔐 Se déconnecter
                        </button>
                    </div>
                </div>

                {/* Panier */}
                <Link to="/panier" className="text-gray-600 hover:text-gray-900 p-2 relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        0
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
            {/* Recherche */}
            <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {/* Connexion */}
            <Link to="/connexion" className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </Link>

            {/* Panier */}
            <Link to="/panier" className="text-gray-600 hover:text-gray-900 p-2 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                </span>
            </Link>
        </div>
    );
};

export default UserNav;
