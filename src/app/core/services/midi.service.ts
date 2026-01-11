import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Endpoints, Methods } from 'app/enums/api';
import { BehaviorSubject, catchError, from, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { Midi } from '@tonejs/midi';

@Injectable({
    providedIn: 'root'
})
export class MidiService {
    private _midi$ = new BehaviorSubject<any[]>([]);
    public midi$ = this._midi$.asObservable();

    constructor(private apiService: ApiService) { }

    loadMidi(transcriptionId: string): void {
        this.apiService
            .request(
                Endpoints.MUSIC_TRANSCRIPTION_GET_MIDI,
                Methods.GET,
                { urlReplacements: { id: transcriptionId }, responseType: 'arraybuffer' }
            )
            .pipe(
                switchMap((response: ArrayBuffer) => from(new Midi(response).tracks)),
                map(track => {
                    const notes: any[] = [];
                    track.notes.forEach(note => {
                        notes.push([
                            note.time,              // start time
                            note.time + note.duration, // end time
                            note.midi               // pitch
                        ]);
                    });
                    return notes;
                }),
                tap(notes => {
                    this._midi$.next(notes);
                }),
                catchError(error => {
                    console.error('Error loading MIDI:', error);
                    return throwError(() => error);
                })
            ).subscribe();
    }
}
