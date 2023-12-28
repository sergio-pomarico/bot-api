import { CreateCategoryUseCase } from '@application/usecases/category/create';
import { CategoryDTO } from '@domain/dtos';
import { CustomHTTPError } from '@domain/errors/custom';
import { Request, Response } from 'express';

export class CategoryController {
  constructor(private readonly createCategory: CreateCategoryUseCase) {}
  handlerError = (error: unknown, res: Response) => {
    if (error instanceof CustomHTTPError) {
      return res.status(error.httpCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  };
  create = async (req: Request, res: Response) => {
    const [error, categoryDTO] = CategoryDTO.create(req.body);
    this.createCategory
      .run(categoryDTO!)
      .then((response) => {
        return res.status(200).json({ ...response });
      })
      .catch((error) => this.handlerError(error, res));
    if (error) return res.status(400).json({ error });
  };
}
