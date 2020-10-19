import { NotFoundError, ValidationError } from 'iyasunday';
import User from '../auth/model';
import { generateAuthToken } from '../../utils/helpers';


const projection = ['image', 'email', 'firstName', 'lastName'];

export async function getUserDetails(req, res, next) {
  try {
    const user = await User.findOne({
      _id: req.user._id
    }).select([...projection, 'bio', 'company', 'phoneNumber'])

    if (!user) {
      throw new NotFoundError('Could not find this user')
    }

    res.status(200).send({
      data: user,
      success: true,
      message: 'Successfully fetched details'
    })
  } catch (error) {
    next(error);
  }
}

export async function updateUserDetails(req, res, next) {
  try {
    const user = await User.findOneAndUpdate({
      _id: req.user._id
    }, {
      $set: req.body
    }, {
      new: true,
      projection,
      useFindAndModify: false
    })

    if (!user) {
      throw new NotFoundError('Could not find this user')
    }

    res.status(200).send({
      data: await generateAuthToken(user),
      success: true,
      message: 'Successfully updated details'
    })
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req, res, next) {
  const { newPassword: password, oldPassword } = req.body;
 
  try {
    const user = await User.findOne({
      _id: req.user._id
    });

    if (!user) {
      throw new NotFoundError('Could not find this user')
    }

    if (!user.comparePassword(oldPassword)) {
      throw new ValidationError('Incorrect password');
    }

    user.password = password;

    await user.save();

    res.status(200).send({
      success: true,
      message: 'Successfully updated details'
    })
  } catch (error) {
    next(error);
  }
}

export async function updateUserPhoto(req, res, next) {
  try {
    const user = await User.findOneAndUpdate({
      _id: req.user._id
    }, {
      $set: {
        image: req.file.path
      }
    }, {
      new: true,
      projection,
      useFindAndModify: false
    })

    if (!user) {
      throw new NotFoundError('Could not find this user');
    };

    res.status(200).send({
      data: await generateAuthToken(user),
      success: true,
      message: 'Successfully updated details'
    });

  } catch (error) {
    next(error);
  }
}
