import html, { Component } from '../components/preact.js'
import * as demoData from '../components/demo_data.js'
import { IDCard } from '../containers/cards.js'

export default class extends Component{
    render(){
        return html`<${IDCard} ...${demoData}/>`
    }
}
