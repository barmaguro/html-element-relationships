import React from "react";
import { Element } from "../app/types";

interface HTMLTreeProps {
  tree: Element;
  selectedElement: Element | null;
  setSelectedElement: (element: Element | null) => void;
  level?: number;
  parent?: Element;
}

const HTMLTree: React.FC<HTMLTreeProps> = ({
  tree,
  selectedElement,
  setSelectedElement,
  level = 0,
  parent,
}) => {
  const isSelected = selectedElement && tree.id === selectedElement.id;
  const isParent =
    selectedElement &&
    selectedElement.parent &&
    selectedElement.parent.id === tree.id;
  const isChild =
    selectedElement && tree.parent && tree.parent.id === selectedElement.id;
  const isSibling =
    selectedElement &&
    parent &&
    parent.children.some((child) => child.id === selectedElement.id) &&
    tree.id !== selectedElement.id;
  const isAncestor = selectedElement && isAncestorOf(tree, selectedElement);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(
      isSelected ? null : { ...tree, level, parent: parent || undefined }
    );
  };

  const getHighlightClass = () => {
    if (isSelected) return "bg-blue-200 text-blue-800";
    if (isParent) return "bg-green-200 text-green-800";
    if (isChild) return "bg-yellow-200 text-yellow-800";
    if (isSibling) return "bg-purple-200 text-purple-800";
    if (isAncestor) return "bg-orange-200 text-orange-800";
    return "";
  };

  if (tree.tag === "root") {
    return (
      <div className="bg-white text-gray-800 p-4 font-mono">
        {tree.children.map((child) => (
          <HTMLTree
            key={child.id}
            tree={child}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            level={level}
            parent={tree}
          />
        ))}
      </div>
    );
  }

  if (tree.tag === "#text") {
    if (!tree.textContent?.trim()) {
      return null;
    }
    return <span className="text-gray-600 italic">{tree.textContent}</span>;
  }

  const classString =
    tree.classes.length > 0 ? ` class="${tree.classes.join(" ")}"` : "";

  return (
    <div style={{ marginLeft: `${level * 16}px` }}>
      <span
        className={`cursor-pointer ${getHighlightClass()}`}
        onClick={handleClick}
      >
        <span className="text-gray-500">&lt;</span>
        <span className="text-blue-600">{tree.tag}</span>
        {classString && (
          <>
            <span className="text-purple-600"> class</span>
            <span className="text-gray-500">=</span>
            <span className="text-green-600">&quot;{tree.classes.join(" ")}&quot;</span>
          </>
        )}
        <span className="text-gray-500">&gt;</span>
      </span>
      {tree.textContent && !tree.children.length && tree.textContent.trim() && (
        <span className="text-gray-300 ml-2">{tree.textContent}</span>
      )}
      {tree.children.map((child) => (
        <HTMLTree
          key={child.id}
          tree={child}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          level={level + 1}
          parent={tree}
        />
      ))}
      {tree.children.length > 0 && (
        <span
          className={`cursor-pointer ${getHighlightClass()}`}
          onClick={handleClick}
        >
          <span className="text-gray-500">&lt;/</span>
          <span className="text-blue-600">{tree.tag}</span>
          <span className="text-gray-500">&gt;</span>
        </span>
      )}
    </div>
  );
};

function isAncestorOf(ancestor: Element, descendant: Element): boolean {
  let current = descendant.parent;
  while (current) {
    if (current.id === ancestor.id) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

export default HTMLTree;