/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';

export default class GpmcDetail extends Component {
    constructor (props) {
        super(props);
    }

    // 反担保明细: 
    setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata) {
        console.log(transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata, 'transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata')
        if (obj && obj.key) {
            if (obj.key == 'linkctrybill') {
                // props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/card", {
                //     id: rowdata[15][0]['0'],
                //     appcode: '36620GCL',
                //     pagecode:'36620GCL_CARD',
                //     scene: 'report',
                //     status: 'browse'
                // });
                drillToBill(props, data, 'pk_guacontract', 'pk_billtypecode');
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