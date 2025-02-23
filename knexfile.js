import "dotenv/config";
// logs:
console.log("Database Configuration:");
console.log("  Host:", process.env.DB_HOST);
console.log("  Database:", process.env.DB_NAME);
console.log("  User:", process.env.DB_USER);
console.log("  Password:", process.env.DB_PASSWORD ? "********" : "Not Set"); // Mask password for security

export default {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: "utf8",
  },
};
