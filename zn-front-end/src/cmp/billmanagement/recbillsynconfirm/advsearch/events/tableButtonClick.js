/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息

let table_id = Templatedata.list_tableid;
let page_id = Templatedata.card_pageid;

export default function tableButtonClick(props, key, text, record, index) {
    console.log(key);
    let self = this;
    switch (key) {

        //list总操作列中动作
        case 'edittableBtn':
            props.linkTo('/cmp/billmanagement/recbilllink/card/index.html', {
                status: 'edit',
                id: record.pk_recbill.value,
                pagecode:page_id
            });
            break;
        case 'deletetableBtn':
            //props.modal.show('delete');
            let data = {
                'pk': record.pk_recbill.value,
                'ts': record.ts.value
            };

            ajax({
                url: '/nccloud/cmp/recbill/recbilldelete.do',
                data: data,
                success: (res) => {
                    if (res.success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMLINK") && this.props.MutiInit.getIntl("36070RBMLINK").get('36070RBMLINK-000023') });/* 国际化处理： 删除成功*/
                        props.table.deleteTableRowsByIndex(table_id, index);
                    }
                }
            });
            break;
        case 'makebilltableBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMLINK") && this.props.MutiInit.getIntl("36070RBMLINK").get('36070RBMLINK-000006') });/* 国际化处理： 功能待开发*/
            break;
        case 'approvetableBtn':
            toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMLINK") && this.props.MutiInit.getIntl("36070RBMLINK").get('36070RBMLINK-000006') });/* 国际化处理： 功能待开发*/
            break;
        case 'submittableBtn':
            let submitdataArr = [];
            submitdataArr.push(record.pk_recbill.value);
            let submitdata = {
                'pks': submitdataArr,
                'pageid': page_id
            };

            ajax({
                url: '/nccloud/cmp/recbill/recbillsubmit.do',
                data: submitdata,
                success: (res) => {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMLINK") && this.props.MutiInit.getIntl("36070RBMLINK").get('36070RBMLINK-000004') });/* 国际化处理： 提交成功*/
                        refresh(props);

                    }
                }
            });
            break;
        case 'unsubmittableBtn':
            let unsubmitdataArr = [];
            unsubmitdataArr.push(record.pk_recbill.value);
            let unsubmitdata = {
                'pks': unsubmitdataArr,
                'pageid': page_id
            };

            ajax({
                url: '/nccloud/cmp/recbill/recbillunsubmit.do',
                data: unsubmitdata,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBMLINK") && this.props.MutiInit.getIntl("36070RBMLINK").get('36070RBMLINK-000005') });/* 国际化处理： 收回成功*/
                        refresh(props);

                    }
                }
            });
            break;

    }

}

//刷新页面
function refresh(props){

    let table_id =  Templatedata.list_tableid;;
    let search_id = Templatedata.list_searchid;
    let page_id = Templatedata.list_pageid;

    let refreshpageInfo = props.table.getTablePageInfo(table_id);//分页
    let refreshsearchVal = props.search.getAllSearchData(search_id);//查询condition


    let searchdata = {
        conditions: refreshsearchVal.conditions || refreshsearchVal,
        pageInfo: refreshpageInfo,
        pagecode: page_id,
        queryAreaCode: search_id,  //查询区编码
        oid: Templatedata.list_oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        queryType: Templatedata.list_querytype
    };
    ajax({
        url: '/nccloud/cmp/recbill/recbillquery.do',
        data: searchdata,
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