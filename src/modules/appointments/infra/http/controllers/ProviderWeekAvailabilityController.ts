import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderWeekAvailabilityService from '@modules/appointments/services/ListProviderWeekAvailabilityService';

export default class ProviderWeekAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { providerId } = request.params;
        const { month, year, day } = request.query;

        const listProvidersWeek = container.resolve(
            ListProviderWeekAvailabilityService,
        );
        const availability = await listProvidersWeek.execute({
            providerId,
            month: Number(month),
            year: Number(year),
            day: Number(day),
        });

        return response.json(availability);
    }
}
