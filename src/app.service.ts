import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async validateUserPermission() {
    // Check if the user has the required permission
  }
}

//curl -i -X POST http://localhost:8001/services/coffee-service/plugins  --data "config.claims_to_verify=exp" --data "config.key_claim_name=roles" --data name=jwt
