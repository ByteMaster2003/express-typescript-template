# Express TypeScript Backend Template

A production-ready Express.js backend template with TypeScript, featuring robust authentication, security measures, and best practices.

## Features

- **TypeScript Support**: Full TypeScript integration with proper configurations
- **Authentication**:
  - JWT-based authentication with access and refresh tokens
  - Cookie-based token storage
  - Password hashing with bcrypt
  - Role-based authorization middleware
- **Security**:
  - Helmet for security headers
  - Rate limiting for API endpoints
  - MongoDB sanitization
  - CORS configuration
  - Cookie security
  - Input validation using Zod
- **API Documentation**:
  - Swagger/OpenAPI documentation
  - Auto-generated API docs
- **Error Handling**:
  - Global error handling
  - Custom API error class
  - Validation error handling
  - TypeScript type checking
- **Logging**:
  - Morgan for HTTP request logging
  - Winston for application logging
  - Different log levels for development/production
- **Code Quality**:
  - ESLint configuration
  - Prettier code formatting
  - Import sorting
  - TypeScript strict mode
- **Database**:
  - MongoDB with Mongoose
  - Type-safe models
  - Database connection handling
- **Development Tools**:
  - Hot reloading with ts-node-dev
  - Environment variable validation
  - Path aliases (@/ imports)
  - Proper development scripts

## Prerequisites

- Node.js (v22.11.0 or higher)
- MongoDB
- Yarn package manager

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file with appropriate values:

```env
NODE_ENV=development
PORT=8086
MONGO_URI=mongodb://localhost:27017/your-db-name

ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
HASH_SECRET=your-hash-secret
OTP_SECRET=your-otp-secret
```

## Available Scripts

- **Development**:

```bash
yarn dev         # Start development server with hot-reload
```

- **Production**:

```bash
yarn build      # Build the project
yarn start      # Start production server
```

- **Code Quality**:

```bash
yarn lint       # Run ESLint
yarn lint:fix   # Fix ESLint issues
yarn format     # Format code with Prettier
yarn format:check # Check code formatting
```

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:8086/api/v1/docs
```

## Project Structure

```
docs/               # Swagger API definitions
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Express middlewares
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
├── utils/          # Utility functions
├── validations/    # Request validations
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## Authentication Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/status` - Check auth status

## Security Measures

1. **Rate Limiting**:

   - Login: 3 requests per hour
   - Registration: 10 requests per hour
   - Other endpoints: Customizable limits

2. **Input Validation**:

   - Zod schema validation for all requests
   - Custom password strength validation
   - Email format validation
   - Phone number format validation

3. **Security Headers**:
   - CORS configuration
   - Helmet security headers
   - MongoDB query sanitization

## Error Handling

The template includes a global error handler that:

- Converts all errors to a consistent format
- Handles validation errors
- Provides stack traces in development
- Logs errors appropriately

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.
