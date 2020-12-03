import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInWeekFromProviderDTO from '@modules/appointments/dtos/IFindAllInWeekFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(
        date: Date,
        providerId: string,
    ): Promise<Appointment | undefined>;
    findAllInMonthFromProvider(
        data: IFindAllInMonthFromProviderDTO,
    ): Promise<Appointment[]>;
    findAllInWeekFromProvider(
        data: IFindAllInWeekFromProviderDTO,
    ): Promise<Appointment[]>;
    findAllInDayFromProvider(
        data: IFindAllInDayFromProviderDTO,
    ): Promise<Appointment[]>;
}

export default IAppointmentsRepository;
