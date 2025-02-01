import { PUSH_BASED } from '../data';
import { OrganisationTreeVisitor } from './organisation-tree.visitor';
import { TaskCalculationVisitor } from './task-calculation.visitor';
import { visitAllDepartments, visitAllTasks, visitAllUnits } from './traversal';

const organisationTreeVisitor = new OrganisationTreeVisitor();
const taskCalculationVisitor = new TaskCalculationVisitor();

// calculate the total duration
visitAllTasks(PUSH_BASED, taskCalculationVisitor);
console.log(`Total Task Duration: ${taskCalculationVisitor.totalWork} hours`);

// print the report
visitAllUnits(PUSH_BASED, organisationTreeVisitor);
console.log(organisationTreeVisitor.renderedTree);
// print the report for departments only
visitAllDepartments(PUSH_BASED, organisationTreeVisitor);
console.log(organisationTreeVisitor.renderedTree);
