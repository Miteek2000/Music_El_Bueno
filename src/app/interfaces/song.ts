export interface Song {
    name: string,
    artist: string,
    url_cover: string,
    url_media: string
    

}

import { SpotifyPlaylistResponse } from './spotify-playlist-response';
import { SpotifyTrackResponse } from './spotify-track-response';

export function parseSpotifyPlaylist(playlistResponse: SpotifyPlaylistResponse): Song[] {
  const songs = playlistResponse.tracks.items.map(item => {
    const track: SpotifyTrackResponse = item.track;
    const artistNames = track.artists.map(a => a.name).join(', ');

    return {
      name: track.name,
      artist: artistNames,
      // Usar la carátula del álbum del track, con fallback a la imagen de la playlist
      url_cover: track.album?.images?.[0]?.url || playlistResponse.images[0]?.url || '',
      url_media: track.preview_url || '' 
    } as Song;
  });

  // Filtrar títulos que parezcan términos técnicos no musicales
  const blocked = /(\bapi\b|\bendpoint\b|\bendpoints\b|puntos\s+finales)/i;
  return songs.filter(s => !blocked.test(s.name ?? ''));
}