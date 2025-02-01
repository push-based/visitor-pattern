# Visitor Pattern Variations

The visitor pattern can be implemented in different ways depending on the targeted data structure.

## Single Dispatch

The single dispatch pattern is the simplest form of the visitor pattern. The visitor calls the correct method based on the type of the visited object.

```ts
function visit(unit: Department | Employee, visitor: DepartmentVisitor): void {
  // The visitor must be aware of all possible types of nodes
  switch (unit.type) {
    case 'department':
      visitor.visitDepartment(unit)
      break
    case 'employee':
      visitor.visitEmployee(unit)
      break
  }
}

class MyVisitor implements DepartmentVisitor {
  visitDepartment(dept: Department) {
    console.log('Visiting Department:', dept.name)
  }

  visitEmployee(emp: Employee) {
    console.log('Visiting Employee:', emp.name)
  }
}

const visitor = new MyVisitor();
visit(orgA, visitor);

// Output:
// Visiting Department: Head Office
// Visiting Employee: Diana
// ...
```

## Double Dispatch

The double dispatch pattern is a variation of the visitor pattern that allows the visitor to call the correct method based on the type of the visited object.

```ts
interface Visitable {
  accept(visitor: DepartmentVisitor): void;
}

type Department = Visitable & {
  accept: (visitor: DepartmentVisitor) => void;
}

type Employee = Visitable & {
  accept: (visitor: DepartmentVisitor) => void;
}

// Implementation for Department data structure
const departmentA = {
  // ...
  accept(visitor: DepartmentVisitor) {
    visitor.visitDepartment(this);
  }
};

// Implementation for Employee data structure
const employeeA = {
  // ...
  accept(visitor: DepartmentVisitor) {
    visitor.visitEmployee(this);
  }
};

// Implementation of the logic applied to the data structure nodes
class Visitor implements DepartmentVisitor {
  visitDepartment(department: Department) {
    console.log('Visiting Department');
  }

  visitEmployee(employee: Employee) {
    console.log('Visiting Employee');
  }
}

const visitor = new Visitor();
orgA.accept(visitor);

// Output:
// Visiting Department
// Visiting Employee
// ...
```

There is clearly more code to write before you can use the visitor, but the advantage is that the visitor does not need to know the structure of the data.
