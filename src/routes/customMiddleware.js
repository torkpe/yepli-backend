import User from '../modules/auth/model';
import {decodeJwt, NotFoundError,  InvalidTokenError} from 'iyasunday';

export async function authMiddleware(req, res, next) {
  try {
    let token = req.headers.authorization;
    if (!token) {
      throw new InvalidTokenError('Kindly supply authentication token');
    }

    token = token.split(' ').pop();

    const data = await decodeJwt(token);

    const user = await User.countDocuments({
      _id: data._id,
      isVerified: true
    });

    if (!user) {
      throw new NotFoundError('This account is not valid')
    }

    req.user = data;
    console.log(req.user)
    return next()
  } catch (err) {
    next(err);
  }
}