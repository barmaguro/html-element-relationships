import { ParsedElement, Element } from '../types';

function parseHTML(html: string): ParsedElement[] {
  if (typeof window === 'undefined') {
    console.warn('parseHTML is being called on the server side. Returning an empty array.');
    return [];
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return Array.from(doc.body.childNodes).map(parseNode).filter((node): node is ParsedElement => node !== null);
}

function parseNode(node: Node): ParsedElement | null {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    if (text) {
      return {
        tag: '#text',
        classes: [],
        children: [],
        textContent: text,
      };
    }
    return null; // 空白や改行のみのテキストノードを無視
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as HTMLElement;
    return {
      tag: element.tagName.toLowerCase(),
      classes: Array.from(element.classList),
      children: Array.from(element.childNodes)
        .map(parseNode)
        .filter((child): child is ParsedElement => child !== null),
      textContent: element.childNodes.length === 1 && element.firstChild?.nodeType === Node.TEXT_NODE ? element.textContent?.trim() : undefined,
    };
  }
  return null;
}

function convertToElement(parsed: ParsedElement, parent?: Element): Element {
  const id = Math.random().toString(36).substr(2, 9);
  const element: Element = {
    id,
    tag: parsed.tag,
    classes: parsed.classes,
    children: [],
    textContent: parsed.textContent,
    parent,
  };
  element.children = parsed.children.map(child => convertToElement(child, element));
  return element;
}

export function parseAndConvertHTML(html: string): Element {
  if (typeof window === 'undefined') {
    console.warn('parseAndConvertHTML is being called on the server side. Returning an empty root element.');
    return {
      id: 'root',
      tag: 'root',
      classes: [],
      children: [],
    };
  }
  const parsed = parseHTML(html);
  return {
    id: 'root',
    tag: 'root',
    classes: [],
    children: parsed.filter((p): p is ParsedElement => p !== null).map(p => convertToElement(p)),
  };
}

