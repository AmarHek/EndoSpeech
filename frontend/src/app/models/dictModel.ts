import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export interface Dict {
  _id:       string;
  parts:    TopLevel[];
  timestamp: Date;
  name:     string;
}

export type Selectable = CheckBox;

export interface CheckBox {
  kind:           "box";
  name:           string[];
  text:           string;
  judgementText?: string;
  normal:         boolean;
  variables:      Variable[];
  choiceGroup:    string;
  listGroup:      string;
  predictable?:   boolean;
}

export interface Option {
  kind:           "option";
  name:           string;
  text:           string;
  conditionalId?: string;
  judgementText?: string;
  normal:         boolean;
  variables:      Variable[];
}

export type TopLevel = Category | Disease;

export interface Disease {
  kind:         "disease";
  name:         string;
  categories:   Category[];
}

export interface Category {
  kind:         "category";
  name:         string;
  condition:    string;
  selectables:  Selectable[];
}

export type Variable = VariableOC | VariableText | VariableMC | VariableNumber | VariableDate | VariableRatio;

export interface VariableOC {
  kind:   "oc";
  value?: string;
  values: string[];
}

export interface VariableCommon {
  textBefore: string;
  textAfter:  string;
}

export interface VariableMC extends VariableCommon {
  kind:   "mc";
  values: [string, boolean][];
}

export interface VariableText extends VariableCommon {
  kind:  "text";
  unit: string;
}

export interface VariableNumber extends VariableCommon {
  kind:  "number";
  value: number;
}

export interface VariableDate extends VariableCommon {
  kind:  "date";
  value: NgbDateStruct;
}

export interface VariableRatio extends VariableCommon {
  kind:           "ratio";
  numerator:      number;
  denominator:    number;
  fractionDigits: number;
}

export class Vars {
  anzahlVar = 0;
  varTypes: Array<string> = [];
}

export class Atts {
  anzahlAtt = 0;
  myVars: Array<Vars> = [];
}

export class Cats {
  anzahlCat = 0;
  myAtts: Array<Atts> = [];
}

