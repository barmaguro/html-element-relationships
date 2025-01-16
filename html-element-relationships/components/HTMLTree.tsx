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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(isSelected ? null : { ...tree, level, parent: parent || undefined });
  };

  const getHighlightClass = () => {
    if (isSelected) return "bg-blue-200 text-blue-800";
    if (isParent) return "bg-green-200 text-green-800";
    if (isChild) return "bg-yellow-200 text-yellow-800";
    if (isSibling) return "bg-purple-200 text-purple-800";
  };

  return (
    <div onClick={handleClick} className={`p-2 ${getHighlightClass()}`}>
      &lt;{tree.tag}
      {tree.classes.length > 0 ? ` class=&quot;${tree.classes.join(" ")}&quot;` : ""}
      &gt;
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
      &lt;/{tree.tag}&gt;
    </div>
  );
};

export default HTMLTree;
