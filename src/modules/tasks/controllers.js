import Model from './model';
import mongoose from "mongoose";
import { USER_COLLECTION } from '../auth/model';
import { DEAL_COLLECTION } from '../deals/model';

const { ObjectId } = mongoose.Types;

const pipeline = [
  {
    $lookup: {
      from: USER_COLLECTION,
      localField: 'assignee',
      foreignField: '_id',
      as: 'assignee'
    }
  },
  {
    $lookup: {
      from: DEAL_COLLECTION,
      localField: 'dealId',
      foreignField: '_id',
      as: 'deal'
    }
  },
  {
    $lookup: {
      from: USER_COLLECTION,
      localField: 'createdBy',
      foreignField: '_id',
      as: 'createdBy'
    }
  },
  {
    $lookup: {
      from: DEAL_COLLECTION,
      localField: 'dealId',
      foreignField: '_id',
      as: 'deal'
    }
  },
  {
    $unwind: {
      path: '$deal',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: USER_COLLECTION,
      localField: 'deal.members',
      foreignField: '_id',
      as: 'members'
    }
  },
  {
    $unwind: {
      path: '$assignee',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $unwind: {
      path: '$deal',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $unwind: {
      path: '$createdBy',
      preserveNullAndEmptyArrays: true,
    },
  },
];

export async function addTask(req, res, next) {
  try {
    req.body.assignee = req.body.assignee._id;
    req.body.createdBy = req.user._id;
    await Model.create(req.body);
    const task = await Model.aggregate([
      {
        $match: {
          dealId: ObjectId(req.body.dealId)
        }
      },
      ...pipeline
    ]);
    res.status(201).send({
      status: 201,
      success: true,
      data: task[0]
    });
  } catch(error) {
    next(error);
  }
}

export async function getTasks(req, res, next) {
  try {
    let query = {};
    const { userId, dealId } = req.query;

    if (userId) {
      query = {
        ...query,
        $or: [
          { 'assignee._id': ObjectId(userId) },
          { 'createdBy._id': ObjectId(userId) },
          { mentions: { $in: [userId] } },
        ]
      }
    }

    if (dealId) {
      query.dealId = ObjectId(dealId);
    }


    const tasks = await Model.aggregate([
      ...pipeline,
      {
        $match: query
      },
    ]);

    res.status(200).send({
      status: 200,
      success: true,
      data: tasks
    });
  } catch(error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await Model.updateOne({
      _id: req.params.taskId
    }, {
      $set: req.body
    });

    res.status(200).send({
      status: 200,
      success: true,
      data: task
    });

  } catch (error) {
    next(error);
  }
}
