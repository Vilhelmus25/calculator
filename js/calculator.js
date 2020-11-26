'use strict';

const buttons = Array.from(document.querySelectorAll('[class^="calculator__buttons--"]'));          // az összes gombra egy wildcard kereséssel.   ^= starts with
//buttons.forEach((elements) => console.log(elements.firstChild));            // bejárja szépen a gombelemeket és kiírja, a firstchild a gombok tartalmát, vagyis a karaktereket adja vissza, ezek stringek

const numberButtons = buttons.map((elements) => elements.firstChild.textContent)
    .filter(elements => parseInt(elements) == elements)             // itt az a baj, hogy megvizsgálja, stimmel, de stringként megy tovább, nekünk number kell, vagy tömb
    .forEach((elements) => console.log(typeof elements));        //  hát ez bejárja a tömbbe rakott stringeket és integerré alakítja, a forEach az csak kiiratás végett van, majd ki is vesszük

numberButtons.forEach(elements => elements.addEventListener('click', handleClick));       // eseményfigyelőt teszünk rájuk, kattintásra ('click') és meghívjuk az onScreen metódust



function handleClick(item) {
    (event) => event.target.textContent = item;
    console.log(item);
}