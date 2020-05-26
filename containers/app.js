import html, { Component } from '../components/preact.js'
import loadStyle from '../components/styleLoader.js'
import { pages, root, containers } from '../components/paths.js'
import LoadingComponent from './loading.js'
import NotFoundPage from '../pages/404.js'

function getLinkParams(){
    const container = location.href.slice(root.length + 1, -location.search.length);
    const params = {};
    for(const [ name, val ] of location.search.slice(1).split('&').map(v => v.split('=').map(decodeURIComponent))){
        params[name] = val === undefined ? true : val == +val ? +val : val
    }
    return { container, params }
}

loadStyle('main');

export default class App extends Component{
    state = {
        Component: LoadingComponent,
        params: {}
    }
    async componentDidMount(){
        try{
            const { container, params } = getLinkParams();
            const Container = (await import(`${pages}/${container}.js`)).default;
            this.setState({ Container, params })
        } catch(e){
            console.error(e);
            this.setState({ Container: NotFoundPage })
        }
    }
    render(){
        const { Container, params } = this.state;
        return Container ? html`
            <${Container} ...${params}/>
        ` : null
    }
}
