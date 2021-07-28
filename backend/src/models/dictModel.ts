export interface Dict {
    id:     string;
    parts:  TopLevel[];
    name:   string;
}

export type Variable = VariableOC  | VariableText;

export interface VariableOC {
    kind: "oc";
    values: string[];
}

export interface VariableCommon {
    textBefore: string;
    textAfter:  string;
}

export interface VariableText extends VariableCommon {
    kind:  "text";
    unit:  string;
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
