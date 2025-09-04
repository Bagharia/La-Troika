const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'La quantité doit être au moins de 1']
    },
    price: {
        type: Number,
        required: true
    },
    originalPrice: Number,
    selectedColor: {
        name: String,
        code: String
    },
    selectedSize: {
        name: String
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'paypal', 'apple_pay', 'google_pay'],
        required: true
    },
    paymentIntentId: String, // ID de Stripe ou autre processeur de paiement
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    couponCode: String,
    total: {
        type: Number,
        required: true
    },
    shippingAddress: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'France'
        },
        phone: {
            type: String,
            required: true
        }
    },
    billingAddress: {
        firstName: String,
        lastName: String,
        street: String,
        city: String,
        postalCode: String,
        country: String
    },
    shippingMethod: {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        estimatedDays: String,
        trackingNumber: String,
        carrier: String
    },
    notes: {
        type: String,
        maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
    },
    estimatedDelivery: Date,
    actualDelivery: Date,
    cancellationReason: String,
    refundReason: String,
    refundAmount: Number,
    isGift: {
        type: Boolean,
        default: false
    },
    giftMessage: String
}, {
    timestamps: true
});

// Index pour améliorer les performances
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shippingAddress.city': 1 });
orderSchema.index({ 'shippingAddress.postalCode': 1 });

// Génération automatique du numéro de commande
orderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5);
        this.orderNumber = `TROIKA-${timestamp}-${random}`.toUpperCase();
    }
    next();
});

// Méthode pour calculer le total de la commande
orderSchema.methods.calculateTotal = function() {
    this.total = this.subtotal + this.tax + this.shippingCost - this.discount;
    return this.total;
};

// Méthode pour mettre à jour le statut
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
    const previousStatus = this.status;
    this.status = newStatus;
    
    // Ajouter des notes automatiques selon le statut
    if (newStatus === 'shipped' && this.shippingMethod.trackingNumber) {
        this.notes = `${this.notes || ''}\n\nCommande expédiée - Numéro de suivi: ${this.shippingMethod.trackingNumber}`;
    }
    
    if (newStatus === 'delivered') {
        this.actualDelivery = new Date();
    }
    
    if (newStatus === 'cancelled' && notes) {
        this.cancellationReason = notes;
    }
    
    return { previousStatus, newStatus };
};

// Méthode pour annuler la commande
orderSchema.methods.cancelOrder = function(reason) {
    if (this.status === 'delivered') {
        throw new Error('Impossible d\'annuler une commande déjà livrée');
    }
    
    this.status = 'cancelled';
    this.cancellationReason = reason;
    
    // Si la commande était payée, marquer pour remboursement
    if (this.paymentStatus === 'paid') {
        this.paymentStatus = 'refunded';
        this.refundAmount = this.total;
    }
    
    return this;
};

// Méthode pour demander un remboursement
orderSchema.methods.requestRefund = function(reason, amount) {
    if (this.paymentStatus !== 'paid') {
        throw new Error('Seules les commandes payées peuvent être remboursées');
    }
    
    if (this.status === 'cancelled') {
        throw new Error('Cette commande est déjà annulée');
    }
    
    this.paymentStatus = 'refunded';
    this.refundReason = reason;
    this.refundAmount = amount || this.total;
    
    return this;
};

// Méthode pour obtenir le statut de livraison
orderSchema.methods.getDeliveryStatus = function() {
    const statuses = {
        'pending': 'En attente de confirmation',
        'confirmed': 'Commande confirmée',
        'processing': 'En cours de préparation',
        'shipped': 'Expédiée',
        'delivered': 'Livrée',
        'cancelled': 'Annulée',
        'refunded': 'Remboursée'
    };
    
    return statuses[this.status] || this.status;
};

// Méthode pour obtenir le statut de paiement
orderSchema.methods.getPaymentStatus = function() {
    const statuses = {
        'pending': 'En attente de paiement',
        'paid': 'Payée',
        'failed': 'Échec du paiement',
        'refunded': 'Remboursée'
    };
    
    return statuses[this.paymentStatus] || this.paymentStatus;
};

// Méthode pour vérifier si la commande peut être modifiée
orderSchema.methods.canBeModified = function() {
    return ['pending', 'confirmed'].includes(this.status);
};

// Méthode pour vérifier si la commande peut être annulée
orderSchema.methods.canBeCancelled = function() {
    return ['pending', 'confirmed', 'processing'].includes(this.status);
};

// Méthode pour obtenir le temps écoulé depuis la commande
orderSchema.methods.getTimeSinceOrder = function() {
    const now = new Date();
    const orderTime = this.createdAt;
    const diffTime = Math.abs(now - orderTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 jour';
    if (diffDays < 7) return `${diffDays} jours`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semaines`;
    return `${Math.floor(diffDays / 30)} mois`;
};

// Méthode pour calculer les taxes (TVA française 20%)
orderSchema.methods.calculateTax = function() {
    this.tax = (this.subtotal - this.discount) * 0.20;
    return this.tax;
};

// Méthode pour appliquer un coupon
orderSchema.methods.applyCoupon = function(couponCode, discountPercentage, minimumAmount) {
    if (this.subtotal >= minimumAmount) {
        this.couponCode = couponCode;
        this.discount = (this.subtotal * discountPercentage) / 100;
        this.calculateTotal();
        return true;
    }
    return false;
};

module.exports = mongoose.model('Order', orderSchema); 