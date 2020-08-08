export class ShiftLineModel {
    Id: number;
    ShiftId: number;
    ShiftDate: Date;
    TimeIn1: string;
    TimeOut1: string;
    TimeIn2: string;
    TimeOut2: string;
    IsRestDay: boolean;
    TotalNumberOfHours: number;
    NightDifferentialHours: number;
    IsFlexible: boolean;
    FixibilityHoursLimit: number;
    Remarks: string;
}