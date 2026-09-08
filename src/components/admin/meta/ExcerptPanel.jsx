import { FileText } from 'lucide-react';

export default function ExcerptPanel({ isEn, excerpt, setExcerpt }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-3">
        <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            {isEn ? 'Excerpt & Summary' : 'Ringkasan Excerpt'}
          </span>
          <span className="text-[10px] text-[var(--text-subtle)] font-mono">
            {excerpt ? excerpt.length : 0} {isEn ? 'chars' : 'karakter'}
          </span>
        </h4>

        <textarea
          rows={5}
          placeholder={isEn ? "Write a short article summary for preview cards..." : "Tulis ringkasan singkat artikel untuk kartu pratinjau..."}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-amber-500 transition-colors leading-relaxed"
        />
        <p className="text-[10px] text-[var(--text-subtle)] italic">
          {isEn ? '💡 This summary will appear on article cards on the homepage and search results.' : '💡 Ringkasan ini akan tampil pada kartu artikel di halaman depan dan hasil pencarian.'}
        </p>
      </div>
    </div>
  );
}
