//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import BankDocGrid from '../component/bankDocGrid';

class BankDocListView extends Component{
    constructor(props){
        super(props);
        this.config = {
            type:this.getUrlParams("type"),
            pk_org:this.getUrlParams("pk_org")
        }
    }
    getUrlParams(pop){
        let result;
        let params = window.location.hash.split('#');
        if (params) {
            params = params[1].split('&');
            params.find((item) => {
                if (item.indexOf(pop) != -1) {
                    result = item.split('=')[1];
                }
            });
            return result;
        }
    }
    render(){
        let config = {
            type:this.config.type,
            pk_org:this.config.pk_org
        };
        return(
            <BankDocGrid config={config}/>
        );
    }
}

ReactDOM.render(<BankDocListView/>, document.querySelector('#app'));
//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65