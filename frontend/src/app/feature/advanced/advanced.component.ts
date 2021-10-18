import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import * as M from "@app/models/model";
import { KeywordSelectable, KeywordDisease, TextDic } from "@app/models/keyword";
import { InputParserService } from "@app/core/services/input-parser.service";
import { TextOutputService } from "@app/core/services/text-output.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { DictManagerService } from "@app/core/services/dict-manager.service";
import { ParserBasisService } from "@app/core/services/parser-basis.service";


@Component({
  selector: "app-text",
  templateUrl: "./advanced.component.html",
  styleUrls: ["./advanced.component.scss"]
})
export class AdvancedComponent implements OnInit, OnDestroy {

  errorMsg = "";
  isLoading = false;
  routeName: string;
  private textSub: Subscription;
  dict: M.Dict = { name: "", parts: [], id: "" };
  myText: { report: string } = { report: "" };
  diseases: Array<KeywordDisease> = [];
  firstTime = false;
  myInput: { twInput: string, again: boolean } = { twInput: "", again: false };
  end = false;
  end0 = false;
  oldInput = "";
  missing: Array<TextDic> = [];
  filledCats: Array<TextDic> = [];
  parsingString = "";
  jsDown: SafeUrl;
  jsDown2: SafeUrl;
  inner = "hey";
  getReady = false;
  // recogWords : {Array<string>} = [];

  @ViewChild("myReport", { static: false }) myReport: ElementRef;
  @ViewChild("myJson", { static: false }) myJson: ElementRef;

  constructor(private dateParser: NgbDateParserFormatter,
              private http: HttpClient,
              private route: ActivatedRoute,
              private inputParser: InputParserService,
              private textOut: TextOutputService,
              private sanitizer: DomSanitizer,
              private dictManager: DictManagerService,
              private router: Router,
              private base: ParserBasisService) {
  }

  ngOnDestroy(): void {
    this.textSub.unsubscribe();
  }

  ngOnInit(): void {
    // assigns reference to polyp object
    // this.polyp = this.inputParser.polyp;
    this.route.paramMap.subscribe((ps) => {
      if (ps.has("name")) {
        this.routeName = ps.get("name");
        this.isLoading = true;
        this.dictManager.getList();
        this.textSub = this.dictManager
          .getListUpdateListener()
          .subscribe((list: M.Dict[]) => {
            this.isLoading = false;
            this.dict = list.find((d) => d.name === this.routeName);
            if (this.dict === undefined) {
              this.errorMsg =
                "Dieses Dictionary existiert nicht! Bitte auf List Seite zurückkehren und eines der dort aufgeführten Dictionaries auswählen.";
            } else {
              if (!this.inputParser.start) {
                console.log(this.dict.parts);
                this.inputParser.createStartDict(this.dict.parts);
                this.inputParser.start = true;
              }
            }
            /* this.dictionaryService.setDict(list.find(d => d.name === this.routeName));
            this.new_parts = this.dictionaryService.myDict.dict; */
            /* this.myList[1].name = "Leo2";
            this.dictManager.updateDict(this.myList[1]); */
          });
      } else {
        this.errorMsg =
          "Kein Dictionary zum Editieren ausgewählt! Bitte auf List Seite zurückkehren und das gewünschte Dictionary auswählen.";
      }
    });
    this.diseases = this.base.diseases;
    this.missing = this.base.missing;
    this.firstTime = false;
    this.myInput = this.inputParser.twInput;
    this.jsDown = this.textOut.downJson;
    this.filledCats = this.textOut.rep;
    // this.recogWords = this.textOut.recogWords;
  }


  // used that only one synonym for each keyword is shown on the interface
  filterSyn(arr: Array<KeywordSelectable>) {
    return arr.filter(key => key.name === key.synonym);
  }

  triggerClick() {
    const el: HTMLElement = this.myReport.nativeElement as HTMLElement;
    const el2: HTMLElement = this.myJson.nativeElement as HTMLElement;
    setTimeout(() => {
      el.click();
      el2.click();
    }, 2000);

  }

  catUsed(dis: string, cat: string) {
    return this.filledCats.find(el => el.disName === dis).reports.find(el => el.category === cat).key !== "";
  }
  KeysExample(dis: string, cat: string) {
    const elements: Array<String> = [];
    const element = this.diseases.find(el1 => el1.name === dis).categories.find(el2 => el2.name === cat);
    for (let i = 0; i < 2; i++) {
      if (element.keys.length === 1) {
        elements.push(this.diseases.find(el1 => el1.name === dis).categories.find(el2 => el2.name === cat).keys[0].synonym);
        return "z.B.: " + elements[0].replace("[d]", "[Zahl]");
      } else {
        elements.push(this.diseases.find(el1 => el1.name === dis).categories.find(el2 =>
          el2.name === cat).keys.filter(el3 => el3.name === el3.synonym)[i].name);
      }
    }
    return "z.B.: " + elements.join(", ") + "...";
  }

