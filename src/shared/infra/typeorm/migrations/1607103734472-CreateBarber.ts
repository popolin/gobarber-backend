import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateBarber1607103734472 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'barbers',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'logo',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'address',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'address_state',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'address_city',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'address_county',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'address_zip',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'theme',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'from_time',
                        type: 'integer',
                        default: 8,
                    },
                    {
                        name: 'to_time',
                        type: 'integer',
                        default: 20,
                    },
                    {
                        name: 'saturday',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'from_time_saturday',
                        type: 'integer',
                        default: 8,
                    },
                    {
                        name: 'to_time_saturday',
                        type: 'integer',
                        default: 14,
                    },
                    {
                        name: 'sunday',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
        await queryRunner.createTable(
            new Table({
                name: 'barbers_users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'rule',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'barber_id',
                        type: 'uuid',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'BarberUserUser',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['user_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'BarberUserBarber',
                        referencedTableName: 'barbers',
                        referencedColumnNames: ['id'],
                        columnNames: ['barber_id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('barbers_users');
        await queryRunner.dropTable('barbers');
    }
}
