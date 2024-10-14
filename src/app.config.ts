export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    basePath: process.env.BASE_PATH || '',
    protocol: process.env.PROTOCOL || 'http',
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    },
    google_id: process.env.GOOGLE_ID || '',
});
