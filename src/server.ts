import * as dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { createApp } from "./app";

const app = createApp();
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);