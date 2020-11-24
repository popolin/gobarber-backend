import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointmentService', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
        const appointment = await createAppointmentService.execute({
            date: new Date(),
            providerId: '123123',
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.providerId).toBe('123123');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
        const appointmentDate = new Date(2020, 4, 10, 11);
        await createAppointmentService.execute({
            date: appointmentDate,
            providerId: '123123',
        });
        expect(
            createAppointmentService.execute({
                date: appointmentDate,
                providerId: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
