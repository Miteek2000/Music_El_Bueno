import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyPlaylistResponse } from '../../interfaces/spotify-playlist-response';
import { Observable, map } from 'rxjs';
import { Song } from '../../interfaces/song';

@Injectable({
  providedIn: 'root'
})
export class SpotifyPlaylistService {
  
  constructor(
    private _http: HttpClient
  ){
  }

  getPlaylist(token: string): Observable<SpotifyPlaylistResponse> {
    // El interceptor adjunta Authorization automáticamente
    return this._http.get<SpotifyPlaylistResponse>('https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n');
  }

  searchTracks(query: string, limit: number = 20): Observable<Song[]> {
    const url = 'https://api.spotify.com/v1/search';
    const params = { q: query, type: 'track', limit: String(limit) };
    return this._http.get<any>(url, { params }).pipe(
      map(res => {
        const items = res?.tracks?.items ?? [];
        return items.map((t: any) => ({
          name: t?.name ?? '',
          artist: (t?.artists ?? []).map((a: any) => a.name).join(', '),
          url_cover: t?.album?.images?.[0]?.url ?? '',
          url_media: t?.preview_url ?? ''
        } as Song));
      })
    );
  }
}
