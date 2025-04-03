const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json()); // Permet de lire le JSON dans les requêtes
app.use(cors()); // Autorise les requêtes du front-end

// Route de test
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API de La Troika !");
    console.log("Démarrage du serveur...");
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
