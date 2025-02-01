# Separation of Concerns

The original implementation tightly couples **traversal logic** with **operational behavior**, making the system rigid and difficult to extend.

To improve maintainability and modularity, we separate concerns into distinct areas:

- **📂 Data Structure**  
  Defines the hierarchical structure being traversed.

- **🔄 Traversal Logic**  
  Responsible for systematically visiting nodes in the structure. Common traversal functions include `walk`, `visitAll`, and `traverse`.
  - **📍 Traversal Context**: Metadata derived from traversal, such as `level`, `last`, or `even`.

- **⚙️ Behavioral Logic**  
  Encapsulates operations performed on the data during traversal. Implemented in dedicated **Visitor** classes.
  - **🧠 Behavioral Context**: Internal state maintained by the visitor.
  - **🖼️ Render Logic**: Defines how the hierarchical structure is formatted for display.

> [!note]
> The source code is simplified to highlight **separation of concerns**. The original implementation can be found in the [problem source](./src/problem/problem.ts) folder.

## 📂 Data Structure

The hierarchical data model follows a **tree structure**, where each node represents either a **department** or an **employee**.

- **📁 Departments**: Contain child units (either sub-departments or employees).
- **👤 Employees**: Contain individual attributes such as **role** and **assigned tasks**.

For a detailed breakdown of the data model, refer to [tree-structures.md](./tree-structures.md).

📌 **Example Data**  
We use sample data from [`src/data.ts`](./src/data.ts) to demonstrate traversal and behavior operations.

## 🔄 Traversal Logic

To maintain **separation of concerns**, we first extract the **traversal logic**, isolating it from any behavioral operations.

### Extracting Traversal Logic

The function below **recursively visits all units** in the hierarchy.  
We've marked locations where **behavioral logic** (such as rendering) was previously intermingled.

```ts
export function visitAllUnits(unit: Unit/*, behaviour: unknown*/): void {
  if (unit.type === 'department') {
    // 🏢 Processing department behaviour
    unit.children.forEach((child, index) => {
      // 👤 Processing emploee behaviour
      visitAll(child);
    });
  } else if (unit.type === 'employee') {
    unit.tasks.forEach((task, index) => {
      // 🛠️ Processing task behaviour
    });
  }
}
```
By **separating traversal logic**, we gain:

- **Modularity** 🛠️ → The ability to **extend** the data structure without modifying traversal.
- **Reusability** 🔁 → The same traversal can be applied with different behaviors.
- **Customization** 🎛️ → Allows for **specialized traversal strategies**.

---
### 🔍 **Specialized Traversals**

With traversal logic extracted, we can create **specialized traversal functions** that **target specific types** of nodes, such as **only visiting tasks or employees**.

```ts
export function visitAllUnitTasks(unit: Unit/*, behaviour: unknown*/): void {
  if (unit.type === 'department') {
    unit.children.forEach((employee, index) => {
      visitAllTasks(employee);
    });
  } else if (unit.type === 'employee') {
    unit.tasks.forEach((task, index) => {
      // 🛠️ Processing task behaviour
    });
  }
}

export function visitAllUnitEmployees(unit: Unit/*, behaviour: unknown*/): void {
  if (unit.type === 'department') {
    unit.children.forEach((childr, index) => {
      visitAllEmployees(child);
    });
  } else if (unit.type === 'employee') {
    // 👤 Processing emploee behaviour
  }
}

export function visitAllUnitDepartments(unit: Unit/*, behaviour: unknown*/): void {
  if (unit.type === 'department') {
    // 🏢 Processing department behaviour
    unit.children.forEach((child, index) => {
      visitAllDepartments(child);
    });
  }
}
```

By structuring traversal logic this way, we **maximize flexibility** while ensuring the **core data structure remains unchanged**.

## ⚙️ Behavioural Logic

The **behavioral logic** defines what actions should be performed on each **department, employee, or task** while traversing the structure. To keep traversal logic independent, we introduce an **interface** that acts as a **contract** between traversal and behavior.

```ts
export interface UnitVisitor {
  visitDepartment?: (department: Department) => void;
  visitEmployee?: (employee: Employee) => void;
  visitTask?: (task: Task) => void;
}
```

### Decoupling Behaviour from Traversal
By using a **Visitor pattern**, we ensure:
- Each **visitor** is independent and can be applied to any traversal logic.
- The traversal **automatically calls** the correct method for each unit type.
- New behaviors can be introduced **without modifying** existing traversal logic.
- Each visitor can maintain its own **state**, known as **behavioral context**.

---

### Implementing Visitors & Behavioral Context

