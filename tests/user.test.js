import supertest from "supertest";
import { web } from "../src/application/web.js";
import { removeUserTest, createUserTest } from "./test-util.js";
import { prismaClient } from "../src/application/database.js";

describe('POST /api/users', () => {
  afterEach(async () => {
    await prismaClient.user.delete({
      where: {
        username: 'medomeckz14',
      }
    })
  });

  it('should can register new user', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'medomeckz14',
        password: 'P_assword001',
        name: 'Albarra Zikrillah'
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe('medomeckz14');
    expect(result.body.data.name).toBe('Albarra Zikrillah');
    expect(result.body.data.password).toBeUndefined();
  });

  it('should reject if request is invalid', async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: '',
        password: '',
        name: ''
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should can register new user', async () => {
    let result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'medomeckz14',
        password: 'P_assword001',
        name: 'Albarra Zikrillah'
      });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe('medomeckz14');
    expect(result.body.data.name).toBe('Albarra Zikrillah');
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'medomeckz14',
        password: 'P_assword001',
        name: 'Albarra Zikrillah'
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});