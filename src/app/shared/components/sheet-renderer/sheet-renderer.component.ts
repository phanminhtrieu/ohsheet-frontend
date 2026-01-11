import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import VexFlow, { Factory, EasyScore, Voice, Formatter, Stave, StaveNote } from 'vexflow';
import {
  start as ToneStart,
  getTransport,
  PolySynth,
  AMSynth,
  Part
} from "tone";
import { MidiService } from 'app/core/services/midi.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { Midi } from "@tonejs/midi";
import { Subject, takeUntil } from 'rxjs';
import { LocalHostConstant } from 'app/shared/constants';

interface Note {
  start: number;
  note: string;
  duration: number;
  [key: string]: any; // hỗ trợ các thuộc tính khác
}

@Component({
  selector: 'app-sheet-renderer',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sheet-renderer.component.html',
  styleUrl: './sheet-renderer.component.scss'
})
export class SheetRendererComponent implements OnDestroy {
  @ViewChild('sheetContainer', { static: true }) sheetContainer!: ElementRef<HTMLDivElement>;
  @Input() chunkSize: number = 8;

  constructor(
    private midiService: MidiService,
    private localStorageService: LocalStorageService
  ) { }

  allNotePositions: any[] = [];
  cursors: any[] = [];
  animationFrameId?: number;
  synth!: any;
  part!: any;
  isPlaying = false;
  startTime = 0;

  previewNotes: [number, number, number][] = []
  private destroy$ = new Subject<void>();

