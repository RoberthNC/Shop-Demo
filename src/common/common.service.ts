import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor() {}
  private readonly logger = new Logger('Bootstrap');

  error(message: any) {
    this.logger.error(message);
  }
}
