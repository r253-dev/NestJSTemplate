import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  /**
   * パスワードをハッシュ化する
   * @param password パスワード
   * @param saltLength ソルトの長さ
   * @returns ハッシュ化されたパスワード
   */
  async hash(password: string, saltLength: number): Promise<string> {
    return await bcrypt.hash(password, saltLength);
  }

  /**
   * パスワードの検証
   * @param password パスワード
   * @param hash ハッシュ化されたパスワード
   * @returns YES/NO
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
