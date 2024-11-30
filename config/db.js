import mongoose from 'mongoose';
import chalk from 'chalk'
const connection = async()=>{
try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log(chalk.blue.italic("Your server is connected with database successfully"))
} catch (error) {
    console.log(chalk.yellow.italic("something went wrong in DB connection"),error)
}
}

export {connection}