Visitors maintain their **own logic** and, if needed, **stateful data**.

```ts
export class TotalWorkVisitor extends UnitVisitor {
  private _totalWork = 0; // 👈 behavioral context

  get totalWork() {
    return this._totalWork;
  }

  visitTask(task: Task) {
    this._totalWork += task.duration;
  }
}

export class OrganisationTreeVisitor implements UnitVisitor {
  // 👇 behavioral context/state
  private _renderedTree = '';

  addBranchToTree(branch: string) {
    this._renderedTree += `${branch}\n`;
  }

  get renderedTree() {
    return this._renderedTree;
  }

  visitDepartment(department: Department) {
    console.log(department.name);
  }

  visitEmployee(employee: Employee) {
    console.log(employee.name + ' ' + employee.role);
  }

  // ...
}
```

Each visitor **specializes** in a different behavior:
- **Calculating Total Work** ⏳ → Aggregates task durations.
- **Rendering an Organization Tree** 🌳 → Formats hierarchical output.

---

### Testing Visitors in Action
By implementing visitors separately, we can **swap behaviors easily** and test them independently.

```ts
import { PUSH_BASED } from './data';

// calculate total work
const totalWorkVisitor = new TotalWorkVisitor();
visitAllUnits(PUSH_BASED, totalWorkVisitor);
console.log(`Total Work: ${totalWorkVisitor.totalWork}h`);

// render organization tree
const orgTreeVisitor = new OrganisationTreeVisitor();
visitAllUnits(PUSH_BASED, orgTreeVisitor);
console.log(orgTreeVisitor.renderedTree); // 👈 missing implementation of the `OrganisationTreeVisitor` for now
```

With this approach, **behavioral concerns** remain **completely separate** from traversal logic, ensuring a **scalable and maintainable** system.

## Traversal Context

When extracting the remaining logic from the **organization tree visitor**, we encounter a challenge:  
The tree structure relies on **two key states** to ensure correct rendering:
- **`childIsLast`** → Determines whether to use `└──` (last child) or `├──` (sibling exists).
- **`indent`** → Determines the indentation level for hierarchical alignment.

These states are **not part of the data structure** but **derived from the traversal process**.  
To make traversal logic **reusable**, we generalize these states into a **context**.

```ts
export type TraversalTreeContext = {
  level: number;
  last: boolean;
  // 👇 more contextual information can be added here
  // - first
  // - even
  // - odd
};
```
This **contextual information** enables **multiple traversal implementations** while maintaining structure integrity.

### Update Traversal Logic and Implement Context

We modify the traversal functions to **automatically compute context**, passing **level and last-child status**.

```ts
export function visitAllUnits<T extends TraversalTreeContext>(
    unit: Unit,
    visitor: Visitor<T>,
    // 👇 traversal context. Smart default for better DX 
    context: T = {level: 0, last: false} as T
): void {
    if (unit.type === 'department') {
        visitor?.visitDepartment?.(unit, context);

        unit.children.forEach((child, index) => {
            visitAllUnits(
                child,
                visitor,
                // 👇 update traversal context 
                {
                    ...parentContext,
                    level: parentContext.level + 1,
                    last: index === unit.children.length - 1
                }
            );
        });
    } else if (unit.type === 'employee') {
        visitor?.visitEmployee?.(unit, context);

        unit.tasks.forEach((task, index) => {
            visitor?.visitTask?.(
                task,
                // 👇 update traversal context
                {
                    ...parentContext,
                    level: parentContext.level + 1,
                    last: index === unit.tasks.length - 1
                }
            );
        });
    }
}
```

Each recursive call **updates** the context:
- **`level`** → Increases with tree depth.
- **`last`** → Identifies the last child at each level.

### Integrating Context into the Visitor

Now, we modify the **visitor interface** to receive **traversal context**.

```ts
export interface Visitor<T extends TraversalTreeContext = TraversalTreeContext> {
  visitDepartment?: (department: Department, context: Readonly<T>) => void;
  visitEmployee?: (employee: Employee, context: Readonly<T>) => void;
  visitTask?: (task: Task, context: Readonly<T>) => void;
}

export class OrganisationTreeVisitor implements Visitor {
  // ...
  //                                      👇 use traversal context
  visitDepartment(department: Department, context: TraversalTreeContext) {
    //...
  }

  //                               👇 use traversal context
  visitEmployee(employee: Employee, context: TraversalTreeContext) {
    //...
  }
}
```

**Key Benefits:**  
✅ **Traversal logic** → remains separate from behavior.  
✅ **Visitors** → receive **context-aware** information for rendering.  
✅ **Multiple visitor implementations** → can **leverage traversal context** without modifying traversal logic.

