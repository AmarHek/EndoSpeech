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

/*testGetImagesAsFiles() {
  const directory: string = "test2";
  const images: string[] = ["00000002_000.png", "IMG_20200826_130737.jpg", "jin.jpg",
    "patient00010_study1_view2_lateral.jpg", "photomode_03012021_214524.png"]
  for (const image of images) {
    const imageUrl = this.baseUrl + directory + "/" + image;
    this.recordGenerator.getFreezeAsFile(imageUrl).subscribe(data => {
      let imageFile = new File([data], image);
      console.log(imageFile);
    });
  }
}
*/
