// Importation des modules nécessaires
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Permet de charger les variables d'environnement depuis le fichier .env

// Création de l'application Express
const app = express();

// Middleware pour permettre de lire le JSON dans les requêtes
app.use(express.json());

// Middleware CORS pour autoriser les requêtes venant d'un autre domaine
app.use(cors());

// Route de test (affiche un message simple pour tester l'API)
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API de La Troika !");
    console.log("Démarrage du serveur...");
});

// Connexion à MongoDB via Mongoose
const mongoURI = process.env.MONGO_URI; // Récupère l'URI de connexion depuis le fichier .env

if (!mongoURI) {
    console.error("❌ Erreur : MONGO_URI est indéfini !");
    process.exit(1); // Arrête l'exécution si l'URI est manquant
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connecté !"))
    .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// Exemple de modèle Mongoose (Schema et Model)
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    stock: Number,
});

const Product = mongoose.model("Product", ProductSchema);

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
app.post("/products", async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;
        const newProduct = new Product({ name, price, description, stock });
        await newProduct.save(); // Sauvegarde le produit dans la base de données
        res.status(201).json(newProduct); // Envoie le produit créé en réponse
    } catch (err) {
        console.error("Erreur lors de l'ajout du produit", err);
        res.status(500).send("Erreur serveur");
    }
});

// Lancer le serveur sur un port spécifié dans les variables d'environnement (par défaut 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
