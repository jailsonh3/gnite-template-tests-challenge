import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { User } from "../../entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUserRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Show User Profile', () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository;
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it('should be able to show user profile with user_id', async () => {

    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty('id');

    const profile = await showUserProfileUseCase.execute(result.id as string)

    expect(profile).toBeInstanceOf(User);
    expect(profile.id).toEqual(result.id);
    expect(profile.name).toEqual(user.name);
    expect(profile.email).toEqual(user.email);
  })

  it('should not be able to show user profile with user_id', async () => {

    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty('id');

    await expect(async () => {
      await showUserProfileUseCase.execute('12983u1e98y9d32d3')
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  })
})
