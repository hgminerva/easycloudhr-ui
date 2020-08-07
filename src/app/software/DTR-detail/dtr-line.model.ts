import { DTRModel } from './dtr-detial.model';

export class DTRLineModel {
    Id: number;
    DTRId: number;
    EmployeeId: number;
    Employee: string;
    DTRDate: Date;
    DateType: string;
    IsRestDay: boolean;
    ShiftId: number;
    Shift: string;
    Branch: string;
    TimeIn1: string;
    TimeOut1: string;
    TimeIn2: string;
    TimeOut2: string;
    IsOnLeave: boolean;
    IsOnLeaveHalfDay: boolean;
    IsOnOfficialBusiness: boolean;
    IsOnOfficialBusinessHalfDay: boolean;
    IsAbsent: boolean;
    IsAbsentHalfDay: boolean;
    NumberOfHoursWorked: string;
    OvertimeHours: string;
    NightDifferentialHours: string;
    LateHours: string;
    UndertimeHours: string;
    DailyPay: string;
    RestdayPay: string;
    HolidayPay: string;
    OvertimePay: string;
    NightDifferentialPay: string;
    LateDeduction: string;
    UndertimeDeduction: string;
    AbsentDeduction: string;
    DailyNetPay: string;
    Remarks: string;
}

export class DTRLines{
    DailyTimeRecordModel: DTRModel;
    EmployeeList: any;
    UseEmployeeDefaultShift: boolean;
    StartDate: Date;
    EndDate: Date;
    TimeIn1: string;
    TimeOut1: string;
    TimeIn2: string;
    TimeOut2: string;
}


