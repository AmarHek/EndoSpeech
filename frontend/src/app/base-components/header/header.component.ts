import {Component, DoCheck, OnInit} from "@angular/core";
import { faLaptopMedical } from "@fortawesome/free-solid-svg-icons";

import { DisplayService } from "../../core/services/display.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, DoCheck {

  public displayNavbar: boolean;
  public mode: string;
  public ui: string;
  public title: string;

  faUser: any;
  constructor(private displayService: DisplayService) {}

  ngOnInit(): void {
    this.displayNavbar = true;
    this.faUser = faLaptopMedical;
    this.setUi();
  }

  ngDoCheck(): void {
    // TODO: change, so the value is based on class
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
