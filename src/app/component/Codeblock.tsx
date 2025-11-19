"use client";

import React, { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";

// =======================================
// PRISMLIGHT IMPORT (IMPORTANT)
// =======================================
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

// Themes
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import oneLight from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";

// Languages
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";

// Register languages (NOW works with PrismLight)
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("bash", bash);

// Auto-detect language
const detectLanguage = (code: string) => {
  if (/class |def |import /.test(code)) return "python";
  if (/const |let |function |=>/.test(code)) return "javascript";
  if (/<.*?>/.test(code)) return "jsx";
  return "bash"; // fallback
};

const Codeblock = ({ text, isDarkMode = true }: any) => {
  if (!text || typeof text !== "string") return null;

  // Split text into code + inline code + normal text
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (!part) return null;

        // =============================
        // MULTILINE CODEBLOCK ``` ```
        // =============================
        if (part.startsWith("```")) {
          const code = part
            .replace(/```[\w]*/, "")
            .replace(/```$/, "")
            .trim();

          return (
            <CopyableCode key={index} code={code} isDarkMode={isDarkMode} />
          );
        }

        // =============================
        // INLINE CODE `example`
        // =============================
        if (part.startsWith("`") && part.endsWith("`")) {
          const code = part.slice(1, -1);
          return (
            <code key={index} className={`px-2 py-1 rounded font-mono text-sm ${ isDarkMode ? "bg-gray-800 text-yellow-300" : "bg-gray-200 text-yellow-700"}`} >
              {code}
            </code>
          );
        }

        // =============================
        // NORMAL TEXT
        // =============================
        return (
          <p key={index} className={`leading-6 text-sm whitespace-pre-wrap ${ isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
            {part}
          </p>
        );
      })}
    </div>
  );
};

export default Codeblock;

// =======================================
// COPYABLE CODE BLOCK COMPONENT
// =======================================

const CopyableCode = ({ code, isDarkMode }: any) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const lang = detectLanguage(code);

  return (
    <div className="relative">
      {/* Copy Button */}
      <button onClick={handleCopy} className={`absolute top-2 right-3 p-1 rounded-md transition ${ isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}>
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <ClipboardCopy className="w-4 h-4" />
        )}
      </button>

      {/* Syntax Highlighted Code */}
      <SyntaxHighlighter language={lang} style={isDarkMode ? oneDark : oneLight} wrapLines={true} showLineNumbers={true}
        customStyle={{
          borderRadius: "12px",
          padding: "16px",
          fontSize: "14px",
          marginTop: "40px",
        }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
