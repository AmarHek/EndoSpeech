import { Injectable } from "@angular/core";
import * as M from "../../helper-classes/gastro_model";
import { KeywordDisease, TextDic } from "../../helper-classes/keyword";
import { ParserBasisService } from "./parser-basis.service";
import { TextOutputService } from "./text-output.service";


@Injectable({
  providedIn: "root"
})

export class InputParserService {

  constructor(private textOut: TextOutputService, private base: ParserBasisService) {

  }
  // Contains whole Polyp with its Categories and Keywords inside of each Category
  diseases: Array<KeywordDisease> = [];
  // contains input text
  twInput: { twInput: string, again: boolean } = { twInput: "", again: false };
  // contains all missing categories after first "ende"
  missing: Array<TextDic> = [];
  // 2nd ende?
  end = false;
  start = false;
  // 1st ende?
  end0 = false;
  globalPos: number;
  startingTime: Date;



  /* --------------------------------
      Creating Dictionary
     --------------------------------
  */
  // Create a Dictionary (e.g. the polyp Object)

  createStartDict(rootEl: M.TopLevel[]) {
    this.diseases = this.base.createStartDict(rootEl);
    this.startingTime = new Date();


  }




  /* --------------------------------
      Analyzing Input
     --------------------------------
  */



  // parses the input by calling different methods and writing/reading to/from the polyp object
  parseInput(input: string) {
    this.twInput.twInput = input;
    let text: string;
    // checks if "ende" is called
    this.base.checkEnd(this.twInput.twInput);
    // if ende is not called yet
    if (!this.base.end) {
      // gets current disease
      let activeDis = this.base.setDisease(input, this.diseases);
      if (activeDis !== undefined) {
        // Checks if Category name contains Disease name, which produces an error
        const disPosLast = activeDis.position[activeDis.position.length - 1] + activeDis.name.length;

        if ((disPosLast !== input.length) && input.charAt(disPosLast) !== " ") {
          const tempInput = input.substr(0, activeDis.position[activeDis.position.length - 1]) + input.substr(disPosLast + 1);
          activeDis = this.base.setDisease(tempInput, this.diseases);
        }
        /* disabled: // pushes dis name to array for correction purpose later
        if(this.textOut.recogWords[this.textOut.recogWords.length-1] !== activeDis.name.toLowerCase()){
        this.textOut.recogWords.push(activeDis.name.toLowerCase());
        }  */
        // only look for categories at what comes after the last disease

        let input2 = "";
        for (let j = 0; j < activeDis.positionEnd.length; j++) {
          // adds together all input parts that belong to the active disease
          input2 += input.substring(activeDis.position[j], activeDis.positionEnd[j]);
        }
        // adds the current part from the disease
        input2 += input.substring(activeDis.position[activeDis.position.length - 1]);
        // loops through all categories of current disease
        for (let i = 0; i < activeDis.categories.length; i++) {
          const activeCat = activeDis.categories[i];
          activeCat.position = 0;
          activeCat.active = true;
          // if one active category is detected, it's active value is set to true, all others to false
          if (activeCat) {

            // Evaluate only the input that comes after the last category
            input2 = input2.substring(activeCat.position);
            // Find out which keywords occur in the input2
            for (const key of activeCat.keys) {
              key.position = this.base.getIndex(key, input2, activeCat.position + activeDis.position[activeDis.position.length - 1]);

            }
            // enables the rest normal method
            if (input2.toLowerCase().indexOf("rest normal") !== -1) {
              this.base.restNormal(activeDis);
            }
            // if a keyword is addressed by different synonyms, the synonym with the latest appearance has to be used
            // (currently not used: Also responsible for button clicks)
            this.base.onlyLatestKeyword(activeCat.keys);
            // if a category is addressed by different keywords, the keyword with the lastest appearance has to be used
            // Also check which keywords have variables and if the occur in the input2
            this.twInput.again = this.base.getActivesAndVariables(false, activeCat.keys, input2, activeDis, activeCat, this.twInput);
            // produces text output
            text = this.textOut.makeReport(activeCat, activeDis, this.startingTime);
          }
          activeCat.active = false;
        }

      }
      return text;
    }
    // no text when no category is activated
    return this.textOut.makeReport(undefined, undefined, this.startingTime);

  }

}
