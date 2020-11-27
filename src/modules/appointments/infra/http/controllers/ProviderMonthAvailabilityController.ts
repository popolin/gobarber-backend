import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        console.log('AQUI');
        const { providerId } = request.params;
        const { month, year } = request.body;

        const listProvidersMonth = container.resolve(
            ListProviderMonthAvailabilityService,
        );
        const availability = await listProvidersMonth.execute({
            providerId,
            month,
            year,
        });
        console.log(availability);

        return response.json(availability);
    }
}
