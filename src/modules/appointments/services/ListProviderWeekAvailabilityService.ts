import { injectable, inject } from 'tsyringe';
import { isSameDay } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    providerId: string;
    month: number;
    year: number;
    day: number;
    period?: number;
}

type IResponse = Array<{
    day: Date;
    available: boolean;
}>;

@injectable()
class ListProviderWeekAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        providerId,
        year,
        month,
        day,
        period = 21,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInWeekFromProvider(
            {
                providerId,
                year,
                month,
                day,
                period,
            },
        );

        const startDate = new Date(year, month - 1, day, 0, 0, 0);
        const days = Array.from(
            {
                length: period,
            },
            (ignored, index) => index,
        );
        const availability = days.map(iDay => {
            const varDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + iDay,
            );
            const available = appointments.filter(app =>
                isSameDay(app.date, varDate),
            );
            return {
                day: varDate,
                available: available.length < 10,
            };
        });

        return availability;
    }
}

export default ListProviderWeekAvailabilityService;
