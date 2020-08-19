export class LoanModel {
    Id: number;
    LNNumber: string;
    LDDate: Date;
    EmployeeId: number;
    Employee: string;
    OtherDeductionId: number;
    DocRef: string;
    Amortization: string;
    Remarks: string;
    LoanAmount: string;
    PaidAmount: string;
    BalanceAmount: string;
    Status: string;
    PreparedByUserId: number;
    CheckedByUserId: number;
    ApprovedByUserId: number;
    CreatedByUserId: number;
    CreatedByUser: string;
    CreatedDateTime: string;
    UpdatedByUserId: number;
    UpdatedByUser: string;
    UpdatedDateTime: string;
    IsLocked: boolean;
}