const { z } = require('zod');

/**
 * Generic request validator middleware.
 *
 * Usage:
 *   app.post('/route', validate({ body: BodySchema }), handler)
 */
function validate({ body, params, query } = {}) {
  return function validateMiddleware(req, res, next) {
    try {
      if (body) {
        const result = body.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({
            error: 'Validation error',
            details: result.error.flatten(),
          });
        }
        req.body = result.data;
      }

      if (params) {
        const result = params.safeParse(req.params);
        if (!result.success) {
          return res.status(400).json({
            error: 'Validation error',
            details: result.error.flatten(),
          });
        }
        req.params = result.data;
      }

      if (query) {
        const result = query.safeParse(req.query);
        if (!result.success) {
          return res.status(400).json({
            error: 'Validation error',
            details: result.error.flatten(),
          });
        }
        req.query = result.data;
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

module.exports = {
  validate,
  z,
};
