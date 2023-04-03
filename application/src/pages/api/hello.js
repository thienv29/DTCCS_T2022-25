// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from './../../core/models/user';

export default async function handler(req, res) {
    await connectDb();
    const user = User.create({name: 'thien', email: 'thien@gmail.com'});
    res.status(200).json({name: 'John Doe'})
}
