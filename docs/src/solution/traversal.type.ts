/**
 * Traversal context
 * @param level - current level of the tree
 * @param isLast - is the current node the last one in the list
 *
 * @example
 * ```ts
 * const context: TraversalContext = { level: 0, isLast: false };
 * ```
 * // tree diagram with level and last child
 * A // level 0, isLast: false
 * ├── C // level 1, isLast: false
 * │   ├── D // level 2, isLast: false
 * │   └── E // level 2, isLast: true
 * └── B // level 1, isLast: true
 * */
export type TraversalContext = {
  level: number;
  last: boolean;
};
