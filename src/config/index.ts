export default () => ({
  secret: process.env.JWT_SECRET,
  port: process.env.PORT,
});
