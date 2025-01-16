import React from 'react'
import { Element } from '../types'

interface ElementInfoProps {
  element: Element | null
}

const ElementInfo: React.FC<ElementInfoProps> = ({ element }) => {
  if (!element) {
    return <div className="text-lg text-gray-800 p-4 bg-blue-100 rounded">要素を選択してください</div>
  }

  const getAncestors = (element: Element): Element[] => {
    const ancestors: Element[] = []
    let current = element.parent
    while (current) {
      ancestors.unshift(current)
      current = current.parent
    }
    return ancestors
  }

  const getValidChildren = (element: Element) => 
    element.children.filter(child => child.tag !== '#text' || child.textContent?.trim());

  const ancestors = getAncestors(element)

  return (
    <div className="text-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-900">選択された要素: {element.tag}</h2>
      <p className="mb-2">
        <span className="font-semibold text-gray-600">親要素:</span> {element.parent ? `${element.parent.tag} (緑色の背景でハイライト)` : 'なし'}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-gray-600">子要素:</span> {
          getValidChildren(element).length > 0 
            ? getValidChildren(element)
                .map(child => child.tag === '#text' ? 'テキスト' : child.tag)
                .join(', ') + ' (黄色の背景でハイライト)' 
            : 'なし'
        }
      </p>
      <p className="mb-2">
        <span className="font-semibold text-gray-600">兄弟要素:</span> {
          element.parent
            ? getValidChildren(element.parent)
                .filter(child => child.id !== element.id)
                .map(child => child.tag === '#text' ? 'テキスト' : child.tag)
                .join(', ') + ' (紫色の背景でハイライト)'
            : 'なし'
        }
      </p>
      <p className="mb-4">
        <span className="font-semibold text-gray-600">祖先要素:</span> {
          ancestors.length > 0
            ? ancestors.map(ancestor => ancestor.tag).join(' > ') + ' (オレンジ色の背景でハイライト)'
            : 'なし'
        }
      </p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">要素の説明:</h3>
        <ul className="list-disc list-inside">
          <li><span className="font-semibold text-blue-800 bg-blue-200 px-1 rounded">青色:</span> 選択された要素</li>
          <li><span className="font-semibold text-green-800 bg-green-200 px-1 rounded">緑色:</span> 親要素</li>
          <li><span className="font-semibold text-yellow-800 bg-yellow-200 px-1 rounded">黄色:</span> 子要素</li>
          <li><span className="font-semibold text-purple-800 bg-purple-200 px-1 rounded">紫色:</span> 兄弟要素</li>
          <li><span className="font-semibold text-orange-800 bg-orange-200 px-1 rounded">オレンジ色:</span> 祖先要素</li>
        </ul>
      </div>
    </div>
  )
}

export default ElementInfo

