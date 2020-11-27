import { injectable, inject } from 'tsyringe';

import Appointments from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    providerId: string;
    month: number;
    year: number;
    day: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        providerId,
        year,
        month,
        day,
    }: IRequest): Promise<Appointments[]> {
        const appointments = this.appointmentsRepository.findAllInDayFromProvider(
            {
                providerId,
                year,
                month,
                day,
            },
        );

        return appointments;
    }
}

export default ListProviderAppointmentsService;
