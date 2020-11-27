import { getRepository, Not, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async create({
        name,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create({
            name,
            email,
            password,
        });
        await this.ormRepository.save(user);
        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }

    public async findById(id: string): Promise<User | undefined> {
        const findUser = await this.ormRepository.findOne(id);
        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = await this.ormRepository.findOne({
            where: { email },
        });
        return findUser;
    }

    public async findAllProviders({
        exceptUserId,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let users: User[];
        if (exceptUserId) {
            users = await this.ormRepository.find({
                where: { id: Not(exceptUserId) },
            });
        } else {
            users = await this.ormRepository.find();
        }

        return users;
    }
}

export default UsersRepository;
