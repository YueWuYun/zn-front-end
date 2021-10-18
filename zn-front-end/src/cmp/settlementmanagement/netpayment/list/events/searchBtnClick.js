/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let table_id = Templatedata.list_tableid;
let page_code = Templatedata.list_pageid;
let search_id = Templatedata.list_searchid;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {

    let _this = this;
    let oid = this.state.oid;
    if (searchVal) {
        this.setStateCache();
        let pageInfo = props.table.getTablePageInfo(table_id);
        let conditions = this.filterSearchValue(searchVal);
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
                    if (data) {
                        if (data && data.vos) {
                            this.props.table.setAllTableData(table_id, data.vos[table_id]);
                            this.props.button.setButtonDisabled(Templatedata.payGroup, false);
                            // 支付、联查、打印下拉禁用置灰
                            this.props.button.setButtonDisabled(Templatedata.payBtn, true);
                            this.props.button.setButtonDisabled('updatePayStatus', true);
                            this.props.button.setButtonDisabled(Templatedata.linkNetBankBtn, true);
                            this.props.button.setButtonDisabled(Templatedata.linkPayAffirmBtn, true);
                            this.props.button.setButtonDisabled(Templatedata.otherGruop, true);
                            this.props.button.setButtonDisabled(Templatedata.linkGroup, false);
                            //this.props.button.setButtonDisabled(Templatedata.otherGruop,false);
                            // 保存当前页的pks，用于在操作时候刷新页面数据
                            let pks = [];
                            data.vos[table_id].rows.forEach((val, index) => {
                                let pk = val.values.pk_settlement.value;
                                pks.push(pk);
                            });
                            this.setState({
                                pks: pks
                            });
                        } else {
                            this.setState({
                                pks: []
                            });//此处滞空查询得到的pk防止再次刷新还能有数据
                            this.props.table.setAllTableData(table_id, { rows: [] });
                            this.props.table.setAllTableData(table_id, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                        }
                        //====重新规定查询后提示方式====
                        if (data && data.num && data.num.alldata.num !='0') {
                            // 此处提示查询成功
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000074') });
                        } else {
                            //全部为空才提示为查询不到数据
                            this.setState({
                                pks: []
                            });//此处滞空查询得到的pk防止再次刷新还能有数据
                            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000070') });
                        }
                        if (data && data.num) {
                            //处理页签值，显示全部数据数量
                            //页签赋值
                            _this.setState({
                                tabs01: data.num.waitingsettle,
                                tabs02: data.num.paying
                            });
                        } else {
                            let value = { num: 0 };
                            this.setState({
                                tabs01: value,
                                tabs02: value
                            });
                        }
                    } else {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070OP") && this.props.MutiInit.getIntl("36070OP").get('36070OP-000070') });
                        this.props.table.setAllTableData(table_id, { rows: [] });
                        let value = { num: 0 };
                        this.setState({
                            tabs01: value,
                            tabs02: value
                        });
                    }
                }
            }
        });
    }

};

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/