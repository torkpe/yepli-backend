import Types from "./model";
import {
  NotFoundError
} from "iyasunday";
import mongoose from "mongoose";
import { TEMAPLATE_COLLECTION } from "../custom-template/model";

const { ObjectId } = mongoose.Types;


export async function addType(req, res, next) {
  try {
    req.body.createdBy = req.user._id;
    const type = await Types.create(req.body);
    res.status(200).send({
      data: type,
      status: 200,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

export async function editType(req, res, next) {
  try {

    const type = await Types.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: {
        name: req.body.name
      }
    });

    if (!type) {
      throw new NotFoundError('Could not find any type with this id')
    }

    res.status(200).send({
      data: type,
      status: 200,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

export async function getTypes(req, res, next) {
  try {
    const types = await Types.aggregate([
      {
        $match: {
          createdBy: ObjectId(req.user._id),
        }
      },
      {
        $lookup: {
          from: TEMAPLATE_COLLECTION,
          foreignField: 'typeId',
          localField: '_id',
          as: 'templates'
        }
      }
    ]);

    res.status(200).send({
      data: types,
      status: 200,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteType(req, res, next) {
  try {
    await Types.deleteOne({
      _id: req.params.id
    })

    res.status(200).send({
      message: 'Successfully deleted type',
      status: 200,
      success: true
    });
  } catch (error) {
    next(error);
  }
}