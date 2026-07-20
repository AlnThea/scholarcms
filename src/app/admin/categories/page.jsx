'use client';
import { redirect } from 'next/navigation';

export default function AdminCategoriesRedirect() {
  redirect('/dashboard/categories');
  return null;
}
