# Telco Product Recommendation System

A fullstack web application that recommends telco products based on customer behavior collected through a questionnaire. Built with vanilla JavaScript (no frontend framework), Express.js backend, and MongoDB Atlas.

## Features

- **Phone Number Authentication**: Simple login system using phone numbers
- **Behavioral Questionnaire**: Collects user preferences for internet usage, streaming habits, data consumption, etc.
- **Product Recommendations**: ML-based (dummy logic) recommendations based on questionnaire responses
- **Product Catalog**: Browse featured telco products (data, voice, SMS, VOD, bundles)
- **User Dashboard**: View profile, questionnaire responses, and current recommendations
- **Responsive Design**: Modern UI built with Tailwind CSS and DaisyUI

## Tech Stack

### Frontend
- **HTML5**: Pure HTML structure
- **CSS**: Tailwind CSS + DaisyUI for styling
- **JavaScript**: Vanilla JavaScript (no frameworks)
- **Vite**: Build tool and dev server (for fast HMR and optimized builds)

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB Atlas**: Cloud database (Google Cloud Singapore region)
- **JWT**: Token-based authentication

## Project Structure

```
.
├── models/
│   ├── User.js          # User model with questionnaire data
│   └── Product.js       # Product model
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── questionnaire.js # Questionnaire submission & retrieval
│   ├── products.js      # Product CRUD operations
│   └── recommendations.js # Recommendation logic
├── scripts/
│   └── seedProducts.js  # Database seeding script
├── public/
│   ├── pages/
│   │   ├── login.html
│   │   ├── questionnaire.html
│   │   ├── landing.html
│   │   ├── product-detail.html
│   │   └── dashboard.html
│   ├── js/
│   │   ├── router.js    # SPA router
│   │   ├── auth.js      # Authentication utilities
│   │   ├── api.js       # API client
│   │   └── app.js       # Main application logic
│   ├── styles.css
│   └── index.html
├── server.js            # Express server
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Backend Environment Variables
   PORT=3000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   
   # Frontend Environment Variables (optional, for Vite)
   # VITE_API_BASE_URL=http://localhost:3000
   ```
   
   **Note:** Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client. The API base URL is optional since Vite proxies `/api` requests automatically in development.

   To get your MongoDB Atlas connection string:
   - Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (select Google Cloud Singapore region)
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<password>` with your database password
   - Add your IP address to the whitelist

4. **Seed the database with sample products**
   ```bash
   npm run seed
   ```
   
   Or directly:
   ```bash
   node scripts/seedProducts.js
   ```

5. **Start the development servers**
   
   **Option 1: Run both servers together (Recommended)**
   ```bash
   npm run dev:all
   ```
   This will start both the backend server and Vite dev server concurrently.
   
   **Option 2: Run servers separately**
   
   **Terminal 1 - Backend Server:**
   ```bash
   npm run server:dev
   ```
   
   **Terminal 2 - Vite Dev Server (Frontend):**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173` (Vite dev server)
   The backend API will be available at `http://localhost:3000`
   
   Vite will automatically proxy API requests to the backend server.
   
   **For production:**
   ```bash
   npm run build    # Build the frontend
   npm start        # Start the production server (serves built files)
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
   
   (Vite dev server - in development mode)
   
   Or for production:
   ```
   http://localhost:3000
   ```
   (Express server serving built files)

## Application Flow

1. **Login Page** (`/login`)
   - User enters phone number
   - If new user, account is automatically created
   - JWT token is stored in localStorage
   - Redirects to questionnaire if not completed, otherwise to landing page

2. **Questionnaire Page** (`/questionnaire`)
   - Collects behavioral data:
     - Internet usage level
     - Streaming habits
     - Data consumption
     - Voice usage
     - SMS usage
     - VOD interest
     - Budget preference
   - Submits data and generates recommendations
   - Redirects to landing page

3. **Landing Page** (`/`)
   - Displays featured products
   - Shows "Recommended for You" section based on questionnaire
   - Product cards with images and details

4. **Product Detail Page** (`/product/:id`)
   - Detailed product information
   - Features and specifications
   - Related recommendations section

5. **User Dashboard** (`/dashboard`)
   - Profile information
   - Questionnaire responses
   - Current recommendations with scores

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with phone number
- `GET /api/auth/verify` - Verify JWT token

### Questionnaire
- `POST /api/questionnaire/submit` - Submit questionnaire (requires auth)
- `GET /api/questionnaire/data` - Get questionnaire data (requires auth)

### Products
- `GET /api/products` - Get all products (optional: `?category=data&featured=true`)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category

### Recommendations
- `GET /api/recommendations/user` - Get user recommendations (requires auth)
- `GET /api/recommendations/related/:category` - Get related products by category

## Recommendation Logic

The system uses a simple scoring algorithm based on questionnaire responses:

- **Data Category**: Scored based on `dataConsumption` level
- **Voice Category**: Scored based on `voiceUsage` level
- **SMS Category**: Scored based on `smsUsage` level
- **VOD Category**: Scored based on `vodInterest` and `streamingHabits`
- **Bundle Category**: Average score of data, voice, and SMS categories

Recommendations are sorted by score (highest first) and displayed to users.

## Development

### Adding New Products

You can add products through the MongoDB Atlas interface or by modifying `scripts/seedProducts.js` and running it again.

### Customizing Recommendations

Edit the `generateRecommendations` function in `routes/questionnaire.js` to implement your own recommendation logic.

## Notes

- This project uses dummy recommendation logic. For production, integrate a proper ML model.
- Phone number validation is basic. Enhance for production use.
- JWT tokens expire after 7 days.
- All images use placeholder URLs. Replace with actual product images.

## License

ISC