  async ngOnInit(): Promise<void> {
    const transcriptionId = this.localStorageService.getItem(LocalHostConstant.TRANSCRIPTION_ID);
    if (transcriptionId) {
      this.midiService.loadMidi(transcriptionId);
    }

    this.midiService.midi$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notes => {
        if (notes && notes.length > 0) {
          this.previewNotes = notes;
          console.log("🎵 Loaded MIDI notes:", this.previewNotes);
          this.renderNotes(this.previewNotes, true);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  renderNotes(notesArray: [number, number, number][], isDemo: boolean) {
    // reset trước khi render lại
    this.allNotePositions = [];

    // Cấu hình
    const staveWidth = 450;  // chiều rộng mỗi dòng khuông
    const chunkSize = this.chunkSize;     // số nốt tối đa mỗi dòng
    let yOffset = 20;        // vị trí Y bắt đầu
    const xOffset = 35;
    const lines = Math.ceil(notesArray.length / chunkSize);
    const staveHeight = 100; // chiều cao giữa các dòng
    const svgHeight = lines * staveHeight + 40; // thêm padding

    // Tạo Factory
    const vf = new Factory({
      renderer: { elementId: 'sheet-container', width: 520, height: svgHeight },
    });
    const score = vf.EasyScore();
    const context = vf.getContext();

    // Chuyển từ tín hiệu MIDI -> ký hiệu chữ c, d, e, ...
    const vexflowNotes = notesArray.map(([start, end, pitch]) => this.midiToVexflowKey(start, end, pitch));
    const vexflowSortedNotes = vexflowNotes.sort((a, b) => a.start - b.start);

    const groupedNotesString = this.notesToString(vexflowSortedNotes);
    const groupedNotesArray = groupedNotesString.split(", ");

    let line = 1;
    // Chia nốt thành từng chunk
    for (let i = 0; i < groupedNotesArray.length; i += chunkSize) {
      const chunk = groupedNotesArray.slice(i, i + chunkSize);

      const voice = new Voice();
      voice.setMode(Voice.Mode.SOFT); // Không quan tâm nó có bao nhiêu phách trong một ô nhịp

      // Add note vào 1 voice
      const tickables = score.notes(chunk.join(", "));
      voice.addTickables(tickables);

      // Tạo stave thủ công
      const stave = new Stave(xOffset, yOffset, staveWidth);
      stave.addClef('treble').setContext(context).draw();

      // Đánh số dòng bằng context 
      const ctx = vf.getContext();
      const y = stave.getYForTopText() + 35;
      ctx.fillText(`${line}`, 15, y);

      const voices = [voice];

      this.formatVoices(voices, stave);
      this.drawVoicesOnStave(context, stave, voices);

      // Ghi lại vị trí từng nốt
      const notePositions = tickables.map((n, idx) => ({
        start: vexflowSortedNotes[i + idx]?.start ?? 0,
        end: vexflowSortedNotes[i + idx]?.end ?? 0,
        x: n.getAbsoluteX(),
        y: yOffset,
      }));

      this.allNotePositions.push(...notePositions);

      // 🟥 Tạo thanh cursor cho dòng hiện tại
      const cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cursor.setAttribute("x1", xOffset.toString());
      cursor.setAttribute("x2", xOffset.toString());
      cursor.setAttribute("y1", yOffset.toString());
      cursor.setAttribute("y2", (yOffset + staveHeight - 20).toString());
      cursor.setAttribute("stroke", "red");
      cursor.setAttribute("stroke-width", "2");

      const svg = document.querySelector("#sheet-container svg");
      svg?.appendChild(cursor);

      // Lưu để animate theo chunk
      this.cursors.push(cursor);


      // Tăng yOffset cho dòng tiếp theo
      yOffset += staveHeight;
      line = line + 1;
    }

    vf.draw();
  }

  play() {
    this.playMidi(this.previewNotes);

  }

  midiToVexflowKey(startTime: number, endTime: number, pitch: number): { start: number, end: number, note: string } {
    const noteNames = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
    const octave = Math.floor(pitch / 12) - 1;
    const name = noteNames[pitch % 12];
    return {
      start: startTime,
      end: endTime,
      note: `${name}${octave}`
    };
  }

  notesToString(notes: any, tolerance = 0.1): string {
    if (!notes || notes.length === 0) return "";

    const result: string[] = [];
    let currentGroup: Note[] = [];

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const last = currentGroup[currentGroup.length - 1];

      if (last && Math.abs(note.start - last.start) <= tolerance) {
        // cùng thời điểm -> thêm vào group
        currentGroup.push(note);
      } else {
        // xử lý group cũ
        if (currentGroup.length > 0) {
          if (currentGroup.length === 1) {
            result.push(`${currentGroup[0].note}/q`);
          } else {
            const chordNotes = currentGroup.map(n => n.note).join(" ");
            result.push(`(${chordNotes})/q`);
          }
        }
        // bắt đầu group mới
        currentGroup = [note];
      }
    }

    // push group cuối cùng
    if (currentGroup.length > 0) {

      if (currentGroup.length === 1) {
        result.push(`${currentGroup[0].note}/q`);
      } else {
        const chordNotes = currentGroup.map(n => n.note).join(" ");
        result.push(`(${chordNotes})/q`);
      }
    }

    return result.join(", ");
  }

  formatVoices(voices: Voice | Voice[], stave: Stave) {
    const voiceArray = Array.isArray(voices) ? voices : [voices];
    new Formatter().joinVoices(voiceArray).format(voiceArray, stave.getWidth() - 50);
  }

  drawVoicesOnStave(
    context: any,
    stave: Stave,
    voices: Voice | Voice[],
  ) {
    // Đảm bảo voices là mảng
    const voiceArray = Array.isArray(voices) ? voices : [voices];

    // Vẽ từng voice lên stave
    for (const voice of voiceArray) {
      voice.draw(context, stave);
    }
  }

  groupNoteByStartTime(currentGroup: any, currentNote: any, last: any) {

  }

  async playMidi(notesArray: [number, number, number][]) {
    if (this.isPlaying) return;

    const transport = getTransport();
    await ToneStart();

    // Dùng PolySynth với AMSynth
    this.synth = new PolySynth(AMSynth).toDestination();

    transport.cancel(0);
    transport.stop();
    transport.position = 0;

    // Dữ liệu toneNotes dựa trên previewNotes / allNotePositions
    const toneNotes = this.previewNotes.map(([start, end, midi]) => {
      const noteObj = this.midiToVexflowKey(start, end, midi);
      return {
        time: start,
        duration: end - start,
        name: noteObj.note.toUpperCase(), // ví dụ "C4", "D#5", v.v.
      };
    });

    this.part = new Part((time, note: any) => {
      this.synth.triggerAttackRelease(note.name, note.duration, time);
    }, toneNotes).start(0);

    transport.start();
    this.isPlaying = true;
    this.startTime = transport.seconds;
    this.animateCursorLoop();
  }

  stopMidi() {
    if (!this.isPlaying) return;

    const transport = getTransport();
    transport.stop();
    this.part.stop();
    this.synth.releaseAll();

    this.cursors.forEach(c => (c.style.display = "none"));
    if (this.cursors.length > 0) {
      const first = this.cursors[0];
      first.style.display = "block";
      first.setAttribute("x1", "35");
      first.setAttribute("x2", "35");
    }

    cancelAnimationFrame(this.animationFrameId!);
    this.isPlaying = false;
  }

  private animateCursorLoop() {
    if (!this.isPlaying) return;

    const transport = getTransport();
    const currentTime = transport.seconds - this.startTime;

    const currentNote = this.allNotePositions.find(
      n => currentTime >= n.start && currentTime < n.end
    );

    if (currentNote) {
      const currentLine = Math.floor(currentNote.y / 100);
      this.cursors.forEach((c, idx) => {
        c.style.display = idx === currentLine ? "block" : "none";
      });

      const cursor = this.cursors[currentLine];
      if (cursor) {
        cursor.setAttribute("x1", currentNote.x.toString());
        cursor.setAttribute("x2", currentNote.x.toString());
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animateCursorLoop());
  }
}
