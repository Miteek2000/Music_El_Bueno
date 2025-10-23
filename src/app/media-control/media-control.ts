import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Song } from '../interfaces/song';

@Component({
  selector: 'app-media-control',
  templateUrl: './media-control.html',
  styleUrls: ['./media-control.css'],
  standalone: false
})
export class MediaControl implements OnChanges {
  @Input() currentSong!: Song;
  @Input() playlist: Song[] = [];

  @Output() currentSongChange = new EventEmitter<Song>();

  @ViewChild('audioRef', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  isPlaying = false;
  progress = 0; // 0-100

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSong'] && this.currentSong) {
      const audio = this.audioRef?.nativeElement;
      if (audio) {
        audio.src = this.currentSong.url_media || '';
        audio.load();
        // Autoplay si hay URL válida
        if (this.currentSong.url_media) {
          audio.play().then(() => this.isPlaying = true).catch(() => this.isPlaying = false);
        } else {
          this.isPlaying = false;
        }
      }
    }
  }

  private get currentIndex(): number {
    return this.playlist.findIndex(s => s.url_media === this.currentSong?.url_media && s.name === this.currentSong?.name);
  }

  playPause(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) return;
    if (!this.currentSong?.url_media) return;

    if (audio.paused) {
      audio.play().then(() => this.isPlaying = true).catch(() => this.isPlaying = false);
    } else {
      audio.pause();
      this.isPlaying = false;
    }
  }

  prev(): void {
    if (!this.playlist?.length) return;
    const idx = this.currentIndex;
    const prevIdx = idx > 0 ? idx - 1 : this.playlist.length - 1;
    const nextSong = this.playlist[prevIdx];
    if (nextSong) this.currentSongChange.emit(nextSong);
  }

  next(): void {
    if (!this.playlist?.length) return;
    const idx = this.currentIndex;
    const nextIdx = idx >= 0 ? (idx + 1) % this.playlist.length : 0;
    const nextSong = this.playlist[nextIdx];
    if (nextSong) this.currentSongChange.emit(nextSong);
  }

  onTimeUpdate(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio || !audio.duration) return;
    this.progress = (audio.currentTime / audio.duration) * 100;
  }

  onSeek(event: Event): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio || !audio.duration) return;
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    audio.currentTime = (value / 100) * audio.duration;
  }

  onEnded(): void { this.next(); }
}
