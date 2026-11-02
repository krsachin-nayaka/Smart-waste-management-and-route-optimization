/**
 * Async Handler Wrapper
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Wraps async Express route controllers to eliminate repetitive try-catch blocks.
 * Forwards any unhandled Promise rejections automatically to next(err).
 *
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
