const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Import du modèle User
const User = require('../models/User');

// Middlewares partagés
const { authenticateToken, requireRole } = require('../utils/auth');

// ===== ROUTES D'AUTHENTIFICATION =====

// POST /api/auth/register - Inscription
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;

        // Validation des données
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: '❌ Données manquantes',
                error: 'Tous les champs obligatoires doivent être remplis'
            });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: '❌ Email déjà utilisé',
                error: 'Un compte avec cet email existe déjà'
            });
        }

        // Créer le nouvel utilisateur
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            phone: phone || '',
            address: address || {
                street: '',
                city: '',
                postalCode: '',
                country: 'France'
            }
        });

        const savedUser = await newUser.save();

        // Générer le token JWT
        const token = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: '✅ Inscription réussie !',
            user: savedUser.toSafeObject(),
            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de l\'inscription',
            error: error.message
        });
    }
});

// POST /api/auth/login - Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des données
        if (!email || !password) {
            return res.status(400).json({
                message: '❌ Données manquantes',
                error: 'Email et mot de passe requis'
            });
        }

        // Trouver l'utilisateur avec le mot de passe inclus
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: '❌ Identifiants incorrects',
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: '❌ Identifiants incorrects',
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '✅ Connexion réussie !',
            user: user.toSafeObject(),
            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de la connexion',
            error: error.message
        });
    }
});

// GET /api/auth/me - Profil utilisateur (protégé)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        res.json({
            message: '✅ Profil récupéré avec succès',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de la récupération du profil',
            error: error.message
        });
    }
});

// POST /api/auth/logout - Déconnexion
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // En production, on pourrait ajouter le token à une liste noire
        // Pour l'instant, on retourne juste un message de succès
        res.json({
            message: '✅ Déconnexion réussie !',
            user: null,
            token: null
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de la déconnexion',
            error: error.message
        });
    }
});

// POST /api/auth/verify - Vérification du token
router.post('/verify', authenticateToken, async (req, res) => {
    try {
        res.json({
            message: '✅ Token valide',
            user: req.user,
            valid: true
        });
    } catch (error) {
        res.status(401).json({
            message: '❌ Token invalide',
            valid: false,
            error: error.message
        });
    }
});

// PUT /api/auth/profile - Mise à jour du profil (protégé)
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, phone, address } = req.body;
        const userId = req.user._id;

        // Mettre à jour le profil
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName: firstName || req.user.firstName,
                lastName: lastName || req.user.lastName,
                phone: phone || req.user.phone,
                address: address || req.user.address
            },
            { new: true }
        ).select('-password');

        res.json({
            message: '✅ Profil mis à jour avec succès !',
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
});

// PUT /api/auth/password - Changement de mot de passe (protégé)
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: '❌ Données manquantes',
                error: 'Ancien et nouveau mot de passe requis'
            });
        }

        // Récupérer l'utilisateur avec le mot de passe
        const user = await User.findById(userId);
        
        // Vérifier l'ancien mot de passe
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                message: '❌ Mot de passe incorrect',
                error: 'L\'ancien mot de passe est incorrect'
            });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        await user.save();

        res.json({
            message: '✅ Mot de passe mis à jour avec succès !'
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Erreur lors du changement de mot de passe',
            error: error.message
        });
    }
});

module.exports = router;
