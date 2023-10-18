import express, { Application } from 'express';

export class Server {
  public app: Application = express();
  private readonly port: number;

  constructor(port: number) {
    this.port = port;
  }

  async start() {
    this.app.listen(this.port, () => {
      console.info(`🚀 server run on port ${this.port}`);
    });
  }
}
