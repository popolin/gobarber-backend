import {
    getRepository,
    Repository,
    Raw,
    Between,
    FindConditions,
} from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import IFindAllInWeekFromProviderDTO from '@modules/appointments/dtos/IFindAllInWeekFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        userId,
        providerId,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            userId,
            providerId,
            date,
        });
        await this.ormRepository.save(appointment);
        return appointment;
    }

    public async findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, providerId },
        });
        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        providerId,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');
        const findAppointments = await this.ormRepository.find({
            where: {
                providerId,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });
        return findAppointments;
    }

    public async findAllInWeekFromProvider({
        providerId,
        day,
        month,
        year,
        period,
    }: IFindAllInWeekFromProviderDTO): Promise<Appointment[]> {
        const startDate = new Date(year, month - 1, day, 0, 0, 0);
        const endDate = new Date(year, month - 1, day + period, 24, 59, 59);
        console.log(startDate);
        console.log(endDate);

        const findAppointments = await this.ormRepository.find({
            where: {
                providerId,
                date: Between<FindConditions<Date>>(startDate, endDate),
            },
            relations: ['user'],
        });
        console.log(findAppointments);
        return findAppointments;
    }

    public async findAllInDayFromProvider({
        providerId,
        day,
        month,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const findAppointments = await this.ormRepository.find({
            where: {
                providerId,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['user'],
        });
        return findAppointments;
    }
}

export default AppointmentsRepository;
