import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecordOutputComponent } from "./record-output.component";

describe("DisplayComponent", () => {
  let component: RecordOutputComponent;
  let fixture: ComponentFixture<RecordOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordOutputComponent);
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
