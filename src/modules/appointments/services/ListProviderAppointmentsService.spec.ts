import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list all provider appointments on a specific day ', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            providerId: 'provider-id',
            userId: 'user-id',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            providerId: 'provider-id',
            userId: 'user-id-2',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        const appointments = await listProviderAppointmentsService.execute({
            providerId: 'provider-id',
            year: 2020,
            month: 5,
            day: 20,
        });

        expect(appointments).toEqual(
            expect.arrayContaining([appointment1, appointment2]),
        );
    });
});
