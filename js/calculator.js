'use strict';

let currentScreenContent = '';
let result;

//  itt kiválogatjuk csak a számokat egy tömbbe, mint kategória, a vizsgálatokhoz
const numberButtons = Array.from(document.querySelectorAll('[class^="calculator__buttons--"]'))         // az összes gombra egy wildcard kereséssel.   ^= starts with
    .map((elements) => elements.firstChild.textContent)             // a firstchild.textContent a gombok tartalma, vagyis a karaktereket adja vissza, ezek stringek
    .filter(elements => parseFloat(elements) == elements)             // itt az a baj, hogy megvizsgálja, stimmel, de stringként megy tovább, nekünk number kell, vagy tömb
    .map((elements) => parseFloat(elements));                         //  ez bejárja a tömbbe rakott stringeket és integerré alakítja azért kell
console.log(numberButtons);

//  itt kiválogatjuk csak az operátorokat egy tömbbe, mint kategória, a vizsgálatokhoz
const operatorButtons = Array.from(document.querySelectorAll('[class^="calculator__buttons--"]'))
    .map((elements) => elements.firstChild.textContent)
    .filter(elements => parseFloat(elements) != elements);            // ugyanaz, mint fönt csak ez az operátorokat válogatja ki
console.log(operatorButtons);

//  leves
const allButtons = Array.from(document.querySelectorAll('[class^="calculator__buttons--"]'))
    .map((elements) => elements.firstChild.textContent);
console.log(allButtons);


// eseményfigyelőt teszünk a gombokra, kattintásra ('click') és meghívjuk a handleClick metódust
const buttonListener = () => document.querySelectorAll('[class^="calculator__buttons--"]')
    .forEach(elements => document.addEventListener('click', handleClick));
//buttons.forEach((elements) => console.log(elements.firstChild));            

const calculatorScreen = document.querySelector('.calculator__screen');         // ha teszünk rá querySelectort, akkor már tudjuk változtatni a textContent-jét!!!

function handleClick(event) {                                                               // fontos, hogy a gombokra szűrjünk, mert ha csak az if van, akkor minden egér kattintásnak a targetjét beírja
    const getOnScreenContent = allButtons.filter(elements => elements == event.target.textContent)
        .filter(elements => elements !== 'C' && elements !== '=');
    //console.log(getOnScreenContent);
    if (getOnScreenContent == event.target.textContent) {
        calculatorScreen.textContent = `${calculatorScreen.textContent}${event.target.textContent}`;
        currentScreenContent = calculatorScreen.textContent;
    }

    // akciógombok:
    clearScreen();      //  törlés
    calculate();        //  kiszámolás
    //return currentScreenContent;
}

function clearScreen() {
    const isClearButton = operatorButtons.filter(elements => elements == event.target.textContent)
        .some(elements => elements === 'C');
    if (isClearButton) {
        calculatorScreen.textContent = ``;
        currentScreenContent = calculatorScreen.textContent;
    }
}

function calculate() {

    const isEqualButton = operatorButtons.filter(elements => elements == event.target.textContent)
        .some(elements => elements === '=');
    if (isEqualButton) {
        const operands = Array.from(calculatorScreen.textContent).filter((elements, index) => elements == operatorButtons.filter(item => item == elements));      // ez kiválogatja a műveletek a számlapról
        const numbers = Array.from(calculatorScreen.textContent).filter((elements, index) => elements == numberButtons.filter(item => item == elements));       // ez meg a számokat válogatja ki egy tömbbe, mindegyik számjegy egy string
        const allScreenContent = Array.from(calculatorScreen.textContent).filter((elements) => elements);

        (calculatorScreen.textContent != '') ?                  // ha nem üres a screen amikor '=' -jelet nyomunk       
            result = checkOperationRule(operands, numbers, allScreenContent)                                // itt a lényeg, amikor megnyomjuk az '=' -jelet amikor nem üres a screen, akkor vizsgálódunk
            : error();        // különben (ha üres) akkor Error!  (Error után még működnek a gombok, csak a cleart kellene működőképesnek hagyni)

        //  console.log(operatorButtons.filter((elements, index) => elements == operatorButtons[index]));
        console.log(result);
        calculatorScreen.textContent = result;

    }

}

