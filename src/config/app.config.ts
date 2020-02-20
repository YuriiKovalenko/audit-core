export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
  },
});
