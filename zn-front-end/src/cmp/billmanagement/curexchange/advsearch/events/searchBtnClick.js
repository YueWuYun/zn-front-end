/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let oid = Templatedata.list_oid;
let queryType = Templatedata.list_querytype;
let list_searchscheme = Templatedata.list_searchscheme;
let list_searchalldata = Templatedata.list_searchalldata;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if(props.meta.getMeta()[this.searchId].oid){
        oid = props.meta.getMeta()[this.searchId].oid;//动态获取oid
    }
    if (searchVal) {
        // let queryInfo = props.search.getQueryInfo(this.tableId, false);
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchdata = {
            querycondition: searchVal,
            custcondition: {
                logic: 'and', //逻辑操作符，and、or
                conditions: []
            },
            pageInfo: pageInfo,
            pageCode: this.pageCode,
            queryAreaCode: this.searchId, //查询区编码
            oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };

        ajax({
            url: list_searchscheme,
            data: searchdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        /**
                         * 新增按钮中传参,选择第一条数据
                         */
                        let add_values = data[this.tableId].rows;//返回allpk的第一条pk
                        let add_pk = '';
                        let add_status = '';
                        if (add_values && add_values.length > 0) {
                            add_status = add_values[0].values.busistatus.value;
                            add_pk = add_values[0].values.pk_cruexchange.value;
                        }
                        this.setState({
                            add_pk: add_pk,
                            add_status: add_status
                        });
                        /**
                         * 列表赋值
                         */
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                        /**
                         * 页签赋值
                         */
                        ajax({
                            url: list_searchalldata,
                            data: searchdata,
                            success: (res) => {
                                let { success, data } = res;
                                if (success) {
                                    if (data) {
                                        //处理页签值，显示全部数据结果
                                        let returnData = data[this.tableId].rows;
                                        let tabs01 = [];
                                        let tabs02 = [];
                                        let tabs03 = [];
                                        let tabs04 = [];
                                        let tabs05 = [];
                                        let tabs06 = [];

                                        returnData.forEach((val) => {
                                            if (val.values.busistatus.value === '1') {
                                                //已保存
                                                tabs01.push(val.values.pk_cruexchange.value);
                                            }
                                            if (val.values.busistatus.value === '2') {
                                                // 待审批
                                                tabs02.push(val.values.pk_cruexchange.value);
                                            }
                                            if (val.values.busistatus.value === '3') {
                                                // 待办理
                                                tabs03.push(val.values.pk_cruexchange.value);
                                            }
                                            if (val.values.busistatus.value === '4') {
                                                // 已完毕
                                                tabs04.push(val.values.pk_cruexchange.value);
                                            }
                                            if (val.values.vbillstatus.value === '2') {
                                                //审批状态：审批中
                                                tabs06.push(val.values.pk_cruexchange.value);
                                            }
                                            tabs05.push(val.values.pk_cruexchange.value);


                                        });
                                        //页签赋值
                                        this.setState({
                                            tabs01: tabs01.length,
                                            tabs02: tabs02.length,
                                            tabs03: tabs03.length,
                                            tabs04: tabs04.length,
                                            tabs05: tabs05.length,
                                            tabs06: tabs06.length
                                        });
                                    }

                                }
                            }
                        });


                    } else {
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                        //页签赋值
                        this.setState({
                            tabs01: '',
                            tabs02: '',
                            tabs03: '',
                            tabs04: '',
                            tabs05: '',
                            tabs06: '',
                        });
                    }

                }
            }
        });
    }

};
/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/