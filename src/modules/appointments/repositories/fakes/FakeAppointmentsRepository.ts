import { v4 } from 'uuid';
import {
    isEqual,
    getMonth,
    getYear,
    getDate,
    isAfter,
    isBefore,
} from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInWeekFromProviderDTO from '@modules/appointments/dtos/IFindAllInWeekFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async create({
        userId,
        providerId,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        // Object.assign pra carregar o objeto (mais elegante):
        Object.assign(appointment, { id: v4(), date, userId, providerId });
        // appointment.id = v4();
        // appointment.providerId = providerId;
        // appointment.date = date;
        this.appointments.push(appointment);
        return appointment;
    }

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            appointment =>
                isEqual(appointment.date, date) &&
                appointment.providerId === providerId,
        );
        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.providerId === providerId &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });

        return appointments;
    }

    public async findAllInWeekFromProvider({
        providerId,
        month,
        year,
        day,
        period,
    }: IFindAllInWeekFromProviderDTO): Promise<Appointment[]> {
        const startDate = new Date(year, month - 1, day, 0, 0, 0);
        const endDate = new Date(year, month - 1, day + period, 23, 59, 59);

        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.providerId === providerId &&
                isAfter(appointment.date, startDate) &&
                isBefore(appointment.date, endDate)
            );
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        providerId,
        day,
        month,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment => {
            return (
                appointment.providerId === providerId &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });

        return appointments;
    }
}

export default AppointmentsRepository;
