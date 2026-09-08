import { useState } from 'react';

export function useMediaHandler(editor) {
  const [mediaModalState, setMediaModalState] = useState({
    isOpen: false,
    type: 'link',
    initialData: {}
  });

  const handleToggleLink = () => {
    if (!editor) return;
    const currentHref = editor.getAttributes('link').href || '';
    setMediaModalState({
      isOpen: true,
      type: 'link',
      initialData: { url: currentHref, isEditing: !!currentHref }
    });
  };

  const handleMediaModalConfirm = (data) => {
    if (!editor) return;
    const { url, text, openInNewTab, remove } = data;
    const modalType = mediaModalState.type;

    if (modalType === 'link') {
      if (remove) {
        editor.chain().focus().unsetLink().run();
      } else if (url) {
        editor.chain().focus().setLink({ href: url, target: openInNewTab ? '_blank' : '_self' }).run();
      }
    } else if (modalType === 'image') {
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } else if (modalType === 'video') {
      if (url) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
    } else if (modalType === 'button') {
      if (url && text) {
        editor.chain().focus().insertContent(`<p class="my-4"><a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-5 py-2.5 font-bold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 transition-colors no-underline">${text} ↗</a></p>`).run();
      }
    }
  };

  return { mediaModalState, setMediaModalState, handleToggleLink, handleMediaModalConfirm };
}
