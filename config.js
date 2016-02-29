module.exports = {
  // App Settings
  MONGO_URI: process.env.MONGO_URI || 'mongodb://heroku_z1qhwknn:neo6ds37tnmv9q2256rosusqqe@ds061954.mongolab.com:61954/heroku_z1qhwknn', 
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'Shhh',
  GITHUB_SECRET: process.env.GITHUB_SECRET || '881163697cad6c7cc246638d4b98819dd5cf679e',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '3c30b4028da7c634cb9a'
};