function checkOperationRule(op, num, all) {

    let leftOperand = num[0];           // -andó
    let rightOperand = 0;               // -ó
    let currentOperand = '';            // aktuális operátor, a helyes műveleti függvény meghívásához
    let numberIterator = 0;             // bejárjuk vele a csak számokat tartalmazó elemeket amiket a screen-ből szűrtünk ki
    let operandIterator = 0;            // bejárjuk vele a csak operátorokat tartalmazó elemeket amiket a screen-ből szűrtünk ki
    let equation;
    let commaIndex = 0;

    if (all[0] === num[0]) {        // ha spec karakterrel kezdődik a számolás, akkor hiba, különben vizsgálunk tovább
        for (let i = 0; i < all.length;) {
            if (all[i] === num[numberIterator]) {    // amíg szám jön
                i += 1;                                // a ciklus loop-ját az if feltételhez kötöttük
                numberIterator += 1;                   // egyt léptetünk a vizsgálandó tömbbön, ami csak a számokat tartalmazza
            } else if (all[i] === '.') {                //  ha spec karakter jön, el kell dönteni milyen művelet az
                commaIndex = i;                     // lementjük a tizedestört indexét
                i += 1;                             // léptetünk egyet, mert akkor beragad, a tizedestörtnél, szám a következő
            } else {
                if (commaIndex != 0) {          //  kicsit katyvaszos lett, ha volt tizedestört, akkor a ciklus i-1     -ig menjen, hogy ne akadjon össze
                    for (let j = 1; j < i - 1; j += 1) {    // előbb lementjük az eddigi számokat egy változóba, azért i-1, mert az összefűzéshez kell egy nem 0 kezdőérték, ami az első indexű elem lett most 
                        if (j === commaIndex) {
                            leftOperand = leftOperand + '.';
                            leftOperand = leftOperand + num[j];
                        } else {
                            leftOperand = leftOperand + num[j];
                        }
                    }
                } else {                                    //  ha name volt tizedestört, akkor i -ig megy rendesen
                    for (let j = 1; j < i; j += 1) {    // előbb lementjük az eddigi számokat egy változóba, azért i-1, mert az összefűzéshez kell egy nem 0 kezdőérték, ami az első indexű elem lett most 
                        if (j === commaIndex) {
                            leftOperand = leftOperand + '.';
                            leftOperand = leftOperand + num[j];
                        } else {
                            leftOperand = leftOperand + num[j];
                        }
                    }
                }
                currentOperand = all[i];    // aztán az operandust mentjük le
                operandIterator += 1;       // az operátorokat vizsgáló iterátort is növeljük eggyel
                i += 1;                     // az all-tömb is iterál egyet
                if (all[i] === op[operandIterator]) {         // ha az operandus után operandus jön, akkor hibával térünk vissza
                    return error();
                } else {
                    rightOperand = num[numberIterator];     // hogy ne a 0 legyen a kezdőérték, mert nem tudom az elején mi lesz ennek az értéke
                    while (all[i] === num[numberIterator] && i < all.length - 1) {      // a num[numberiterator] amikor az utolsó iterációban van (all.lenght-1) akkor +1-el az utolsó elemet fogja elérni és nem lesz gond
                        rightOperand = rightOperand + num[numberIterator + 1]; // aztán lementjük a többi számot egy másik változóba; +1, hogy ne ugyanaz legyen, mint a kezdőérték
                        i += 1;                          // a ciklus loop-ját az if feltételhez kötöttük
                        numberIterator += 1;             // egyt léptetünk a vizsgálandó tömbbön, ami csak a számokat tartalmazza
                    }
                }
                console.log(`leftOperand: ${leftOperand}, majd rightOperand: ${rightOperand} és az operandus: ${currentOperand}`);
            }

        }
        leftOperand = parseFloat(leftOperand);          //  itt átalakítjuk stringből floatba, hogy az összeadás is működjön és ne egymáshoz fűzze a számokat
        rightOperand = parseFloat(rightOperand);

        switch (currentOperand) {
            case '+':
                equation = summary(leftOperand, rightOperand);
                break;
            case '-':
                equation = difference(leftOperand, rightOperand);
                break;
            case '*':
                equation = multiplication(leftOperand, rightOperand);
                break;
            case '/':
                equation = divide(leftOperand, rightOperand);
                break;
            default: error();
        }
    } else {
        return error();
    }
    return equation;
}

const error = () => result = `ERROR!!!`;

// műveletek
const summary = (a, b) => a + b;
const difference = (a, b) => a - b;
const multiplication = (a, b) => a * b;
const divide = (a, b) => a / b;

// button listener
buttonListener();