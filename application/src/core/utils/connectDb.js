import mongoose from 'mongoose';

const password = 't4uRwFdjmDcdSnRU';
const username = 'thien1lan';
const connectionString = `mongodb+srv://${username}:${password}@master-free.mibycec.mongodb.net/blockchain-document-hospital?retryWrites=true&w=majority`;
mongoose.set('strictQuery', false);
export const connectDb = async () => mongoose.connect(connectionString);
