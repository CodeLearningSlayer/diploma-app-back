export default () => ({
  secret: process.env.JWT_SECRET,
  port: Number(process.env.PORT),
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  dbPort: process.env.POSTGRES_PORT,
});
