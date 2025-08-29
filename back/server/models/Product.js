const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du produit est requis'],
        trim: true,
        maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    description: {
        type: String,
        required: [true, 'La description est requise'],
        trim: true,
        maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
    },
    shortDescription: {
        type: String,
        trim: true,
        maxlength: [200, 'La description courte ne peut pas dépasser 200 caractères']
    },
    price: {
        type: Number,
        required: [true, 'Le prix est requis'],
        min: [0, 'Le prix ne peut pas être négatif']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Le prix original ne peut pas être négatif']
    },
    category: {
        type: String,
        required: [true, 'La catégorie est requise'],
        enum: ['femmes', 'hommes', 'accessoires', 'nouveautes', 'promotions'],
        default: 'accessoires'
    },
    subcategory: {
        type: String,
        trim: true,
        maxlength: [50, 'La sous-catégorie ne peut pas dépasser 50 caractères']
    },
    brand: {
        type: String,
        required: [true, 'La marque est requise'],
        trim: true,
        maxlength: [50, 'La marque ne peut pas dépasser 50 caractères']
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: String,
        isMain: {
            type: Boolean,
            default: false
        }
    }],
    colors: [{
        name: String,
        code: String, // Code hexadécimal de la couleur
        available: {
            type: Boolean,
            default: true
        }
    }],
    sizes: [{
        name: String,
        available: {
            type: Boolean,
            default: true
        }
    }],
    stock: {
        type: Number,
        required: [true, 'Le stock est requis'],
        min: [0, 'Le stock ne peut pas être négatif'],
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        trim: true,
        uppercase: true
    },
    weight: {
        type: Number,
        min: [0, 'Le poids ne peut pas être négatif']
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    materials: [String],
    features: [String], // Caractéristiques du produit
    tags: [String], // Mots-clés pour la recherche
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isOnSale: {
        type: Boolean,
        default: false
    },
    salePercentage: {
        type: Number,
        min: [0, 'Le pourcentage de réduction ne peut pas être négatif'],
        max: [100, 'Le pourcentage de réduction ne peut pas dépasser 100%']
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    shipping: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        freeShipping: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Index pour améliorer les performances
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ 'rating.average': -1 });

// Méthode pour calculer le prix de vente
productSchema.methods.getSalePrice = function() {
    if (this.isOnSale && this.salePercentage > 0) {
        return this.price * (1 - this.salePercentage / 100);
    }
    return this.price;
};

// Méthode pour vérifier si le produit est en stock
productSchema.methods.isInStock = function() {
    return this.stock > 0;
};

// Méthode pour obtenir l'image principale
productSchema.methods.getMainImage = function() {
    const mainImage = this.images.find(img => img.isMain);
    return mainImage || this.images[0];
};

// Méthode pour mettre à jour la note moyenne
productSchema.methods.updateRating = function() {
    if (this.reviews.length === 0) {
        this.rating.average = 0;
        this.rating.count = 0;
        return;
    }
    
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
};

// Middleware pour mettre à jour la note avant la sauvegarde
productSchema.pre('save', function(next) {
    this.updateRating();
    next();
});

// Génération automatique du SKU
productSchema.pre('save', function(next) {
    if (!this.sku) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        this.sku = `${this.category.toUpperCase().substr(0, 3)}-${timestamp}-${random}`.toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Product', productSchema); 