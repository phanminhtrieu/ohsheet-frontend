import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Factory, EasyScore, Voice, Formatter, Stave } from 'vexflow';
import {
  start as ToneStart,
  getTransport,
  PolySynth,
  AMSynth,
  Part
} from "tone";
import { MidiService } from 'app/core/services/midi.service';
import { LocalStorageService } from 'app/core/services/local-storage.service';
import { Subject, takeUntil } from 'rxjs';
import { LocalHostConstant } from 'app/shared/constants';

interface Note {
  start: number;
  end: number;
  note: string;
}

interface SheetLine {
  notes: string[];
  notePositions: any[];
}

interface SheetPage {
  pageIndex: number;
  lines: SheetLine[];
}

@Component({
  selector: 'app-sheet-renderer',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sheet-renderer.component.html',
  styleUrls: ['./sheet-renderer.component.scss']
})
export class SheetRendererComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('sheetContainer', { static: true }) sheetContainer!: ElementRef<HTMLDivElement>;

  @Input() transcriptionId?: string;
  @Input() pageMode: 'compact' | 'normal' | 'dense' = 'normal';
  @Input() linesPerPage?: number;
  @Input() notesPerLine?: number;
  @Input() sheetWidth?: number;

  pages: SheetPage[] = [];
  currentPageIndex: number = 0;

  allNotePositions: any[] = [];
  cursors: any[] = [];
  animationFrameId?: number;
  synth!: any;
  part!: any;
  isPlaying = false;
  startTime = 0;

  previewNotes: [number, number, number][] = []
  private destroy$ = new Subject<void>();

  constructor(
    private midiService: MidiService,
    private localStorageService: LocalStorageService
  ) { }

  async ngOnInit(): Promise<void> {
    const transcriptionId = this.transcriptionId || this.localStorageService.getItem(LocalHostConstant.TRANSCRIPTION_ID);
    if (transcriptionId) {
      this.midiService.loadMidi(transcriptionId);
    }

    this.midiService.midi$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notes => {
        if (notes && notes.length > 0) {
          this.previewNotes = notes;
          console.log("🎵 Loaded MIDI notes:", this.previewNotes);
          this.buildPagesFromNotes(this.previewNotes);
          this.renderPage(0);
        }
      });

    window.addEventListener('keydown', this.handleKeyDown);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transcriptionId'] && !changes['transcriptionId'].firstChange) {
      const newId = changes['transcriptionId'].currentValue;
      if (newId) {
        this.midiService.loadMidi(newId);
      }
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      this.nextPage();
    } else if (event.key === 'ArrowLeft') {
      this.prevPage();
    }
  };

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.destroy$.next();
    this.destroy$.complete();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  buildPagesFromNotes(notesArray: [number, number, number][]) {
    const notesPerLine = this.notesPerLine ?? 8;
    let linesPerPage = this.linesPerPage;
    if (!linesPerPage) {
      switch (this.pageMode) {
        case 'compact': linesPerPage = 5; break;
        case 'dense': linesPerPage = 10; break;
        case 'normal':
        default: linesPerPage = 8; break;
      }
    }

    // 1. Parse MIDI -> logical notes
    const vexflowNotes = notesArray.map(([start, end, pitch]) => this.midiToVexflowKey(start, end, pitch));
    const vexflowSortedNotes = vexflowNotes.sort((a, b) => a.start - b.start);
    const groupedNotesString = this.notesToString(vexflowSortedNotes);
    const groupedNotesArray = groupedNotesString.split(", ");

    // 2. Group notes into lines
    const allLines: SheetLine[] = [];
    for (let i = 0; i < groupedNotesArray.length; i += notesPerLine) {
      const chunk = groupedNotesArray.slice(i, i + notesPerLine);
      const notePositions = vexflowSortedNotes.slice(i, i + notesPerLine).map(n => ({
        start: n.start,
        end: n.end,
        x: 0,
        y: 0
      }));

      allLines.push({
        notes: chunk,
        notePositions: notePositions
      });
    }

    // 3. Group lines into pages
    this.pages = [];
    for (let i = 0; i < allLines.length; i += linesPerPage) {
      this.pages.push({
        pageIndex: Math.floor(i / linesPerPage),
        lines: allLines.slice(i, i + linesPerPage)
      });
    }
  }

  private calculateStaveWidth(): number {
    // Use explicit width if provided
    if (this.sheetWidth) {
      return this.sheetWidth - 100; // Account for padding + clef space
    }

    // Calculate based on notesPerLine
    const baseWidth = 450;
    const notesPerLine = this.notesPerLine ?? 8;
    const widthPerNote = 50; // Linear scaling

    return baseWidth + ((notesPerLine - 8) * widthPerNote);
  }

  renderPage(pageIndex: number) {
    if (pageIndex < 0 || pageIndex >= this.pages.length) return;
    this.currentPageIndex = pageIndex;
    const page = this.pages[pageIndex];

    // Reset rendering state
    this.allNotePositions = [];
    this.cursors = [];
    const container = this.sheetContainer.nativeElement;
    container.innerHTML = '';

    const staveWidth = this.calculateStaveWidth();
    const svgWidth = staveWidth + 100; // Increased padding for clef
    const staveHeight = 100;
    const xOffset = 50; // Increased from 35 to prevent clef cutoff
    let yOffset = 20;

    const svgHeight = page.lines.length * staveHeight + 40;
    const vf = new Factory({
      renderer: { elementId: 'sheet-container', width: svgWidth, height: svgHeight },
    });
    const score = vf.EasyScore();
    const context = vf.getContext();

    page.lines.forEach((line, lineIdx) => {
      this.renderLine(line, lineIdx, yOffset, xOffset, staveWidth, staveHeight, vf, score, context);
      yOffset += staveHeight;
    });

    vf.draw();
  }

  renderLine(
    line: SheetLine,
    lineIdx: number,
    yOffset: number,
    xOffset: number,
    staveWidth: number,
    staveHeight: number,
    vf: Factory,
    score: EasyScore,
    context: any
  ) {
    const voice = new Voice();
    voice.setMode(Voice.Mode.SOFT);

    const tickables = score.notes(line.notes.join(", "));
    voice.addTickables(tickables);

    const stave = new Stave(xOffset, yOffset, staveWidth);
    stave.addClef('treble').setContext(context).draw();

    // Line number (global index)
    const linesPerPage = this.linesPerPage ?? (this.pageMode === 'compact' ? 5 : this.pageMode === 'dense' ? 10 : 8);
    const globalLineIndex = (this.currentPageIndex * linesPerPage) + lineIdx + 1;
    context.fillText(`${globalLineIndex}`, 15, stave.getYForTopText() + 35);

    this.formatVoices([voice], stave);
    this.drawVoicesOnStave(context, stave, [voice]);

    // Update note positions with rendered X
    tickables.forEach((n, idx) => {
      if (line.notePositions[idx]) {
        line.notePositions[idx].x = n.getAbsoluteX();
        line.notePositions[idx].y = yOffset;
        this.allNotePositions.push(line.notePositions[idx]);
      }
    });

    // Create cursor for this line
    const cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
    cursor.setAttribute("x1", xOffset.toString());
    cursor.setAttribute("x2", xOffset.toString());
    cursor.setAttribute("y1", yOffset.toString());
    cursor.setAttribute("y2", (yOffset + staveHeight - 20).toString());
    cursor.setAttribute("stroke", "red");
    cursor.setAttribute("stroke-width", "2");
    cursor.style.display = "none";

    const svgElement = document.querySelector("#sheet-container svg");
    svgElement?.appendChild(cursor);
    this.cursors.push(cursor);
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
        currentGroup.push(note);
      } else {
        if (currentGroup.length > 0) {
          if (currentGroup.length === 1) {
            result.push(`${currentGroup[0].note}/q`);
          } else {
            const chordNotes = currentGroup.map(n => n.note).join(" ");
            result.push(`(${chordNotes})/q`);
          }
        }
        currentGroup = [note];
      }
    }

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

  drawVoicesOnStave(context: any, stave: Stave, voices: Voice | Voice[]) {
    const voiceArray = Array.isArray(voices) ? voices : [voices];
    for (const voice of voiceArray) {
      voice.draw(context, stave);
    }
  }

  async playMidi(notesArray: [number, number, number][]) {
    if (this.isPlaying) return;

    const transport = getTransport();
    await ToneStart();

    this.synth = new PolySynth(AMSynth).toDestination();

    transport.cancel(0);
    transport.stop();
    transport.position = 0;

    const toneNotes = this.previewNotes.map(([start, end, midi]) => {
      const noteObj = this.midiToVexflowKey(start, end, midi);
      return {
        time: start,
        duration: end - start,
        name: noteObj.note.toUpperCase(),
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

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.isPlaying = false;
  }

  private animateCursorLoop() {
    if (!this.isPlaying) return;

    const transport = getTransport();
    const currentTime = transport.seconds - this.startTime;

    // Find the note and its page
    let targetPageIndex = -1;
    let targetNote = null;

    for (let p = 0; p < this.pages.length; p++) {
      const page = this.pages[p];
      for (const line of page.lines) {
        const note = line.notePositions.find(n => currentTime >= n.start && currentTime < n.end);
        if (note) {
          targetPageIndex = p;
          targetNote = note;
          break;
        }
      }
      if (targetNote) break;
    }

    if (targetNote && targetPageIndex !== -1) {
      if (targetPageIndex !== this.currentPageIndex) {
        this.renderPage(targetPageIndex);
      }

      const currentLineIndex = Math.floor((targetNote.y - 20) / 100);
      this.cursors.forEach((c, idx) => {
        c.style.display = idx === currentLineIndex ? "block" : "none";
      });

      const cursor = this.cursors[currentLineIndex];
      if (cursor) {
        cursor.setAttribute("x1", targetNote.x.toString());
        cursor.setAttribute("x2", targetNote.x.toString());
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animateCursorLoop());
  }

  nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.renderPage(this.currentPageIndex + 1);
    }
  }

  prevPage() {
    if (this.currentPageIndex > 0) {
      this.renderPage(this.currentPageIndex - 1);
    }
  }
}
