'use strict';

class RatesBoard {
    constructor(){
        this.tableBody = document.querySelector('table.table.rates tbody');
    }

    fillTable(data){
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                this.tableBody.innerHTML += `
                <tr>
                    <td>${key}</td>
                    <td data-eur-ntc="${element}">${element}</td>
                </tr>`;
            }
        }
    }

    clearTable(){
        this.tableBody.innerHTML = "";
    }
}