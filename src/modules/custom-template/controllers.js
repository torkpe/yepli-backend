import Template from "./model";
import {
  NotFoundError
} from "iyasunday";
import mongoose from "mongoose";

export async function addTemplate(req, res, next) {
  try {
    req.body.createdBy = req.user._id;
    const type = await Template.create(req.body);
    res.status(200).send({
      data: type,
      status: 200,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTemplate(req, res, next) {
  try {
    req.body.createdBy = req.user._id;

    const type = await Template.update({
      _id: req.params._id,
      $set: {
        ...req.body
      }
    });

    res.status(200).send({
      data: type,
      status: 200,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

export async function getTemplates(req, res, next) {
  try {
    const templates = await Template.find({
      createdBy: req.user._id,
      isDeleted: {$ne: true}
    });
    res.status(200).send({
      data: templates,
      status: 200,
      success: true
    });
  } catch (error) {
    next(error);
  }
}