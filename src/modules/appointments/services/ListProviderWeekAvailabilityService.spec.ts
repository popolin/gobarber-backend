import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderWeekAvailabilityService from './ListProviderWeekAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderWeekAvailabilityService: ListProviderWeekAvailabilityService;

describe('ListProviderWeekAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderWeekAvailabilityService = new ListProviderWeekAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to list the weekly availability from provider', async () => {
        const hours = Array.from(
            {
                length: 10,
            },
            (ignored, index) => index + 8,
        );

        await Promise.all(
            hours.map(async hour => {
                const data = new Date(2020, 4, 21, hour, 0, 0);
                await fakeAppointmentsRepository.create({
                    providerId: 'user',
                    userId: '111',
                    date: data,
                });
            }),
        );

        const availability = await listProviderWeekAvailabilityService.execute({
            providerId: 'user',
            year: 2020,
            month: 5,
            day: 20,
        });
        const availabes = availability.filter(av => av.available);

        expect(availabes.length).toBe(20);
    });
});
