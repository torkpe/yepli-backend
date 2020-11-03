import { NotFoundError, ValidationError } from 'iyasunday';
import User from '../auth/model';
import { generateAuthToken } from '../../utils/helpers';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

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

export async function getUsers(req, res, next) {
  try {
    const { searchKey } = req.query;
    let query = {
      _id: {$ne: ObjectId(req.user._id)},
      isVerified: true
    };

    if (searchKey) {
      query = {
        ...query,
        $or: [
          { "firstName": new RegExp(searchKey, "i") },
          { "lastName": new RegExp(searchKey, "i") },
          { "email": new RegExp(searchKey, "i") },
        ]
      }
    }

    const users = await User.aggregate([
      {
        $match: query
      },
      {
        $project: {
          image: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          company: 1,
        }
      }
    ]);

    return res.status(200).send({
      succes: true,
      data: users,
    })
  } catch (error) {
    next(error);
  }
}