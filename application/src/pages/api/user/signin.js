// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from '../../../core/models/user';
import {connectDb} from '@/core/utils/connectDb';

export default async function signin(req, res) {
    await connectDb();
    const {account} = req.body;
    const userByAddress = await User.findOne({address: account});
    if (userByAddress) {
        return res.status(200).json(userByAddress)
    } else {
        const userCreated = await User.create({name: account, address: account});
        return res.status(200).json(userCreated)
    }

}
