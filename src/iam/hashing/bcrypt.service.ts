import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return await hash(data, salt);
  }
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await compare(data, encrypted);
  }
}
