import { Node, mergeAttributes } from '@tiptap/core';

export const AccordionHeader = Node.create({
  name: 'accordionHeader',
  content: 'inline*',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="accordion-header"]',
      },
      {
        tag: 'summary',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'accordion-header',
        class: 'font-extrabold text-base cursor-text text-[var(--text-main)] p-3 bg-[var(--bg-primary)]/60 hover:bg-blue-500/10 hover:text-blue-500 transition-colors flex items-center justify-between border-b border-[var(--border-color)]',
      }),
      0,
    ];
  },
});

export const AccordionContent = Node.create({
  name: 'accordionContent',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="accordion-content"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'accordion-content',
        class: 'p-4 text-sm text-[var(--text-muted)] leading-relaxed bg-[var(--bg-surface)]',
      }),
      0,
    ];
  },
});

export const AccordionItem = Node.create({
  name: 'accordionItem',
  group: 'block',
  content: 'accordionHeader accordionContent',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="accordion-item"]',
      },
      {
        tag: 'details',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'accordion-item',
        class: 'my-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-sm transition-all',
      }),
      0,
    ];
  },
});

export const AccordionGroup = Node.create({
  name: 'accordionGroup',
  group: 'block',
  content: 'accordionItem+',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="accordion-group"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'accordion-group',
        class: 'accordion-group-box my-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3 w-full',
      }),
      0,
    ];
  },
});
