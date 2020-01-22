import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserMigration1579696183731 implements MigrationInterface {

    private  static readonly table = new Table({
        name: 'meal_entity',
        columns: [],
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(UserMigration1579696183731.table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(UserMigration1579696183731.table);
    }

}
