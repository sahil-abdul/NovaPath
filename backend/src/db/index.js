import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



async function main() {
    try {
        const data = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n database connected successfully !! :-`,data.connection.host)
    } catch (error) {
        console.log("error in conection :: ",error )
        process.exit(1);
    }
}

export default main;