  whichKeyUsed(dis: string, cat: string, cond = false) {
    const element = this.diseases.find(el1 => el1.name === dis).categories.find(el2 =>
      el2.name === cat).keys.find(el3 => el3.position !== -1);
    if (element === undefined) {
      return undefined;
    }
    if (cond === true && element === this.diseases.find(el1 => el1.name === dis).categories.find(el2 =>
      el2.name === cat).keys[0]) {
      return undefined;
    }
    let re: string = element.name;
    if (element.name.includes("[d]")) {
      re = element.synonym;
    }
    for (let i = 0; i < element.variables.length; i++) {
      if (i === 0) {
        re += ": ";
      } else {
        re += " +++ ";
      }
      if (element.variables[i].kind === "text") {
        const letters = element.variables[i].options[0].replace(/[^a-z]/gi, "");
        if (element.variables[i].varFound[0] !== undefined) {
          re += "<span> \"" + element.variables[i].varFound[0].replace(element.variables[i].textAfter, "") + "\"</span>";
        } else {
          re += "<span> \"" + element.variables[i].textBefore + "... [" + letters + "]\"</span>";
        }
      } else {
        if (element.variables[i].varFound[0] !== undefined) {
          re += "<span> \"" + element.variables[i].varFound[0] + "\"</span>";
        } else {
          for (let j = 0; j < element.variables[i].options.length; j++) {
            if (j > 0) {
              re += " / ";
            }
            re += "<span> \"" + element.variables[i].options[j] + "\"</span>";

          }
        }
      }
    }
    return re;
  }

  inputClick() {
    this.changeButton();
  }

  changeButton() {
    if (!this.end) {
      const signalButton = document.getElementById("listening");
      signalButton.classList.toggle("btn-danger");
      signalButton.classList.toggle("btn-success");
      if (signalButton.innerText === "Ein") {
        signalButton.innerText = "Aus";
      } else {
        signalButton.innerText = "Ein";
      }
    }
  }


  onInput() {
    /* if(!this.firstTime){
      this.inputParser.createStartDict(this.parts);
      this.readConfig();
      this.firstTime = true;
    } */
    // this.twoWayInput += "In ";
    // let input = (document.getElementById('input') as HTMLTextAreaElement).value;
    /* console.log("event");
    console.log(ev); */
    const inp = (document.getElementById("input") as HTMLTextAreaElement).value;
    let dif: string;

    if (this.oldInput === "") {
      dif = inp;
      this.oldInput = inp;
      this.myInput.twInput += dif;
    } else {
      if (inp.toLowerCase().lastIndexOf("pause") > inp.toLowerCase().lastIndexOf("weiter")) {
        if (!this.getReady) {
          this.changeButton();
        }
        this.getReady = true;
      } else {
        if (this.getReady) {
          this.oldInput = inp;
          if (this.getReady) {
            this.changeButton();
          }
          this.getReady = false;

          console.log("weiter");
          console.log(this.oldInput);
        } else {

          dif = inp.replace(this.oldInput, "");
          console.log("dif");
          console.log(dif);
          this.oldInput = inp;
          this.myInput.twInput += dif;
        }
      }
    }
    // console.log(ev.clipboardData.getData('text'));
    // this.myInput.twInput += ev.data;
    this.myText.report = this.inputParser.parseInput(this.myInput.twInput.toLowerCase());
    const inpArr: Array<string> = JSON.parse(JSON.stringify(this.myInput.twInput.toLowerCase())).split(" ");
    this.end = this.base.end;
    this.textOut.finalOut(this.end, inpArr);
    this.jsDown = this.textOut.downJson;
    this.jsDown2 = this.textOut.downJson2;
    if (this.end) {
      this.triggerClick();
    }

    this.end0 = this.base.end0;
    if (this.end0) {
      // document.getElementById("Form1").innerHTML = "bye";
      this.inner = "bye";
    }
    this.missing = this.base.missing;
    /* console.log("MissingComp");
    console.log(this.missing); */

    this.textOut.colorTextInput(JSON.parse(JSON.stringify(this.diseases)), this.myInput.twInput);
    if (this.myInput.again) {
      this.myText.report = this.inputParser.parseInput(this.myInput.twInput);
      this.textOut.colorTextInput(JSON.parse(JSON.stringify(this.diseases)), this.myInput.twInput);
    }
    // this.myText.report = this.textOut.makeReport(this.diseases);
  }


  makeNormal() {
    const input = (document.getElementById("input") as HTMLTextAreaElement).value;
    this.myText.report = this.inputParser.parseInput(input + " rest normal");
    this.textOut.colorTextInput(JSON.parse(JSON.stringify(this.diseases)), input);
  }

  refreshPage() {
    window.location.reload();
  }

  /*
  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
  }*/

}

