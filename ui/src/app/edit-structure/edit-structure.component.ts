import { Component, OnDestroy, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import * as N from "../../helper-classes/gastro_model";
import { faAngleDown, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { NgForm } from "@angular/forms";
import { DictManagerService } from "../services/dict-manager.service";
import { Subscription } from "rxjs";
import {DisplayService} from "../services/display.service";

@Component({
  selector: "app-edit-structure",
  templateUrl: "./edit-structure.component.html",
  styleUrls: ["./edit-structure.component.css"],
  animations: [
    trigger("openClose", [
      // ...
      state(
        "open",
        style({
          marginLeft: "10px",
        })
      ),
      state(
        "closed",
        style({
          display: "none",
        })
      ),
      transition("open => closed", [animate("1s")]),
      transition("closed => open", [animate("0.5s")]),
    ]),
  ],
})

// -----------------------------
// This Component manages everything about the Edit UI
// -----------------------------



export class EditStructureComponent implements OnInit, OnDestroy {


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private dictManager: DictManagerService,
    private router: Router,
    private displayService: DisplayService
  ) { }
  @ViewChildren("myParts") myParts;

  angleDown = faAngleDown;
  pencilAlt = faPencilAlt;
  routeName: string;
  private editSub: Subscription;
  isOpen = true;
  kindVar: Array<string> = [];
  @ViewChild("f") signupForm: NgForm;
  // parts: M.TopLevel[] = [];
  myEdit: N.MyDict = { name: "", dict: [], id: "" };
  new_parts: N.TopLevel[] = [];
  disTyp = "";

  emptyVar: N.Vars = { anzahlVar: undefined, varTypes: [] };
  emptyAtt: N.Atts = { anzahlAtt: undefined, myVars: [] };
  myDisease: N.Cats = { anzahlCat: undefined, myAtts: [] };
  myAtt: N.Atts = { anzahlAtt: undefined, myVars: [] };

  // ------------------------------
  // dummy dict for testing
  var11 = <N.VariableOC>{ kind: "oc", values: ["links", "rechts"] };
  var12 = <N.VariableText>{
    kind: "text",
    textBefore: "bei",
    textAfter: "(entsprechend einer begr. Gerätelänge)",
    unit: "cm",
  };
  startSel1 = <N.CheckBox>{
    kind: "box",
    name: ["Paris 1p", "gestielt"],
    text:
      "Polypen Einzelbeschreibung: Es zeigt sich ein gestielter Polyp (Paris-Typ I p). ",
    normal: true,
    variables: [this.var11, this.var12],
    choiceGroup: ""
  };
  startSel2 = <N.CheckBox>{
    kind: "box",
    name: ["Paris 1s", "sessil"],
    text:
      "Polypen Einzelbeschreibung: Es zeigt sich ein sessiler Polyp (Paris-Typ I s). ",
    normal: false,
    variables: [this.var11, this.var12],
    choiceGroup: ""
  };

  startCat = <N.Category>{
    kind: "category",
    name: "Form",
    selectables: [this.startSel1, this.startSel2],
  };
  startDis = <N.Disease>{
    kind: "disease",
    name: "Polyp",
    categories: [this.startCat],
  };

  topCat = <N.Category>{
    kind: "category",
    name: "Test",
    selectables: [this.startSel1, this.startSel2],
  };



  // --------------------------
  // uploaded is the dict that is about to be edited
  // errorMsg and is Loading are responsible for loading animation as long as api call is loading
  uploaded: Array<N.TopLevel> = [this.startDis, this.topCat];
  errorMsg = "";
  isLoading = false;
  mode: string;

  // this function manages the initiation process when anything is added to an
  // existing dictionary. One case for variables, attributes and categories
  addPosition = "";
  addVar = false;
  addAtt = false;
  addKat = false;

  ngOnInit() {
    this.setMode();
    console.log("Edit");
    console.log(this.mode);
    // gets chosen dict from dictManager service
    this.route.paramMap.subscribe((ps) => {
      if (ps.has("name")) {
        this.routeName = ps.get("name");
        this.isLoading = true;
        this.dictManager.getList();
        this.editSub = this.dictManager
          .getListUpdateListener()
          .subscribe((list: N.MyDict[]) => {
            this.isLoading = false;
            this.myEdit = list.find((d) => d.name === this.routeName);
            if (this.myEdit === undefined) {
              this.errorMsg =
                "Dieses Dictionary existiert nicht! Bitte auf List Seite zurückkehren und eines der dort aufgeführten Dictionaries auswählen.";
            }
            /* this.dictionaryService.setDict(list.find(d => d.name === this.routeName));
            this.new_parts = this.dictionaryService.myDict.dict; */
            /* this.myList[1].name = "Leo2";
            this.dictManager.updateDict(this.myList[1]); */
            console.log("onInit");
            console.log(this.myEdit);
            // console.log(this.new_parts);
          });
      } else {
        this.errorMsg =
          "Kein Dictionary zum Editieren ausgewählt! Bitte auf List Seite zurückkehren und das gewünschte Dictionary auswählen.";
      }
    });


    /* this.dictionaryService.setDict(this.dictManager.myList.find(d => d.name === this.routeName));
    this.new_parts = this.dictionaryService.myDict.dict; */
  }

  ngOnDestroy(): void {
    this.editSub.unsubscribe();
  }

  setMode(): void {
    this.displayService.getMode().subscribe((value) => {
      this.mode = value;
    });
  }

  // not used, check if something breaks when removing
  /* toggle() {
    this.isOpen = !this.isOpen;
  } */


  // if the user adds an Category to an existing disease, this function manages everything
  onSubmitKat() {
    console.log(this.signupForm);
    console.log(this.signupForm.value.allgData.disName);
    /*     startSel = <M.CheckBox>{name: ["paris", "1p"], text: "paris ist form", normal: true, variables: []};
        startCat = <M.Category>{name: "form", selectables: [this.startSel]};
        startDis = <M.Disease>{kind: "disease", name: "Polyp", categories: [this.startCat]}; */

    const catName = (<HTMLInputElement>document.getElementById("disName"))
      .value;
    const sels: Array<N.Selectable> = [];
    // this loop gets all the data from the input Form by the assigned IDs. Empty Variables,
    // Attributes and a Category are created and filled with the input Form information.
    // In the end, everything gets reset and the new Category is pushed to the corresponding disease
    for (
      let i = 0;
      i < Number(this.signupForm.value.allgData.KanzahlAtt);
      i++
    ) {
      const vars: Array<N.Variable> = [];
      const attText = (<HTMLInputElement>(
        document.getElementById("KAttText" + i)
      )).value;
      const attName = (<HTMLInputElement>(
        document.getElementById("KAttName" + i)
      )).value;
      const attJud = (<HTMLInputElement>(
        document.getElementById("KJudText" + i)
      )).value;
      const attNormal = (<HTMLInputElement>(
        document.getElementById("Knormal" + i)
      )).value;
      for (
        let k = 0;
        k <
        Number(
          (<HTMLInputElement>document.getElementById("KanzahlAttVar" + i))
            .value
        );
        k++
      ) {
        if (
          (<HTMLInputElement>document.getElementById("KvarKind" + i + k))
            .value === "text"
        ) {
          const myTextBefore = (<HTMLInputElement>(
            document.getElementById("KtextBefore" + i + k)
          )).value;
          const myTextAfter = (<HTMLInputElement>(
            document.getElementById("KtextAfter" + i + k)
          )).value;
          const varUnit = (<HTMLInputElement>(
            document.getElementById("KvarUnit" + i + k)
          )).value;
          const myTextVar = <N.VariableText>{
            kind: "text",
            textBefore: myTextBefore,
            textAfter: myTextAfter,
            unit: varUnit,
          };
          vars.push(myTextVar);
        } else if (
          (<HTMLInputElement>document.getElementById("KvarKind" + i + k))
            .value === "oc"
        ) {
          const varOptions: Array<String> = (<HTMLInputElement>(
            document.getElementById("KvarOptions" + i + k)
          )).value
            .split("/")
            .map((opt) => opt.trim());
          const myOCVar = <N.VariableOC>{ kind: "oc", values: varOptions };
          vars.push(myOCVar);
        }
      }
      const myAtt = <N.Selectable>{
        kind: "box",
        name: attName.split(",").map((n) => n.trim()),
        text: attText,
        normal: Boolean(attNormal),
        variables: vars,
        judgementText: attJud === "" ? null : attJud

      };
      sels.push(myAtt);
    }
    const myCat = <N.Category>{
      kind: "category",
      name: catName,
      selectables: sels,
    };
    const positions = this.addPosition.split("").map(Number);
    const myVar: N.TopLevel = this.myEdit.dict[positions[0]];
    if (myVar.kind === "disease") {
      myVar.categories.push(myCat);
    }
    // this.dictionaryService.addDisease(myCat);

    // console.log(this.dictionaryService.uploaded);
    console.log(this.myEdit);
    this.addKat = false;
    this.addPosition = "";
    this.signupForm.reset();
    this.myDisease = { anzahlCat: undefined, myAtts: [] };
    this.myAtt = { anzahlAtt: undefined, myVars: [] };

    // console.log((<HTMLInputElement>document.getElementById("KAttName" + 0)).value);
  }


  // see onSubmitKat() for more detailed information
  onSubmitAtt() {
    const vars: Array<N.Variable> = [];
    const attText = (<HTMLInputElement>(
      document.getElementById("KAttText" + this.addPosition)
    )).value;
    const attName = (<HTMLInputElement>(
      document.getElementById("KAttName" + this.addPosition)
    )).value;
    const attJud = (<HTMLInputElement>(
      document.getElementById("KJudText" + this.addPosition)
    )).value;
    const attNormal = (<HTMLInputElement>(
      document.getElementById("Knormal" + this.addPosition)
    )).value;
    let attZuGroup;
    <HTMLInputElement>(document.getElementById("KZuGroup" + this.addPosition)) !== null ?
      attZuGroup = (<HTMLInputElement>(document.getElementById("KZuGroup" + this.addPosition))).value : attZuGroup = null;
    let attAuGroup;
    <HTMLInputElement>(document.getElementById("KAuGroup" + this.addPosition)) !== null ?
      attAuGroup = (<HTMLInputElement>(document.getElementById("KAuGroup" + this.addPosition))).value : attAuGroup = null;

    for (
      let k = 0;
      k <
      Number(
        (<HTMLInputElement>document.getElementById("KanzahlAttVar" + this.addPosition))
          .value
      );
      k++
    ) {
      if (
        (<HTMLInputElement>document.getElementById("KvarKind" + this.addPosition + k))
          .value === "text"
      ) {
        const myTextBefore = (<HTMLInputElement>(
          document.getElementById("KtextBefore" + this.addPosition + k)
        )).value;

        const myTextAfter = (<HTMLInputElement>(
          document.getElementById("KtextAfter" + this.addPosition + k)
        )).value;
        const varUnit = (<HTMLInputElement>(
          document.getElementById("KvarUnit" + this.addPosition + k)
        )).value;
        const myTextVar = <N.VariableText>{
          kind: "text",
          textBefore: myTextBefore,
          textAfter: myTextAfter,
          unit: varUnit,
        };
        vars.push(myTextVar);
      } else if (
        (<HTMLInputElement>document.getElementById("KvarKind" + this.addPosition + k))
          .value === "oc"
      ) {
        const varOptions: Array<String> = (<HTMLInputElement>(
          document.getElementById("KvarOptions" + this.addPosition + k)
        )).value
          .split("/")
          .map((opt) => opt.trim());
        const myOCVar = <N.VariableOC>{ kind: "oc", values: varOptions };
        vars.push(myOCVar);
      }
    }
    const myAtt = <N.Selectable>{
      kind: "box",
      name: attName.split(",").map((n) => n.trim()),
      text: attText,
      normal: Boolean(attNormal),
      variables: vars,
      judgementText: attJud === "" ? null : attJud,
      listGroup: attAuGroup === "" ? null : attAuGroup,
      choiceGroup: attZuGroup === "" ? null : attZuGroup
    };
    const positions = this.addPosition.split("").map(Number);
    const myVar: N.TopLevel = this.myEdit.dict[positions[0]];
    if (myVar.kind === "category") {
      myVar.selectables.push(myAtt);
    } else if (myVar.kind === "disease") {
      myVar.categories[positions[1]].selectables.push(
        myAtt
      );
    }
    console.log(this.myEdit);
    this.addAtt = false;
    this.addPosition = "";

    this.signupForm.reset();

    this.myDisease = { anzahlCat: undefined, myAtts: [] };
    this.myAtt = { anzahlAtt: undefined, myVars: [] };


  }



  // see onSubmitKat() for more detailed information
  onSubmitVar() {
    let vari;
    if (
      (<HTMLInputElement>document.getElementById("KvarKind" + this.addPosition))
        .value === "text"
    ) {
      const myTextBefore = (<HTMLInputElement>(
        document.getElementById("KtextBefore" + this.addPosition)
      )).value;
      const myTextAfter = (<HTMLInputElement>(
        document.getElementById("KtextAfter" + this.addPosition)
      )).value;
      const varUnit = (<HTMLInputElement>(
        document.getElementById("KvarUnit" + this.addPosition)
      )).value;
      vari = {
        kind: "text",
        textBefore: myTextBefore,
        textAfter: myTextAfter,
        unit: varUnit,
      };
    } else if (
      (<HTMLInputElement>document.getElementById("KvarKind" + this.addPosition))
        .value === "oc"
    ) {
      const varOptions: Array<String> = (<HTMLInputElement>(
        document.getElementById("KvarOptions" + this.addPosition)
      )).value
        .split("/")
        .map((opt) => opt.trim());
      vari = { kind: "oc", values: varOptions };
    }
    const positions = this.addPosition.split("").map(Number);
    const myVar: N.TopLevel = this.myEdit.dict[positions[0]];
    if (myVar.kind === "category") {
      myVar.selectables[positions[1]].variables.push(vari);
    } else if (myVar.kind === "disease") {
      myVar.categories[positions[1]].selectables[positions[2]].variables.push(
        vari
      );
    }
    console.log(this.myEdit);
    this.addVar = false;
    this.addPosition = "";

    this.signupForm.reset();

    this.myDisease = { anzahlCat: undefined, myAtts: [] };
    this.myAtt = { anzahlAtt: undefined, myVars: [] };
  }


  // this is for adding a whole new top level element
  // see onSubmitKat() for more detailed information
  onSubmit() {
    console.log(this.signupForm);
    console.log(this.signupForm.value.allgData.disName);
    /*     startSel = <M.CheckBox>{name: ["paris", "1p"], text: "paris ist form", normal: true, variables: []};
        startCat = <M.Category>{name: "form", selectables: [this.startSel]};
        startDis = <M.Disease>{kind: "disease", name: "Polyp", categories: [this.startCat]}; */
    if (this.signupForm.value.allgData.typ === "Krankheit") {
      const cats: Array<N.Category> = [];
      for (let i = 0; i < Number(this.signupForm.value.allgData.anzahl); i++) {
        const catName = (<HTMLInputElement>(
          document.getElementById("disCatName" + i)
        )).value;
        const catCon = (<HTMLInputElement>(
          document.getElementById("disCatCon" + i)
        )).value;
        const sels: Array<N.Selectable> = [];
        for (

          let j = 0;
          j <
          Number(
            (<HTMLInputElement>document.getElementById("anzahlAtt" + i)).value
          );
          j++
        ) {
          const vars: Array<N.Variable> = [];
          const attText = (<HTMLInputElement>(
            document.getElementById("disCatAttText" + i + j)
          )).value;
          const attName = (<HTMLInputElement>(
            document.getElementById("disCatAttName" + i + j)
          )).value;
          const attJud = (<HTMLInputElement>(
            document.getElementById("disCatJudText" + i + j)
          )).value;
          const attNormal = (<HTMLInputElement>(
            document.getElementById("normal" + i + j)
          )).value;

          for (
            let k = 0;
            k <
            Number(
              (<HTMLInputElement>(
                document.getElementById("anzahlAttVar" + i + j)
              )).value
            );
            k++
          ) {
            if (
              (<HTMLInputElement>document.getElementById("varKind" + i + j + k))
                .value === "text"
            ) {
              const myTextBefore = (<HTMLInputElement>(
                document.getElementById("textBefore" + i + j + k)
              )).value;
              const myTextAfter = (<HTMLInputElement>(
                document.getElementById("textAfter" + i + j + k)
              )).value;
              const varUnit = (<HTMLInputElement>(
                document.getElementById("varUnit" + i + j + k)
              )).value;
              const myTextVar = <N.VariableText>{
                kind: "text",
                textBefore: myTextBefore,
                textAfter: myTextAfter,
                unit: varUnit,
              };
              vars.push(myTextVar);
            } else if (
              (<HTMLInputElement>document.getElementById("varKind" + i + j + k))
                .value === "oc"
            ) {
              const varOptions: Array<String> = (<HTMLInputElement>(
                document.getElementById("varOptions" + i + j + k)
              )).value
                .split("/")
                .map((opt) => opt.trim());
              const myOCVar = <N.VariableOC>{ kind: "oc", values: varOptions };
              vars.push(myOCVar);
            }
          }
          const myAtt = <N.Selectable>{
            kind: "box",
            name: attName.split(",").map((n) => n.trim()),
            text: attText,
            normal: Boolean(attNormal),
            variables: vars,
            judgementText: attJud === "" ? null : attJud

          };
          sels.push(myAtt);
        }
        const myCat = <N.Category>{
          kind: "category",
          name: catName,
          condition: catCon === "" ? undefined : catCon,
          selectables: sels,
        };
        cats.push(myCat);
      }
      const dis: N.Disease = {
        kind: "disease",
        name: this.signupForm.value.allgData.disName,
        categories: cats,
      };
      this.myEdit.dict.push(dis);
      // this.dictionaryService.addDisease(dis);
    } else if (this.signupForm.value.allgData.typ === "Kategorie") {
      const catName = (<HTMLInputElement>document.getElementById("disName"))
        .value;
      let KCon;
      <HTMLInputElement>(document.getElementById("KCon")) !== null ?
        KCon = (<HTMLInputElement>(document.getElementById("KCon"))).value : KCon = null;
      const sels: Array<N.Selectable> = [];
      for (
        let i = 0;
        i < Number(this.signupForm.value.allgData.KanzahlAtt);
        i++
      ) {
        const vars: Array<N.Variable> = [];
        const attText = (<HTMLInputElement>(
          document.getElementById("KAttText" + i)
        )).value;
        const attName = (<HTMLInputElement>(
          document.getElementById("KAttName" + i)
        )).value;
        const attJud = (<HTMLInputElement>(
          document.getElementById("KJudText" + i)
        )).value;
        const attNormal = (<HTMLInputElement>(
          document.getElementById("Knormal" + i)
        )).value;
        let attZuGroup;
        <HTMLInputElement>(document.getElementById("KZuGroup" + i)) !== null ?
          attZuGroup = (<HTMLInputElement>(document.getElementById("KZuGroup" + i))).value : attZuGroup = null;
        let attAuGroup;
        <HTMLInputElement>(document.getElementById("KAuGroup" + i)) !== null ?
          attAuGroup = (<HTMLInputElement>(document.getElementById("KAuGroup" + i))).value : attAuGroup = null;
        for (
          let k = 0;
          k <
          Number(
            (<HTMLInputElement>document.getElementById("KanzahlAttVar" + i))
              .value
          );
          k++
        ) {
          if (
            (<HTMLInputElement>document.getElementById("KvarKind" + i + k))
              .value === "text"
          ) {
            const myTextBefore = (<HTMLInputElement>(
              document.getElementById("KtextBefore" + i + k)
            )).value;
            const myTextAfter = (<HTMLInputElement>(
              document.getElementById("KtextAfter" + i + k)
            )).value;
            const varUnit = (<HTMLInputElement>(
              document.getElementById("KvarUnit" + i + k)
            )).value;
            const myTextVar = <N.VariableText>{
              kind: "text",
              textBefore: myTextBefore,
              textAfter: myTextAfter,
              unit: varUnit,
            };
            vars.push(myTextVar);
          } else if (
            (<HTMLInputElement>document.getElementById("KvarKind" + i + k))
              .value === "oc"
          ) {
            const varOptions: Array<String> = (<HTMLInputElement>(
              document.getElementById("KvarOptions" + i + k)
            )).value
              .split("/")
              .map((opt) => opt.trim());
            const myOCVar = <N.VariableOC>{ kind: "oc", values: varOptions };
            vars.push(myOCVar);
          }
        }
        const myAtt = <N.Selectable>{
          kind: "box",
          name: attName.split(",").map((n) => n.trim()),
          text: attText,
          normal: Boolean(attNormal),
          variables: vars,
          judgementText: attJud === "" ? null : attJud,
          listGroup: attAuGroup === "" ? null : attAuGroup,
          choiceGroup: attZuGroup === "" ? null : attZuGroup
        };
        sels.push(myAtt);
      }
      const myCat = <N.Category>{
        kind: "category",
        name: catName,
        condition: KCon === "" ? null : KCon,
        selectables: sels,
      };
      this.myEdit.dict.push(myCat);
      // this.dictionaryService.addDisease(myCat);
    }
    // console.log(this.dictionaryService.uploaded);
    console.log(this.myEdit);
    this.signupForm.reset();
    this.myDisease = { anzahlCat: undefined, myAtts: [] };
    this.myAtt = { anzahlAtt: undefined, myVars: [] };

    // console.log((<HTMLInputElement>document.getElementById("KAttName" + 0)).value);
  }



  // this is for deleting anything, from variables to attributes, category and diseases. Therefore the different cases for each level
  deleteDisease(index: Array<number>) {
    // this.myDict.dict.splice()
    const myVar: N.TopLevel = this.myEdit.dict[index[0]];
    switch (index.length) {
      case 1:
        this.myEdit.dict.splice(index[0], 1);
        break;
      case 2:
        if (myVar.kind === "disease") {
          myVar.categories.splice(index[1], 1);
        } else if (myVar.kind === "category") {
          myVar.selectables.splice(index[1], 1);
        }
        break;
      case 3:
        if (myVar.kind === "disease") {
          myVar.categories[index[1]].selectables.splice(index[2], 1);
        } else if (myVar.kind === "category") {
          myVar.selectables[index[1]].variables.splice(index[2], 1);
        }
        break;
      case 4:
        if (myVar.kind === "disease") {
          myVar.categories[index[1]].selectables[index[2]].variables.splice(
            index[3],
            1
          );
        }
        break;
    }
  }

  // START -------------------------
  // These Methods are used to calculate how many options should pop on the screen after selecting a number
  computeCats() {
    for (let i = 0; i < this.myDisease.anzahlCat; i++) {
      this.myDisease.myAtts.push({ anzahlAtt: undefined, myVars: [] });
    }
    console.log(this.myDisease);
  }

  computeAtts(category: number) {
    for (let i = 0; i < this.myDisease.myAtts[category].anzahlAtt; i++) {
      this.myDisease.myAtts[category].myVars.push({
        anzahlVar: undefined,
        varTypes: [],
      });
    }
    console.log(this.myDisease);
  }

  computeKAtts() {
    for (let i = 0; i < this.myAtt.anzahlAtt; i++) {
      this.myAtt.myVars.push({ anzahlVar: undefined, varTypes: [] });
    }
    console.log(this.myAtt);
  }

  printer() {
    console.log(this.myDisease);
    console.log(this.signupForm);
  }


  // END -------------------------------

  // START +++++++++++++++++++++++++++++++
  // These methods return the kind of the element that occurs in the dropdown

  topLevelType(top: N.TopLevel) {
    if (top.kind === "category") {
      return top.selectables;
    } else if (top.kind === "disease") {
      return top.categories;
    }
  }
  secondLevelType(second) {
    if (second.kind === "category") {
      return second.selectables;
    } else if (second.kind === "box") {
      return second.variables;
    }
  }

  thirdLevelType(third) {
    if (third.kind === "box") {
      return third.variables;
    }
  }

  // END +++++++++++++++++++++++++++++

  // just rotates the icon
  rotateIcon(x: number, y: number, z: number, p) {
    if (y === undefined) {
      document.getElementById("angle" + x).classList.contains("firstTime")
        ? document.getElementById("angle" + x).classList.toggle("myRotOut")
        : undefined;
      document.getElementById("angle" + x).classList.toggle("myRotIn");
      document.getElementById("angle" + x).classList.toggle("fa-rotate-180");
      document.getElementById("angle" + x).classList.add("firstTime");
    } else if (z === undefined) {
      document.getElementById("angle" + x + y).classList.contains("firstTime")
        ? document.getElementById("angle" + x + y).classList.toggle("myRotOut")
        : undefined;
      document.getElementById("angle" + x + y).classList.toggle("myRotIn");
      document
        .getElementById("angle" + x + y)
        .classList.toggle("fa-rotate-180");
      document.getElementById("angle" + x + y).classList.add("firstTime");
    } else {
      document
        .getElementById("angle" + x + y + z)
        .classList.contains("firstTime")
        ? document
          .getElementById("angle" + x + y + z)
          .classList.toggle("myRotOut")
        : undefined;
      document.getElementById("angle" + x + y + z).classList.toggle("myRotIn");
      document
        .getElementById("angle" + x + y + z)
        .classList.toggle("fa-rotate-180");
      document.getElementById("angle" + x + y + z).classList.add("firstTime");
    }

    console.log(p);
  }

  // START --------------------------
  // These two functions handle renaming of all kinds, from diseases to variables

  renameMode(mode: string, arr: Array<number>, kind: string, option?: string) {
    if (option === undefined) {
      option = "";
    }
    const ind = arr.join("");
    // console.log(document.getElementById("rename" + kind + ind));
    const b = document.getElementById(
      "rename" + option + kind + ind
    ) as HTMLButtonElement;
    switch (mode) {
      case "rename":
        console.log("MYPARTS");
        // console.log(this.myParts._results[0].nativeElement.nextElementSibling.childNodes[0].childNodes[0].childNodes[0].childNodes[3].childNodes[1]);
        console.log(this.myParts._results[0].nativeElement.nextElementSibling);

        b.value = "pressed";

        break;
      case "showInput":
        if (b != null) {
          /* console.log(new Date().getSeconds());
          console.log(b, ind, b.value == "pressed"); */
          return b.value === "pressed";
        } else {
          return false;
        }

      case "cancel":
        b.value = "";
        console.log("hey");
        console.log(b.value);
        break;
      case "submit":
        console.log(mode, "here");
        const c = document.getElementById(
          "renameVal" + option + kind + ind
        ) as HTMLFormElement;
        this.renameTop(arr, c, option);
        b.value = "";
        console.log(new Date().getSeconds + " Submit", c.value);
        // console.log(this.new_parts);
        break;
    }
  }
  renameTop(ind: Array<number>, c, option: string) {
    const myVar: N.TopLevel = this.myEdit.dict[ind[0]];
    switch (ind.length) {
      case 1:
        this.myEdit.dict[ind[0]].name = c.value;
        break;
      case 2:
        if (myVar.kind === "disease") {
          myVar.categories[ind[1]].name = c.value;
        } else if (myVar.kind === "category") {
          if (option === "name") {
            myVar.selectables[ind[1]].name = c.value
              .split(",")
              .map((s) => s.trim());
          } else if (option === "text") {
            myVar.selectables[ind[1]].text = c.value;
          } else if (option === "cg") {
            myVar.selectables[ind[1]].choiceGroup = c.value;
          } else if (option === "ag") {
            myVar.selectables[ind[1]].listGroup = c.value;
          } else if (option === "jt") {
            myVar.selectables[ind[1]].judgementText = c.value;
          }


        }
        break;
      case 3:
        if (myVar.kind === "disease") {
          if (option === "name") {
            myVar.categories[ind[1]].selectables[ind[2]].name = c.value
              .split(",")
              .map((s) => s.trim());
          } else if (option === "text") {
            myVar.categories[ind[1]].selectables[ind[2]].text = c.value;
          } else if (option === "cg") {
            myVar.categories[ind[1]].selectables[ind[2]].choiceGroup = c.value;
          } else if (option === "ag") {
            myVar.categories[ind[1]].selectables[ind[2]].listGroup = c.value;
          } else if (option === "jt") {
            myVar.categories[ind[1]].selectables[ind[2]].judgementText = c.value;
          }
        } else if (myVar.kind === "category") {
          const myVar2 = myVar.selectables[ind[1]].variables[ind[2]];
          if (myVar2.kind === "oc") {
            myVar2.values = c.value.split(",").map((s) => s.trim());
          } else if (myVar2.kind === "text") {
            myVar2.textBefore = c.elements[0].value;
            myVar2.unit = c.elements[1].value;
            myVar2.textAfter = c.elements[2].value;
          }
        }
        break;
      case 4:
        if (myVar.kind === "disease") {
          const myVar2 =
            myVar.categories[ind[1]].selectables[ind[2]].variables[ind[3]];
          if (myVar2.kind === "oc") {
            myVar2.values = c.value.split(",").map((s) => s.trim());
          } else if (myVar2.kind === "text") {
            myVar2.textBefore = c.elements[0].value;
            myVar2.unit = c.elements[1].value;
            myVar2.textAfter = c.elements[2].value;
          }
        }
        break;
    }

    /* this.myDict.dict[ind].name = c.value;
    console.log(this.myDict.dict[ind]); */
    console.log(this.myEdit.dict);
  }
  addToDict(kind: string, position: Array<number>) {
    this.addPosition = position.join("");
    this.signupForm.reset();
    this.myDisease = { anzahlCat: undefined, myAtts: [] };
    this.myAtt = { anzahlAtt: undefined, myVars: [] };
    switch (kind) {
      case "variable":
        this.myAtt.anzahlAtt = 1;
        this.computeKAtts();
        this.addVar = true;
        this.addAtt = false;
        this.addKat = false;

        break;
      case "attribute":
        this.myAtt.anzahlAtt = 1;
        this.computeKAtts();
        this.addAtt = true;
        this.addKat = false;
        this.addVar = false;
        break;
      case "category":
        console.log(this.addPosition);
        this.addAtt = false;
        this.addKat = true;
        this.addVar = false;
        break;
    }

  }


  // cancels the adding of any new information
  cancelAdding() {
    this.addAtt = false;
    this.addKat = false;
    this.addVar = false;
    this.signupForm.reset();
    this.myDisease = { anzahlCat: undefined, myAtts: [] };
    this.myAtt = { anzahlAtt: undefined, myVars: [] };
  }

  // not used, check if they can be removed without crashing
  /*   logg2(arr: Array<number>, kind: string) {
      let ind = arr.join("");
      let b = document.getElementById("rename" + kind + ind) as HTMLButtonElement;


    }
    logg3(arr: Array<number>, kind: string) {
      let ind = arr.join("");
      console.log(document.getElementById("rename" + kind + ind));
      let b = document.getElementById("rename" + kind + ind) as HTMLButtonElement;
      b.value = "";
    }
   */


  // update dict after making changes and saving them
  updateDict() {
    this.dictManager.updateDict(this.myEdit);
    this.router.navigate(["/list"]);
  }

  /* logg4(arr: Array<number>, kind: string) {
    let ind = arr.join("");
    console.log(document.getElementById("rename" + kind + ind));
    let b = document.getElementById("rename" + kind + ind) as HTMLButtonElement;
    let c = document.getElementById("renameDisVal" + ind) as HTMLButtonElement;
    this.dictionaryService.renameTop(Number(ind), c.value);
    b.value = "";
    console.log(this.new_parts);
  } */

  // just print and helper functions for debugging
  Myprinter() {
    console.log("triggered");
  }
  Myprinter2() {
    this.dictManager.addDict(this.myEdit);
  }
}
