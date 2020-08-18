export const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  secret: process.env.SECRET || 'secret',
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
    ssl: process.env.DATABASE_SSL === 'true'
  },
});
