
import { MetadataRoute } from 'next'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default function manifest(): MetadataRoute.Manifest {
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');
  
  return {
    name: 'RecoupPro Strategy Coach',
    short_name: 'RecoupPro',
    description: 'Master your trading recovery with algorithmic precision.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f171a',
    theme_color: '#14b8a6',
    icons: [
      {
        src: logo?.imageUrl || 'https://picsum.photos/seed/rp-trading-logo/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: logo?.imageUrl || 'https://picsum.photos/seed/rp-trading-logo/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
