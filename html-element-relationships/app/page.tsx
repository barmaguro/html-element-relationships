"use client";

import ElementInfo from "@/components/ElementInfo";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Element } from "./types";
import { parseAndConvertHTML } from "./utils/htmlParser";

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
`;

const DynamicHTMLTree = dynamic(() => import("@/components/HTMLTree"), {
  ssr: false,
});

export default function Home() {
  const [htmlInput, setHtmlInput] = useState(initialHTML);
  const [tree, setTree] = useState<Element>({
    id: "root",
    tag: "root",
    classes: [],
    children: [],
  });
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  useEffect(() => {
    setTree(parseAndConvertHTML(htmlInput));
    setSelectedElement(null);
  }, [htmlInput]);

  return (
    <div className="flex flex-col bg-gray-50 text-gray-800">
      <header className="">
        <h1 className="text-2xl font-bold py-2 px-4 text-white text-center bg-gray-800">
          HTMLの要素関係を知ろう!
        </h1>
        <p className="">
          
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-screen-xl px-4 mx-auto">
        <div className="w-full  py-4 pr-4 overflow-auto">
          <DynamicHTMLTree
            tree={tree}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
          />
        </div>
        <div className="w-full  p-4 bg-gray-50 border-t md:border-t-0 md:border-l">
          <ElementInfo element={selectedElement} />
        </div>
      </div>
      <div className="p-4 bg-gray-100">
        <div className=" max-w-screen-xl mx-auto">
          <Label
            htmlFor="html-input"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            HTMLを書き換えたい場合はこちらにHTMLをコピペしてください。
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
  );
}
