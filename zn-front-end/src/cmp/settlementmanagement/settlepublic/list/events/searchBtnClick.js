/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let table_id = Templatedata.list_tableid;
let page_code = Templatedata.list_pageid;
let search_id = Templatedata.list_searchid;
let oid = Templatedata.list_oid;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {

    let _this = this;
    if (searchVal) {
        let pageInfo = props.table.getTablePageInfo(table_id);
        let conditions = [];
        let searchdata = {
            querycondition: searchVal,
            custcondition: {
                logic: 'and', //逻辑操作符，and、or
                conditions
            },
            // conditions: searchVal.conditions || searchVal,
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
                        toast({
                            color: 'success',
                            content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000101')//查询成功
                        });
                        _this.props.table.setAllTableData(table_id, data[table_id]);
                    } else {
                        toast({
                            color: 'warning',
                            content: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000080')
                        });
                        _this.props.table.setAllTableData(table_id, { rows: [] });
                    }
                }
            }
        });
    }

};

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/