/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let table_id = Templatedata.list_tableid;
let search_id = Templatedata.list_searchid;
let page_id = Templatedata.list_pageid;
let card_page_id = Templatedata.card_pageid;
let oid = Templatedata.list_oid;
let querytype = Templatedata.list_querytype;
//请求url
let tablebutton_submit = Templatedata.tablebutton_submit;
let tablebutton_unsubmit = Templatedata.tablebutton_unsubmit
let tablebutton_settleBtn = Templatedata.tablebutton_settleBtn;
let tablebutton_unsettltBtn = Templatedata.tablebutton_unsettltBtn;
let tablebutton_editinnerBtn = Templatedata.tablebutton_editinnerBtn;
let tablebutton_deleteinnerBtn = Templatedata.tablebutton_deleteinnerBtn;
let tablebutton_refresh = Templatedata.tablebutton_refresh;

export default function tableButtonClick(props, key, text, record, index) {
    console.log(key);
    let self = this;
    let ts = record.ts.value;
    switch (key) {
        
        case 'submitBtn':
            let tsmap = {
                'ts':ts,
                'pk':record.pk_cruexchange.value
            }
            let data = {
                'pk': record.pk_cruexchange.value,
                'pageid':card_page_id,
                'ts':ts,
                'tsmap':tsmap
            };
            ajax({
                url: tablebutton_submit,
                data: data,
                success: (res) => {
                    toast({
                        duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                        color: 'success',     // 提示类别，默认是 "success",非必输
                        title: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000051'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 已成功*/
                        content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000061')   // 提示内容,非必输/* 国际化处理： 提交成功!*/
                    })
                    self.refresh();
                    
                }
            });
            break;
        //收回
        case 'unsubmitBtn':
            let unsubmitdata = {
                'pk': record.pk_cruexchange.value,
                'pageid':card_page_id,
                'ts':ts
            };
            ajax({
                url: tablebutton_unsubmit,
                data: unsubmitdata,
                success: (res) => {
                    toast({
                        duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                        color: 'success',     // 提示类别，默认是 "success",非必输
                        title: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000051'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 已成功*/
                        content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000063')   // 提示内容,非必输/* 国际化处理： 收回成功!*/
                    })
                    self.refresh();
                }
            });
            break;
        //结算
        case 'settleBtn':
            let data4 = {
                'pk': record.pk_cruexchange.value,
                'pageid':page_id,
                'ts':ts
            };

            ajax({
                url: tablebutton_settleBtn,
                data: data4,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000051'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 已成功*/
                            content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000006')   // 提示内容,非必输/* 国际化处理： 结算成功*/
                        })
                        
                        self.refresh();
                    }
                }
            });
            break;
        //取消结算
        case 'unsettleBtn':
            let data5 = {
                'pk': record.pk_cruexchange.value,
                'pageid':page_id,
                'ts':ts
            };
            ajax({
                url: tablebutton_unsettltBtn,
                data: data5,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000051'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 已成功*/
                            content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000007')   // 提示内容,非必输/* 国际化处理： 结算取消成功*/
                        })
                        self.refresh();
                        
                    }
                }
            });
            break;

        case 'editinnerBtn':
            props.linkTo(tablebutton_editinnerBtn, {
                status: 'edit',
                id: record.pk_cruexchange.value
            });
            break;
        //单条删除
        case 'deleteinnerBtn':
            // props.modal.show('delete');
            let data2 = {
                'pk': record.pk_cruexchange.value,
                'ts': record.ts.value,
                'pageid':page_id
            };
            ajax({
                url: tablebutton_deleteinnerBtn,
                data: data2,
                success: (res) => {
                    if (res.success) {
                        toast({
                            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
                            color: 'success',     // 提示类别，默认是 "success",非必输
                            title: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000051'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 已成功*/
                            content: this.props.MutiInit.getIntl("36070FCEAPP") && this.props.MutiInit.getIntl("36070FCEAPP").get('36070FCEAPP-000084')   // 提示内容,非必输/* 国际化处理： 删除成功*/
                        })
                        
                        self.refresh();
                    }
                }
            });
            break;

    }
};
//刷新列表信息[暂时未用]
function refresh(props) {


    let refreshpageInfo = props.table.getTablePageInfo(table_id);//分页
    let refreshsearchVal = props.search.getAllSearchData(search_id);//查询condition
    if(this.props.meta.getMeta()[search_id].oid){
        oid = this.props.meta.getMeta()[search_id].oid;//动态获取oid
    }
    let data = {
        conditions: refreshsearchVal.conditions || refreshsearchVal,
        pageInfo: refreshpageInfo,
        pagecode: page_id,
        queryAreaCode: search_id,  //查询区编码
        oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        queryType: querytype
    };
    ajax({
        url: tablebutton_refresh,
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    props.table.setAllTableData(table_id, data[table_id]);
                } else {
                    props.table.setAllTableData(table_id, { rows: [] });
                }

            }
        }
    });

}

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/