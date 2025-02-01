import { EmployeeRole, Unit } from './model';
import { bold, dim, greenBright, yellow } from 'ansis';

/**
 * Processes the organizational structure and optionally prints it.
 *
 * @param unit - The organizational unit (department or employee).
 * @param printReport - If `true`, prints the organization structure; otherwise, just returns the total duration.
 * @param indent - The current indentation level.
 * @param isLast - Indicates if the current unit is the last child of its parent.
 * @returns The total sum of all task durations.
 *
 * @example
 * const totalDuration = processUnits(PUSH_BASED); // Returns the total duration.
 * console.log(`Total Task Duration: ${totalDuration} hours`);
 *
 * @example
 * processUnits(PUSH_BASED, true); // Prints the organization structure and returns the total duration.
 * // Output:
 * 🏢 Head Office
 *     ├── 👩‍💼 Alice ≺🎖️Manager≻ | 2🛠️
 *     ├── 🏢 Engineering 💻
 *     │   ├── 👩‍⚕️ Bob ≺🎖️Supervisor≻ | 1🛠️
 *     │   ├── 👩‍💻 Carol ≺🎖Engineer≻ | 2🛠️
 *     │   ├── 👤 Sutri ≺🎖Engineer≻ | 3🛠️
 *     │   └── 👩‍💻 Mardim ≺🎖️Worker≻ | 2🛠️
 *     └── 🏢 Sales 💼
 *         └── 👩‍⚕️ Dave ≺🎖️Supervisor≻ | 1🛠️
 */
export function processUnits(unit: Unit, printReport = false, indent = '', isLast = true): number {
  // Adjusted Color Palette
  const colors = {
    department: bold.gray, // Bold gray for departments
    employee: bold, // Default bold for employee names
    role: yellow, // Yellow for roles (light and visible)
    task: greenBright, // Bright green for task durations
    tree: dim, // Dim gray for tree lines
  };

  // Icons & Styling
  const departmentEmoji = '🏢'; // Unified emoji for departments
  const employeeEmojis: Record<Extract<EmployeeRole, 'A' | 'B' | 'C'>, string> = {
    A: '👩‍💻', // Engineer
    B: '👩‍⚕️', // Supervisor
    C: '👩‍💼', // Manager
  };

  const roleDecorators = { start: '≺🎖️', end: '≻' }; // Role bracket styling
  const taskSeparator = colors.tree('|'); // Task separator
  const tasksEmoji = '🛠️'; // Icon for tasks

  let totalDuration = 0;

  // Prefix for tree structure
  let prefix = indent;
  if (indent) {
    prefix += isLast ? colors.tree('└── ') : colors.tree('├── ');
  }

  if (unit.type === 'department') {
    if (printReport) {
      console.log(`${prefix}${colors.department(departmentEmoji + ' ' + unit.name)}`);
    }

    const newIndent = indent + (isLast ? '    ' : colors.tree('│   '));
    unit.children.forEach((child, index) => {
      const childIsLast = index === unit.children.length - 1;
      totalDuration += processUnits(child, printReport, newIndent, childIsLast);
    });
  } else if (unit.type === 'employee') {
    const roleEmoji = employeeEmojis[unit.role] || ' 👤';
    const roleText = colors.role(
      `${roleDecorators.start}${
        unit.role === 'A'
          ? 'Engineer'
          : unit.role === 'B'
            ? 'Supervisor'
            : unit.role === 'C'
              ? 'Manager'
              : 'Contractor'
      }${roleDecorators.end}`
    );
    const totalTasks = unit.tasks.length;
    const employeeDuration = unit.tasks.reduce((sum, task) => sum + task.duration, 0);
    totalDuration += employeeDuration;

    if (printReport) {
      console.log(
        `${prefix}${colors.employee(roleEmoji + ' ' + unit.name)} ${roleText} ${taskSeparator} ${colors.task(
          totalTasks + tasksEmoji
        )}`
      );
    }
  }

  return totalDuration;
}
