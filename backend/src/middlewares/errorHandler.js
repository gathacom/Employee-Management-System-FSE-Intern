// backend/src/middlewares/errorHandler.js
import { StatusCodes } from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'An unexpected error occurred on the server.';

  if (err.code === 'P2002') {
    statusCode = StatusCodes.CONFLICT; 
    message = 'Data already exists: ' + err.meta.target.join(', ');
  }

  if (err.name === 'ZodError') {
    statusCode = StatusCodes.BAD_REQUEST; 
    message = 'Validation Error: ' + err.errors.map(e => `${e.path.join('.')} is ${e.message.toLowerCase()}`).join(', ');
  }
  
  res.status(statusCode).json({
    message: message,
    data: null,
  });
};

export default errorHandler;