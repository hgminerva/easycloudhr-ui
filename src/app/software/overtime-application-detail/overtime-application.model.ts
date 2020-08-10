export class OvertimeApplicationModel {
    Id: number;
    OTNumber: string;
    OTDate: Date;
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