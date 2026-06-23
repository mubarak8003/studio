
import { MetadataRoute } from 'next'
import { PlaceHolderImages } from '@/lib/placeholder-images'

export default function manifest(): MetadataRoute.Manifest {
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');
  
  return {
    name: 'RecoupPro Strategy Coach',
    short_name: 'RecoupPro',
    description: 'Master your trading recovery with algorithmic precision and AI coaching.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f171a',
    theme_color: '#14b8a6',
    icons: [
      {
        src: logo?.imageUrl || '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: logo?.imageUrl || '',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: logo?.imageUrl || '',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
