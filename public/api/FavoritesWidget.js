'use strict';

class FavoritesWidget{
    constructor(){
        this.favoritesTableBody = document.querySelector('table.table.addresses tbody');
        this.addUserToFavoritesForm = document.getElementById('addUser');
        this.favoritesMessageBox = document.getElementById('favoritesMessageBox');
        this.favoritesMessageBox.style.display = 'none';

        this.addUserCallback = f => f;
        this.removeUserCallback = f => f;

        this.addUserToFavoritesForm.querySelector('.button').
            addEventListener('click', () => {
                this.addUserCallback(this._getData());
                this.addUserToFavoritesForm.reset();
            });

        this.favoritesTableBody.addEventListener('click', event => {
            if(event.target.closest('button')){
                const userId = event.target.closest('tr').children[0].textContent;
                this.removeUserCallback(userId);
            }
        });

    }
    
    fillTable(data){
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                this.favoritesTableBody.innerHTML += `
                <tr>
                    <td data-addressee-id='${key}'>${key.length > 15 ? key.slice(0,15)+"..." : key}</td>
                    <td data-addressee-name='${element}'>${element}</td>
                    <td>
                        <button class='ui purple icon button mini'>
                        <i class='trash icon'></i>
                        </button>
                    </td>
                </tr>`;
            }
        }
    }

    clearTable(){
        this.favoritesTableBody.innerHTML = '';
    }

    _getData(){
        
        const id = this.addUserToFavoritesForm.querySelector("[placeholder='ID']").value;
        const name = this.addUserToFavoritesForm.querySelector("[placeholder='Имя']").value;
        return {id, name};
    }

    setMessage(isError, message){
        if(isError){
            this.favoritesMessageBox.className = 'ui message fluid error';
        }else{
            this.favoritesMessageBox.className = 'ui message fluid success';
        }

        this.favoritesMessageBox.innerText = message;
        this.favoritesMessageBox.style.display = 'block';
        setTimeout(() => this.favoritesMessageBox.style.display = 'none', 5000)
    }
}