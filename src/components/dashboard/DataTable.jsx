'use client';

import React from 'react';

export default function DataTable({
  headers = [],
  children,
  loading = false,
  emptyMessage = 'Tidak ada data ditemukan.',
  className = '',
}) {
  return (
    <div className={`p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm ${className}`}>
      {loading ? (
        <div className="py-12 text-center text-xs font-semibold text-[var(--text-subtle)]">
          Memuat data...
        </div>
      ) : children ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-main)]">
            {headers.length > 0 && (
              <thead className="bg-[var(--bg-primary)] text-xs uppercase text-[var(--text-muted)] font-semibold border-y border-[var(--border-color)]">
                <tr>
                  {headers.map((h, idx) => (
                    <th
                      key={idx}
                      className={`py-3 px-4 ${typeof h === 'object' && h.align === 'right' ? 'text-right' : ''}`}
                    >
                      {typeof h === 'object' ? h.label : h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-[var(--border-color)]">
              {children}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-xs font-semibold text-[var(--text-subtle)]">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
