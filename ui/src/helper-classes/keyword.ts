export class KeywordSelectable {
    name: string;
    synonym: string;
    variables: KeywordVariable[];
    category: string;
    position: number;
    active: string;
    text?: string;
    normal?: boolean;
    judgement?: string;
}

export class KeywordVariable {
    kind: string;
    textAfter = "";
    textBefore = "";
    options: string[] = [];
    varFound: string[] = [];
}

export class KeywordCategory {
    keys: KeywordSelectable[];
    name: string;
    active: boolean;
    position: number;
    condition?: string;
}

export class KeywordDisease {
    name: string;
    categories: KeywordCategory[];
    active: boolean;
    number: number;
    position: number[];
    firstTime: boolean;
    positionEnd: number[];
}

export class TextDic {
    disName: string;
    reports: {text: string, category: string, key: string, code: string, condition: string}[];
}

