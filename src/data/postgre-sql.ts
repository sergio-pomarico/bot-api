import { DataSource, DataSourceOptions } from 'typeorm';

interface Options {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export abstract class PostgreSQLDatabase {
  static async connect(options: Options): Promise<void> {
    try {
      const config = this.databaseConfig(options);
      const posgresDataSource = new DataSource(config);
      await posgresDataSource.initialize();
      console.log('📚 PostgreSQL connected');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('💥 error: ', error);
        throw Error(error.message);
      }
    }
  }
  static databaseConfig(options: Options): DataSourceOptions {
    return {
      type: 'postgres',
      host: options.host,
      port: options.port,
      username: options.username,
      password: options.password,
      database: options.name,
      synchronize: true,
      logging: true,
      //entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };
  }
}
