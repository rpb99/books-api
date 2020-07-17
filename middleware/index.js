module.exports = {
  asyncHandler: (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  },

  errorResponse(message, statusCode, res) {
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  },
};
