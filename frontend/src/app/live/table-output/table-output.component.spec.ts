import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TableOutputComponent } from "./table-output.component";

describe("DisplayComponent", () => {
  let component: TableOutputComponent;
  let fixture: ComponentFixture<TableOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
