import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('it should be able recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@gmail.com',
            password: '123123',
        });

        await sendForgotPasswordEmail.execute({
            email: 'jhondoe@gmail.com',
        });
        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able recover a non existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'jhon_doe@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@gmail.com',
            password: '123123',
        });

        await sendForgotPasswordEmail.execute({
            email: 'jhondoe@gmail.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
