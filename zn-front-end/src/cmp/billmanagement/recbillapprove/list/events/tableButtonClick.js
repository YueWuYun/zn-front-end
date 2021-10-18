/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { ajax, toast, viewModel } from "nc-lightapp-front";
import { MakeBillApp } from "../../../../public/utils/Makebill"; //制单
import { Templatedata } from "../../config/Templatedata"; //配置的id和area信息
/**
 * 模版配置参数
 */
let table_id = Templatedata.list_tableid;
let page_id = Templatedata.card_pageid;
//制单
let makebill_billtype = Templatedata.makebill_billtype;
let makebill_cachekey = Templatedata.makebill_cachekey;
let makebill_code = Templatedata.makebill_code;
let makebill_appid = Templatedata.makebill_appid;
let makebill_appcode = Templatedata.makebill_appcode;
let { setGlobalStorage, getGlobalStorage, removeGlobalStorage } = viewModel;
export default function tableButtonClick(props, key, text, record, index) {
    console.log(key);
    let self = this;
    /**
     * 新增---->根据交易类型----->加载模版
     */
    let tradecode = JSON.parse(getGlobalStorage("sessionStorage", "sessionTP"));
    let urlpagecode = page_id;
    console.log(urlpagecode, "add_pageid");
    if (tradecode) {
        urlpagecode = tradecode;
    }
    switch (key) {
        //list总操作列中动作
        case "edittableBtn":
            /**
             * 修改编辑----->根据交易类型跳转类型
             */
            if (record.trade_type.value) {
                urlpagecode = record.trade_type.value;
            }
            props.linkTo("/cmp/billmanagement/recbill/card/index.html", {
                status: "edit",
                id: record.pk_recbill.value,
                pagecode: urlpagecode
            });
            break;
        //删除
        case "deletetableBtn":
            //props.modal.show('delete');
            let tsmpa = {
                pk: record.pk_recbill.value,
                ts: record.ts.value
            };
            let listTsmap = [];
            listTsmap.push(tsmpa);
            let data = {
                pk: record.pk_recbill.value,
                ts: record.ts.value,
                listTsmap: listTsmap
            };

            ajax({
                url: "/nccloud/cmp/recbill/recbilldelete.do",
                data: data,
                success: res => {
                    if (res.success) {
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36070RBMAPP") &&
                                this.props.MutiInit.getIntl("36070RBMAPP").get(
                                    "36070RBMAPP-000026"
                                )
                        }); /* 国际化处理： 删除成功*/
                        self.refresh();
                    }
                }
            });
            break;
        //制单
        case "makebilltableBtn":
            if (!record.pk_recbill.value) {
                toast({
                    color: "warning",
                    content:
                        this.props.MutiInit.getIntl("36070RBMAPP") &&
                        this.props.MutiInit.getIntl("36070RBMAPP").get(
                            "36070RBMAPP-000002"
                        )
                }); /* 国际化处理： 操作失败，无数据!*/
                return;
            }
            let makebillArr = [];
            let arr = [];
            //处理选择数据
            let pk_makebill = record.pk_recbill.value;
            let pk_billtypecode = "D4";
            if (record.trade_type.value) {
                pk_billtypecode = record.trade_type.value;
            }
            makebillArr.push(pk_billtypecode);
            makebillArr.push(pk_makebill);
            arr.push(makebillArr);
            MakeBillApp(props, makebill_appcode, arr);

            break;
        case "approvetableBtn":
            toast({
                color: "warning",
                content:
                    this.props.MutiInit.getIntl("36070RBMAPP") &&
                    this.props.MutiInit.getIntl("36070RBMAPP").get(
                        "36070RBMAPP-000010"
                    )
            }); /* 国际化处理： 功能待开发*/
            break;
        //提交
        case "submittableBtn":
            let submitdataArr = [];
            let tsmpa2 = {
                pk: record.pk_recbill.value,
                ts: record.ts.value
            };
            let listTsmap2 = [];
            listTsmap2.push(tsmpa2);
            submitdataArr.push(record.pk_recbill.value);
            let submitdata = {
                pks: submitdataArr,
                pageid: page_id,
                ts: record.ts.value,
                listTsmap: listTsmap2
            };

            ajax({
                url: "/nccloud/cmp/recbill/recbillsubmit.do",
                data: submitdata,
                success: res => {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36070RBMAPP") &&
                                this.props.MutiInit.getIntl("36070RBMAPP").get(
                                    "36070RBMAPP-000008"
                                )
                        }); /* 国际化处理： 提交成功*/
                        self.refresh();
                        // refresh(props);
                    }
                }
            });
            break;
        //收回
        case "unsubmittableBtn":
            let unsubmitdataArr = [];
            unsubmitdataArr.push(record.pk_recbill.value);
            let unsubmitdata = {
                pks: unsubmitdataArr,
                pageid: page_id
            };

            ajax({
                url: "/nccloud/cmp/recbill/recbillunsubmit.do",
                data: unsubmitdata,
                success: function(res) {
                    let { success, data } = res;
                    if (success) {
                        toast({
                            color: "success",
                            content:
                                this.props.MutiInit.getIntl("36070RBMAPP") &&
                                this.props.MutiInit.getIntl("36070RBMAPP").get(
                                    "36070RBMAPP-000009"
                                )
                        }); /* 国际化处理： 收回成功*/
                        self.refresh();
                    }
                }
            });
            break;
    }
}

//刷新页面[暂时未用]
function refresh(props) {
    let table_id = Templatedata.list_tableid;
    let search_id = Templatedata.list_searchid;
    let page_id = Templatedata.list_pageid;

    let refreshpageInfo = props.table.getTablePageInfo(table_id); //分页
    let refreshsearchVal = props.search.getAllSearchData(search_id); //查询condition
    let oid = Templatedata.list_oid; //动态获取oid
    if (props.meta.getMeta()[search_id].oid) {
        oid = props.meta.getMeta()[search_id].oid; //动态获取oid
    }
    let searchdata = {
        querycondition: refreshsearchVal,
        custcondition: {
            logic: "and", //逻辑操作符，and、or
            conditions: []
        },
        pageInfo: refreshpageInfo,
        pageCode: page_id,
        queryAreaCode: search_id, //查询区编码
        oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: "tree"
    };
    ajax({
        url: "/nccloud/cmp/recbill/recbillquery.do",
        data: searchdata,
        success: res => {
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