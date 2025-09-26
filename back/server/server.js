// Importation des modules nécessaires
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config({ path: path.join(__dirname, '.env') });

// Import des modèles
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

// Import des routes de test (désactivées)
// const testRoutes = require('./test-routes');

// Import des routes d'authentification
const authRoutes = require('./routes/auth');
const { authenticateToken, requireRole } = require('./utils/auth');

// Création de l'application Express
const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET;

// Fonction de seed pour créer un compte administrateur si défini en variables d'environnement
async function seedAdminIfNeeded() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
        const adminLastName = process.env.ADMIN_LAST_NAME || 'User';
        const forceReset = String(process.env.ADMIN_FORCE_RESET || '').toLowerCase() === 'true';

        if (!adminEmail || !adminPassword) {
            return; // Pas de seed sans identifiants
        }

        const existing = await User.findOne({ email: adminEmail }).select('+password');
        if (existing) {
            let changed = false;
            if (existing.role !== 'admin') {
                existing.role = 'admin';
                changed = true;
            }
            if (forceReset && adminPassword) {
                existing.password = adminPassword; // sera hashé par le pre-save
                changed = true;
            }
            if (changed) {
                await existing.save();
                console.log(`👑 Admin mis à jour: ${adminEmail} ${forceReset ? '(mot de passe réinitialisé)' : ''}`);
            } else {
                console.log(`ℹ️ Admin déjà présent et à jour: ${adminEmail}`);
            }
            return;
        }

        const adminUser = new User({
            firstName: adminFirstName,
            lastName: adminLastName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
        });
        await adminUser.save();
        console.log(`👑 Compte admin créé: ${adminEmail}`);
    } catch (err) {
        console.error('❌ Échec du seed admin:', err);
    }
}

// Confiance proxy (utile si déployé derrière un proxy/ingress)
app.set('trust proxy', 1);

// Logs HTTP en développement
if (NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Compression des réponses
app.use(compression());

// Sécurité headers
app.use(helmet());

// CORS strict
app.use(cors({
    origin: CORS_ORIGIN.split(',').map(o => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
}));

// Body parser avec limite
app.use(express.json({ limit: '10kb' }));

// Assainissement NoSQL injection (désactivé, pose problème avec Express 5)
// app.use(mongoSanitize());

// Protection XSS (désactivée, pose problème avec Express 5)
// app.use(xssClean());

// Protection contre la pollution de paramètres (désactivée, pose problème avec Express 5)
// app.use(hpp());

// Rate limiting pour l'API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max requêtes par IP par fenêtre
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Utilisation des routes de test (désactivées)
// if (NODE_ENV !== 'production') {
//     app.use('/api', testRoutes);
// }

// Utilisation des routes d'authentification
app.use('/api/auth', authRoutes);

// Route de test (affiche un message simple pour tester l'API)
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API de La Troika !");
    console.log("Démarrage du serveur...");
});

// Healthcheck simple
app.get('/health', async (req, res) => {
    const dbState = mongoose.connection.readyState; // 1 connecté, 2 connecting, 0 déconnecté
    res.json({ status: 'ok', db: dbState === 1 ? 'up' : 'down' });
});

// Connexion à MongoDB via Mongoose
const mongoURI = process.env.MONGO_URI; // Récupère l'URI de connexion depuis le fichier .env

if (!mongoURI) {
    console.error("❌ Erreur : MONGO_URI est indéfini !");
    process.exit(1); // Arrête l'exécution si l'URI est manquant
}

if (!JWT_SECRET) {
    console.error("❌ Erreur : JWT_SECRET est indéfini ! Ajoutez-le dans back/server/.env");
    process.exit(1);
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log("✅ MongoDB connecté !");
        await seedAdminIfNeeded();
    })
    .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// Les modèles sont maintenant importés depuis les fichiers séparés

// Exemple de route pour obtenir tous les produits
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find(); // Récupère tous les produits
        res.json(products); // Envoie la liste des produits en réponse
    } catch (err) {
        console.error("Erreur lors de la récupération des produits", err);
        res.status(500).send("Erreur serveur");
    }
});

// Exemple de route pour ajouter un produit
// Création d'un produit (admin uniquement)
app.post("/products", authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { name, price, description, stock, category, subcategory, brand } = req.body;

        // Log d'entrée pour diagnostic
        if (NODE_ENV !== 'production') {
            console.log('POST /products payload:', req.body);
        }

        if (!name || price === undefined || !description || stock === undefined || !brand) {
            return res.status(400).json({ message: 'Champs requis manquants: name, price, description, stock, brand' });
        }

        const numericPrice = Number(price);
        const numericStock = Number(stock);
        if (Number.isNaN(numericPrice) || Number.isNaN(numericStock)) {
            return res.status(400).json({ message: 'price et stock doivent être numériques' });
        }

        const newProduct = new Product({
            name,
            price: numericPrice,
            description,
            stock: numericStock,
            category, // optionnel, défaut dans le schéma
            subcategory,
            brand,
        });
        await newProduct.save(); // Sauvegarde le produit dans la base de données
        res.status(201).json(newProduct); // Envoie le produit créé en réponse
    } catch (err) {
        console.error("Erreur lors de l'ajout du produit", err);
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation échouée', error: err.message });
        }
        res.status(500).send("Erreur serveur");
    }
});

// Suppression d'un produit (admin uniquement)
app.delete('/products/:id', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit supprimé avec succès', id });
    } catch (err) {
        console.error("Erreur lors de la suppression du produit", err);
        res.status(500).send("Erreur serveur");
    }
});

// Lancer le serveur sur un port spécifié dans les variables d'environnement (par défaut 5000)
const PORT = process.env.PORT || 5000;

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware global d'erreurs
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    const status = err.status || 500;
    res.status(status).json({
        message: 'Erreur serveur',
        error: NODE_ENV === 'production' ? undefined : err.message,
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
