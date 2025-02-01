import { Department, Employee, Task } from '../model';
import { TraversalContext } from './traversal.type';

export interface Visitor<T extends TraversalContext = TraversalContext> {
  visitDepartment?: (department: Department, context: Readonly<T>) => void;
  visitEmployee?: (employee: Employee, context: Readonly<T>) => void;
  visitTask?: (task: Task, context: Readonly<T>) => void;
}
