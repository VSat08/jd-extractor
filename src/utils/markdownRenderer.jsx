import React from 'react';

/**
 * Parses inline markdown tokens (bold, italic, inline code, links) into React elements.
 * 100% client-side, zero dependencies, completely XSS-safe (uses native React elements).
 * @param {string} text 
 * @returns {React.ReactNode[]}
 */
export function renderInlineMarkdown(text) {
  if (!text) return null;

  // Regex matching:
  // 1. Bold: **text**
  // 2. Inline Code: `code`
  // 3. Italic: *text* (excluding standalone bullets)
  // 4. Links: [label](url)
  const regex = /(\*\*[^*]+?\*\*|`[^`]+?`|\*(?!\s)[^*]+?(?<!\s)\*|\[[^\]]+?\]\([^)]+?\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }

    // Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={idx} className="preview-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }

    // Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+?)\]\(([^)]+?)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <a
          key={idx}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="preview-link"
        >
          {label}
        </a>
      );
    }

    return part;
  });
}

/**
 * Parses multi-line markdown text into structured blocks (headings, paragraphs, lists, hr).
 * @param {string} text 
 * @returns {Array<Object>}
 */
export function parseMarkdownBlocks(text) {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const blocks = [];
  let currentParagraph = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: currentParagraph.join(' '),
      });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Blank line flushes active blocks
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Horizontal Rule: --- or *** or ___
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'hr' });
      continue;
    }

    // Headings: #, ##, ###, ####, etc.
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    // Unordered List Item: - item, * item, + item, • item, · item
    const ulMatch = trimmed.match(/^[-*+•·◦]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1].trim());
      continue;
    }

    // Ordered List Item: 1. item, 2. item
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1].trim());
      continue;
    }

    // Regular paragraph content
    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

/**
 * Renders raw markdown text into an array of styled React elements matching Cupertino HIG.
 * @param {string} text 
 * @returns {React.ReactNode}
 */
export function renderMarkdownBlocks(text) {
  if (!text) return null;

  const blocks = parseMarkdownBlocks(text);
  if (!blocks.length) return null;

  return (
    <div className="preview-markdown-content">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading': {
            const level = Math.min(block.level, 4);
            const HeadingTag = `h${level}`;
            return (
              <HeadingTag key={idx} className={`preview-heading-${level}`}>
                {renderInlineMarkdown(block.text)}
              </HeadingTag>
            );
          }

          case 'paragraph': {
            return (
              <p key={idx} className="preview-paragraph">
                {renderInlineMarkdown(block.text)}
              </p>
            );
          }

          case 'ul': {
            return (
              <ul key={idx} className="preview-list preview-list-unordered">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="preview-list-item">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );
          }

          case 'ol': {
            return (
              <ol key={idx} className="preview-list preview-list-ordered">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="preview-list-item">
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ol>
            );
          }

          case 'hr': {
            return <hr key={idx} className="preview-divider" />;
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
