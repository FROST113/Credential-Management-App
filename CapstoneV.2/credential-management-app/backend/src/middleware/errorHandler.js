const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
  
    res.status(500).json({ error: 'Internal Server Error' });
  };
  
  module.exports = errorHandler;
  