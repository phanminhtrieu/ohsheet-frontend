import { Component } from '@angular/core';

@Component({
  selector: 'app-vexflow-midi-player',
  standalone: true,
  imports: [],
  templateUrl: './vexflow-midi-player.component.html',
  styleUrl: './vexflow-midi-player.component.scss'
})
export class VexflowMidiPlayerComponent {
  isPlaying = false;

  togglePlay(): void {
    // this.isPlaying = !this.isPlaying;
    console.log('Toggle play');
    // TODO: Implement actual MIDI playback logic
  }
}
