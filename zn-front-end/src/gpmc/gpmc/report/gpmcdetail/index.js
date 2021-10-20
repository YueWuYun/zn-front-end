/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { SimpleReport } from 'nc-report';
import { drillToBill } from '../../../../tmpub/report/query/DrillUtil';

export default class GpmcDetail extends Component {
    constructor (props) {
        super(props);
    }

    disposeSearch (meta, props) {
        // 参照过滤
        let items = meta['light_report'].items;
        items.forEach((item) => {
            if(item.attrcode == 'pk_org') {//财务组织
                item.queryCondition = () => {
                    return {
                        funcode: props.getSearchParam('c'),//appcode获取
                        TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
                    }
                }
                item.isMultiSelectedEnabled = true;
            }
            if(item.attrcode == 'pk_guacontract') {//担保合同号
                item.queryCondition = () => {
                    return {
                        contracttype: '1',
                        isdetail: true
                    }
                }
            }
        });
        return meta; // 处理后的过滤参照返回给查询区模板
    }

    /**
     * 
     * @param  items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
     */
    expandSearchVal (items) {
        // 变量赋值拓展
        console.log(items)
        // if (items.length > 0) {
        //     items.forEach(item => {
        //         if (item.field == 'user_name') { // 需要进行拓展的变量
        //             if (item.value.firstvalue == '11') {
        //                 let obj = {  //obj对象内oprtype为between时firstvalue,secondvalue都有值，其他情况只有firstvalue有值
        //                     field: 'user_other',
        //                     oprtype: 'like',
        //                     value: {firstvalue: '111', secondvalue: '222'}
        //                 }
        //                 items.push(obj);
        //             }
        //         }
        //     })
        // }
        return items;
    }

    /**查询区编辑后事件
     * props: props
     * searchId: 查询区需要的searchId参数
     * field: 编辑后的key
     * val: 编辑后的value
     */
    onAfterEvent (props, searchId, field, val) {
        //财务组织
        // if (field == 'pk_org') {
        //     props.search.setSearchValByField(searchId, 'pk_account', { value: null });   
        // }
        // //开户组织
        // if (field == 'pk_ownerorg') {
        //     props.search.setSearchValByField(searchId, 'pk_account', { value: null });   
        // }
        // //币种
        // if (field == 'pk_currtype') {
        //     props.search.setSearchValByField(searchId, 'pk_account', { value: null });   
        // }
    }

    // 债务执行明细:  linkdebtbill,  
    // 担保额度执行明细: linkguabill, 
    // 反担保明细: linkctrybill, 
    // 物权执行明细: linkprobill
    setConnectionSearch(transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata) {
        console.log(transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata, 'transSaveObject, obj, data, props, url, urlParams, sessonKey, rowdata');
        let linkDetail= {
            linkdebt: '/gpmc/gpmc/report/debtdetail/index.html',
            linkctry: '/gpmc/gpmc/report/ctrydetail/index.html',
            linkpro: '/gpmc/gpmc/report/prodetail/index.html',
        };
        if (!obj) {
            return;
        }
        switch(obj.key) {
            case 'linkguabill': // 担保额度执行明细
                // props.openTo("/gpmc/gpmc/Guarantee/main/index.html#/card", {
                //     id: rowdata[19][0]['0'],
                //     appcode: '36620GCL',
                //     pagecode:'36620GCL_CARD',
                //     scene: 'report',
                //     status: 'browse'
                // });
                drillToBill(props, data, 'pk_guacontract', 'pk_billtypecode');
                break;
            case 'linkdebt':    // 债务执行明细
            case 'linkctry':    // 反担保明细
            case 'linkpro':     // 物权执行明细
                props.openTo(linkDetail[obj.key], urlParams);
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
                    showAdvBtn={true} 
                    disposeSearch={this.disposeSearch.bind(this)} 
                    setConnectionSearch={this.setConnectionSearch.bind(this)} 
                    // onAfterEvent={this.onAfterEvent.bind(this)}
                    // expandSearchVal={this.expandSearchVal.bind(this)} 
                />
            </div>
        );
    }
}

ReactDOM.render(<GpmcDetail/>, document.getElementById('app'));
/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/