export class EmployeeModel {
    Id: number;
    EmployeeCode: string;
    IdNumber: number;
    BiometricIdNumber: string;
    LastName: string;
    FirstName: string;
    MiddleName: string;
    ExtensionName: string;
    FullName: string;
    Address: string;
    ZipCode: string;
    ContactNumber: string;
    ContactMobileNumber: string;
    EmailAddress: string;
    DateOfBirth: Date;
    PlaceOfBirth: string;
    Sex: string;
    CivilStatus: string;
    Citizenship: string;
    Height: string;
    Weight: string;
    BloodType: string;
    Remarks: string;
    PictureURL: string;
    CompanyId: number;
    UserId: number;
    User: string;
    CreatedByUserId: number;
    CreatedByUser: string;
    CreatedDateTime: Date;
    UpdatedByUserId: number;
    UpdatedByUser: string;
    UpdatedDateTime: Date;
    IsLocked: boolean;
    EmployeePayroll: EmployeePayrollModel
    EmployeeHR: EmployeeHRModel
}

export class EmployeePayrollModel {
    Id: number;
    EmployeeId: number;
    PayrollGroup: string;
    PayrollType: string;
    MonthlyRate: string;
    DailyRate: string;
    HourlyRate: string;
    AbsentDailyRate: string;
    LateHourlyRate: string;
    UndertimeHourlyRate: string;
    OvertimeHourlyRate: string;
    NightDifferentialRate: string;
    SSSAddOnAmount: string;
    SSSComputationType: string;
    HDMFAddOnAmount: string;
    HDMFComputationType: string;
    TaxTable: string;
    TaxExemptionId: number;
    IsMinimumWageEarner: string;
    CostOfLivingAllowance: string;
    AdditionalAllowance: string;
    ATMAccountNumber: string;
}

export class EmployeeHRModel {
    Id: number;
    EmployeeId: number;
    DateHired: string;
    DateRegular: string;
    DateResigned: string;
    Branch: string;
    Division: string;
    Department: string;
    Position: string;
    DefaultShiftId: string;
}

