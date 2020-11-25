import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('CreateUserService', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let authenticateUser: AuthenticateUserService;
    let createUser: CreateUserService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('it should be able to authenticate', async () => {
        const user = await createUser.execute({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });

        const response = await authenticateUser.execute({
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });
        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUser.execute({
                email: 'johndoe@example.com',
                password: '12312',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await createUser.execute({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });

        await expect(
            authenticateUser.execute({
                email: 'jhon_doe@gmail.com',
                password: 'wrongpassword',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
