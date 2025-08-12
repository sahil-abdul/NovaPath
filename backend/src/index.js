import dotenv from "dotenv";
import main from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT || 8080;

dotenv.config({
  path: "./.env",
});

main()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });

    app.on("error", () => {
      console.log("Error :: ", error);
      throw error;
    });
  })
  .catch((err) => {
    console.log("connection faild !!!:: ", err);
  });
