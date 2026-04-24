const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    try {
      await connectDB();
    } catch (error) {
      // Continue without MongoDB: controllers fall back to runtimeStore.
      console.warn(
        `MongoDB unavailable, running in-memory mode: ${error.message}`,
      );
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
