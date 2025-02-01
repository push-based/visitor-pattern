## Tree Structures

As visitors are all about data structures, let's define a simple structure to work with.
In this example we use an organization chart with departments and employees in form of a tree.

### Types

```ts
type UnitType = 'department' | 'employee';

export interface UnitBase {
  type: UnitType;
  name: string;
}

export interface Department extends UnitBase {
  type: 'department';
  children: Unit[];
}

export interface Employee extends UnitBase {
  type: 'employee';
  role: 'C' | 'B' | 'A';
  tasks: [
    {
      id: number;
      title: string;
      duration: number;
    }
  ]
}

export type Unit = Department | Employee;
```

## Tree Structure

```shell
`Department`
├── `Department`
│   ├── `Employee`
│   │   ├── `Task`
│   │   └── ...
│   └── `Employee`
│       ├── `Task`
│       └── ...
└── `Department`
    └── `Employee`
        ├── `Task`
        └── ...
```

## Sample data

```ts
import { Unit } from './types';

/**
 * Sample organizational structure.
 * 
 * Head Office
 * ├── Engineering
 * │   ├── Alice (C)
 * │   │   ├── Task 1: Code Review (3h)
 * │   │   └── Task 2: Sprint Planning (2h)
 * │   ├── Bob (B)
 * │   │   └── Task 1: Feature Implementation (5h)
 * │   └── Carol (A)
 * │       ├── Task 1: Bug Fixing (2h)
 * │       └── Task 2: Unit Testing (4h)
 * ├── Sales
 * │   └── Dave (C)
 * │       ├── Task 1: Client Meeting (3h)
 * │       └── Task 2: Sales Report (2h)
 * └── Marketing
 *     └── Emily (B)
 *         ├── Task 1: Social Media Strategy (4h)
 *         └── Task 2: SEO Optimization (3h)
 *  
 **/
export const ORGANIZATION_A: Unit = {
  type: 'department',
  name: 'Head Office',
  children: [
    {
      type: 'employee',
      name: 'Alice',
      role: 'A',
      tasks: [
        { id: 1, title: 'Resolve bug', duration: 5 },
        { id: 2, title: 'Add feature', duration: 3 },
      ],
    },
    {
      type: 'department',
      name: 'Engineering',
      children: [
        {
          type: 'employee',
          name: 'Bob',
          role: 'B',
          tasks: [
            { id: 1, title: 'Create ticket', duration: 4 },
          ],
        },
        {
          type: 'employee',
          name: 'Carol',
          role: 'C',
          tasks: [
            { id: 1, title: 'Order service license', duration: 2 },
            { id: 2, title: 'Evaluate team member', duration: 1 },
          ],
        },
      ],
    },
    {
      type: 'department',
      name: 'Sales',
      children: [
        {
          type: 'employee',
          name: 'Dave',
          role: 'B',
          tasks: [
            { id: 6, title: 'Send out cold mail', duration: 3 },
          ],
        },
      ],
    },
  ],
};
```
