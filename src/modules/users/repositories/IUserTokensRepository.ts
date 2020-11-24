import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
    generate(userId: string): Promise<UserToken>;
}
