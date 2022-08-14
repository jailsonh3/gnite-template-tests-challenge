import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create a new User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to create a new user', async () => {

    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty('id');

  })

  it('should not be able to create a user with email already exist', async () => {

    await expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Jailson',
        email: 'jailsonh2@gmail.com',
        password: '123456',
      }

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);

    }).rejects.toBeInstanceOf(CreateUserError);

  })

  it('should be able to create a user with password encrypted', async () => {

    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

    const result = await createUserUseCase.execute(user);

    const verifyPassword = await compare(user.password, result.password);

    expect(verifyPassword).toEqual(true);

  });
})
