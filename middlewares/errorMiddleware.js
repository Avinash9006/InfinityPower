const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack); // log the error for debugging

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle common Mongoose errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code && err.code === 11000) {
    // Duplicate key error
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `Duplicate value for field: ${field}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
