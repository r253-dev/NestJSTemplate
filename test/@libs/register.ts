import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { AdministratorModel } from 'share/models/administrator.model';

export async function registerAdminDirectly(email: string, password: string) {
  let passwordHash = '';
  if (password === 'password') {
    passwordHash = '$2b$10$gXma497mgORuUxk52mcIVusd7W2HCJK3RoMTnOam30m5.rXh4whbK';
  } else {
    passwordHash = bcrypt.hashSync(password, 10);
  }
  await AdministratorModel.create({
    uuid: v4(),
    email,
    passwordHash,
    createdAt: new Date(),
  });
}
