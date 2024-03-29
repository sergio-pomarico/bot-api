import { DataSource, DataSourceOptions } from 'typeorm';
import { env } from '@shared/utils';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  ssl: boolean;
}

export class PostgreSQLDatabase {
  constructor(private readonly options: Options) {
    this.config = this.databaseConfig(this.options);
    this.datasource = new DataSource(this.config);
  }

  public datasource: DataSource;
  private config: DataSourceOptions;

  async connect(): Promise<void> {
    try {
      await this.datasource.initialize();
      console.info('📚 PostgreSQL connected');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('💥 error: ', error);
        throw Error(error.message);
      }
    }
    return;
  }

  databaseConfig(options: Options): DataSourceOptions {
    return {
      type: 'postgres',
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.name,
      synchronize: true,
      logging: false,
      ssl: options.ssl,
      entities: [__dirname + '/models/*.model{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    };
  }
}

export const postgreSQLDatabase = new PostgreSQLDatabase(env.database);
export const datasource: DataSource = postgreSQLDatabase.datasource;
