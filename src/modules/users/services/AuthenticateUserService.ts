import { compare } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import authConfig from '@config/auth';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        console.log({ email, password });
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Incorrent email/password combination.', 401);
        }
        console.log(2);

        const passwordMatched = await this.hashProvider.compareHash(
            password,
            user.password,
        );
        console.log(3);
        if (!passwordMatched) {
            throw new AppError('Incorrent email/password combination.', 401);
        }
        console.log(4);
        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        console.log(5);
        return { user, token };
    }
}

export default AuthenticateUserService;
