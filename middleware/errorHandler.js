const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errorCode = 'SERVER_ERROR';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
    errorCode = 'INVALID_ID_ERROR';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
    errorCode = 'DUPLICATE_ERROR';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
