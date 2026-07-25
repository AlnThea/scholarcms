import { Node, mergeAttributes } from '@tiptap/core';

export const DetailsSummary = Node.create({
  name: 'detailsSummary',
  content: 'inline*',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'summary',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'summary',
      mergeAttributes(HTMLAttributes, {
        class: 'font-bold text-base select-none cursor-pointer text-[var(--text-main)] py-1 hover:text-blue-500 transition-colors',
      }),
      0,
    ];
  },
});

export const DetailsContent = Node.create({
  name: 'detailsContent',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="details-content"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'details-content',
        class: 'mt-2 pt-2 border-t border-[var(--border-color)] text-sm text-[var(--text-muted)] leading-relaxed',
      }),
      0,
    ];
  },
});

export const Details = Node.create({
  name: 'details',
  group: 'block',
  content: 'detailsSummary detailsContent',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'details',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'details',
      mergeAttributes(HTMLAttributes, {
        class: 'my-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 shadow-sm transition-all',
        open: true,
      }),
      0,
    ];
  },
});
