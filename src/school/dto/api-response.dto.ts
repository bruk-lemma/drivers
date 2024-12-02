import { Expose } from 'class-transformer';

export class ApiResponseDto<T> {
  @Expose()
  data: T;

  @Expose()
  message: string;

  constructor(data: T, message: string) {
    this.data = data;
    this.message = message;
  }
}
