import { prismaClient } from "../src/application/database.js";

export const createUserTest = async () => {
  await prismaClient.user.create({
    data: {
      username: 'test',
      password: 'rahasia',
      name: 'test',
      token: 'test'
    }
  });
}

export const removeUserTest = async () => {
  await prismaClient.user.delete({
    where: {
      username: 'test',
    }
  });
};