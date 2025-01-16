import React from "react";
import { Element } from "../app/types";

interface ElementInfoProps {
  element: Element | null;
}

const ElementInfo: React.FC<ElementInfoProps> = ({ element }) => {
  if (!element) {
    return (
      <div className="text-lg text-gray-800 p-4 bg-blue-100 rounded">
        要素を選択してください
      </div>
    );
  }

  const getAncestors = (element: Element): Element[] => {
    const ancestors: Element[] = [];
    let current = element.parent;
    while (current) {
      ancestors.unshift(current);
      current = current.parent;
    }
    return ancestors;
  };

  const getValidChildren = (element: Element) =>
    element.children.filter(
      (child) => child.tag !== "#text" || child.textContent?.trim()
    );

  const ancestors = getAncestors(element);

  return (
    <div className="text-gray-800 md:sticky md:top-0">
      <h2 className="text-xl font-bold mb-6 text-gray-900">
        選択された要素
        <span className=" px-2 bg-blue-200 block w-fit">
          &lt;{element ? `${element.tag}` : "なし"}
          {element && element.classes.length > 0
            ? ` class="${element.classes}"`
            : ""}
          &gt;
        </span>
      </h2>
      <p className="mb-4">
        <span className="font-semibold text-gray-600 ">祖先要素</span>{" "}
        <ul className="flex flex-col gap-1">
          {ancestors.length > 0
            ? ancestors.slice(0, -1).map((ancestor, index) => (
                <li
                  key={ancestor.id}
                  className="px-2 block w-fit bg-orange-200"
                  style={{ marginLeft: `${index * 12}px` }}
                >
                  &lt;{ancestor.tag}
                  {ancestor.classes.length > 0
                    ? ` class="${ancestor.classes.join(" ")}"`
                    : ""}
                  /&gt;
                </li>
              ))
            : "なし"}
        </ul>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-gray-600">親要素</span>
        <span className=" px-2 bg-green-200 block w-fit">
          &lt;{element.parent ? `${element.parent.tag}` : "なし"}
          {element.parent && element.parent.classes.length > 0
            ? ` class="${element.parent.classes}"`
            : ""}
          &gt;
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-gray-600">子要素</span>
        <ul className="flex flex-col gap-1">
          {getValidChildren(element).length > 0
            ? getValidChildren(element).map((child) =>
                child.tag === "#text" ? (
                  `${element.textContent}`
                ) : (
                  <li key={child.id} className="px-2 bg-yellow-200 block w-fit">
                    &lt;{child.tag}
                    {child.classes.length > 0
                      ? ` class="${child.classes}"`
                      : ""}
                    /&gt;
                  </li>
                )
              )
            : "なし"}
        </ul>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-gray-600">兄弟要素:</span>{" "}
        <ul className="flex flex-col gap-1">
          {element.parent
            ? getValidChildren(element.parent)
                .filter((child) => child.id !== element.id)
                .map((child) =>
                  child.tag === "#text" ? (
                    `${element.textContent}`
                  ) : (
                    <li
                      key={child.id}
                      className="px-2 bg-purple-200 block w-fit"
                    >
                      &lt;{child.tag}
                      {child.classes.length > 0
                        ? ` class="${child.classes}"`
                        : ""}
                      /&gt;
                    </li>
                  )
                )
            : "なし"}
        </ul>
      </p>
    </div>
  );
};

export default ElementInfo;
