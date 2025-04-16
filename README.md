# Rudra - Test Project

A Next.js application with Material-UI components and Hasura GraphQL backend.

## Features

- User authentication (Login, Signup, Forgot Password)
- Protected routes
- User management
- Modern UI with Material-UI components
- GraphQL API with Hasura
- PostgreSQL database

## Prerequisites

- Node.js 18 or later
- Docker and Docker Compose
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd rudra
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
NEXT_PUBLIC_HASURA_ENDPOINT=http://localhost:8080/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=myadminsecretkey
JWT_SECRET=your-jwt-secret-key
```

4. Start the Hasura and PostgreSQL containers:
```bash
docker-compose up -d
```

5. Access the Hasura Console at http://localhost:8080/console and apply the following SQL:
```sql
-- Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create necessary permissions
```

6. Run the development server:
```bash
npm run dev
```

7. Open http://localhost:3000 in your browser.

## Project Structure

```
rudra/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── graphql/         # GraphQL queries and mutations
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions and configurations
├── public/              # Static files
└── docker-compose.yml   # Docker configuration
```

## Technologies Used

- Next.js 14
- Material-UI
- Apollo Client
- Hasura GraphQL
- PostgreSQL
- Docker

## Development

- The application uses Next.js App Router
- Material-UI for the component library
- Apollo Client for GraphQL operations
- Hasura for the GraphQL API
- PostgreSQL for the database

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. For the backend, you can use:
- Hasura Cloud
- Self-hosted Hasura instance
- Any PostgreSQL database

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
