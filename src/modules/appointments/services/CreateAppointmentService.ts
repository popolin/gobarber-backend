import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    userId: string;
    providerId: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        userId,
        providerId,
        date,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);
        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError('You cant create an appointment on a past date');
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            userId,
            providerId,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        if (userId === providerId) {
            throw new AppError("You can't create an appointment to yourself");
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                'You can only make an appointment between 8am and 17pm',
            );
        }

        const appointment = await this.appointmentsRepository.create({
            userId,
            providerId,
            date: appointmentDate,
        });

        const dateFormatted = format(
            appointment.date,
            "dd 'de' MMMM 'às' HH:mm'h' ",
        );

        await this.notificationsRepository.create({
            recipientId: providerId,
            content: `Novo agendamento para ${dateFormatted}`,
        });

        const cacheKey = `provider-appointments:${providerId}:${format(
            appointment.date,
            'yyyy-M-d',
        )}`;
        await this.cacheProvider.invalidate(cacheKey);

        return appointment;
    }
}

export default CreateAppointmentService;
