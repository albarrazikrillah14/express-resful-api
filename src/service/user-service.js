import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { registerUserValidation, loginUserValidation, getUserValidation } from '../validation/user-validation.js';
import { validate } from "../validation/validation.js";
import bcrypt from 'bcrypt';
import { v4  as uuid} from "uuid";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    }
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    }
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);
  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      password: true,
    }
  });

  if (!user) {
    throw new ResponseError(401, "username or password wrong");
  }

  const isMatch = bcrypt.compare(loginRequest.password, user.password);

  if (!isMatch) {
    throw new ResponseError(401, "username atau password salah");
  }

  const token = uuid().toString();
  return await prismaClient.user.update({
    data: {
      token: token
    },
    where: {
      username: loginRequest.username,
    },
    select: {
      token: true,
    }
  });
}

const get = async (username) => {
  const result = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: result,
    },
    select: {
      username: true,
      name: true,
    }
  });

  if (!user) {
    throw new ResponseError(404, 'user is not found');
  }

  return user;
}

export default { register, login, get };