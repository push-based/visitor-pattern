# Visitors for CSS AST

## Css AST


```ts
import postcss, { Root } from 'postcss';

const parsed: Root = postcss.parse(cssContent, { from: 'file.css' });
``` 

The returned structure is an object of type `Root` and similar to TypeScript AST.
Each parsed stylesheet represents a set of CSS rules. The `Root` type has the following structure:

### Metadata

- `after`: The space symbols after the last child to the end of file.
- `codeAfter`: Non-CSS code after `Root`, when `Root` is inside `Document`.
- `codeBefore`: Non-CSS code before `Root`, when `Root` is inside `Document`.
- `semicolon`: Is the last child has an (optional) semicolon.
- `raws`: Information used to generate byte-to-byte equal node string as it was in the origin input.
- `inputs`: An array of input sources that were parsed.
- `source`: Information about the source of the parsed CSS (positional information).

### Data

- `type`: The type of the node, e.g. `root`.
- `nodes`: An array of nodes that represent the CSS rules.

### Node types

- `rule`: A CSS rule, e.g. `.btn { color: red; }`.
- `decl`: A CSS declaration, e.g. `color: red`.
- `comment`: A CSS comment, e.g. `/* comment */`.
- `atrule`: A CSS at-rule, e.g. `@media screen { ... }`.

### Root Structure

```ts
const stylesRoot: Root = {
  raws: {
    semicolon: false,
    after: "\n"
  },
  type: "root",
  nodes: [
    {
      type: "rule",
      raws: {
        before: "\n  ",
        between: " ",
        semicolon: true,
        after: "\n  "
      },
      nodes: [
        {
          type: "decl",
          raws: {
            before: "\n    ",
            between: ": "
          },
          source: {
            end: {
              column: 15,
              line: 3,
              offset: 25
            },
            inputId: 0,
            start: {
              column: 5,
              line: 3,
              offset: 14
            }
          },
          prop: "color",
          value: "red"
        }
      ],
      source: {
        end: {
          column: 3,
          line: 4,
          offset: 29
        },
        inputId: 0,
        start: {
          column: 3,
          line: 2,
          offset: 3
        }
      },
      selector: ".btn"
    }
  ],
  source: {
    start: {
      column: 1,
      line: 1,
      offset: 0
    },
    end: {
      column: 1,
      line: 5,
      offset: 30
    },
    inputId: 0
  },
  inputs: [
    {
      hasBOM: false,
      css: "\n  .btn {\n    color: red;\n  }\n",
      id: "<input css 6eFWb0>"
    }
  ]
};
```

## Visitor Definition

```ts
import { Comment, Node, Postcss, Root, Rule } from 'postcss';
import { CssAstVisitor } from './stylesheet.visitor';
import { node } from '@rspack/core';
import AtRule from 'postcss/lib/at-rule.js';

export interface CssAstVisitor extends DiagnosticsCollector {
  visitRoot(root: Root): void;

  visitRule(rule: Rule): void;

  visitDecl(decl: Decl): void;

  visitComment(comment: Comment): void;

  visitAtRule(atRule: AtRule): void;
}
```

#### Make Structure Visitable

```ts
import postcss from 'postcss';

function augmentNodeTypeVisitor(root: Root) {
  root.walk((node: unknown) => {
    const visitFn = `visit${node.type.at(0).toUpperCase()}${node.type.slice(1)}`;
    node.visit = (visitor: CssAstVisitor) => visitor[visitFn](node);
  });
}
```

### Implementing the Visitor

```ts

class CssAstVisitor implements CssAstVisitor {
  private postcss: Postcss;
  private diagnostics: Diagnostic[] = [];

  constructor(root: Postcss) {
    this.postcss.walk((node: Node) => this.walk(node));
  }

  getDiagnostics(): Diagnostic[] {
    return this.diagnostics;
  }

  visitRoot(root: Root) {
    console.log('Visiting Root');
  }

  visitRule(rule: Rule) {
    console.log('Visiting Rule');
  }

  visitDecl(decl: Decl) {
    console.log('Visiting Decl');
  }

  visitComment(comment: Comment) {
    console.log('Visiting Comment');
  }

  visitAtRule(atRule: AtRule) {
    console.log('Visiting AtRule');
  }
}
```

#### Visit Structure

```ts
function visitCssAst(root: Root, visitor: CssAstVisitor) {
  augmentNodeTypeVisitor(root);

  root.visit(visitor);
  postcss.walk((root: unknown) => {
    node.visit(visitor)
  });
}

const visitor = new CssAstVisitor();
visitCssAst(stylesRoot, visitor);

// Output:
// Visiting Root
// Visiting Rule
// Visiting Decl
// ...
```





