const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
  origin: '*', // In production, replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
// * Swagger setup


require('dotenv').config();
const connectDB = require('./config/db');
// * connect to the database
connectDB();

// * middleware to parse JSON and URL-encoded data 
app.use(express.json({ limit: '10mb' })); // Increase limit if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase limit if needed

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// * middleware for authentication
// const auth = require('./middleware/auth');
// app.use(auth);


// * use routes
app.use('/auth', require('./routes/auth'));
app.use('/todos', require('./routes/Todo'));

app.get('/', (req, res) => {
  res.send('Welcome to the Express Server!');
}
);

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'active',
    timestamp: new Date().toISOString(),
    message: 'Server is running smoothly!' 
});
}
);

// * start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}
);