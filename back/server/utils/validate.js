// Middleware générique de validation avec Joi
// Usage: validate(schema) où schema contient { body, params, query }

const validate = (schema) => {
    return (req, res, next) => {
        try {
            const segments = ['body', 'params', 'query'];
            for (const segment of segments) {
                if (schema[segment]) {
                    const { error, value } = schema[segment].validate(req[segment], {
                        abortEarly: false,
                        stripUnknown: true
                    });
                    if (error) {
                        return res.status(400).json({
                            message: 'Validation échouée',
                            errors: error.details.map(d => ({ path: d.path.join('.'), message: d.message }))
                        });
                    }
                    req[segment] = value;
                }
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { validate };


