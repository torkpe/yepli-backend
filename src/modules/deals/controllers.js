import Deal from "./model";
import moment from "moment";
import {
  NotFoundError
} from "iyasunday";
import { USER_COLLECTION } from "../auth/model";
import mongoose from "mongoose";

const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'hellobooks', 
  api_key: '521381859673832', 
  api_secret: '8c060McBdeyZClXXNfNgpG8QqXU' 
});
const { ObjectId } = mongoose.Types;

export async function addDeal(req, res, next) {
  try {
    const { body } = req;
    body.createdBy = req.user._id;

    console.log(body, '======?>')
    const deal = await Deal.create(body);

    res.status(201).send({
      success: true,
      message: 'Successfully created deal',
      data: deal
    })
  } catch (error) {
    console.log(error.toString())
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

    console.log('got here')
    const response = await cloudinary.uploader.upload(req.file.path);
    console.log(response)

    await Deal.updateOne({
      _id: req.params.dealId
    }, {
      $push: {
        images: response.secure_url
      }
    });

    res.status(200).send({
      success: true,
      data: response.secure_url,
      message: 'Successfully added image'
    })

  } catch(error) {
    console.log(error)
    next(error)
  }
}
  