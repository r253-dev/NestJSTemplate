export enum Role {
  /** 全ての権限がある。システム上の全ての操作を行うことが出来る */
  SUPER_ADMIN = 'super_admin',
  /** 一般システム管理者。システム管理を行うことが出来る */
  ADMIN = 'admin',
  /** 管理ユーザー */
  MANAGER = 'manager',
  /** 一般ユーザー。 */
  USER = 'user',
  /** 請求管理者。このロールに対しては課金されない */
  BILLING_ADMIN = 'billing_admin',
}
