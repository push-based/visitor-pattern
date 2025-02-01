```mermaind
classDiagram
class Unit {
<<abstract>>
+string name
+UnitType type
}

    class Department {
        +Unit[] children
    }

    class Employee {
        +EmployeeRole role
        +Task[] tasks
    }

    class Task {
        +int id
        +string title
        +int duration
    }

    class TraversalContext {
        +int level
        +boolean isLast
    }

    class Visitor<T> {
        +visitDepartment(department: Department, context: T)
        +visitEmployee(employee: Employee, context: T)
        +visitTask(task: Task, context: T)
    }

    class OrganisationTreeVisitor {
        +visitDepartment(department: Department, context: TraversalContext)
        +visitEmployee(employee: Employee, context: TraversalContext)
        +visitTask(task: Task, context: TraversalContext)
        -TreeRenderer treeRenderer
        -OrganisationRenderer organisationRenderer
    }

    class OrganisationRenderer {
        +renderDepartment(department: Department): string
        +renderEmployee(employee: Employee): string
    }

    class TreeRenderer {
        +renderTreeIndent(context: TraversalContext): string
        +updateActiveBranchLevels(context: TraversalContext)
    }

    class visitAllUnits<T> {
        +visitAllUnits(unit: Unit, visitor: Visitor<T>, context: T)
    }

    Unit <|-- Department
    Unit <|-- Employee
    Employee "1" -- "*" Task
    Visitor <|-- OrganisationTreeVisitor
    OrganisationTreeVisitor --> TreeRenderer
    OrganisationTreeVisitor --> OrganisationRenderer
```
