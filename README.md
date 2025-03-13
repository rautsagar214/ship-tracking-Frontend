# ShipTrack - Shipping Management System

ShipTrack is a comprehensive shipping management and tracking system that allows businesses to manage shipments, track containers, and handle customer enquiries efficiently.

## Features

### Admin Dashboard

- Secure admin authentication
- Shipment management (Create, Track, Update)
- Real-time status updates
- Location tracking
- Customer enquiry management
- Responsive design for all devices

### Public Features

- Container tracking using unique container IDs
- Contact form for enquiries
- Modern, user-friendly interface
- Real-time shipment status updates

## Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Lucide React for icons

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- CORS for secure cross-origin requests

## Project Structure

```
ship-tracking/
├── ship-tracking-Frontend/    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── AdminComponent/   # Admin dashboard components
│   │   ├── assets/          # Static assets
│   │   └── App.jsx          # Main application component
│   └── package.json         # Frontend dependencies
│
└── ship-tracking-Backend/    # Backend Node.js application
    ├── config/              # Configuration files
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    ├── middleware/         # Custom middleware
    └── server.js          # Main server file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup

1. Navigate to the backend directory:

```bash
cd ship-tracking-Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_PASSKEY=your_admin_password
NODE_ENV=development
```

4. Start the backend server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ship-tracking-Frontend/Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_ADMIN_PASSKEY=your_admin_password
```

4. Start the frontend development server:

```bash
npm run dev
```

## Accessing Admin Dashboard

To access the admin dashboard, follow these steps:

1. Start both backend and frontend servers
2. Open your browser and go to: `http://localhost:5173/admin-login`
3. You will see the admin login page
4. Enter the following admin passkey:
   ```
   ShipTrack2024@Admin
   ```
5. Click "Access Dashboard" to log in
6. You will be redirected to the admin dashboard at `/admin-dashboard`

Note: The admin dashboard is protected and requires authentication. Your login session will be maintained until you click the logout button or close the browser.

### Admin Features Available:

- Create and manage shipments
- Update shipment status and location
- View and manage customer enquiries
- Search and filter shipments
- Real-time updates

## API Endpoints

### Authentication

- POST /api/auth/login - Admin login
- GET /api/auth/verify - Verify JWT token

### Shipments

- GET /api/shipments - Get all shipments (protected)
- POST /api/shipments - Create new shipment (protected)
- GET /api/shipments/track/:containerId - Track shipment (public)
- PATCH /api/shipments/:id/status - Update status (protected)
- PATCH /api/shipments/:id/location - Update location (protected)

### Contact/Enquiries

- POST /api/contact - Submit contact form (public)
- GET /api/contact - Get all enquiries (protected)
- PATCH /api/contact/:id - Update enquiry status (protected)

## Features in Detail

### Shipment Management

- Automatic container ID generation
- Container path based on date and ID
- Location history tracking
- Status updates with timestamps
- Comprehensive shipment details

### Admin Dashboard

- Secure login with JWT
- Real-time shipment updates
- Search and filter capabilities
- Status management
- Location updates
- Enquiry management

### Public Tracking

- Easy-to-use tracking interface
- Detailed shipment information
- Current status and location
- Shipment history

## Security Features

- JWT authentication for admin routes
- Protected API endpoints
- CORS configuration
- Environment variable management
- Input validation and sanitization

## Error Handling

- Comprehensive error messages
- Form validation
- API error responses
- Loading states
- User feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


