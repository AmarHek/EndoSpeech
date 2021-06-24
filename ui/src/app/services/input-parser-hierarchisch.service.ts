import { Injectable } from "@angular/core";
import * as M from "../../helper-classes/gastro_model";
import { KeywordDisease, TextDic } from "../../helper-classes/keyword";
import { ParserBasisService } from "./parser-basis.service";
import { TextOutputService } from "./text-output.service";



@Injectable({
  providedIn: "root"
})

export class InputParserHierarchischService {

  constructor(private textOut: TextOutputService,  private base: ParserBasisService) {

  }
  // Contains whole Polyp with its Categories and Keywords inside of each Category
  diseases: Array<KeywordDisease> = [];
  // contains the input text
  twInput: { twInput: string, again: boolean } = { twInput: "", again: false };
  missing: Array<TextDic> = [];

  startingTime: Date;
  // finished?
  start = false;

  end = false;
  globalPos: number;


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
    // checks if "ende" is called
    this.base.checkEnd(this.twInput.twInput);
    // if ende is not called yet
    if (!this.base.end) {
      // gets currently active Disease
      let activeDis = this.base.setDisease(input, this.diseases);
      if (activeDis !== undefined) {
        // Checks if Category name contains Disease name, which produces an error
        const disPosLast = activeDis.position[activeDis.position.length - 1] + activeDis.name.length;

        if ((disPosLast !== input.length) && input.charAt(disPosLast) !== " ") {
          const tempInput = input.substr(0, activeDis.position[activeDis.position.length - 1]) + input.substr(disPosLast + 1);
          activeDis = this.base.setDisease(tempInput, this.diseases);
        }

        // only look for categories at what comes after the last disease
        let input2 = input.substring(activeDis.position[activeDis.position.length - 1]);
        // checks which category is active and where in the input field it occurs
        const activeCat = this.base.setCategory(input2, activeDis.categories);
        // if one active category is detected, it's active value is set to true, all others to false
        if (activeCat !== undefined) {
          // pushes dis name to array for correction purpose later
          if (this.textOut.recogWords.find(el => {
            // tslint:disable-next-line:max-line-length
            return (el.word.length >= activeCat.name.length && el.pos === activeCat.position + activeDis.position[activeDis.position.length - 1]);
          }) === undefined) {
            // tslint:disable-next-line:max-line-length
            this.textOut.recogWords.push({ word: activeCat.name.toLowerCase(), pos: activeDis.position[activeDis.position.length - 1] + activeCat.position });
            const ind = this.textOut.recogWords.findIndex(el => {
              // tslint:disable-next-line:max-line-length
              return ((el.pos === activeCat.position + activeDis.position[activeDis.position.length - 1]) && (el.word.length < activeCat.name.length));
            });
            if (ind !== -1) {
                this.textOut.recogWords.splice(ind, 1);
            }
          }

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
          this.twInput.again = this.base.getActivesAndVariables(true, activeCat.keys, input2, activeDis, activeCat, this.twInput);
          // produces text output
          const text = this.textOut.makeReport(activeCat, activeDis, this.startingTime);
          // Test log
          const index = activeDis.categories.findIndex(cat => cat.name === activeCat.name);
          console.log("IndexTest");
          console.log(this.diseases);
          console.log(index);
          // return output text
          return text;
          // if no category is active yet and a new disease was just created
        } else if (activeDis.firstTime) {
          // automatically goes into first category when disease is called
          const firstCatName = activeDis.categories[0].name;
          this.twInput.twInput += " " + firstCatName + " ";
          this.twInput.again = true;
          activeDis.firstTime = false;
        }
        console.log("KeyTest");
        console.log(this.diseases);

      }
    }
    // no text when no category is activated
    return this.textOut.makeReport(undefined, undefined, this.startingTime);
  }

}
