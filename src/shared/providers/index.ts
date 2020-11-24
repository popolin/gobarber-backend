import { container } from 'tsyringe';

import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import DiskStorageProvider from '@shared/providers/StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
);
