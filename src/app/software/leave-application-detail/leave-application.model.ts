export class LeaveApplicationModel {
    Id: number;
    LANumber: string;
    LADate: string;
    PayrollGroup: string;
    YearId: number;
    Year: string;
    Remarks: string;
    PreparedByUserId: number;
    PreparedByUser: string;
    CheckedByUserId: number;
    CheckedByUser: string;
    ApprovedByUserId: number;
    ApprovedByUser: string;
    CreatedByUserId: number;
    CreatedByUser: string;
    CreatedDateTime: Date;
    UpdatedByUserId: number;
    UpdatedByUser: string;
    UpdatedDateTime: Date;
    IsLocked: boolean;
}