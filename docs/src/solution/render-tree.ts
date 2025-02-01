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

export type RenderTree = {
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
): RenderTree {
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
     * ### 🎯 **Why This Matters**
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
     * ### 📌 **Example: How It Affects Indentation**
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
