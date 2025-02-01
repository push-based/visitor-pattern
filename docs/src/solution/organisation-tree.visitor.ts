import { Department, Employee } from '../model';
import { Visitor } from './visitor';
import { TraversalContext } from './traversal.type';
import {
  createOrganisationRenderer,
  RenderOrganisation,
} from './render-organisation';
import { createTreeRenderer, RenderTree } from './render-tree';

export class OrganisationTreeVisitor implements Visitor {
  private _renderedTree = '';

  addToRenderedTree(line: string) {
    this._renderedTree += `${line}\n`;
  }

  get renderedTree() {
    return this._renderedTree;
  }

  constructor(
    private readonly organisationRenderer: RenderOrganisation = createOrganisationRenderer(),
    private readonly treeRenderer: RenderTree = createTreeRenderer()
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
    const indent = this.treeRenderer.renderTreeIndent(context);
    this.addToRenderedTree(
      `${indent}${this.organisationRenderer.renderDepartment(department)}`
    );

    this.treeRenderer.updateActiveBranchLevels(context);
  }

  visitEmployee(employee: Employee, context: TraversalContext) {
    const treeIndent = this.treeRenderer.renderTreeIndent(context);

    // Employees are never root, so always apply indentation
    this.addToRenderedTree(
      `${treeIndent}${this.organisationRenderer.renderEmployee(employee)}`
    );
  }
}
