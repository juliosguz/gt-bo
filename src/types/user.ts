export interface UserDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
  roles?: string[];
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  picture?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  picture?: string;
}
