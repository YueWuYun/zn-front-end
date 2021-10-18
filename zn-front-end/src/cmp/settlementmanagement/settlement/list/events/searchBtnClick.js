/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, deepClone, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let table_id = Templatedata.list_tableid;
let page_code = Templatedata.list_pageid;
let search_id = Templatedata.list_searchid;

/**
 * 点击查询，获取查询区数据
 * @param {*} props 
 * @param {*} searchVal 
 */
export default function clickSearchBtn(props, searchVal) {

    let _this = this;
    let oid = this.state.oid;
    if (props.meta.getMeta()[search_id].oid) {
        oid = props.meta.getMeta()[search_id].oid;//动态获取oid
    }
    let tabKey = this.state.tabKey;
    let conditions = [];
    if (tabKey != '0') {
        conditions = this.filterSearchValue(searchVal);
    }
    if (searchVal) {
        let pageInfo = props.table.getTablePageInfo(table_id);
        let searchdata = {
            querycondition: searchVal,
            custcondition: {
                logic: 'and', //逻辑操作符，and、or
                conditions
            },
            pageInfo: pageInfo,
            pageCode: page_code,
            queryAreaCode: search_id,  //查询区编码
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };
        ajax({
            url: Templatedata.query,
            data: searchdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let selectedData = props.table.getCheckedRows(this.tableId);
                    if (selectedData.length == 0) {
                        props.button.setButtonDisabled(Templatedata.allBtnName, true);//没有数据时按钮不可用
                    }
                    if (data && data.vos) {
                        props.table.setAllTableData(table_id, data.vos[table_id]);
                        // 保存当前页的pks，用于在操作时候刷新页面数据
                        let pks = [];
                        data.vos[table_id].rows.forEach((val, index) => {
                            let pk = val.values.pk_settlement.value;
                            pks.push(pk);
                        });
                        _this.setState({
                            pks: pks
                        });
                    } else {
                        _this.setState({
                            pks: []
                        });//滞空数据防止刷新页面再有数据!
                        props.table.setAllTableData(table_id, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    }
                    //====重新规定查询后提示方式====
                    if (data && data.num && data.num.alldata && data.num.alldata.num != '0') {
                        // 此处提示查询成功
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000101') });
                    } else {
                        //全部为空才提示为查询不到数据
                        _this.setState({
                            pks: []
                        });//滞空数据防止刷新页面再有数据!
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000080') });
                    }
                    if (data && data.num) {
                        //页签赋值
                        _this.setState({
                            tabs01: data.num.waitingsign,
                            tabs02: data.num.waitingsettle,
                            tabs04: data.num.paying,
                            tabs05: data.num.isbacked
                        })
                    } else {
                        let value = { num: 0 };
                        _this.setState({
                            tabs00: value,
                            tabs01: value,
                            tabs02: value,
                            tabs03: value,
                            tabs04: value,
                            tabs05: value
                        });
                    }
                }
            }
        });
    }

};

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/