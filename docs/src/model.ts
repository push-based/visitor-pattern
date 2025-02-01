export type UnitType = 'department' | 'employee';
export type EmployeeRole =
  | 'C' // Manager
  | 'B' // Supervisor
  | 'A' // Worker;
  | 'X'; // Subcontractor;

export interface UnitBase {
  type: UnitType;
  name: string;
}

export interface Department extends UnitBase {
  type: 'department';
  children: Unit[];
}

export interface Task {
  id: number;
  duration: number;
}

export interface Employee extends UnitBase {
  type: 'employee';
  role: EmployeeRole;
  tasks: Task[];
}

export type Unit = Department | Employee;
