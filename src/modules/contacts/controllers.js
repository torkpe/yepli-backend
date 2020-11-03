import Contacts from "./model";
import {
  NotFoundError
} from "iyasunday";
import User, { USER_COLLECTION } from "../auth/model";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export async function addContact(req, res, next) {
  try {
    let user;

    if (!req.body.userId) {
      user = await User.create({
        email: req.body.email,
        invitedBy: req.user._id
      });
      req.body.userId = user._id;
    }
  
    req.body.addedBy = req.user._id;
    const contact = await Contacts.create(req.body)
  
    return res.status(201).send({
      success: true,
      message: 'Successfully added contact',
      data: contact
    })
  } catch (error) {
    next(error);
  }
}


export async function getContacts(req, res, next) {
  try {
    const { searchKey } = req.query;
  
    let query = {};

    if (searchKey) {
      query = {
        $or: [
          { "userDetail.firstName": new RegExp(searchKey, "i") },
          { "firstName": new RegExp(searchKey, "i") },
          { "userDetail.lastName": new RegExp(searchKey, "i") },
          { "lastName": new RegExp(searchKey, "i") },
        ]
      }
    }

    const contacts = await Contacts.aggregate([
      {
        $match: {
          addedBy: ObjectId(req.user._id)
        }
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          foreignField: '_id',
          localField: 'userId',
          as: 'userDetail'
        }
      },
      {
        $unwind: {
          path: '$userDetail',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: query
      }
    ]);

    return res.status(200).send({
      data: contacts,
      status: 200,
      success: true
    });
  } catch (error) {
    next(error);
  }
}
