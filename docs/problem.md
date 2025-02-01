# The Problem

The company has ambitious growth plans and wants to improve its **reporting capabilities**. However, the current codebase lacks **flexibility** to support new operations or modifications efficiently.

## ⚠️ Issues in the Existing Code

- ❌ **Hardcoded traversal & behavior** – The logic for **walking the structure** and **applying operations** (like printing) are **tightly coupled**.
- ❌ **Difficult to extend** – Adding new features like **license costs** or **rooms for departments** requires modifying the core traversal logic.
- ❌ **Limited reusability** – Specific operations like **calculating work duration** or **filtering employees** cannot be **easily extracted** or **reused**.

---

## 📌 **Existing Code**
The existing implementation **mixes traversal with operations**, making changes error-prone and hard to maintain.

<details>

<summary><b>Existing Code</b></summary>

```ts 
import { EmployeeRole, Unit } from './model';
import { bold, dim, greenBright, yellow } from 'ansis';


/**
 * Processes the organizational structure and optionally prints it.
 *
 * @param unit - The organizational unit (department or employee).
 * @param printReport - If `true`, prints the organization structure; otherwise, just returns the total duration.
 * @param indent - The current indentation level.
 * @param isLast - Indicates if the current unit is the last employee of its parent.
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

  const colors = {
    department: bold.gray,
    employee: bold,
    role: yellow,
    task: greenBright,
    tree: dim,
  };

  const departmentEmoji = '🏢';
  const employeeEmojis: Record<Extract<EmployeeRole, 'A' | 'B' | 'C'>, string> = {
    A: '👩‍💻',
    B: '👩‍⚕️',
    C: '👩‍💼',
  };

  const roleDecorators = { start: '≺🎖️', end: '≻' };
  const taskSeparator = colors.tree('|');
  const tasksEmoji = '🛠️';

  let totalDuration = 0;

  let prefix = indent;
  if (indent) {
    prefix += isLast ? colors.tree('└── ') : colors.tree('├── ');
  }

  if (unit.type === 'department') {
    if (printReport) {
      console.log(`${prefix}${colors.department(departmentEmoji + ' ' + unit.name)}`);
    }

    const newIndent = indent + (isLast ? '    ' : colors.tree('│   '));
    unit.children.forEach((employee, index) => {
      const employeeIsLast = index === unit.children.length - 1;
      totalDuration += processUnits(employee, printReport, newIndent, employeeIsLast);
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
```

</details>

---

## Goals for the Refactor

We aim to **decouple** traversal and behavior to achieve:
- ✅ **Flexible data operations** – Allow new operations (e.g., calculating work per department) without modifying traversal logic.
- ✅ **Reusability** – Enable **different operations** (printing, calculations, filtering) using **visitors**.
- ✅ **Extensibility** – Support **new data types** like:
  - **License costs** for employees 💰
  - **Rooms** for departments 🏢

New Capabilities:
- **Calculate** total work duration per department.
- **Print** an **organization chart** for all departments.
  - **List only** departments.
  - **List only** employees.
  - **List only** tasks.

By refactoring the code, we enable **scalable and maintainable reporting** for the company’s future growth. 🚀






