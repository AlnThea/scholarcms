'use client';
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function AdminCatchAllRedirect() {
  const pathname = usePathname();
  // Remove the leading '/admin' segment
  const newPath = pathname.replace(/^\/admin/, '/dashboard');
  redirect(newPath);
  return null;
}
