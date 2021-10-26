import {Component, DoCheck, OnInit} from "@angular/core";
import { faLaptopMedical } from "@fortawesome/free-solid-svg-icons";

import { DisplayService } from "@app/core/services/display.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, DoCheck {

  public displayNavbar: boolean;
  public mode: string;
  public ui: string;
  public title = "EndoAssist";

  faUser: any;
  constructor(private displayService: DisplayService) {}

  ngOnInit(): void {
    this.displayNavbar = true;
    this.faUser = faLaptopMedical;
    this.setUi();
  }

  ngDoCheck(): void {
    this.displayService.updateDisplay();
    this.displayNavbar = this.displayService.displayHeader;
  }

  private setUi(): void {
    this.displayService.getUi().subscribe((value) => {
      this.ui = value;
    });
  }

  cycleUi(): void {
    this.displayService.cycleUI();
  }

  setNewUi(new_ui: string): void {
    this.displayService.setUi(new_ui);
  }

}
