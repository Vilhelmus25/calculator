'use strict';

const numberButtons = Array.from(document.querySelectorAll('[class^="calculator__buttons--"]'))
    .map((elements) => elements.firstChild.textContent)
    .filter(elements => parseInt(elements) == elements)             // itt az a baj, hogy megvizsgálja, stimmel, de stringként megy tovább, nekünk number kell, vagy tömb
    .map((elements) => parseInt(elements));        //  hát ez bejárja a tömbbe rakott stringeket és integerré alakítja, a forEach az csak kiiratás végett van, majd ki is vesszük

const buttonListener = () => document.querySelectorAll('[class^="calculator__buttons--"]')
    .forEach(elements => document.addEventListener('click', handleClick));          // az összes gombra egy wildcard kereséssel.   ^= starts with
//buttons.forEach((elements) => console.log(elements.firstChild));            // bejárja szépen a gombelemeket és kiírja, a firstchild a gombok tartalmát, vagyis a karaktereket adja vissza, ezek stringek

const calculatorScreen = document.querySelector('.calculator__screen');         // ha teszünk rá querySelectort, akkor már tudjuk változtatni a textContetn-jét!!!

console.log(numberButtons);
//numberButtons.forEach(elements => elements.addEventListener('click', handleClick));       // eseményfigyelőt teszünk rájuk, kattintásra ('click') és meghívjuk az onScreen metódust

function handleClick(event) {
    calculatorScreen.textContent = `${calculatorScreen.textContent}${event.target.textContent}`;
    return calculatorScreen.textContent;
}

buttonListener();