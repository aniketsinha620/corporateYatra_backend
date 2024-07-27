import mongoose from "mongoose";


const connectDB = async () => {

    try {
        const connectionString = await mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_KEY}@traveller.k0umkna.mongodb.net/?retryWrites=true&w=majority`)

        console.log('DB connected')
    }

    catch (error) {
        console.log("Error connecting to database: ", error);
    }
}

export default connectDB