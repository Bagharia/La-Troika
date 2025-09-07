import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiUrl = 'http://localhost:5000/api/auth';

    // Vérifier le token au chargement
    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const response = await fetch(`${apiUrl}/verify`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                    } else {
                        // Token invalide, le supprimer
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Erreur vérification token:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, [token]);

    // Inscription
    const register = async (userData) => {
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('token', data.token);
                return { success: true, message: data.message };
            } else {
                setError(data.message || 'Erreur lors de l\'inscription');
                return { success: false, message: data.message || data.error };
            }
        } catch (error) {
            setError('Erreur de connexion');
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    };

    // Connexion
    const login = async (email, password) => {
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem('token', data.token);
                alert("connexion reussi")
                return { success: true, message: data.message };
            } else {
                setError(data.message || 'Erreur lors de la connexion');
                return { success: false, message: data.message || data.error };
            }
        } catch (error) {
            setError('Erreur de connexion');
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    };

    // Déconnexion
    const logout = async () => {
        try {
            if (token) {
                await fetch(`${apiUrl}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        } finally {
            setUser(null);
            setToken(null);
            setError(null);
            localStorage.removeItem('token');
        }
    };

    // Mise à jour du profil
    const updateProfile = async (profileData) => {
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                return { success: true, message: data.message };
            } else {
                setError(data.message || 'Erreur lors de la mise à jour');
                return { success: false, message: data.message || data.error };
            }
        } catch (error) {
            setError('Erreur de connexion');
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    };

    // Changement de mot de passe
    const changePassword = async (currentPassword, newPassword) => {
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/password`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                setError(data.message || 'Erreur lors du changement de mot de passe');
                return { success: false, message: data.message || data.error };
            }
        } catch (error) {
            setError('Erreur de connexion');
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    };

    // Récupérer le profil utilisateur
    const getProfile = async () => {
        try {
            const response = await fetch(`${apiUrl}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                return data.user;
            }
        } catch (error) {
            console.error('Erreur récupération profil:', error);
        }
        return null;
    };

    const value = {
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        getProfile,
        isAuthenticated: !!user && !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
