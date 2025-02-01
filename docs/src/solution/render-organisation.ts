import { Department, Employee, EmployeeRole } from '../model';
import { bold, dim, greenBright, yellow } from 'ansis';

type OrganisationStyle = {
  department: (text: string) => string;
  employee: (text: string) => string;
  role: (text: string) => string;
  task: (text: string) => string;
};

type OrganisationDecoration = {
  department: string;
  employees: Record<Extract<EmployeeRole, 'A' | 'B' | 'C'>, string>;
  unknownEmployee: string;
  task: string;
  taskSeparator: string;
  roleDecorators: { start: string; end: string };
};

type OrganisationTransformation = {
  role: (role: EmployeeRole) => string;
};

export type OrganisationConfig = {
  style: OrganisationStyle;
  decoration: OrganisationDecoration;
  transformation: OrganisationTransformation;
};

export type RenderOrganisation = {
  renderDepartment(department: Department): string;
  renderEmployee(employee: Employee): string;
};

/**
 * Creates an organisation renderer with the given configuration.
 *
 * @param config
 * @returns RenderOrganisation
 *
 * @example
 * ```ts
 * const renderer = createOrganisationRenderer();
 *
 * const department = { name: 'Engineering' };
 * console.log(renderer.renderDepartment(department)); // 🏢 Engineering
 *
 * const employee = { name: 'Alice', role: 'C', tasks: [1, 2] };
 * console.log(renderer.renderEmployee(employee)); // 👩‍💼 Alice ≺🎖️Manager≻ | 2🛠️
 * ```
 */
export function createOrganisationRenderer(
  config: Partial<OrganisationConfig> = {
    style: {
      department: bold.gray,
      employee: bold,
      role: yellow,
      task: greenBright,
    },
    decoration: {
      department: '🏢',
      employees: {
        A: '👩‍💻', // Engineer
        B: '👩‍⚕️', // Supervisor
        C: '👩‍💼', // Manager
      },
      unknownEmployee: '👤',
      task: '🛠️',
      roleDecorators: { start: '≺🎖️', end: '≻' },
      taskSeparator: dim('|'),
    },
    transformation: {
      role: (role: EmployeeRole) => {
        return role === 'A'
          ? 'Engineer'
          : role === 'B'
          ? 'Supervisor'
          : role === 'C'
          ? 'Manager'
          : role === 'X'
          ? 'Contractor'
          : 'Unknown Role';
      },
    },
  }
): RenderOrganisation {
  return {
    renderDepartment(department: Department) {
      return `${config.style.department(
        config.decoration.department + ' ' + department.name
      )}`;
    },

    renderEmployee(employee: Employee) {
      const roleEmoji =
        config.decoration.employees[employee.role] ||
        config.decoration.unknownEmployee;
      const roleText = config.style.role(
        `${config.decoration.roleDecorators.start}${config.transformation.role(
          employee.role
        )}${config.decoration.roleDecorators.end}`
      );

      return `${config.style.employee(
        roleEmoji + ' ' + employee.name
      )} ${roleText} ${config.decoration.taskSeparator} ${config.style.task(
        employee.tasks.length + config.decoration.task
      )}`;
    },
  };
}
