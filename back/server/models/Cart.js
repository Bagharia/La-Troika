const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'La quantité doit être au moins de 1'],
        max: [99, 'La quantité ne peut pas dépasser 99']
    },
    selectedColor: {
        name: String,
        code: String
    },
    selectedSize: {
        name: String
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: Number, // Prix original avant réduction
    isOnSale: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Méthode pour calculer le prix total de l'article
cartItemSchema.methods.getTotalPrice = function() {
    return this.price * this.quantity;
};

// Méthode pour calculer l'économie réalisée
cartItemSchema.methods.getSavings = function() {
    if (this.originalPrice && this.originalPrice > this.price) {
        return (this.originalPrice - this.price) * this.quantity;
    }
    return 0;
};

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    coupon: {
        code: String,
        discountPercentage: Number,
        discountAmount: Number,
        minimumAmount: Number,
        expiresAt: Date
    },
    shippingAddress: {
        firstName: String,
        lastName: String,
        street: String,
        city: String,
        postalCode: String,
        country: {
            type: String,
            default: 'France'
        },
        phone: String
    },
    shippingMethod: {
        name: String,
        price: Number,
        estimatedDays: String
    },
    notes: {
        type: String,
        maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
    },
    expiresAt: {
        type: Date,
        default: function() {
            // Le panier expire après 30 jours
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    }
}, {
    timestamps: true
});

// Index pour améliorer les performances
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 });

// Méthode pour calculer le sous-total
cartSchema.methods.getSubtotal = function() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
};

// Méthode pour calculer la réduction du coupon
cartSchema.methods.getCouponDiscount = function() {
    if (!this.coupon) return 0;
    
    const subtotal = this.getSubtotal();
    
    // Vérifier le montant minimum pour le coupon
    if (this.coupon.minimumAmount && subtotal < this.coupon.minimumAmount) {
        return 0;
    }
    
    // Vérifier si le coupon a expiré
    if (this.coupon.expiresAt && new Date() > this.coupon.expiresAt) {
        return 0;
    }
    
    if (this.coupon.discountPercentage) {
        return (subtotal * this.coupon.discountPercentage) / 100;
    }
    
    if (this.coupon.discountAmount) {
        return this.coupon.discountAmount;
    }
    
    return 0;
};

// Méthode pour calculer les frais de livraison
cartSchema.methods.getShippingCost = function() {
    if (!this.shippingMethod) return 0;
    
    const subtotal = this.getSubtotal();
    
    // Livraison gratuite à partir de 40€
    if (subtotal >= 40) {
        return 0;
    }
    
    return this.shippingMethod.price || 0;
};

// Méthode pour calculer le total final
cartSchema.methods.getTotal = function() {
    const subtotal = this.getSubtotal();
    const couponDiscount = this.getCouponDiscount();
    const shippingCost = this.getShippingCost();
    
    return subtotal - couponDiscount + shippingCost;
};

// Méthode pour calculer le nombre total d'articles
cartSchema.methods.getItemCount = function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
};

// Méthode pour ajouter un article au panier
cartSchema.methods.addItem = function(productId, quantity, color, size) {
    const existingItemIndex = this.items.findIndex(item => 
        item.product.toString() === productId.toString() &&
        item.selectedColor?.name === color?.name &&
        item.selectedSize?.name === size?.name
    );
    
    if (existingItemIndex > -1) {
        // Mettre à jour la quantité de l'article existant
        this.items[existingItemIndex].quantity += quantity;
    } else {
        // Ajouter un nouvel article
        this.items.push({
            product: productId,
            quantity,
            selectedColor: color,
            selectedSize: size,
            price: 0, // Sera mis à jour lors de la sauvegarde
            originalPrice: 0
        });
    }
    
    return this;
};

// Méthode pour mettre à jour la quantité d'un article
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
    const item = this.items.id(itemId);
    if (item) {
        item.quantity = Math.max(1, Math.min(99, quantity));
    }
    return this;
};

// Méthode pour supprimer un article
cartSchema.methods.removeItem = function(itemId) {
    this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
    return this;
};

// Méthode pour vider le panier
cartSchema.methods.clearCart = function() {
    this.items = [];
    this.coupon = null;
    this.shippingAddress = null;
    this.shippingMethod = null;
    this.notes = null;
    return this;
};

// Méthode pour appliquer un coupon
cartSchema.methods.applyCoupon = function(couponCode) {
    // Ici vous pourriez valider le coupon avec votre logique métier
    // Pour l'instant, on simule un coupon de 10% à partir de 50€
    if (couponCode === 'TROIKA10' && this.getSubtotal() >= 50) {
        this.coupon = {
            code: couponCode,
            discountPercentage: 10,
            minimumAmount: 50,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
        };
        return true;
    }
    return false;
};

// Middleware pour mettre à jour les prix des articles avant la sauvegarde
cartSchema.pre('save', async function(next) {
    try {
        // Mettre à jour les prix des articles avec les informations actuelles des produits
        for (let item of this.items) {
            if (item.product && item.product._id) {
                const Product = mongoose.model('Product');
                const product = await Product.findById(item.product._id);
                if (product) {
                    item.price = product.getSalePrice();
                    item.originalPrice = product.originalPrice || product.price;
                    item.isOnSale = product.isOnSale;
                }
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Cart', cartSchema); 