/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';

export default class GpmcDetail extends Component {
    constructor (props) {
        super(props);
    }

    setConnectionSearch (transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata) {
        console.log(transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata, 'transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata')
        if (obj && obj.key) {
            if (obj.key == 'linkprobill') {
                // props.openTo("/gpmc/gpmc/GuaProperty/main/index.html#/card", {
                //     id: rowdata[14][0]['0'],
                //     appcode: '36620GP',
                //     pagecode: '36620GP_CARD',
                //     scene: 'report',
                //     status: 'browse'
                // });
                drillToBill(props, data, 'pk_guaproperty', 'pk_billtypecode');
            } else {
                props.openTo(url, urlParams);
            }
        }
    }

    render () {
        return (
            <div className='table'>
                <SimpleReport 
                    setConnectionSearch={this.setConnectionSearch.bind(this)} 
                />
            </div>
        );
    }
}

ReactDOM.render(<GpmcDetail/>, document.getElementById('app'));
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/