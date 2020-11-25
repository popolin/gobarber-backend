import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

describe('UpdateProfile', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeHashProvider: FakeHashProvider;
    let updateProfileService: UpdateProfileService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });
        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'Jhon Tre',
            email: 'jhontre@gmail.com',
        });
        expect(updatedUser.name).toBe('Jhon Tre');
        expect(updatedUser.email).toBe('jhontre@gmail.com');
    });

    it('should not be able to change another user email', async () => {
        await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });
        const user = await fakeUsersRepository.create({
            name: 'Teste',
            email: 'teste@example.com',
            password: '123123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Jhon Tre',
                email: 'jhon_doe@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'Jhon Tre',
            email: 'jhon_doe@gmail.com',
            password: '111111',
            oldPassword: '123123',
        });

        expect(updatedUser.password).toBe('111111');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Jhon Tre',
                email: 'jhon_doe@gmail.com',
                password: '111111',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Jhon Tre',
                email: 'jhon_doe@gmail.com',
                password: '111111',
                oldPassword: '111111',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update an no-existing user', async () => {
        await expect(
            updateProfileService.execute({
                userId: 'non-existing-id',
                name: 'Jhon Tre',
                email: 'jhon_doe@gmail.com',
                password: '111111',
                oldPassword: '111111',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
