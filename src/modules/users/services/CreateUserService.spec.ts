import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let fakeCacheProvider: FakeCacheProvider;
    let createUserService: CreateUserService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });
        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with an already registered email', async () => {
        await createUserService.execute({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });

        await expect(
            createUserService.execute({
                name: 'Jhon Doe',
                email: 'jhon_doe@gmail.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
