import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    // Validar token JWT

    const authHeader = request.headers.authorization;
    if (!authHeader) {
        throw new AppError('JWT token is missing', 401);
    }
    // Valor do token é 'Bearer lfdkjdhf23492472394'
    // A linha abaixo dá um split e pega apenas o valor do 2o índice do array:
    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);
        const { sub } = decoded as ITokenPayload;
        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new AppError('Invalid JWT token', 401);
    }
}
