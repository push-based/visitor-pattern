import { Unit } from '../model';
import { Visitor } from './visitor';
import { TraversalContext } from './traversal.type';

function updatedContext<T extends TraversalContext>(
  parentContext: T,
  index: number,
  totalChildren: number
): T {
  return {
    ...parentContext,
    level: parentContext.level + 1,
    last: index === totalChildren - 1,
  };
}

export function visitAllUnits<T extends TraversalContext>(
  unit: Unit,
  visitor: Visitor<T>,
  context: T = { level: 0, last: false } as T
): void {
  if (unit.type === 'department') {
    visitor?.visitDepartment?.(unit, context);

    unit.children.forEach((child, index) => {
      visitAllUnits(
        child,
        visitor,
        updatedContext(context, index, unit.children.length)
      );
    });
  } else if (unit.type === 'employee') {
    visitor?.visitEmployee?.(unit, context);

    unit.tasks.forEach((task, index) => {
      visitor?.visitTask?.(
        task,
        updatedContext(context, index, unit.tasks.length)
      );
    });
  }
}

export function visitAllDepartments<T extends TraversalContext>(
  unit: Unit,
  visitor: Visitor<T>,
  context: T = { level: 0, last: false } as T
): void {
  if (unit.type === 'department') {
    visitor?.visitDepartment?.(unit, context);

    unit.children.forEach((child, index) => {
      visitAllDepartments(
        child,
        visitor,
        updatedContext(context, index, unit.children.length)
      );
    });
  }
}

export function visitAllEmployees<T extends TraversalContext>(
  unit: Unit,
  visitor: Visitor<T>,
  context: T = { level: 0, last: false } as T
): void {
  if (unit.type === 'department') {
    unit.children.forEach((child, index) => {
      visitAllEmployees(
        child,
        visitor,
        updatedContext(context, index, unit.children.length)
      );
    });
  } else if (unit.type === 'employee') {
    visitor?.visitEmployee?.(unit, context);
  }
}

export function visitAllTasks<T extends TraversalContext>(
  unit: Unit,
  visitor: Visitor<T>,
  context: T = { level: 0, last: false } as T
): void {
  if (unit.type === 'department') {
    unit.children.forEach((child, index) => {
      visitAllTasks(
        child,
        visitor,
        updatedContext(context, index, unit.children.length)
      );
    });
  } else if (unit.type === 'employee') {
    unit.tasks.forEach((task, index) => {
      visitor?.visitTask?.(
        task,
        updatedContext(context, index, unit.tasks.length)
      );
    });
  }
}
