import mongoose, {model, Schema} from 'mongoose';

const UserSchema = new Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: String,
});
const User = mongoose.models.User || model('User', UserSchema);
export default User;
