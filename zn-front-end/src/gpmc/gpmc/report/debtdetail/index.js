/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';

export default class GpmcDetail extends Component {
    constructor (props) {
        super(props);
    }

    // 债务执行明细:  
    setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata) {
        console.log(transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata, 'transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata')
        if (obj && obj.key) {
            if (obj.key == 'linkdebtbill') {
                // props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/card", {
                //     id: rowdata[15][0]['0'],
                //     appcode: '36620GCL',
                //     pagecode:'36620GCL_CARD',
                //     scene: 'report',
                //     status: 'browse'
                // });
                drillToBill(props, data, 'pk_srcbill', 'pk_billtypecode');
            } else {
                props.openTo(url, urlParams);
            }
        }
        return;
        let type= rowdata[12][0]['0'];
        let id= rowdata[11][0]['0'];
        if (!type) {
            return;
        }
        switch(type) {
            case '36X1': // 授信协议
                props.openTo("/ccc/ccc/bankprotocol/main/index.html#/list", {
                    id,
                    status: 'browse',
                    appcode: '36610CC',
                    pagecode: '36610CC_Link',
                    scene: 'linksce',
                });
                break;
            case '36Z2':    // 贷款合同
                props.openTo("/cdmc/cdm/contract/main/index.html#/card", {
                    id,
                    status: 'browse',
                    appcode: '36630BLCL',
                    pagecode:'36630BLCL_CARD',
                    scene: 'linksce',
                });
                break;
            case '36Z4':    // 贷款还本
                props.openTo("/cdmc/cdm/repayprcpl/main/index.html#/card", {
                    id,
                    appcode: '36630BLPL',
                    pagecode: '36630BLPL_CARD',
                    scene: 'linksce',
                    status: 'browse'
                });
                break;
            case '3621':    // 债券契约
                props.openTo("/bond/bond/contract/main/index.html#/card", {
                    id,
                    status: 'browse',
                    appcode: '36650BCL',
                    pagecode: '36650BCL_CARD',
                    scene: 'linksce',
                });
                break;
            case '3623':    // 债券还本
                props.openTo("/bond/bond/repayprcpl/main/index.html#/card", {
                    id,
                    appcode: '36650BRPL',
                    pagecode: '36650BRPL_CARD',
                    scene: 'linksce',
                    status: 'browse'
                });
                break;
            case '36W3':    // 担保债务
                props.openTo("/gpmc/gpmc/GuaContractQuote/main/index.html#/card", {
                    id,
                    appcode: '36620GBM',
                    pagecode: '36620GBM_CARD',
                    scene: 'report',
                    status: 'browse'
                });
                break;
            default: 
                props.openTo(url, urlParams);
                break;
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