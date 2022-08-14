import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe('Get Balance User', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('Should be able to get balance statement user', async () => {
    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

    const result = await createUserUseCase.execute(user);

    const balance = await getBalanceUseCase.execute({
      user_id: result.id as string,
    });

    expect(balance.statement).toBeInstanceOf(Array);
    expect(typeof balance.balance).toEqual('number')

  })

  it('Should not be able to get balance statement id user already exist', async () => {

    await expect(async () => {
      await getBalanceUseCase.execute({
        user_id: 'idho2hd8ey38hd3',
      });
    }).rejects.toBeInstanceOf(GetBalanceError);

  })
})
