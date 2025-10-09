import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import VexFlow, { Factory, EasyScore, Voice, Formatter, Stave, StaveNote } from 'vexflow';

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
export class SheetRendererComponent {
  @ViewChild('sheetContainer', { static: true }) sheetContainer!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    // this.renderSheet();
    // this.renderNotesGrouped([
    //   ["[g4,e4,d4]/q"],
    //   ["d4/q"],
    //   ["e4/q"],
    //   ["[c5,d4]/q"],
    //   ["g4/q"],
    //   ["[b3,c3]/q"]
    // ]);
    console.log("Xap xi:", Math.abs(0.5108390022675737 - 0.4992290249433107));
    
    const previewNotes: [number, number, number][] = [
      [7.004668027210885,7.225257596371883,72], 
      [7.004668027210885,7.422627210884354,60],
      [6.49382902494331,6.714418594104308,74],
      [6.49382902494331,6.9930580498866215,62],
      [6.006209977324263,6.482219047619048,64],
      [5.505697052154195,5.982990022675737,65],
      [5.006468027210884,5.494087074829932,67],
      [4.495629024943311,4.9832480725623585,69],
      [3.9963999999999995,4.484019047619047,71],

      [3.4958870748299318,3.973180045351474,72],
      [2.996658049886621,3.484277097505669,71],
      [2.4974290249433104,2.973438095238095,69],
      [2.009809977324263,2.4858190476190476,67],
      [1.509297052154195,1.986590022675737,65],
      [1.0100680272108844,1.486077097505669,64],
      [0.5108390022675737,0.9868480725623583,62],
      [0.4992290249433107,0.6617687074829932,74],
      [0.011609977324263039,0.47600907029478456,60],
      [0.011609977324263039,0.16253968253968254,72], 
    ];
    

    // previewNotes.sort((a, b) => a[0] - b[0]);
    // console.log("🍺", previewNotes);


    // let notes: string[] = previewNotes.map(n => this.midiToVexflowKey(n[2] as number));


    // const notes = this.convertPreviewNotesToVexflowNotes(previewNotes, this.midiToVexflowKey)
    // console.log("🙃", notes);

    // this.renderNotes(notes, true);

    // this.renderNotesFromPreview(previewNotes, 8);
    

    this.renderNotes(previewNotes, true);
  }

  renderSheet() {
    // Tạo Factory
    const vf = new Factory({
      renderer: { elementId: 'sheet-container', width: 600, height: 200 },
    });

    const score = vf.EasyScore();
    const system = vf.System();

    // Thêm khuông nhạc
    system
      .addStave({
        voices: [
          score.voice(score.notes('C#5/q, B4, A4, G#4', { stem: 'up' })),
          score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
        ],
      })
      .addClef('treble');

    vf.draw();
  }

  renderNotes(notesArray: [number, number, number][], isDemo: boolean) {
    // Cấu hình
    const staveWidth = 450;  // chiều rộng mỗi dòng khuông
    const chunkSize = 8;     // số nốt tối đa mỗi dòng
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
    const groupedNotesString =  this.notesToString(vexflowNotes);
    const groupedNotesArray = groupedNotesString.split(", ");

    console.log("✨", vexflowNotes);
    console.log("✨ 2", groupedNotesString.split(", "));

    let line = 1;
    // Chia nốt thành từng chunk
    for (let i = 0; i < groupedNotesArray.length; i += chunkSize) {
      const chunk = groupedNotesArray.slice(i, i + chunkSize); 
      // const chunk = chunkObjects.map(chunkObject => chunkObject.note);
      
      console.log("😶‍🌫️",chunk);

      const voice = new Voice();
      voice.setMode(Voice.Mode.SOFT); // Không quan tâm nó có bao nhiêu phách trong một ô nhịp

      try {
        // Add note vào 1 voice
        // const tickables = score.notes(this.notesToString(chunk));
        // const tickables = score.notes(this.notesToString(chunkObjects));
        const tickables = score.notes(chunk.join(", "));
        voice.addTickables(tickables);
        
      } catch (e) {
        console.error("Lỗi format note: ", chunk, e);
      }

      // Tạo stave thủ công
      const stave = new Stave(xOffset, yOffset, staveWidth);
      stave.addClef('treble').setContext(context).draw();

      // Đánh số dòng bằng context 
      const ctx = vf.getContext();
      const y = stave.getYForTopText() + 35;
      ctx.fillText(`${line}`, 15, y);

      const voices = [voice];

      // Căn đều các nốt trên stave
      this.formatVoices(voices, stave);

      // Vẽ voice lên stave
      // voice.draw(context, stave);
      this.drawVoicesOnStave(context, stave, voices);

      // Tăng yOffset cho dòng tiếp theo
      yOffset += staveHeight;
      line = line + 1;
    }

    // Cuối cùng vẽ Factory
    vf.draw();
  }

  midiToVexflowKey(startTime: number, endTime: number, pitch: number): {start: number, end: number, note :string } {
    const noteNames = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
    const octave = Math.floor(pitch / 12) - 1;
    const name = noteNames[pitch % 12];
    return {
      start: startTime,
      end: endTime,
      note: `${name}${octave}`
    };
  }
  
  notesToString(notes: any, tolerance = 0.2): string {
    if (!notes || notes.length === 0) return "";

    const result: string[] = [];
    let currentGroup: Note[] = [];

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const last = currentGroup[currentGroup.length - 1];

      if (i > 0) {
        console.log("🤬", Math.abs(note.start - last.start));

      }
      
      if (last && Math.abs(note.start - last.start) <= tolerance) {
        console.log("vao 🥶");
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
      console.log("group: ", currentGroup);

      if (currentGroup.length === 1) {
        result.push(`${currentGroup[0].note}/q`);
      } else {
        const chordNotes = currentGroup.map(n => n.note).join(" ");
        result.push(`(${chordNotes})/q`);
      }
    }

    console.log("🕵️",result.join(", "));

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
    // Chắc chắn voices là mảng
    const voiceArray = Array.isArray(voices) ? voices : [voices];
  
    // Vẽ từng voice lên stave
    for (const voice of voiceArray) {
      voice.draw(context, stave);
    }
  }
}
