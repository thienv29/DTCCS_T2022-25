// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '../../../core/models/user';
import {connectDb} from '@/core/utils/connectDb';

export default async function getUser(req, res) {
    await connectDb();
    const user = await User.findOne({address: req.query.address});
    res.status(200).json(user)
}
