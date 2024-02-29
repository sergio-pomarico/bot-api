import express, { Application } from 'express';
import cors from 'cors';

import { AppRoutes } from './routes/main';

export class Server {
  public app: Application = express();
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/api', AppRoutes.routes);
  }

  async start() {
    this.app.listen(this.port, () => {
      console.info(`🚀 server run on port ${this.port}`);
    });
  }
}
