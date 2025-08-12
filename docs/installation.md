# Installation Guide

This guide will walk you through the process of setting up PolyRule on your local machine for development and testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/polyrule.git
cd polyrule
```

### 2. Install Dependencies

```bash
npm install
```

This will install all the required dependencies including:
- React
- React Router
- Material UI
- Other dependencies

### 3. Start the Development Server

```bash
npm start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### 4. Build for Production

When you're ready to deploy the application, create a production build:

```bash
npm run build
```

This will create a `build` directory with optimized production files.

## Environment Configuration

PolyRule doesn't require any special environment variables for basic operation. However, if you plan to integrate with external services, you may need to set up environment variables.

Create a `.env` file in the root directory and add your variables:

```
REACT_APP_API_URL=https://your-api-url.com
```

## Troubleshooting

### Common Issues

1. **Node.js version conflicts**
   - Solution: Use nvm (Node Version Manager) to switch to the required Node.js version.

2. **Port conflicts**
   - Solution: If port 3000 is already in use, you can specify a different port:
     ```bash
     PORT=3001 npm start
     ```

3. **Dependency issues**
   - Solution: Delete the `node_modules` folder and `package-lock.json` file, then run `npm install` again.

## Next Steps

After installation, check out the [User Guide](user-guide.md) to learn how to use PolyRule effectively.
