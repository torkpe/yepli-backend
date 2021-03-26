import User from "./model";
import moment from "moment";
import {
  EntryExistError,
  EntryNotFoundError,
  AuthenticationError,
  encodeJwt,
  AuthorizationError,
  getContent,
} from "iyasunday";
import { sendMail } from "../../utils/mail";
import { generateAuthToken } from "../../utils/helpers";

export async function addUser(req, res, next) {
  try {
    const count = await User.countDocuments({
      email: req.body.email,
    });

    if (count) {
      throw new EntryExistError("Another user with this email already exists");
    }

    const user = await User.create(req.body);
    const mailOptions = {
      to: req.body.email,
      subject: "Welcome to 411 Salon",
      message: `Complete your registration with the link below
      Link: ${process.env.FRONTEND_URL}?token=${user.token.token}
      Please note that the registration link will only be valid for two hours
      `,
    };
    sendMail(mailOptions);
    return res.status(201).send({
      success: true,
      message:
        "Thanks for signing up. Please check your email to complete the registration process.",
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    })

    if (!user) {
      throw new EntryNotFoundError("Could not find this user");
    }

    // if (!user.isVerified) {
    //   throw new AuthorizationError("This account is yet to be verified");
    // }

    const passwordIsIncorrect = !user.comparePassword(req.body.password);

    if (passwordIsIncorrect) {
      throw new AuthenticationError("Incorrect password or email");
    }

    const token = await generateAuthToken(user);

    return res.status(200).send({
      success: true,
      message: "Successfully logged in",
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const user = await User.findOne({
      "token.token": req.query.cipher
    });

    if (!user) {
      throw new AuthorizationError("Looks like your link has expired");
    }

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          isVerified: true,
          token: null,
        },
      }
    );

    const token = await generateAuthToken(user);

    return res.status(200).send({
      success: true,
      message: "Successfully verified email.",
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function resendEmailVerificationLink(req, res, next) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      throw new AuthorizationError("Could not find this user");
    }

    const token = user.generateToken();

    await User.updateOne({
      token,
    });

    const mailOptions = {
      to: req.body.email,
      subject: "Welcome to Yepli",
      message: `Complete your registration with the link below
      Link: ${token}
      `,
    };

    sendMail(mailOptions);

    return res.status(200).send({
      success: true,
      message: "Email verification link has been resent",
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function socialLogin(req, res, next) {
  try {
    const response = await getContent({
      url: `https://graph.facebook.com/me?access_token=${req.body.accessToken}&fields=name,email`,
    });

    const user = await User.findOne({
      email: response.email,
    });

    let data = {
      userDetails: response,
      isRegistered: false
    }

    if (user) {
      const userToken = await generateAuthToken(user);
      data = {
        token: userToken,
        isRegistered: true
      }
    } else {
      throw new EntryNotFoundError('Looks like you haven\'t signed up with us yet.')
    }


    return res.status(200).send({
      ...data,
      status: 200,
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
