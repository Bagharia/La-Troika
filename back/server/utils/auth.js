const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentifie l'utilisateur via le header Authorization: Bearer <token>
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: '❌ Token d\'accès requis',
                error: 'Aucun token fourni'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: '❌ Token invalide',
                error: 'Utilisateur non trouvé'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({
            message: '❌ Token invalide',
            error: 'Token expiré ou invalide'
        });
    }
};

// Vérifie que l'utilisateur authentifié a l'un des rôles requis
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: '❌ Non authentifié' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: '❌ Accès refusé (rôle requis)' });
        }

        next();
    };
};

module.exports = { authenticateToken, requireRole };


