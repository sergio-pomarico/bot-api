/* eslint-disable @typescript-eslint/no-empty-function */
import { Router } from 'express';

export abstract class BaseRouter<T> {
  constructor(Controller: { new (): T }) {
    this.router = Router();
    this.controller = new Controller();
    this.routes();
  }
  public router: Router;
  public controller: T;

  routes() {}
}
