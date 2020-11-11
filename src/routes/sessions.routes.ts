import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Aki } = require('aki-api');

const region = 'pt';

const aki = new Aki(region);

const sessionsRouter = Router();

sessionsRouter.get('/', async (request, response) => {
    await aki.start();

    const { question, answers } = aki;
    return response.json({ question, answers });
});

sessionsRouter.post('/', async (request, response) => {
    const { email, password } = request.body;
    const authenticateUser = new AuthenticateUserService();
    const { user, token } = await authenticateUser.execute({
        email,
        password,
    });
    delete user.password;

    return response.json({ user, token });
});

export default sessionsRouter;
