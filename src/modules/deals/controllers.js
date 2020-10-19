import Deal from "./model";
import {
  NotFoundError
} from "iyasunday";
import { USER_COLLECTION } from "../auth/model";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export async function addDeal(req, res, next) {
  try {
    const { body } = req;
    body.createdBy = req.user._id;

    body.members = [req.user._id]
    body.finance = [{
      key: 'Loan Request',
      value: req.body.value,
    },
    {
      key: 'Estimated Stablized Value',
      value: ''
    },
    {
      key: 'Cap Rate',
      value: ''
    },
    {
      key: 'Loan to value',
      value: ''
    }
  ];
    const deal = await Deal.create(body);

    res.status(201).send({
      success: true,
      message: 'Successfully created deal',
      data: deal
    })
  } catch (error) {
    next(error)
  }
}

export async function getDeals(req, res, next) {
  try {
    const deals = await Deal.aggregate([
      {
        $match: {
          createdBy: ObjectId(req.user._id),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          foreignField: '_id',
          localField: 'createdBy',
          as: 'createdBy'
        }
      },
      {$unwind: '$createdBy'},
      {
        $project: {
          name: 1,
          createdBy: 1,
          images: 1,
          value: 1,
          type: 1,
          closingDate: 1,
        }
      }
    ]);

    console.log(deals)
    res.status(200).send({
      data: deals,
      success: true,
      message: 'Successfully fetched deals'
    });
  } catch (error) {
    next(error);
  }
}

export async function getDeal(req, res, next) {
  try {
    const deal = await Deal.aggregate([
      {
        $match: {
          _id: ObjectId(req.params.dealId),
          isDeleted: false
        }
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          foreignField: '_id',
          localField: 'members',
          as: 'members'
        }
      }
    ]);

    if (!deal) {
      throw new NotFoundError('Could not find this deal');
    }

    res.status(200).send({
      data: deal[0],
      success: true,
      message: 'Successfully fetched deal'
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDeal(req, res, next) {
  try {
    const deal = await Deal.findOneAndUpdate({
      _id: req.params.dealId,
      isDeleted: false
    }, {
      $set: req.body
    });

    if (!deal) {
      throw new NotFoundError('Could not find this deal');
    }

    res.status(200).send({
      data: deal,
      success: true,
      message: 'Successfully updated deal'
    });
  } catch (error) {
    next(error);
  }
}

export async function addMember(req, res, next) {
  try {
    const deal = await Deal.findOneAndUpdate({
      _id: req.params.dealId,
      isDeleted: false
    }, {
      $push: {
        members: req.body.email
      }
    });

    if (!deal) {
      throw new NotFoundError('Could not find this deal');
    }

    res.status(200).send({
      data: deal,
      success: true,
      message: 'Successfully add member'
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDeal(req, res, next) {
  try {
    const deal = await Deal.updateOne({
      createdBy: req.params.dealId,
      isDeleted: false
    }, {
      isDeleted: true
    });

    if (!deal) {
      throw new NotFoundError('Could not find this deal');
    }

    res.status(200).send({
      data: deal,
      success: true,
      message: 'Successfully updated deal'
    });
  } catch (error) {
    next(error);
  }
}

export async function addImage(req, res, next) {
  try {
    const deal = await Deal.find({
      _id: req.params.dealId
    });

    if (!deal) {
      throw new NotFoundError('Could not find this deal');
    }

    await Deal.updateOne({
      _id: req.params.dealId
    }, {
      $push: {
        images: req.file.path
      }
    });

    console.log(req.file.path);
    res.status(200).send({
      success: true,
      data: req.file.path,
      message: 'Successfully added image'
    })

  } catch(error) {
    next(error)
  }
}
  