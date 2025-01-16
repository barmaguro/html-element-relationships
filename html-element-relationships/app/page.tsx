'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic';
import ElementInfo from './components/ElementInfo'
import { Element } from './types'
import { parseAndConvertHTML } from './utils/htmlParser'
import { Label } from "@/components/ui/label"

const initialHTML = `
<header class="main-header">
  <h1 class="title">Welcome to Our Website</h1>
  <nav class="main-nav">
    <ul class="nav-list">
      <li class="nav-item"><a href="#home">Home</a></li>
      <li class="nav-item"><a href="#about">About</a></li>
      <li class="nav-item"><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>
<main class="content">
  <article class="main-article">
    <h2 class="article-title">Latest News</h2>
    <p class="article-content">
      We're excited to announce the launch of our new product line!
      Stay tuned for more information coming soon.
    </p>
  </article>
  <aside class="sidebar">
    <h3 class="sidebar-title">Quick Links</h3>
    <ul class="sidebar-list">
      <li class="sidebar-item"><a href="#products">Our Products</a></li>
      <li class="sidebar-item"><a href="#services">Our Services</a></li>
    </ul>
  </aside>
</main>
<footer class="main-footer">
  <p class="copyright">&copy; 2023 Our Company. All rights reserved.</p>
</footer>
`

const DynamicHTMLTree = dynamic(() => import('./components/HTMLTree'), { ssr: false });

export default function Home() {
  const [htmlInput, setHtmlInput] = useState(initialHTML)
  const [tree, setTree] = useState<Element>({
    id: 'root',
    tag: 'root',
    classes: [],
    children: [],
  });
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)

  useEffect(() => {
    setTree(parseAndConvertHTML(htmlInput));
    setSelectedElement(null);
  }, [htmlInput])

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4 overflow-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">HTMLの要素関係を知ろう！</h1>
          <DynamicHTMLTree
            tree={tree}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
        </div>
        <div className="w-full md:w-1/2 p-4 bg-gray-50 border-t md:border-t-0 md:border-l">
          <ElementInfo element={selectedElement} />
        </div>
      </div>
      <div className="p-4 bg-gray-100">
        <div className=" mx-auto">
          <Label htmlFor="html-input" className="block text-lg font-medium text-gray-700 mb-2">
            HTMLを下記の入力欄に入力してください。
            <p className="text-red-500 text-sm">
              うまく反映されない場合はタグがセットになっているか確認してください。
            </p>
          </Label>
          <textarea
            id="html-input"
            className="w-full h-64 p-2 border rounded bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="ここにHTMLを入力してください..."
          />
        </div>
      </div>
    </div>
  )
}

