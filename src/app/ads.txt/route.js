import { dbService } from '@/services/dbService';

export const dynamic = 'force-dynamic';

export async function GET() {
  let adContent = '# Google AdSense ads.txt - ScholarCMS Engine\n';
  
  try {
    const adSettings = await dbService.getAdSenseSettings();
    const pubId = (adSettings?.adClient || adSettings?.publisherId || '').trim();
    const isEnabled = adSettings?.globalEnableAds ?? adSettings?.enabled ?? false;

    if (isEnabled && pubId && pubId !== 'ca-pub-9999999999999999') {
      adContent += `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
    } else {
      adContent += '# Status: AdSense is currently using demo key or disabled in Admin Settings.\n';
      adContent += '# Update your official Publisher ID at /dashboard/settings to enable live ads.txt.\n';
    }
  } catch (error) {
    console.error('Error generating ads.txt:', error);
    adContent += '# Error loading AdSense configuration.\n';
  }

  return new Response(adContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
