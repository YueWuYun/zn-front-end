/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/
/*
 * @Author: chenjm7
 * @PageInfo: 内部活期存款利息汇总回单
 * @Date: 2019年3月22日10:15:58
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { SimpleReport } from "nc-report";
import { createPage, ajax, base } from 'nc-lightapp-front';
class DemandIntList extends Component {
    constructor(props) {
        super(props);
    }

    disposeSearch(meta, props) {
        // 参照过滤
        let items = meta['light_report'].items;
        items.forEach((item) => {
            //资金组织
            if (item.attrcode == 'a.pk_org') {
        //显示停用
        item.isShowDisabledData = true;
                item.queryCondition = () => {
                    return {
                        funcode: '36341CIBS',
                        TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
                    }
                }
            }
        });
        return meta; // 处理后的过滤参照返回给查询区模板
    }

    /**
     * items: 查询区查询数据，如需拓展查询区参数，请返回与items相同格式的查询数据
     * props: 平台props
     * type: 是普通查询还是高级查询
     * queryInfo: 经过包装的queryCondition
     */
    expandSearchVal(items, props, type, queryInfo) {
        return items;
    }

    /**
     * 查询区默认显示字段值
     * searchId: 查询区需要的searchId参数
     * 'vname': 需要附默认值的字段
     * {value: '111'}: 显示值，区间为[]，具体可以对照平台查询区修改
     * 'like': 为oprtype字段值
     */
    setDefaultVal(searchId, props) {
        // props.search.setSearchValByField(searchId, 'vname', { value: '111' }, 'like');
    }

    /**
     * 查询区编辑后事件
     * props: props
     * searchId: 查询区需要的searchId参数
     * field: 编辑后的key
     * val: 编辑后的value
     */
    onAfterEvent(props, searchId, field, val) {
    }

    /**
     * 高级查询点击事件
     * props: 平台props
     * searchId: 查询区searchId
     */
    clickAdvBtnEve = (props, searchId) => {
    }

    render() {
        return (
            <div className="table">
                <SimpleReport
                    setDefaultVal={this.setDefaultVal.bind(this)}
                    disposeSearch={this.disposeSearch.bind(this)}
                    expandSearchVal={this.expandSearchVal.bind(this)}
                    onAfterEvent={this.onAfterEvent.bind(this)} //编辑后事件
                    clickAdvBtnEve={this.clickAdvBtnEve.bind(this)}
                    showAdvBtn={true}
                />
            </div>
        );
    }
}
DemandIntList = createPage({
    // mutiLangCode: '36341CIBS'
})(DemandIntList);

export default DemandIntList;
ReactDOM.render(<DemandIntList />, document.getElementById("app"));

/*cI4u54VYZVPxnvGrX5EL6GCGEKAUJFPIuiT7E9tOsZvfeqazA5KHKnhlYnPVmG2G*/