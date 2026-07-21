'use client';

import { createContext, useContext, useState } from 'react';

const MetaSidebarContext = createContext();

export function MetaSidebarProvider({ children }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [status, setStatus] = useState('published');
  const [readTime, setReadTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  return (
    <MetaSidebarContext.Provider
      value={{
        title,
        setTitle,
        slug,
        setSlug,
        excerpt,
        setExcerpt,
        category,
        setCategory,
        tags,
        setTags,
        featuredImage,
        setFeaturedImage,
        status,
        setStatus,
        readTime,
        setReadTime,
        isOpen,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </MetaSidebarContext.Provider>
  );
}

export const useMetaSidebar = () => useContext(MetaSidebarContext);
