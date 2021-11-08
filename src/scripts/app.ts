// noinspection TypeScriptFieldCanBeMadeReadonly

// TODO: mover lo no-tan-relevante al archivo other.ts
class ValueDB {// Solo debe instanciarse una vez (no sé como implementar algo como clases estáticas).

    private _valueList:string[];

    private _dbKey:string = "valueDBList";

    get valueList(): string[] {
        return this._valueList;
    }
    set valueList(value: string[]) {
        this._valueList = value;
    }

    // TODO: no es necesario tener una copia de los valores el localstorage.
    // La lista ya cumple esa función.
    public pushKeyValueToDB (value:string) {
        this._valueList.push(value);
        /*
        let currentValue = JSON.parse(localStorage.getItem(this.dbKey));
        currentValue = currentValue.push(value);
        //TODO: fix add individual value to db
        localStorage.setItem(this.dbKey,JSON.stringify(currentValue));
         */
        valueDB.restoreDB();
    }

    public removeToDB (value:string) {
        this._valueList.splice(this._valueList.indexOf(value),1);
    }

    // recupera los valores en el localStorage para guardarlos
    // en la lista valueList.
    public updateValueList () {
        this._valueList = JSON.parse(localStorage.getItem(this._dbKey));
    }

    // destruye la lista de valores actual y la recrea según los datos existentes almacenados.
    public restoreDB () {
        localStorage.removeItem(this._dbKey);
        this._valueList = Object.keys(localStorage);
        localStorage.setItem(this._dbKey,JSON.stringify(this._valueList));
    }

    constructor() {
        let valueList: string = localStorage.getItem(this._dbKey);

        if (valueList !== null) {
            this._valueList = JSON.parse(localStorage.getItem(this._dbKey));
        }
        else {
            localStorage.setItem(this._dbKey, JSON.stringify([]))
            this._valueList = JSON.parse(localStorage.getItem(this._dbKey));
        }
    }
}

let valueDB:ValueDB;

function main() {
    let btnAdd: HTMLElement = document.getElementById("btnAdd");
    let btnClear: HTMLElement = document.getElementById("btnClear");

    valueDB = new ValueDB();
    valueDB.restoreDB();
    restoreList();

    btnAdd.addEventListener('click', addNewContact);
    btnClear.addEventListener('click', clearAll);
}

function clearAll() {
    valueDB.valueList = [];
    localStorage.clear();
    valueDB.restoreDB();
    document.getElementById('valueList').innerHTML = "";
}

function restoreList() {
    for (let i = 0; i < valueDB.valueList.length; i++) {
        let currentValue = restoreValueFromKeyInLocalStorage(valueDB.valueList[i]);
        pushToList(currentValue);
    }
}


function pushToList(contact: { num: number; name: string }) {
    let ul = document.getElementById('valueList');
    let li = document.createElement('li');
    // TODO: probablemente una tabla?

    li.appendChild(document.createTextNode(`${contact.name} ${contact.num}`));
    ul.appendChild(li);

}


function getKeyToValue(num: number, name: string) {
    let valueKey: string = "";
    for (let i = 0; i < name.length; i++) {
        valueKey = valueKey + String(name.charAt(i).charCodeAt(0));
    }
    valueKey += String(num);

    return valueKey;
}

function restoreValueFromKeyInLocalStorage (valueKey:string) {
    let restoredValue: string = localStorage.getItem(valueKey);
    if (restoredValue !== null) {
        return JSON.parse(restoredValue);
    }
    else {
        stdError("valor inválido / inexistente");
        return null;
    }
}

function pushToLocalStorage(contact: { num: number; name: string }) {
    let keyValue: string = getKeyToValue(contact.num, contact.name);
    localStorage.setItem(keyValue, JSON.stringify(contact));
    valueDB.pushKeyValueToDB(keyValue);
}

function createNewContact(insName:string, insNumber:number) {
    return { name: insName, num: insNumber }
}

function addNewContact() {
    let name: HTMLInputElement = <HTMLInputElement>document.getElementById('tlbName');
    let num: HTMLInputElement = <HTMLInputElement>document.getElementById('tlbNum');
    let contact: { num: number; name: string } = createNewContact(name.value,Number(num.value));

    if (!(valueDB.valueList.includes(getKeyToValue(contact.num,contact.name)))) {
        if (Boolean(num.value) && Boolean(name.value)) {
            pushToList(contact);
            pushToLocalStorage(contact);
        }
    }
}

function stdError(errMsg: string) {
    console.log(`ERROR: ${errMsg}`);
    alert(`ERROR: ${errMsg}`);
}

window.onload = main;