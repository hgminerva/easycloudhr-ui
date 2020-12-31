export class PayrollOtherIncomeLineModel {
    Id: number;
    PIId: number;
    EmployeeId: number;
    Employee: string;
    OtherIncomeId: number;
    OtherIncome: string;
    Amount: string;
    Particulars: string;
}

export class PayrollOtherIncomeLines {
    PayrollOtherIncome: PayrollOtherIncomeLineModel;
    EmployeeList: any;
}