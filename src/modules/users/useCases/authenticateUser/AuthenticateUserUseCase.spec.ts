import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticated User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it('should be able to user authecticated token', async () => {
    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

   await createUserUseCase.execute(user);

   const result = await authenticateUserUseCase.execute({
      email: 'jailsonh2@gmail.com',
      password: '123456'
   })

    expect(result).toHaveProperty('token');
    expect(result.user).toHaveProperty('id');
  })

  it('should not be able to user email authecticated', async () => {
    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

   await createUserUseCase.execute(user);

   await expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'jailsonh5@gmail.com',
        password: '123456'
      })
   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to user email authecticated', async () => {
    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

   await createUserUseCase.execute(user);

   await expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'jailsonh5@gmail.com',
        password: '123456'
      })
   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to user password authecticated', async () => {
    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

   await createUserUseCase.execute(user);

   await expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'jailsonh2@gmail.com',
        password: '555555'
      })
   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