## Extract Render Logic

The **OrganisationTreeVisitor** was initially responsible for both **traversing** the organization tree and **rendering** its content.  
To improve modularity and maintainability, we extract **render logic** into dedicated helper functions.

### Extract `OrganisationRenderer`

Unit content rendering is now delegated to the **`createOrganisationRenderer`** helper.  
This function encapsulates **how** departments and employees should be displayed.

<details>

  <summary><b>organisation-renderer.ts</b></summary> 

```ts
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

export type OrganisationRenderer = {
  renderDepartment(department: Department): string;
  renderEmployee(employee: Employee): string;
};

/**
 * Creates an organisation renderer with the given configuration.
 *
 * @param config
 * @returns OrganisationRenderer
 *
 * @example
 *
 * const renderer = createOrganisationRenderer();
 *
 * const department = { name: 'Engineering' };
 * console.log(renderer.renderDepartment(department)); // 🏢 Engineering
 *
 * const employee = { name: 'Alice', role: 'C', tasks: [1, 2] };
 * console.log(renderer.renderEmployee(employee)); // 👩‍💼 Alice ≺🎖️Manager≻ | 2🛠️
 *
 */
export function createOrganisationRenderer(
  config: Partial<OrganisationConfig> = {
    style: {
      department: bold.gray,
      employee: bold,
      role: yellow,
      task: greenBright
    },
    decoration: {
      department: '🏢',
      employees: {
        A: '👩‍💻', // Engineer
        B: '👩‍⚕️', // Supervisor
        C: '👩‍💼' // Manager
      },
      unknownEmployee: '👤',
      task: '🛠️',
      roleDecorators: { start: '≺🎖️', end: '≻' },
      taskSeparator: dim('|')
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
      }
    }
  }
): OrganisationRenderer {
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
    }
  };
}
```

</details>

**Key Benefits:**  
✅ **Encapsulation** → Keeps formatting logic separate from traversal.  
✅ **Reusability** → Different visitors can use the same rendering logic.  
✅ **Customizability** → The styles and formatting can be easily configured.

### Extract `TreeRenderer`

Rendering the **tree structure** itself requires tracking indentation and branch positions.  
This logic is extracted into the **`createTreeRenderer`** helper.

<details>

  <summary><b>tree-renderer.ts</b></summary> 

