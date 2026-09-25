import createHttpError from 'http-errors';

export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        createHttpError(400, 'Validation failed', {
          errors: error.details.map((d) => d.message),
        }),
      );
    }

    req.body = value;
    next();
  };
}
