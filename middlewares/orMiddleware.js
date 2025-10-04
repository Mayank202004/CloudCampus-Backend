/**
 * @desc Takes a list of middlewares and allows request to continue if any one passes
 * @param {Array<Function>} middlewares 
 */
const orMiddleware = (middlewares) => async (req, res, next) => {
    for (const middleware of middlewares) {
      try {
        await new Promise((resolve, reject) => {
          middleware(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // If middleware passed without error, allow request
        return next();
      } catch (err) {
        // Try next middleware
      }
    }

    // If none passed, throw
    return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
  };

export {orMiddleware};