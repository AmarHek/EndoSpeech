var xlsx = require('xlsx');
//const mydata = require('./3de7a4722cbd2b7f6f31d60033ae636f.json');
const {
  VariableOC,
  VariableText,
  CheckBox,
  Category,
  Disease,
  myDict
} = require('../models/dictModel')

//var xldata = require('./dd70dc66af0d5800e754d3c0496e1082.json');


//console.log(JSON.stringify(mydata));

/* var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.json_to_sheet(mydata);
xlsx.utils.book_append_sheet(newWB, newWS, "Try1958");

xlsx.writeFile(newWB,"Try1958.xlsx"); */

//console.log(xldata[1]);

module.exports.parser = function parser(json) {

  let customDict = new myDict("random", [], "leo");
  try {


    json.forEach(element => {

      // case new disease is specified
      if (element.hasOwnProperty("Element") ? element.Krankheit !== "-" : false) {
        console.log("KrankheitsLoop");

        //Inline Variable
        let vari;
        if (element.hasOwnProperty("Variablenart")) {
          if (element.Variablenart.includes("Text")) {

            let varText = element.Variablendefinition.split("-").map(res => res.trim());
            console.log(varText);
            // need to implement unit vor variable
            vari = new VariableText(varText[0], varText.length === 2 ? varText[1] : "", element.Einheit);
          } else if (element.Variablenart.includes("Auswahl")) {
            vari = new VariableOC(element.Variablendefinition.split("/").map(res => res.trim()));
          }
        }

        let att = new CheckBox(element.Attribute.split(",").map(res => res.trim()), element.Text, element.hasOwnProperty("Normal") ? true : false,
          vari === undefined ? [] : [vari], element.hasOwnProperty("ChoiceGruppe") ? element.ChoiceGruppe : undefined,
          element.hasOwnProperty("Enumeration") ? element.Enumeration : undefined, element.hasOwnProperty("Beurteilungstext") ? element.Beurteilungstext : undefined);
        // Inline Category
        let abh = element.Abhängigkeit == '-' ? undefined : element.Abhängigkeit;
        let cat = new Category(element.Kategorien, abh, [att]);
        if (element.Krankheit == undefined) {
          throw new Error("No name for Element " + element.Element + " given");
        }
        customDict.dict.push(new Disease(element.Krankheit, [cat]));


        //case only new Categorie or toplevel category is specified
      } else if (element.hasOwnProperty("Kategorien") || element.hasOwnProperty("Element")) {
        let vari;
        if (element.hasOwnProperty("Variablenart")) {

          if (element.Variablenart.includes("Text")) {
            let varText = element.Variablendefinition.split("-").map(res => res.trim());


            // need to implement unit vor variable
            vari = new VariableText(varText[0], varText.length === 2 ? varText[1] : "", element.Einheit);
          } else if (element.Variablenart.includes("Auswahl")) {
            vari = new VariableOC(element.Variablendefinition.split("/").map(res => res.trim()));
          }
        }


        let att = new CheckBox(element.Attribute.split(",").map(res => res.trim()), element.Text, element.hasOwnProperty("Normal") ? true : false,
          vari === undefined ? [] : [vari], element.hasOwnProperty("ChoiceGruppe") ? element.ChoiceGruppe : undefined,
          element.hasOwnProperty("Enumeration") ? element.Enumeration : undefined, element.hasOwnProperty("Beurteilungstext") ? element.Beurteilungstext : undefined);
        console.log("CG");
        console.log(element.choiceGroup);
        console.log(element.hasOwnProperty(""));
        // Inline Category
        let abh = element.Abhängigkeit == '-' ? undefined : element.Abhängigkeit;
        let cat = new Category(element.Kategorien, abh, [att]);
        if (element.hasOwnProperty("Element")) {
          customDict.dict.push(cat);
        } else {
          customDict.dict[customDict.dict.length - 1].categories.push(cat);
        }

        // case only new attribute spacified
      } else if (element.hasOwnProperty("Attribute")) {
        console.log(element.Attribute);
        console.log(element.Variablenart == "Auswahl");
        let vari;
        if (element.hasOwnProperty("Variablenart")) {
          if (element.Variablenart.includes("Text")) {
            console.log("pimmel");
            let varText = element.Variablendefinition.split("-").map(res => res.trim());


            vari = new VariableText(varText[0], varText.length === 2 ? varText[1] : "", element.Einheit);
          } else if (element.Variablenart.includes("Auswahl")) {
            vari = new VariableOC(element.Variablendefinition.split("/").map(res => res.trim()));
          }
        }

        let att = new CheckBox(element.Attribute.split(",").map(res => res.trim()), element.Text, element.hasOwnProperty("Normal") ? true : false,
          vari === undefined ? [] : [vari], element.hasOwnProperty("ChoiceGruppe") ? element.ChoiceGruppe : undefined,
          element.hasOwnProperty("Enumeration") ? element.Enumeration : undefined, element.hasOwnProperty("Beurteilungstext") ? element.Beurteilungstext : undefined);

        if (customDict.dict[customDict.dict.length - 1].hasOwnProperty("categories")) {
          customDict.dict[customDict.dict.length - 1].categories[customDict.dict[customDict.dict.length - 1].categories.length - 1].selectables.push(att);
        } else {
          customDict.dict[customDict.dict.length - 1].selectables.push(att);
        }
      } else if (element.hasOwnProperty("Variablenart")) {
        let vari;
        if (element.Variablenart.includes("Text")) {
          console.log("pimmel");
          let varText = element.Variablendefinition.split("-").map(res => res.trim());


          vari = new VariableText(varText[0], varText.length === 2 ? varText[1] : "", element.Einheit);
        } else if (element.Variablenart.includes("Auswahl")) {
          vari = new VariableOC(element.Variablendefinition.split("/").map(res => res.trim()));
        }
        if (customDict.dict[customDict.dict.length - 1].hasOwnProperty("categories")) {
          customDict.dict[customDict.dict.length - 1].categories[customDict.dict[customDict.dict.length - 1].categories.length - 1]
            .selectables[customDict.dict[customDict.dict.length - 1].categories[customDict.dict[customDict.dict.length - 1].categories.length - 1]
              .selectables.length - 1].variables.push(vari);
        } else {
          customDict.dict[customDict.dict.length - 1].selectables[customDict.dict[customDict.dict.length - 1].selectables.length - 1].variables.push(vari);
        }
      }
    });
    console.log(JSON.stringify(customDict));
    return customDict;
  } catch (error) {
    console.error(error);
    console.log(customDict);
    return error.message;
  }


  //console.log(JSON.stringify(mydata));
}
