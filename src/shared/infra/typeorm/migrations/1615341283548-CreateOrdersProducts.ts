import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateOrdersProducts1615341283548 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'orders_products',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'product_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        scale: 2,
                        precision: 5,
                        isNullable: true
                    },
                    {
                        name: 'quantity',
                        type: 'integer',
                        default: 0,
                        isNullable: true
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        );
        await queryRunner.createForeignKey('orders_products', new TableForeignKey({
            name: 'OrdersProductsOrder',
            columnNames: ['order_id'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        }));
        await queryRunner.createForeignKey('orders_products', new TableForeignKey({
            name: 'OrdersProductsProduct',
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('orders_products', 'OrdersProductsOrder');
        await queryRunner.dropForeignKey('orders_products', 'OrdersProductsProduct');
        await queryRunner.dropTable('orders_products');
    }
    
}
