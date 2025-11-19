export interface PolicyHandler {
  handle(user: any): boolean;
}

export class AdminPolicy implements PolicyHandler {
  handle(user: any): boolean {
    return !!user?.isAdmin;
  }
}
