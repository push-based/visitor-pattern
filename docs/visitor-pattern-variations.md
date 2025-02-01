# Visitor Pattern Variations

The **Visitor Pattern** can be implemented in different ways depending on:

- The **targeted data structure** (e.g., tree, graph, flat collection).
- The **level of coupling** between the visitor and the data structure.

In our example, we primarily used **single dispatch**, but never explicitly discussed it.  
Let's explore the differences between **single dispatch** and **double dispatch**.

---

## Single Dispatch (Basic Visitor)

Single dispatch is the simplest form of the visitor pattern.  
It relies on type checking at runtime to invoke the correct method.

### How It Works

- The **visitor must be aware** of all possible types.
- A type check (e.g., `switch` statement) determines which method to call.
- The visitor remains **tightly coupled** to the data structure.

### 📌 Example

```ts
function visit(unit: Department | Employee, visitor: DepartmentVisitor): void {
    // The visitor must explicitly handle all node types
    switch (unit.type) {
        case 'department':
            visitor.visitDepartment(unit);
            break;
        case 'employee':
            visitor.visitEmployee(unit);
            break;
    }
}

class MyVisitor implements DepartmentVisitor {
    visitDepartment(dept: Department) {
        console.log('Visiting Department:', dept.name);
    }

    visitEmployee(emp: Employee) {
        console.log('Visiting Employee:', emp.name);
    }
}

const visitor = new MyVisitor();
visit(orgA, visitor);
```

## Double Dispatch (Classic Visitor Pattern)

Double dispatch is a more flexible variation of the visitor pattern.
It ensures that both the visitor and the visited object participate in method resolution.

### How It Works

- The **data structure itself takes responsibility** for calling the correct visitor method.
- Each visitable object implements an accept method.
- The visitor **does not need to know the structure** of the data.
- No type checking required—method resolution is automatic.

### 📌 Example

```ts
interface Visitable {
    accept(visitor: DepartmentVisitor): void;
}

// Department structure with `accept` method
class Department implements Visitable {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    accept(visitor: DepartmentVisitor) {
        visitor.visitDepartment(this);
    }
}

// Employee structure with `accept` method
class Employee implements Visitable {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    accept(visitor: DepartmentVisitor) {
        visitor.visitEmployee(this);
    }
}

// The visitor logic applied to the data structure nodes
class Visitor implements DepartmentVisitor {
    visitDepartment(department: Department) {
        console.log('Visiting Department:', department.name);
    }

    visitEmployee(employee: Employee) {
        console.log('Visiting Employee:', employee.name);
    }
}

const orgA = new Department("Head Office");
const employeeA = new Employee("Diana");

const visitor = new Visitor();
orgA.accept(visitor);
employeeA.accept(visitor);

// Output:
// Visiting Department: Head Office
// Visiting Employee: Diana
```

## 🔥 Key Takeaways

| Pattern             | Pros                                                                                   | Cons                                                                       |
|---------------------|----------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| **Single Dispatch** | ✅ Simpler to implement <br> ✅ Works without modifying the data structure               | ❌ Visitor must know all types <br> ❌ Requires type checks (switch/casting) |
| **Double Dispatch** | ✅ Decouples visitor from structure <br> ✅ No type checks needed <br> ✅ More extensible | ❌ Requires adding `accept` to all elements <br> ❌ More boilerplate         |

---

## 💡 When to Use Which?

- **Use Single Dispatch** when working with **small, stable** data structures.
- **Use Double Dispatch** when you need **extensibility and maintainability**.

By using **double dispatch**, the visitor pattern **scales better** for larger applications, making it easier to add **new operations** without modifying existing structures.

---

## Adjusting the Traversal Logic for Double Dispatch

If we look at our current traverse logic we can see that the knowledge about how to visit a node is still backed in.
This makes it hard to extend the data without modifying the traversal logic.

```ts

export function visitAllUnits<T extends TraversalContext>(
    unit: Unit,
    visitor: Visitor<T>,
    context: T = { level: 0, last: false } as T
): void {
    const type = unit.type;
    
    switch (type) {
        case 'department':
            // 👇 The traversal logic must know how to handle each type 
            visitor.visitDepartment(unit, context);
            // ...
            break;
        case 'employee':
            // 👇 The traversal logic must know how to handle each type 
            visitor.visitEmployee(unit, context);
            unit.tasks.forEach((task, index) => {
                // 👇 The traversal logic must know how to handle each type 
                visitor.visitTask(task, {
                    level: context.level + 1,
                    last: index === unit.tasks.length - 1,
                });
            });
            break;
    }
}
```

To make it more flexible, we can use a registry to extract the knowledge about how to visit a node from the visitor.

```ts
import {Employee} from "./model";

export interface Visitor<T extends TraversalContext> {
    visitDepartment(department: Department, context: T): void;

    visitEmployee(employee: Employee, context: T): void;

    visitTask(task: Task, context: T): void;
}

export interface VisitorRegistry<T extends TraversalContext> {
    [type: string]: (unit: Unit, visitor: Visitor<T>, context: T) => void;
}

export const registry = {
    department: (unit: Unit, visitor: Visitor<T>, context: T) => {
        visitor.visitDepartment(unit as Department, context);
    },
    task: (task: Task, visitor: Visitor<T>, context: T) => {
        visitor.visitTask(task, context);
    },
    employee: (unit: Unit, visitor: Visitor<T>, context: T) => {
        visitor.visitEmployee(unit as Employee, context);
    },
};

export function visitAllUnits<T extends TraversalContext>(
    unit: Unit,
    visitor: Visitor<T>,
    context: T = { level: 0, last: false } as T
): void {
    const type = unit.type;

    switch (type) {
        case 'department':
            // 👇 The registry knows how to handle each type
            registry.department(unit, visitor, context);
            // ...
            break;
        case 'employee':
            // 👇 The registry knows how to handle each type
            registry.employee(unit, visitor, context);
            unit.tasks.forEach((task, index) => {
                // 👇 The registry knows how to handle each type
                registry.task(unit, visitor, context);
            });
            break;
    }
}
```
