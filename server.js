require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

const path = require('path');

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route files
const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotels');
const roomTypeRoutes = require('./routes/roomTypes');
const roomRoutes = require('./routes/rooms');
const availabilityRoutes = require('./routes/availability');
const bookingRoutes = require('./routes/bookings');
const pricingRuleRoutes = require('./routes/pricingRules');
const housekeepingRoutes = require('./routes/housekeeping');
const historyRoutes =  require('./routes/history');
const invoiceRoutes =  require('./routes/invoices');
const reportRoutes =  require('./routes/reports');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);
// We mount availability under /api/hotels to satisfy GET /api/hotels/search requirement 
app.use('/api/hotels', availabilityRoutes); // This will handle /api/hotels/search
app.use('/api/hotels', hotelRoutes); // This handles /api/hotels and /api/hotels/:id
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing-rules', pricingRuleRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
