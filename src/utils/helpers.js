import CloudinaryStorage from 'multer-storage-cloudinary';
import multer from 'multer';
import {
  encodeJwt,
} from "iyasunday";

const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'hellobooks', 
  api_key: '521381859673832', 
  api_secret: '8c060McBdeyZClXXNfNgpG8QqXU'
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'yepli',
    public_id: (req, file) => Date.now(),
  },
});

const allowedFormat = ['jpeg', 'jpg', 'png', 'gif', 'pdf', 'xls', 'xlsx', 'doc', 'docx'];
const fileFilter = (req, file, cb) => {
  const fileFormat = file.originalname
    .split('.')
    .pop()
    .toLowerCase();
  if (allowedFormat.includes(fileFormat)) {
    return cb(null, true);
  } else {
    return cb(
      `File format not allowed, allowed formats are: ${allowedFormat.join(
        ', '
      )}`
    );
  }
};

export const upload = multer({ storage: storage, limits: {
  fileSize: 1048576,
}, fileFilter });

export const validateEmail = (email) => {
  let emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return emailRegex.test(String(email).toLowerCase());
}

export async function generateAuthToken(user) {
  const token = await encodeJwt({
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image ? user.image : '',
    },
    secreteKey: process.env.APP_KEY
  });
  return token;
}
