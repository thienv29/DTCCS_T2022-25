import mongoose, {model, Schema} from 'mongoose';

const ClusterSchema = new Schema({
    address: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    }

}, {
    timestamps: true
});
const Cluster = mongoose.models.Cluster || model('Cluster', ClusterSchema);
export default Cluster;