```ts
import { dim } from 'ansis';
import { TraversalContext } from './traversal.type';

export interface TreeConfig {
  style: (text: string) => string;
  tree: {
    end: string;
    middle: string;
    line: string;
    indentSpace: string;
  };
}

export type TreeRenderer = {
  renderTreeIndent(context: TraversalContext): string;
  updateActiveBranchLevels(context: TraversalContext): void;
};

export function createTreeRenderer(
  config: Partial<TreeConfig> = {
    style: dim,
    tree: {
      end: '└── ',
      middle: '├── ',
      line: '│   ',
      indentSpace: '    ', // Space when last item
    },
  }
): TreeRenderer {
  const activeParentLevels = new Set<number>();

  return {
    /**
     * Computes the **tree indentation** string based on the traversal context.
     *
     * This function ensures that **vertical tree lines (`│`)** are drawn correctly,
     * maintaining **proper indentation** for hierarchical structures.
     *
     * ---
     *
     * ### 🛠 **How It Works**
     * - **Loops through all levels** (`context.level`) and:
     *   - If the level is in `activeParentLevels`, it **adds a vertical tree line (`│`)**.
     *   - Otherwise, it **adds empty spaces (`    `) for alignment**.
     * - **Appends the correct tree branch marker (`├──` or `└──`)**:
     *   - If the node is **not the last child** (`isLast === false`), it uses `tree.middle` (`├──`).
     *   - If the node **is the last child** (`isLast === true`), it uses `tree.end` (`└──`).
     *
     * ---
     *
     * ### 📌 **Example: How It Affects Indentation**
     *
     * **Before Processing a Last Node in a Level:**
     * ```
     * ├── Department A
     * │   ├── Employee 1
     * │   ├── Employee 2
     * │   └── Employee 3  <-- getTreeIndent() adds `└──` here
     * ```
     *
     * **Before Processing a Non-Last Node in a Level:**
     * ```
     * ├── Department A
     * │   ├── Employee 1  <-- getTreeIndent() adds `├──` here
     * │   ├── Employee 2
     * │   └── Employee 3
     * ```
     *
     * ---
     *
     * ### Why This Matters
     * - Ensures **correct visual alignment** for hierarchical trees.
     * - Prevents **extra or missing** tree lines (`│`) at nested levels.
     * - Maintains **professional and structured output**.
     *
     * ---
     * @param context - The current traversal context containing:
     *   - `level` (number): The **depth level** of the current node in the tree.
     *   - `isLast` (boolean): Whether this node is the **last child** at its level.
     * @returns The computed **tree indentation string**.
     */
    renderTreeIndent(context: TraversalContext): string {
      return Array.from({ length: context.level })
        .map((_, i) =>
          activeParentLevels.has(i) ? config.style(config.tree.line) : '    '
        )
        .join('')
        .concat(
          config.style(context.last ? config.tree.end : config.tree.middle)
        );
    },
    /**
     * Updates the set of active parent levels based on the traversal context.
     *
     * This method ensures that the **tree structure maintains correct indentation** by
     * tracking which parent levels should **continue their vertical lines (`│`)**.
     *
     * ---
     *
     * ### How It Works
     * - If the **current node is NOT the last child** (`isLast === false`), it means this level
     *   **has more children** to process. So, we **add** the current `level` to `activeParentLevels`,
     *   ensuring the tree **continues drawing vertical lines (`│`) at this depth**.
     * - If the **current node IS the last child** (`isLast === true`), we **remove** the
     *   current `level` from `activeParentLevels`, stopping further indentation lines
     *   at this depth.
     *
     * This function is called **after processing** a department or employee to update
     * indentation behavior for all subsequent sibling nodes.
     *
     * ---
     *
     * ### Example: How It Affects Indentation
     *
     * **Before Processing a Last Node in a Level:**
     * ```
     * ├── Department A
     * │   ├── Employee 1
     * │   ├── Employee 2
     * │   └── Employee 3  <-- updateActiveParentLevels removes level here
     * ```
     *
     * **Before Processing a Non-Last Node in a Level:**
     * ```
     * ├── Department A
     * │   ├── Employee 1  <-- updateActiveParentLevels adds level here
     * │   ├── Employee 2
     * │   └── Employee 3
     * ```
     *
     * ---
     *
     * @param context - The current traversal context containing:
     *   - `level` (number): The **depth level** of the current node in the tree.
     *   - `isLast` (boolean): Whether this node is the **last child** at its level.
     */
    updateActiveBranchLevels(context: TraversalContext) {
      if (!context.last) {
        activeParentLevels.add(context.level); // Continue the branch
      } else {
        activeParentLevels.delete(context.level); // Stop indentation at this level
      }
    },
  };
}
```
</details>

**Key Benefits:**  
✅ **Ensures proper tree alignment** → No misplaced branches.  
✅ **Separates structural concerns** → Only manages **indentation & tree lines**, not content.  
✅ **Keeps formatting customizable** → Tree structure can be styled independently.

## Implementing the Visitors

With the **traversal logic** and **render logic** extracted, the **visitors** now focus solely on **applying** the rendering logic.

---

The **OrganisationTreeVisitor**:
- **Delegates rendering** to the `OrganisationRenderer` and `TreeRenderer`.
- **Traversal context** is forwarded for correct indentation.

The full implementation in the [organisation-tree.visitor.ts](./src/solution/organisation-tree.visitor.ts) file.

---

```ts
export class OrganisationTreeVisitor implements Visitor {
  // ...
  
  constructor(
    private readonly organisationRenderer: OrganisationRenderer = createOrganisationRenderer(),
    private readonly treeRenderer: TreeRenderer = createTreeRenderer()
  ) {}

  visitDepartment(department: Department, context: TraversalContext) {
    // If this is the root department, print it without tree indentation
    if (context.level === 0) {
      this.addToRenderedTree(
        this.organisationRenderer.renderDepartment(department)
      );
      return;
    }

    // Otherwise, apply indentation for tree structure
    const treeIndent = this.treeRenderer.renderTreeIndent(context);
    this.addToRenderedTree(
      `${treeIndent}${this.organisationRenderer.renderDepartment(department)}`
    );
    
    // Update the active branch levels for the next iteration
    this.treeRenderer.updateActiveBranchLevels(context);
  }

  visitEmployee(employee: Employee, context: TraversalContext) {
    // Employees are never root, so always apply indentation
    const treeIndent = this.treeRenderer.renderTreeIndent(context);
    this.addToRenderedTree(
      `${treeIndent}${this.organisationRenderer.renderEmployee(employee)}`
    );
  }
}
```

As this visitor was already implemented fully above here just the overview of the implementation.

---

The **TaskCalculationVisitor**:
- **Calculates total work** by summing task durations.

The full implementation in the [task-calculation.visitor.ts](./src/solution/task-calculation.visitor.ts) file.

---

