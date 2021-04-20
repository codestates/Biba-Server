import 'dotenv/config';
export default () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_NAME || 'root',
    password: process.env.DB_PASSWORD || '',
  },
});
