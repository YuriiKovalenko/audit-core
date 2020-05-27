import { Injectable } from '@nestjs/common';
import { generate, verify } from 'password-hash';

@Injectable()
export class HashService {
  public generate(password: string) {
    return generate(password, { algorithm: 'sha256' });
  }

  public verify(plainPassword: string, hashedPassword: string) {
    return verify(plainPassword, hashedPassword);
  }
}
