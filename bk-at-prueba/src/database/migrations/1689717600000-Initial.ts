import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Initial1689717600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear la tabla de eventos deportivos
        await queryRunner.createTable(
            new Table({
                name: 'sport_events',
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
                        name: 'home_team',
                        type: 'varchar',
                    },
                    {
                        name: 'away_team',
                        type: 'varchar',
                    },
                    {
                        name: 'event_date',
                        type: 'timestamp',
                    },
                    {
                        name: 'home_team_odds',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                        default: 1.00,
                    },
                    {
                        name: 'draw_odds',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                        default: 1.00,
                    },
                    {
                        name: 'away_team_odds',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                        default: 1.00,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'result',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'is_live',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'current_minute',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'home_team_score',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'away_team_score',
                        type: 'integer',
                        default: 0,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Crear enum para estado de eventos en vivo
        await queryRunner.query(`
            CREATE TYPE event_live_status AS ENUM (
                'NOT_STARTED',
                'FIRST_HALF',
                'HALF_TIME',
                'SECOND_HALF',
                'FINISHED',
                'CANCELLED',
                'POSTPONED'
            )
        `);

        // Agregar columna de estado en vivo
        await queryRunner.query(`
            ALTER TABLE sport_events
            ADD COLUMN live_status event_live_status DEFAULT 'NOT_STARTED'
        `);

        // Crear enum para estado de apuestas
        await queryRunner.query(`
            CREATE TYPE bet_status_enum AS ENUM (
                'PENDING',
                'WON',
                'LOST',
                'CASH_OUT',
                'REFUNDED'
            )
        `);

        // Crear tabla de apuestas
        await queryRunner.createTable(
            new Table({
                name: 'bets',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'sport_event_id',
                        type: 'uuid',
                    },
                    {
                        name: 'bet_type',
                        type: 'varchar',
                    },
                    {
                        name: 'amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'odds',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                    },
                    {
                        name: 'potential_win',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'bet_status_enum',
                        default: "'PENDING'",
                    },
                    {
                        name: 'cash_out_amount',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'cash_out_date',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'refund_reason',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'refund_date',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['sport_event_id'],
                        referencedTableName: 'sport_events',
                        referencedColumnNames: ['id'],
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('bets');
        await queryRunner.query('DROP TYPE bet_status_enum');
        await queryRunner.dropTable('sport_events');
        await queryRunner.query('DROP TYPE event_live_status');
    }
} 