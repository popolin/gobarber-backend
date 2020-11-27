import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the month availability from provider', async () => {
        // Carrega todos os horários de um dia:
        const hours = Array.from({ length: 10 }, (ignored, index) => index + 8);
        Promise.all(
            hours.map(async hour => {
                await fakeAppointmentsRepository.create({
                    providerId: 'user',
                    date: new Date(2020, 4, 20, hour, 0, 0),
                });
            }),
        );

        await fakeAppointmentsRepository.create({
            providerId: 'user',
            date: new Date(2020, 4, 21, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailability.execute({
            providerId: 'user',
            year: 2020,
            month: 5,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
