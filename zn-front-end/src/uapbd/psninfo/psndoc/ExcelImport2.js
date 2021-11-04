//QACDwalVOlJE0X5bjA/eqPBr+3X0FtDnYo3r1lrXwh0ApmgQll7SGHE8r2kzXzSd
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base,toast,print,high,promptBox,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
const {PrintOutput,ExcelImport}=high;
export class ExcelImport2 extends Component {
    constructor(props) {
    }
    render() {
        var newProps = {...this.props};
        delete newProps['appcode'];
        newProps['appcode'] = props.getAppCode();
        return <ExcelImport {...newProps}/>
    }
     
}

export class Print2 extends Component {
    constructor(props) {
    }
    render() {
        var newProps = {...this.props};
        delete newProps['appcode'];
        newProps['appcode'] = props.getAppCode();
        return <ExcelImport {...newProps}/>
    }
     
}



//QACDwalVOlJE0X5bjA/eqPBr+3X0FtDnYo3r1lrXwh0ApmgQll7SGHE8r2kzXzSd