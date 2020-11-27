import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        providerId,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ providerId, date });
        await this.ormRepository.save(appointment);
        return appointment;
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date },
        });
        return findAppointment;
    }

    public async findAllInMonth({
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
                        `to_char(${dateFieldName}, 'DD-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });
        return findAppointments;
    }
}

export default AppointmentsRepository;
