module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'La Troika API',
    version: '1.0.0',
    description: 'API Auth et Produits pour La Troika',
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@latroika.com' },
          password: { type: 'string', example: 'MotDePasse123!' }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password'],
        properties: {
          firstName: { type: 'string', example: 'Alexis' },
          lastName: { type: 'string', example: 'Troika' },
          email: { type: 'string', example: 'user@latroika.com' },
          password: { type: 'string', example: 'MotDePasse123!' },
          phone: { type: 'string', example: '+33601020304' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string', example: '1 rue de Paris' },
              city: { type: 'string', example: 'Paris' },
              postalCode: { type: 'string', example: '75000' },
              country: { type: 'string', example: 'France' }
            }
          }
        }
      },
      ProfileUpdate: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              postalCode: { type: 'string' },
              country: { type: 'string' }
            }
          }
        }
      },
      PasswordChange: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', example: 'AncienMotDePasse123!' },
          newPassword: { type: 'string', example: 'NouveauMotDePasse456!' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          brand: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'number' },
          category: { type: 'string' },
          subcategory: { type: 'string' }
        }
      },
      ProductCreate: {
        type: 'object',
        required: ['name', 'description', 'price', 'stock', 'brand'],
        properties: {
          name: { type: 'string', example: 'Sac Troika' },
          description: { type: 'string', example: 'Cuir véritable' },
          brand: { type: 'string', example: 'Troika' },
          price: { type: 'number', example: 89.9 },
          stock: { type: 'integer', example: 20 },
          category: { type: 'string', example: 'femmes' },
          subcategory: { type: 'string', example: 'sacs' }
        }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Inscription',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } }
          }
        },
        responses: { 201: { description: 'Créé' }, 400: { description: 'Validation' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Connexion',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } }
          }
        },
        responses: {
          200: { description: 'OK' },
          401: { description: 'Identifiants incorrects' }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        summary: 'Déconnexion',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'Profil courant',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/auth/verify': {
      post: {
        summary: 'Vérifier le token',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Valide' }, 401: { description: 'Invalid' } }
      }
    },
    '/api/auth/profile': {
      put: {
        summary: 'Mettre à jour le profil',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProfileUpdate' } } }
        },
        responses: { 200: { description: 'OK' }, 400: { description: 'Validation' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/api/auth/password': {
      put: {
        summary: 'Changer le mot de passe',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PasswordChange' } } }
        },
        responses: { 200: { description: 'OK' }, 400: { description: 'Validation' }, 401: { description: 'Unauthorized' } }
      }
    },
    '/products': {
      get: {
        summary: 'Lister les produits (paginé)',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 12 } },
          { in: 'query', name: 'sort', schema: { type: 'string', default: 'createdAt' } },
          { in: 'query', name: 'order', schema: { type: 'string', default: 'desc' } },
          { in: 'query', name: 'category', schema: { type: 'string' } },
          { in: 'query', name: 'brand', schema: { type: 'string' } },
          { in: 'query', name: 'minPrice', schema: { type: 'number' } },
          { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
          { in: 'query', name: 'isOnSale', schema: { type: 'boolean' } }
        ],
        responses: { 200: { description: 'OK' } }
      },
      post: {
        summary: 'Créer un produit (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductCreate' } } }
        },
        responses: { 201: { description: 'Créé' }, 400: { description: 'Validation' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' } }
      },
      delete: {
        summary: 'Suppression en masse (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { ids: { type: 'array', items: { type: 'string' } } }, required: ['ids'] } } }
        },
        responses: { 200: { description: 'OK' } }
      }
    },
    '/products/{id}': {
      get: {
        summary: 'Obtenir un produit',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } }
      },
      put: {
        summary: 'Mettre à jour un produit (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductCreate' } } }
        },
        responses: { 200: { description: 'OK' }, 400: { description: 'Validation' }, 404: { description: 'Not Found' } }
      }
    }
  }
};


