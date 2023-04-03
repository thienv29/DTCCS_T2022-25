// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from './../../core/models/user';

export default async function createUser(req, res) {
    await connectDb();
    const {user} = req.body;
    const userCreated = await User.create({name: user.address, address: user.address});
    res.status(200).json(userCreated)
}
