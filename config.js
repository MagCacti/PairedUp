module.exports = {
  // App Settings
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/users', 
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Shhh',
  GITHUB_SECRET: process.env.GITHUB_SECRET || '881163697cad6c7cc246638d4b98819dd5cf679e',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '6ffd349ee17a258a13ff'
};