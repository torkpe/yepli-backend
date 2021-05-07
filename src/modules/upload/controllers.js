import cloudinary from 'cloudinary';


export async function uploadPhoto(req, res, next) {
  try {
    res.status(200).send({
      data: req.file.path,
      success: true,
      message: 'Successfully uploaded file'
    });
  } catch (error) {
    next(error);
  }
}
