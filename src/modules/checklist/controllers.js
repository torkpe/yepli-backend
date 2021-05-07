import Checklist from './model';

export async function addChecklist(req, res, next) {
  try {
    req.body.createdBy = req.user._id;
    const checklist = await Checklist.create(req.body);
    res.status(201).send({
      data: checklist,
      success: true,
      status: 201
    })
  } catch (error) {
    next(error)
  }
}

export async function getChecklists(req, res, next) {
  try {
    const checklists = await Checklist.find({});
    res.status(201).send({
      data: checklists,
      success: true,
      status: 201
    })
  } catch (error) {
    next(error)
  }
}