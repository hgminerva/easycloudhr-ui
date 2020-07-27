export class UserModel {
    Id: number;
    UserName: string;
    Password: string;
    ConfirmPassword: string;
    FullName: string;
    CreatedByUserId: number;
    CreatedByUser: string;
    CreatedDateTime: Date;
    UpdatedByUserId: number;
    UpdatedByUser: string;
    UpdatedDateTime: Date;
    IsLocked: boolean;
}