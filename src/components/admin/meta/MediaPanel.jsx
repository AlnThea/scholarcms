import { Image as ImageIcon } from 'lucide-react';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
];

export default function MediaPanel({ isEn, featuredImage, setFeaturedImage }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)]/50 space-y-4">
        <h4 className="font-extrabold text-xs text-[var(--text-main)] flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-pink-500" />
          {isEn ? 'Featured Cover Image' : 'Gambar Unggulan (Cover Image)'}
        </h4>

        {/* Live Preview Card */}
        {featuredImage ? (
          <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] group aspect-video bg-black/20 shadow-md">
            <img
              src={featuredImage}
              alt="Featured Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'; }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => setFeaturedImage('')}
                className="px-3.5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-red-700 transition-colors"
              >
                {isEn ? 'Remove Image' : 'Hapus Gambar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-center text-[var(--text-subtle)] text-[11px]">
            {isEn ? 'No cover image URL selected yet' : 'Belum ada URL gambar dipilih'}
          </div>
        )}

        {/* URL Input */}
        <div>
          <label className="block text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">{isEn ? 'Cover Image URL' : 'URL Gambar Cover'}</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Preset Sample Images */}
        <div>
          <span className="block text-[10px] font-bold uppercase text-[var(--text-subtle)] mb-2">{isEn ? 'Unsplash Image Samples:' : 'Sampel Gambar Unsplash:'}</span>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_IMAGES.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFeaturedImage(img)}
                className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all ${
                  featuredImage === img ? 'border-pink-500 ring-4 ring-pink-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
