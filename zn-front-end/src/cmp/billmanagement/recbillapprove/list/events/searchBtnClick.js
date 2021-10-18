/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let table_id = Templatedata.list_tableid;
let page_code = Templatedata.list_pageid;
let search_id = Templatedata.list_searchid;
let oid = Templatedata.list_oid;
let querytype = Templatedata.list_querytype;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if(props.meta.getMeta()[search_id].oid){
        oid = props.meta.getMeta()[search_id].oid;//动态获取oid
    }
    if (searchVal) {
        let pageInfo = props.table.getTablePageInfo(table_id);
        let searchdata = {
			querycondition: searchVal,
			custcondition: {
				logic: 'and', //逻辑操作符，and、or
				conditions: []
			},
			pageInfo: pageInfo,
			pageCode: page_code,
			queryAreaCode: search_id, //查询区编码
			oid:oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
			querytype: 'tree'
		};
        ajax({
            url: '/nccloud/cmp/recbill/recbillquery.do',
            data: searchdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                            /**
                         * 新增按钮中传参,选择第一条数据
                         */
                        let add_values = data[table_id].rows;//返回allpk的第一条pk
                        let add_pk ='';
                        let add_status = '';
                        if(add_values && add_values.length>0){
                            add_status =  add_values[0].values.bill_status.value;
                            add_pk = add_values[0].values.pk_recbill.value;
                        }
                        this.setState({
                            add_pk: add_pk,
                            add_status: add_status
                        });
                        /**
                         * 赋值
                         */
                        this.props.table.setAllTableData(table_id, data[table_id]);

                        /**
                         * 页签赋值
                         */
                        ajax({
                            url: '/nccloud/cmp/recbill/recbillqueryalldata.do',
                            data: searchdata,
                            success: (res) => {
                                let { success, data } = res;
                                if (success) {
                                    if (data) {
                                        //处理页签值，显示全部数据结果
                                        let returnData = data[table_id].rows;
                                        let tabs00 = [];
                                        let tabs01 = [];
                                        let tabs02 = [];
                                        let tabs09 = [];
                                        let tabs10 = [];
                                        let tabs11 = [];

                                        returnData.forEach((val) => {
                                            if (val.values.bill_status.value === '1') {
                                                //审批通过
                                                tabs01.push(val.values.pk_recbill.value);
                                            }
                                            if (val.values.bill_status.value === '2') {
                                                //审批中
                                                tabs02.push(val.values.pk_recbill.value);
                                            }
                                            if (val.values.bill_status.value === '9') {
                                                // 未确认
                                                tabs09.push(val.values.pk_recbill.value);
                                            }
                                            if (val.values.bill_status.value === '-10') {
                                                //保存
                                                tabs10.push(val.values.pk_recbill.value);
                                            }
                                            if (val.values.bill_status.value === '-1') {
                                                //待审批
                                                tabs11.push(val.values.pk_recbill.value);
                                            }

                                        });
                                        //页签赋值
                                        this.setState({
                                            tabs00: tabs00.length,
                                            tabs01: tabs01.length,
                                            tabs02: tabs02.length,
                                            tabs09: tabs09.length,
                                            tabs10: tabs10.length,
                                            tabs11: tabs11.length
                                        });
                                    }

                                }
                            }
                        });

                    } else {
                        // this.props.table.setAllTableData(table_id, { rows: [] });
                        this.props.table.setAllTableData(this.tableId, { rows: [] ,pageInfo:{pageIndex:0,pageSize:10,total:0,totalPage:0}});
                        //页签赋值
                        this.setState({
                            tabs00: '',
                            tabs01: '',
                            tabs02: '',
                            tabs09: '',
                            tabs10: '',
                            tabs11: ''
                        });
                        
                    }

                }
            }
        });
    }

};

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/