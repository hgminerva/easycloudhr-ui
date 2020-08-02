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
    Username: string;
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
    PayrollRate: number;
    MonthlyRate: number;
    DailyRate: number;
    HourlyRate: number;
    AbsentDailyRate: number;
    LateHourlyRate: number;
    UndertimeHourlyRate: number;
    OvertimeHourlyRate: number;
    NightDifferentialRate: number;
    SSSAddOnAmount: number;
    SSSComputationType: string;
    HDMFAddOnAmount: number;
    HDMFComputationType: string;
    TaxTable: string;
    TaxExemptionId: number;
    IsMinimumWageEarner: boolean;
    CostOfLivingAllowance: number;
    AdditionalAllowance: number;
    ATMAccountNumber: string;
    SSSNumber: string;
    HDMFNumber: string;
    PHICNumber: string;
    TIN: string;
}

export class EmployeeHRModel {
    Id: number;
    EmployeeId: number;
    DateHired: Date;
    DateRegular: Date;
    DateResigned: Date;
    Branch: string;
    Division: string;
    Department: string;
    Position: string;
    DefaultShiftId: string;
}

