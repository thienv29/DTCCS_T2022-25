// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '../../../core/models/user';
import {connectDb} from '@/core/utils/connectDb';

export default async function update(req, res) {
    await connectDb();
    const userUpdate = req.body;
    const userOld = await User.findOne({address: userUpdate.address});
    if (userOld.role != null) {
        userUpdate.role = userOld.role;
    }
    const userByAddress = await User.updateOne({address: userUpdate.address}, userUpdate)
    return res.status(200).json(userByAddress);

}
