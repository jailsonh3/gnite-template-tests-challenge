import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create a new Statement', () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it('should not be able to create a new statement if not exist user', async () => {
    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

    await createUserUseCase.execute(user);

    await expect(async () => {
      await createStatementUseCase.execute({
        user_id: '28732167712638',
        type: 'withdraw',
        amount: 10,
        description: 'test created statement'
      } as ICreateStatementDTO)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)

  })

  it('should be able to create a new statement', async () => {
    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

    const result = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      user_id: result.id,
      type: 'deposit',
      amount: 100,
      description: 'test created statement'
    } as ICreateStatementDTO)

    expect(statement).toHaveProperty('id');

  })

  it('should not be able to create a new statement if balance less than amount', async () => {
    const user: ICreateUserDTO = {
      name: 'Jailson',
      email: 'jailsonh2@gmail.com',
      password: '123456',
    }

    const result = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id: result.id,
      type: 'deposit',
      amount: 100,
      description: 'test created statement'
    } as ICreateStatementDTO)

    await expect(async () => {
      await createStatementUseCase.execute({
        user_id: result.id,
        type: 'withdraw',
        amount: 200,
        description: 'test created statement'
      } as ICreateStatementDTO)
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)

  })

})
