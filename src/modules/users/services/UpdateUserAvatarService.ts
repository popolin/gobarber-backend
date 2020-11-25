import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
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

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
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
            this.storageProvider.deleteFile(user.avatar);
        }
        const fileName = await this.storageProvider.saveFile(avatarFilename);
        user.avatar = fileName;
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
