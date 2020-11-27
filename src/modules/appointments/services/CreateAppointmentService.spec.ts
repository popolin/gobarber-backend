import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointmentService', () => {
    let fakeNotificationsRepository: FakeNotificationsRepository;
    let fakeAppointmentsRepository: FakeAppointmentsRepository;
    let createAppointmentService: CreateAppointmentService;

    beforeEach(() => {
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            userId: '111',
            providerId: '123123',
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.providerId).toBe('123123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 8).getTime();
        });

        const appointmentDate = new Date(2020, 4, 10, 11);
        await createAppointmentService.execute({
            date: appointmentDate,
            userId: '111',
            providerId: '123123',
        });
        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                userId: '111',
                providerId: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('it should not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 10),
                userId: '111',
                providerId: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('it should not be able to create an appointment with the same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 14),
                userId: '123123',
                providerId: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('it should not be able to create an appointment before 8am and after 17pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 9, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 7),
                userId: '1111',
                providerId: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 18),
                userId: '1111',
                providerId: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
