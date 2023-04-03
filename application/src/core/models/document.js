import mongoose, {model, Schema} from 'mongoose';

const DocumentSchema = new Schema({
    address: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    cluster: {type: mongoose.Schema.Types.ObjectId, ref: 'Cluster'},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    confirm: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true
});
const Document = mongoose.models.Document || model('Document', DocumentSchema);
export default Document;
