export interface Element {
  id: string;
  tag: string;
  classes: string[];
  children: Element[];
  textContent?: string;
  parent?: Element;
  level?: number;
}

export interface ParsedElement {
  tag: string;
  classes: string[];
  children: ParsedElement[];
  textContent?: string;
}

