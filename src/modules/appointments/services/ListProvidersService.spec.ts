import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

describe('ListProvidersService', () => {
    let fakeUsersRepository: FakeUsersRepository;
    let fakeCacheProvider: FakeCacheProvider;
    let listProvidersService: ListProvidersService;

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvidersService = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });

    it('it should be able to list the providers', async () => {
        const userDoe = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhon_doe@gmail.com',
            password: '123123',
        });
        const userTree = await fakeUsersRepository.create({
            name: 'Jhon Tree',
            email: 'jhon_tree@gmail.com',
            password: '111111',
        });
        const userLogged = await fakeUsersRepository.create({
            name: 'Jhon Qua',
            email: 'jhon_qua@gmail.com',
            password: '111111',
        });
        const providers = await listProvidersService.execute({
            userId: userLogged.id,
        });
        expect(providers).toEqual([userDoe, userTree]);
    });
});
