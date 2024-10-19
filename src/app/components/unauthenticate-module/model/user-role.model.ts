export interface UserRoleModel {
  id: number;
  title: string;
  code: string;
  note?: string;
  order: number;
  userCreated: number;
  isNotAllowDelete: boolean;
}

export interface UserRoleTableModel extends UserRoleModel {}

export class UserRoleHelper {
  static toModel(item: any): UserRoleModel {
    return {
      id: item.id,
      title: item.title,
      code: item.code,
      note: item.note,
      order: item.order,
      userCreated: item.userCreated,
      isNotAllowDelete: item.isNotAllowDelete,
    };
  }

  static toTableModel(item: UserRoleModel): UserRoleTableModel {
    return {
      id: item.id,
      title: item.title,
      code: item.code,
      note: item.note,
      order: item.order,
      userCreated: item.userCreated,
      isNotAllowDelete: item.isNotAllowDelete,
    };
  }
}
