const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack); // log the error for debugging

  const statusCode = err.statusCode || 500; // default to 500
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    // optional: include stack trace in dev
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
