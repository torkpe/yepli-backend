import Deal from "./model";
import moment from "moment";
import {
  NotFoundError
} from "iyasunday";

export async function addDeal(req, res, next) {
  try {
    const { body } = req;
    body.createdBy = req.user._id;

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
    const deals = await Deal.find({
      createdBy: req.user._id,
      isDeleted: false
    });

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
    const deal = await Deal.find({
      createdBy: req.params.dealId,
      isDeleted: false
    });

    if (!deal) {
      throw new NotFoundError('Could not find this deal');
    }

    res.status(200).send({
      data: deal,
      success: true,
      message: 'Successfully fetched deal'
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDeal(req, res, next) {
  try {
    const deal = await Deal.updateOne({
      createdBy: req.params.dealId,
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