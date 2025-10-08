import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import VexFlow, { Factory, EasyScore, Voice, Formatter, Stave } from 'vexflow';
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
    this.renderNotes([
      'C4/q', 'D4/q', 'E4/q', 'F4/q', 'G4/q', 'A4/q', 'B4/q', 'C5/q', 
      'C4/q', 'D4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 
      'C4/q', 'D4/q', 'E4/q', 'F4/q', 'G4/q', 'A4/q', 'B4/q', 'C5/q', 
      'C4/q', 'D4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 
      'C4/q', 'D4/q', 'E4/q', 'F4/q', 'G4/q', 'A4/q', 'B4/q', 'C5/q', 
      'C4/q', 'D4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 'E4/q', 
    ], 
    true);
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

  renderNotes(notesArray: string[], isDemo: boolean) {
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

    let line = 1;
    // Chia nốt thành từng chunk
    for (let i = 0; i < notesArray.length; i += chunkSize) {
      const chunk = notesArray.slice(i, i + chunkSize);

      // Tạo voice mềm
      const voice = new Voice();
      voice.setMode(Voice.Mode.SOFT);
      const tickables = score.notes(chunk.join(', '));
      voice.addTickables(tickables);

      // Tạo stave thủ công
      const stave = new Stave(xOffset, yOffset, staveWidth);
      stave.addClef('treble').setContext(context).draw();

      // 🟢 Đánh số dòng bằng context (vẽ text thủ công)
      const ctx = vf.getContext();
      const y = stave.getYForTopText() + 35;
      ctx.fillText(`${line}`, 15, y);

      // Căn đều các nốt trên stave
      new Formatter().joinVoices([voice]).format([voice], stave.getWidth() - 50);

      // Vẽ voice lên stave
      voice.draw(context, stave);

      // Tăng yOffset cho dòng tiếp theo
      yOffset += staveHeight;
      line = line + 1;
    }

    // Cuối cùng vẽ Factory
    vf.draw();
  }
}
