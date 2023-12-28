import { z } from 'zod';

import { CategoryEntity } from '../entities';

const categoryDTOValidator = z.object({
  title: z.string().min(3),
});

export default class CategoryDTO {
  private constructor(public title: string) {}

  static create(data: { [key in keyof CategoryEntity]: string }): [
    Error?,
    CategoryDTO?,
  ] {
    const result = categoryDTOValidator.safeParse(data);
    if (!result.success) return [result.error, undefined];
    return [undefined, new CategoryDTO(data.title!)];
  }
}
