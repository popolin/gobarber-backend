import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

describe('ShowProfile', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let showProfileService: ShowProfileService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    it('should be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });
        const profile = await showProfileService.execute({
            userId: user.id,
        });
        expect(profile.name).toBe('Jhon Doe');
        expect(profile.email).toBe('jhon_doe@gmail.com');
    });

    it('should not be able to show the profile from non-existing user', async () => {
        await expect(
            showProfileService.execute({
                userId: 'non-existing-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
