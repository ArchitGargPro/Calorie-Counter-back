import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class MealMigration1579696194572 implements MigrationInterface {

    private  static readonly table = new Table({
        name: 'meal_entity',
        columns: [],
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(MealMigration1579696194572.table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(MealMigration1579696194572.table);
    }

}
