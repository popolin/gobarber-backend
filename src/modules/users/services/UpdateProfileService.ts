import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
    userId: string;
    name: string;
    email: string;
    password?: string;
    oldPassword?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        userId,
        name,
        email,
        password,
        oldPassword,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found');
        }
        const anotherUserWithThatEmail = await this.usersRepository.findByEmail(
            email,
        );
        if (
            anotherUserWithThatEmail &&
            anotherUserWithThatEmail.id !== user.id
        ) {
            throw new AppError('Email already in use');
        }
        user.name = name;
        user.email = email;

        if (password && !oldPassword) {
            throw new AppError(
                'You need to inform the old password to change it',
            );
        }

        if (password && oldPassword) {
            const checkOldPassword = await this.hashProvider.compareHash(
                oldPassword,
                user.password,
            );
            if (!checkOldPassword) {
                throw new AppError('Old password does not match');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
