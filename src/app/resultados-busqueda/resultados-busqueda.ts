import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyPlaylistService } from '../services/spotify-api/spotify-playlist-service';
import { Song } from '../interfaces/song';

@Component({
  selector: 'app-resultados-busqueda',
  standalone: false,
  templateUrl: './resultados-busqueda.html',
  styleUrls: ['./resultados-busqueda.css']
})
export class ResultadosBusqueda implements OnInit {
  resultados: Song[] = [];
  query = '';

  constructor(private route: ActivatedRoute, private spotify: SpotifyPlaylistService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = (params['q'] ?? '').trim();
      if (this.query) {
        this.spotify.searchTracks(this.query).subscribe(songs => this.resultados = songs);
      } else {
        this.resultados = [];
      }
    });
  }
}
