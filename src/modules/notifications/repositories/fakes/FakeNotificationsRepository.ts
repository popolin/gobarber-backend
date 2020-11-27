import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class FakeNotificationsRepository implements INotificationsRepository {
    private notifications: Notification[] = [];

    public async create({
        content,
        recipientId,
    }: ICreateNotificationDTO): Promise<Notification> {
        const nootification = new Notification();
        Object.assign(Notification, {
            id: new ObjectID(),
            content,
            recipientId,
        });
        this.notifications.push(nootification);

        return nootification;
    }
}

export default FakeNotificationsRepository;
