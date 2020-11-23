import { injectable, inject } from 'tsyringe';
import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
    userId: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new AppError(
                'Only authenticated user can change the avatar.',
                401,
            );
        }
        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );
            if (userAvatarFileExists) {
                fs.promises.unlink(userAvatarFilePath);
            }
        }
        user.avatar = avatarFilename;
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
