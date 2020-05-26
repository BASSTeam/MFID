import html, { Component } from '../components/preact.js'
import getAge from '../components/age.js'
import loadStyle from '../components/styleLoader.js'

loadStyle('cards');

export class IDCard extends Component{
    render(){
        const { avatar, firstName, lastName, birthDay, id } = this.props;
        const age = getAge(...birthDay.split('.').map(v => +v));
        return html`<div class="card id">
            <div class="heading">Идентификатор гражданина</div>
            <div class="content">
                <div class="avatar" style="background-image: url('${avatar}')">
                    <div></div>
                </div>
                <div class="first-name">${firstName}</div>
                <div class="last-name">${lastName}</div>
                <div class="age">Возраст: ${age}&nbsp;года</div>
                <div class="birthday">Дата рождения: ${birthDay}</div>
            </div>
            <div class="footer">
                <div></div>
                <hr>
                <div class="blockchain-id">ID в блокчейне:
                    <div class="id">${id}</div>
                </div>
            </div>
            </div>
        </div>`
    }
}
