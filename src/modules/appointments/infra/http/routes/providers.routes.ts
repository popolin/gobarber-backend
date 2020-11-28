import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const providersRouter = Router();
const providersController = new ProvidersController();
const monthProvidersController = new ProviderMonthAvailabilityController();
const dayProvidersController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
    '/:providerId/month_availability',
    celebrate({
        [Segments.PARAMS]: {
            providerId: Joi.string().uuid().required,
        },
    }),
    monthProvidersController.index,
);
providersRouter.get(
    '/:providerId/day_availability',
    celebrate({
        [Segments.PARAMS]: {
            providerId: Joi.string().uuid().required,
        },
    }),
    dayProvidersController.index,
);

export default providersRouter;
