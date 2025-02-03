# Angular Component Tree

## Legend

- 📂 Directory
- 📦 Package Entry
- 🅰️ Angular Rc
- 🟦 TypeScript Rc
- ┃ File system
- │ AST Tree
- "⤷" - File System Reference
- "↳" - Code Reference 
- "└↘" - AST Reference
- fs-tree  
```bash
  ┗━━┃ 
     ┣━━ file
     ┃   ⤷ file
     ┃  
     ┗━━
```
- as-tree
```bash
  └──│
     ├──↳ 
     └──↘ 
```

## File Tree

```bash
root
┣━━ 📂public
┃   ┗━━
┣━━ 📂src 
┃   ┣━━ 📂app 
┃   ┃   ┣━━ 📂until 
┃   ┃   ┃   ┣━━ 📂button 
┃   ┃   ┃   ┃   ┗━━ button.component.ts
┃   ┃   ┃   ┃        ↳ inline-css
┃   ┃   ┃   ┃        ↳ inline-html
┃   ┃   ┃   ┣━━ 📂select 
┃   ┃   ┃   ┃   ┣━━ select.component.ts
┃   ┃   ┃   ┃   ┣━━ ⤷ select.component.css
┃   ┃   ┃   ┃   ┗━━ ⤷ select.component.html
┃   ┃   ┃   ┗━━...   
┃   ┃   ┣━━ app.routes.ts
┃   ┃   ┣━━ app.component.ts
┃   ┃   ┗━━ app.config.ts
┃   ┣━━ index.html
┃   ┣━━ main.ts
┃   ┗━━ styles.css
┣━━ 📦package.json
┣━━ 🟦tsconfig.json
┣━━ 🅰️angular.json
┗━━ README.md 
```

## Inline Assets (Styles and Templates)

```bash
root
┣━━ 📂any
    ┗━━ any.component.ts
        ↳ inline-0-css # styles[0]: `.btn { color: red; }`
        ↳ inline-1-css # styles[1]: `.btn-primary { color: blue; }`
        ↳ inline-html # template: `<button class="btn btn-primary">Click me</button>`
```

## External Assets (Styles and Templates)

```bash
root
┣━━ 📂any
    ┗━━ any.component.ts
        ┣━━ ⤷ any.style-0.css  # styleUrls[0]: './any.component.css'
        ┃      ↳ `.btn { color: red; }`
        ┣━━ ⤷ any.style-1.css  # styleUrls[1]: './any.component.css'
        ┃      ↳ `.btn-primary { color: blue; }`
        ┗━━ ⤷ any.component.html # templateUrl: './any.component.html'
               ↳ `<button class="btn btn-primary">Click me</button>`
```


## Find Components Files - regex matching

- 'src/app/app.component.ts'
- 'src/app/until/button/button.component.ts'
- 'src/app/until/select.component.ts'


## TS Program

```bash
root
┗━━ angular.json
    ↳ index.html
    ↳ styles.css
    ↳ tsconfig.json
    ↳ main.ts # Program entry
      └↘ app.config.ts
         └↘ app.routes.ts  
            └↘ app/app.component.ts      
               ├↘ button.component.ts
               │  ↳ styles[0]: `*{}`
               │  ↳ styles[1]: `*{}`
               │  ↳ template: `</>`
               └↘ select.component.ts
                  ├↘ styleUrls[0]: select.component.css
                  │                ↳ `*{}`
                  ├↘ styleUrls[1]: select.component.html
                  │                ↳ `*{}`
                  └↘ templateUrl: select.component.html
                                  ↳ `</>`
```

## Parsed Component Class

```bash
ParsedComponentClass # Tree Root
├↳ filePath: 'src/app/until/button/button.component.ts'
├↳ componentClass: 'ButtonComponent' # `ts.ClassDeclaration` -> `name`
├↳ styleUrls # `ts.ClassDeclaration` -> `ts.DecoratorDeclaration` -> `ts.Expression` -> `ts.Expression` -> `value` -> `text`.split()
│   └↳ [0] # index
│       ├↳ startLine: 4
│       └↳ value: '.css'
├↳ styles 
│  └↳ [0]
│      ├↳ startLine: 4
│      └↳ value: `*{}` 
├↳ template # `ts.ClassDeclaration` -> `ts.DecoratorDeclaration` -> `ts.Expression` -> `value` -> `text`
│  ├↳ startLine: 0
│  └↳ value: `</>`
├↳ templateUrl # `ts.ClassDeclaration` -> `ts.DecoratorDeclaration` -> `ts.Expression` -> `value` -> `text`
│  ├↳ startLine: 0
│  └↳ value:  '.html'
└↳ source: TsAstNode # `ts.getSourceFile(filePath)`
           ├↘ TsAstNode # `ts.ClassDeclaration`
           │  ├↘ TmplAstExpression
           │  │  └↘ [0] # index 
           │  │      └↘ text: `*{}`
           │  └↘ template: `<button class="btn btn-primary btn-special">...</button>`
           └↘ TsAstNode
              ├↘ TmplAstExpression
              │  └↘ [0]
              │      └↘ text: '.css'
              │                ⤷ `*{}`
              └↘ templateUrl: '.html'
                               ⤷ `</>`
```

## Resolved Component Class

```bash
├↳ filePath: 'src/app/until/button/button.component.ts'
├↳ componentClass: 'button' # `ts.ClassDeclaration` -> `name` -> 'Component'
├↳ styleUrls
│  └↳ 0 
│     ├↳ startLine: 4
│     ├↳ value: '.css'
│     └↳ sourceFile: CssAstNode
│                  └↘ CssAstRule
│                     └↘ CssAstDeclaration
│                        └↘ text: 'btn'
├↳ styles 
│  └↳ 0 
│     ├↳ startLine: 4
│     ├↳ value: `{}` 
│     └↳ source: CssAstNode
│                    └↘ CssAstRule
│                       └↘ CssAstDeclaration
│                          └↘ text: 'btn'
├↳ template
│  ├↳ startLine: 0
│  ├↳ value: `</>`
│  └↳ source: TmplAstNode
│                └↘ TmplAstExpression
│                   └↘ TmplAstValue
│                      └↘ text: 'btn'
├↳ templateUrl
│  ├↳ startLine: 0
│  ├↳ value:  '.html'
│  └↳ source: TmplAstNode
│                 └↘ TmplAstExpression
│                    └↘ TmplAstValue
│                       └↘ text: 'btn'
└↳ source: TsAstNode 
               ├↘ TsAstNode 
               │  ├↘ TmplAstExpression
               │  │  └↘ 0: 
               │  │     └↘ text: `*{}`
               │  └↘ TmplAstNode
               │     └↘ text: 'class="btn btn-primary btn-special"'
               └↘ TsAstNode
                  ├↘ TsAstNode
                  │  └↘ 0: TsAstNode
                  │        └↘ text: '.select'
                  └↘ TsAstNode
                     └↘ text: 'class="select open"'
```
