import { JsonWebTokenError } from 'jsonwebtoken';
import { errorMessage } from 'iyasunday';
import { ERROR } from './constants';

export function errorHandler(err, res) {
  console.log(err, '=====>>>###')
  let status = err.httpStatusCode
    ? err.httpStatusCode
    : err.status
    ? err.status
    : 500;
  if (err) {
    let message;
    if (err.errors && err.errors[0] && err.errors[0].messages[0]) {
      message = err.errors[0].messages[0];
    } else if (err.message) {
      message = err.message;
    } else if (typeof err === 'string') {
      message = err;
    } else {
      message = 'Something went wrong';
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Maximum file size should not exceed 1MB';
    }
    if (err instanceof JsonWebTokenError) {
      status = 401;
    }

    const error = err.error
      ? typeof err.error === 'string'
        ? err.error
        : err.error.error
        ? err.error.error
        : ERROR.VALIDATION_ERROR
      : ERROR.VALIDATION_ERROR;
    res.status(status).json(errorMessage(message, error));
  }
}
