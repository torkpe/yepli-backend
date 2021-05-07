import mongoose from "mongoose";
import Section from "./model";
import { TASK_COLLECTION } from "../tasks/model";
import { USER_COLLECTION } from "../auth/model";

const { ObjectId } = mongoose.Types;

export async function addSection(req, res, next) {
  try {
    req.body.createdBy = req.user._id;
    const section = await Section.create(req.body);
    res.status(201).send({
      data: section,
      success: true,
      status: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSections(req, res, next) {
  try {
    const sections = await Section.aggregate([
      {
        $match: {
          dealId: ObjectId(req.query.dealId),
        },
      },
      {
        $lookup: {
          from: TASK_COLLECTION,
          foreignField: "sectionId",
          localField: "_id",
          as: "checklists",
        },
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          foreignField: "_id",
          localField: "checklists.createdBy",
          as: "taskCreator",
        },
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          foreignField: "_id",
          localField: "checklists.assignee",
          as: "assignees",
        },
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          foreignField: "_id",
          localField: "createdBy",
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
          preserveNullAndEmptyArrays: true,
        },
      }
    ]);
    res.status(200).send({
      data: sections,
      success: true,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
}
