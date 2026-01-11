import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetRendererComponent } from './sheet-renderer.component';

describe('SheetRendererComponent', () => {
  let component: SheetRendererComponent;
  let fixture: ComponentFixture<SheetRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheetRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
