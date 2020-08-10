export class LeaveApplicationModel {
    Id: number;
    LANumber: string;
    LADate: Date;
    PayrollGroup: string;
    YearId: number;
    Year: string;
    Remarks: string;
    PreparedByUserId: number;
    CheckedByUserId: number;
    ApprovedByUserId: number;
    CreatedByUserId: number;
    CreatedByUser: string;
    CreatedDateTime: Date;
    UpdatedByUserId: number;
    UpdatedByUser: string;
    UpdatedDateTime: Date;
    IsLocked: boolean;
}