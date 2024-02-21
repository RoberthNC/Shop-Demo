import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor() {}
  private readonly logger = new Logger('Bootstrap');

  log(message: any) {
    this.logger.log(message);
  }
}
