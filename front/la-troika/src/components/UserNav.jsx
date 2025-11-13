import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserNav = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const openPanel = () => setIsPanelOpen(true);
    const closePanel = () => setIsPanelOpen(false);

    const handleLogout = async () => {
        await logout();
        closePanel();
    };

    useEffect(() => {
        if (!isPanelOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closePanel();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPanelOpen]);

    const profileContent = isAuthenticated && user ? (
        <>
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-700">
                    {user.firstName?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                    <p className="text-sm text-gray-500">Bonjour</p>
                    <p className="text-lg font-semibold text-gray-800">{user.firstName}</p>
                </div>
            </div>

            <nav className="mt-4 space-y-3 text-sm">
                <Link
                    to="/profil"
                    onClick={closePanel}
                    className="flex items-center justify-between rounded-md border border-transparent px-4 py-3 text-gray-700 transition hover:border-gray-200 hover:bg-gray-50"
                >
                    <span>Mon profil</span>
                    <span className="text-xs text-gray-400">Voir</span>
                </Link>
                <Link
                    to="/commandes"
                    onClick={closePanel}
                    className="flex items-center justify-between rounded-md border border-transparent px-4 py-3 text-gray-700 transition hover:border-gray-200 hover:bg-gray-50"
                >
                    <span>Mes commandes</span>
                    <span className="text-xs text-gray-400">Historique</span>
                </Link>
                <Link
                    to="/favoris"
                    onClick={closePanel}
                    className="flex items-center justify-between rounded-md border border-transparent px-4 py-3 text-gray-700 transition hover:border-gray-200 hover:bg-gray-50"
                >
                    <span>Mes favoris</span>
                    <span className="text-xs text-gray-400">Préférés</span>
                </Link>
            </nav>

            <button
                onClick={handleLogout}
                className="mt-6 w-full rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
                Se déconnecter
            </button>
        </>
    ) : (
        <>


            <div className="mt-6 space-y-3">
                <Link
                    to="/login"
                    onClick={closePanel}
                    className="group relative flex items-center justify-between gap-4 px-4 py-3 text-2xl font-medium text-gray-700 transition-colors duration-300 hover:text-gray-900"
                >
                    <span className="relative inline-block">
                        <span>Se connecter</span>
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-1 left-0 block h-0.5 w-full origin-left scale-x-0 transform bg-gray-400 transition duration-300 group-hover:scale-x-100 group-hover:bg-gray-800"
                        />
                    </span>
                    <svg
                        className="h-6 w-6 flex-shrink-0 text-gray-400 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-gray-900"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 7L15 12L10 17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
                <Link
                    to="/register"
                    onClick={closePanel}
                    className="group relative flex items-center justify-between gap-4 px-4 py-3 text-2xl font-medium text-gray-700 transition-colors duration-300 hover:text-gray-900"
                >
                    <span className="relative inline-block">
                        <span>Créer un compte</span>
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-1 left-0 block h-0.5 w-full origin-left scale-x-0 transform bg-gray-400 transition duration-300 group-hover:scale-x-100 group-hover:bg-gray-800"
                        />
                    </span>
                    <svg
                        className="h-6 w-6 flex-shrink-0 text-gray-400 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-gray-900"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 7L15 12L10 17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
                <Link
                    to="/suivi-commande"
                    onClick={closePanel}
                    className="group relative flex items-center justify-between gap-4 px-4 py-3 text-2xl font-medium text-gray-700 transition-colors duration-300 hover:text-gray-900"
                >
                    <span className="relative inline-block">
                        <span>Suivre une commande</span>
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-1 left-0 block h-0.5 w-full origin-left scale-x-0 transform bg-gray-400 transition duration-300 group-hover:scale-x-100 group-hover:bg-gray-800"
                        />
                    </span>
                    <svg
                        className="h-6 w-6 flex-shrink-0 text-gray-400 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-gray-900"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M10 7L15 12L10 17"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>
        </>
    );

    return (
        <div className="flex items-center space-x-4">
            {/* Recherche */}
            <button className="text-gray-600 hover:text-gray-900 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {/* Profil */}
            <button
                onClick={openPanel}
                className="flex items-center gap-2 rounded-full border border-transparent p-2 text-gray-600 transition hover:border-gray-200 hover:text-gray-900"
                aria-haspopup="dialog"
                aria-expanded={isPanelOpen}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {isAuthenticated && user && (
                    <span className="hidden text-sm font-medium text-gray-700 md:inline">
                        {user.firstName}
                    </span>
                )}
            </button>

            {/* Panier */}
            <Link to="/panier" className="text-gray-600 hover:text-gray-900 p-2 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                </span>
            </Link>

            {/* Panneau latéral */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                    isPanelOpen
                        ? 'visible opacity-100 pointer-events-auto'
                        : 'invisible opacity-0 pointer-events-none'
                }`}
                onClick={closePanel}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            </div>
            <aside
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl transform bg-white p-6 shadow-xl transition-transform duration-300 ${
                    isPanelOpen
                        ? 'translate-x-0 pointer-events-auto'
                        : 'translate-x-full pointer-events-none'
                }`}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-semibold uppercase tracking-wide text-gray-500">Mon compte</h2>
                    <button
                        onClick={closePanel}
                        className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Fermer le panneau"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mt-6 flex h-[calc(100%-3rem)] flex-col gap-6 overflow-y-auto">
                    {profileContent}
                </div>
            </aside>
        </div>
    );
};

export default UserNav;
