import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Get Statement Operation', () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able get statement operation', async () => {
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


    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: result.id as string,
      statement_id: statement.id as string
    });

    expect(statementOperation).toHaveProperty('id');

  });

  it('should not be able get statement operation when user_id not found', async () => {
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

    await expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: '3n29r84293f9h4948',
        statement_id: statement.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)

  })

  it('should not be able get statement operation when statement_id not found', async () => {
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
      await getStatementOperationUseCase.execute({
        user_id: result.id as string,
        statement_id: '3hnr98y2983hfd293'
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)

  })

})
