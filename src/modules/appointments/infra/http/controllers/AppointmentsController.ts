import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const userId = request.user.id;
        const { providerId, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = container.resolve(CreateAppointmentService);
        const appointment = await createAppointment.execute({
            userId,
            providerId,
            date: parsedDate,
        });

        return response.json(appointment);
    }
}
