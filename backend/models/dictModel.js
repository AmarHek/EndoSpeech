
module.exports.VariableOC = function VariableOC(values){
    this.kind = "oc";
    this.values = values;
}

module.exports.VariableText = function VariableText(textBefore, textAfter, unit) {
    this.kind = "text";
    this.textBefore = textBefore;
    this.textAfter = textAfter;
    this.unit = unit;
}

module.exports.CheckBox = function CheckBox(name, text, normal, variables, choiceGroup, listGroup, judgementText){
    this.kind = "box";
    this.name = name;
    this.text = text;
    this.normal = normal;
    this.variables = variables;
    this.choiceGroup = choiceGroup;
    this.listGroup = listGroup;
    this.judgementText = judgementText;
}

module.exports.Category = function Category(name, condition = undefined, selectables){
    this.kind = "category";
    this.name = name;
    this.condition = condition;
    this.selectables = selectables;
}

module.exports.Disease = function Disease(name, categories){
    this.kind = "disease";
    this.name = name;
    this.categories = categories;
}

module.exports.myDict = function (id, dict, name){
    this.id = id;
    this.dict = dict;
    this.name = name;
}
