import { Task } from '../model';
import { Visitor } from './visitor';

export class TaskCalculationVisitor implements Visitor {
  private _totalWork = 0;
  get totalWork() {
    return this._totalWork;
  }

  visitTask(task: Task) {
    this._totalWork += task.duration;
  }
}
