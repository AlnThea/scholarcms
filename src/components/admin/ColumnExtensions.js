import { Node, mergeAttributes } from '@tiptap/core';

export const Column = Node.create({
  name: 'column',
  content: 'block+',
  isolate: true,

  addAttributes() {
    return {
      width: {
        default: '50%',
        parseHTML: element => element.getAttribute('data-width') || element.style.width || '50%',
        renderHTML: attributes => {
          return {
            'data-width': attributes.width,
            style: `width: ${attributes.width}; flex-basis: ${attributes.width}; flex-grow: 0; flex-shrink: 0;`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'column',
        class: 'column-box p-3 rounded-xl border-2 border-dashed border-blue-400/40 bg-[var(--bg-surface)] hover:border-blue-500 transition-all min-h-[90px]',
      }),
      0,
    ];
  },
});

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'columns',
        class: 'columns-container flex flex-row gap-4 my-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 w-full overflow-hidden',
      }),
      0,
    ];
  },
});
