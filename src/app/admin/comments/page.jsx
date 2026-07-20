'use client';
import { redirect } from 'next/navigation';

export default function AdminCommentsRedirect() {
  redirect('/dashboard/comments');
  return null;
}
