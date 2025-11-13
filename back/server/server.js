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
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-spec');

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
const Joi = require('joi');
const { validate } = require('./utils/validate');

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

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

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

// Liste de produits avec pagination/tri/filtre
app.get("/products", async (req, res) => {
    try {
        const {
            page = '1',
            limit = '12',
            sort = 'createdAt',
            order = 'desc',
            q,
            category,
            brand,
            minPrice,
            maxPrice,
            isOnSale
        } = req.query;

        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);

        const filter = { isActive: true };
        if (q) {
            filter.$text = { $search: q };
        }
        if (category) {
            filter.category = category;
        }
        if (brand) {
            filter.brand = brand;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
        }
        if (isOnSale !== undefined) {
            filter.isOnSale = String(isOnSale).toLowerCase() === 'true';
        }

        const sortDir = String(order).toLowerCase() === 'asc' ? 1 : -1;
        const sortObj = { [sort]: sortDir };

        const [items, total] = await Promise.all([
            Product.find(filter)
                .sort(sortObj)
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),
            Product.countDocuments(filter)
        ]);

        res.json({
            items,
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
        });
    } catch (err) {
        console.error("Erreur lors de la récupération des produits", err);
        res.status(500).send("Erreur serveur");
    }
});

// Obtenir un produit par ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (err) {
        console.error('Erreur lors de la récupération du produit', err);
        res.status(500).send('Erreur serveur');
    }
});

// Exemple de route pour ajouter un produit
// Création d'un produit (admin uniquement)
const productCreateSchema = {
    body: Joi.object({
        name: Joi.string().max(100).required(),
        description: Joi.string().max(1000).required(),
        price: Joi.number().min(0).required(),
        stock: Joi.number().integer().min(0).required(),
        category: Joi.string().valid('femmes', 'hommes', 'accessoires', 'nouveautes', 'promotions').optional(),
        subcategory: Joi.string().max(50).optional(),
        brand: Joi.string().max(50).required()
    })
};

app.post("/products", authenticateToken, requireRole('admin'), validate(productCreateSchema), async (req, res) => {
    try {
        const { name, price, description, stock, category, subcategory, brand } = req.body;

        // Log d'entrée pour diagnostic
        if (NODE_ENV !== 'production') {
            console.log('POST /products payload:', req.body);
        }

        if (!name || price === undefined || !description || stock === undefined || !brand) {
            return res.status(400).json({ message: 'Champs requis manquants: name, price, description, stock, brand' });
        }

        const newProduct = new Product({
            name,
            price,
            description,
            stock,
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

// Mettre à jour un produit (admin uniquement)
const productUpdateSchema = {
    params: Joi.object({ id: Joi.string().length(24).hex().required() }),
    body: Joi.object({
        name: Joi.string().max(100).optional(),
        description: Joi.string().max(1000).optional(),
        price: Joi.number().min(0).optional(),
        stock: Joi.number().integer().min(0).optional(),
        category: Joi.string().valid('femmes', 'hommes', 'accessoires', 'nouveautes', 'promotions').optional(),
        subcategory: Joi.string().max(50).optional(),
        brand: Joi.string().max(50).optional()
    })
};

app.put('/products/:id', authenticateToken, requireRole('admin'), validate(productUpdateSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, stock, category, subcategory, brand } = req.body;

        const update = {};
        if (name !== undefined) update.name = name;
        if (price !== undefined) update.price = price;
        if (description !== undefined) update.description = description;
        if (stock !== undefined) update.stock = stock;
        if (category !== undefined) update.category = category;
        if (subcategory !== undefined) update.subcategory = subcategory;
        if (brand !== undefined) update.brand = brand;

        const updated = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(updated);
    } catch (err) {
        console.error("Erreur lors de la mise à jour du produit", err);
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation échouée', error: err.message });
        }
        res.status(500).send('Erreur serveur');
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

// Suppression en masse (admin uniquement)
app.delete('/products', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { ids } = req.body || {};
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Fournir un tableau ids non vide' });
        }
        const result = await Product.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Suppression en masse effectuée', deletedCount: result.deletedCount });
    } catch (err) {
        console.error('Erreur lors de la suppression en masse', err);
        res.status(500).send('Erreur serveur');
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
