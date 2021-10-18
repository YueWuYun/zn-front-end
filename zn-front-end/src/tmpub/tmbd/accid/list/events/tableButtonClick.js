/*0GI1xcoeligdpMeXoHBphk/plwy/y1Rk8TCZrEPwBW/L3h7TD6vjjJziN9ONf5kF*/
import { createPage, ajax, base, toast, promptBox } from 'nc-lightapp-front';
const { NCMessage } = base;

import { 
	app_id, module_id, base_url, button_limit, oid, appcode,
	list_page_id,list_search_id, list_table_id,
	card_page_id,card_from_id,card_fromtail_id
} from '../../cons/constant.js';
import {go2CardCheck} from '../../../../../tmpub/pub/util/index.js';

export default function tableButtonClick(props, key, text, record, index) {
    let that = this;
    switch (key) {
        //修改	
        case 'edit':
			go2CardCheck({
                props,
                url: '/nccloud/tmpub/tmbd/gotocardcheck.do',
                pk: record.pk_accid.value,
                ts: record.ts.value,
				checkTS: record.ts.value ? true : false,
				checkSaga: false,
                fieldPK: 'pk_accid',
                actionCode: null,
                permissionCode: null,
                go2CardFunc: () => {
                    props.pushTo("/card", {
                        status: 'edit',
                        id: record && record.pk_accid && record.pk_accid.value,
                        pagecode: card_page_id,
                    })
                }
            })            
            break;
        //删除，可以支持批量
        case 'delete':
            let {deleteCacheId} = this.props.table;
            //自定义请求数据
            let deletedata = {
                pks: [record && record.pk_accid && record.pk_accid.value],
                tss: [record && record.ts && record.ts.value],
            };
            ajax({
                url: '/nccloud/tmpub/tmbd/acciddel.do',
                data: deletedata,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000013') });/* 国际化处理： 删除成功*/
                        /*
                        * tableAreacode：表格区域编码
                        * pkvalue:数据主键的值
                        */
                        deleteCacheId(list_table_id, record.pk_accid && record.pk_accid.value);
                        props.table.deleteTableRowsByIndex(list_table_id, index );
                        // refreshHtml(props);
                    }
                }
            });
            break;
        //启用
        case 'enable':
            //自定义请求数据
            let data2 = {
                pk: record && record.pk_accid && record.pk_accid.value,
                ts: record && record.ts && record.ts.value
            };
            ajax({
                url: '/nccloud/tmpub/tmbd/accidenable.do',
                data: data2,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000002') });/* 国际化处理： 启用成功*/
                        refreshHtml(props);
                    }
                }
            });
            break;
        //停用
        case 'disable':
            //自定义请求数据
            let data3 = {
                pk: record && record.pk_accid && record.pk_accid.value,
                ts: record && record.ts && record.ts.value
            };

            ajax({
                url: '/nccloud/tmpub/tmbd/acciddisable.do',
                data: data3,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000003') });/* 国际化处理： 停用成功*/
                        refreshHtml(props);
                    }
                }
            });
            break;
        //确认
        case 'confirm':
            //自定义请求数据
            let data4 = {
                pk: record && record.pk_accid && record.pk_accid.value,
                ts: record && record.ts && record.ts.value
            };

            ajax({
                url: '/nccloud/tmpub/tmbd/accidconfirm.do',
                data: data4,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        // 返回值主键存在，说明确认成功
                        if(data[list_table_id] && data[list_table_id].rows[0] 
                            && data[list_table_id].rows[0].values 
                            && data[list_table_id].rows[0].values.pk_accid){
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000005') });/* 国际化处理： 确认成功*/
                            if(data){
                                if(data.pk_srcbill && data.pk_accid &&
                                    data.pk_accid.value === data.pk_srcbill.value){
                                    toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000004') });   /* 国际化处理： 结算未安装或未启用，该账户没有登内部账户明细账,期初余额被清空*/
                                }
                            }
                            refreshHtml(props);
                        }else{
                            // props.modal.show('confirmmodel',{
                            //     content: data,
                            //     //点击确定按钮事件
                            //     beSureBtnClick: (props, key) => tableButtonClick.call(that, props, 'confiryes', text, record, index),
                            //     //取消按钮事件回调
                            //     cancelBtnClick: (props, key) => tableButtonClick.call(that, props, 'confirno', text, record, index),
                            // });
                            that.setState({
                                showModal_confirm: true,
                                content: data,
                                record: record,
			                    index: index,
                            });
                        }
                    }
                }
            });
            break;
        // 确认弹出框 是按钮
        case 'confiryes':
            //自定义请求数据
            let record_state_yes = that.state.record;
            let index_state_yes = that.state.index;
            if(record_state_yes){
                let datayes = {
                    pk: record_state_yes.pk_accid && record_state_yes.pk_accid.value,
                    ts: record_state_yes.ts && record_state_yes.ts.value,
                    operator: 4
                };
                ajax({
                    url: '/nccloud/tmpub/tmbd/accidconfirm.do',
                    data: datayes,
                    success: function (res) {
                        let { success, data } = res;
                        if (success) {
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000005') });/* 国际化处理： 确认成功*/
                            if(data){
                                if(data.pk_srcbill && data.pk_accid &&
                                    data.pk_accid.value === data.pk_srcbill.value){
                                    toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000004') });   /* 国际化处理： 结算未安装或未启用，该账户没有登内部账户明细账,期初余额被清空*/
                                }
                            }
                            that.setState({
                                showModal_confirm: false,
                            });
                            refreshHtml.call(props, that);
                        }
                    }
                });
            }
            break;
        // 确认弹出框 否按钮
        case 'confirno':
            //自定义请求数据
            let record_state_no = that.state.record;
            let index_state_no = that.state.index;
            if(record_state_no){
                let datano = {
                    pk: record_state_no.pk_accid && record_state_no.pk_accid.value,
                    ts: record_state_no.ts && record_state_no.ts.value,
                    operator: 8
                };
                ajax({
                    url: '/nccloud/tmpub/tmbd/accidconfirm.do',
                    data: datano,
                    success: function (res) {
                        let { success, data } = res;
                        if (success) {
                            toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000005') });/* 国际化处理： 确认成功*/
                            if(data){
                                if(data.pk_srcbill && data.pk_accid &&
                                    data.pk_accid.value === data.pk_srcbill.value){
                                    toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000004') });   /* 国际化处理： 结算未安装或未启用，该账户没有登内部账户明细账,期初余额被清空*/
                                }
                            }
                            that.setState({
                                showModal_confirm: false,
                            });
                            refreshHtml.call(props, that);
                        }
                    }
                });
            }
            break;
        // 确认弹出框 取消按钮
        case 'confircancel':
            that.setState({
                showModal_confirm: false,
            });
            break;
        //取消确认
        case 'cancelconfirm':
            //自定义请求数据
            let data5 = {
                pk: record && record.pk_accid && record.pk_accid.value,
                ts: record && record.ts && record.ts.value
            };

            ajax({
                url: '/nccloud/tmpub/tmbd/accidcancelconfirm.do',
                data: data5,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000006') });/* 国际化处理： 取消确认成功*/
                        refreshHtml(props);
                    }
                }
            });
            break;

        //复制
        case 'copy':
            let copyData = props.table.getCheckedRows(this.tableId);
            //数据校验
            if (copyData.length != 1) {
                toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000034') });	/* 国际化处理： 请选择1条数据*/
                return;
            }
            let copyid =0;
            copyData.forEach((val) => {
                copyid = val.data.values.pk_accid.value;
            });
            props.pushTo("/card", {
                status: 'copy',
                id: copyid,
                pagecode: card_page_id,
            });
            break;
        // 变更
        case 'change':
            if(record && record.frozenflag && record.frozenflag.value != 0){
                toast({ color: 'warning', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000007') });/* 国际化处理： 账户状态为正常的才可以进行变更！*/
            }else{
                go2CardCheck({
                    props,
                    url: '/nccloud/tmpub/tmbd/gotocardcheck.do',
                    pk: record.pk_accid.value,
                    ts: record.ts.value,
                    checkTS: record.ts.value ? true : false,
                    checkSaga: false,
                    fieldPK: 'pk_accid',
                    actionCode: null,
                    permissionCode: null,
                    go2CardFunc: () => {
                        props.pushTo("/card", {
                            status: 'edit',
                            id: record && record.pk_accid && record.pk_accid.value,
                            pagecode: card_page_id,
                        })
                    }
                })                
            }
            break;
        // 冻结
        case 'frozen':
            props.modal.show('frozenModel',{
                title: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000023'),/* 国际化处理： 冻结*/
				// content: this.frozenModelContent(),
                //点击确定按钮事件
                beSureBtnClick: (props, key) => tableButtonClick.call(that, props, 'frozenConfirm', text, record, index)
            });
            break;
        // 冻结确认
        case 'frozenConfirm':
            // record.frozendate = this.state.frozendate;
            //自定义请求数据
            let data6 = {
                pk: record && record.pk_accid && record.pk_accid.value,
                frozendate: this.state.frozendate,
                ts: record && record.ts && record.ts.value
            };
            ajax({
                url: '/nccloud/tmpub/tmbd/accidfrozen.do',
                data: data6,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000008') });	/* 国际化处理： 冻结成功*/
                        refreshHtml.call(props, that);
                    }
                }
            });
            break;
        //解冻
        case 'defrozen':
            props.modal.show('defrozenModel',{
                title: this.props.MutiInit.getIntl("36010IACC") && this.props.MutiInit.getIntl("36010IACC").get('36010IACC--000024'),/* 国际化处理： 解冻*/
				// content: this.defrozenModelContent(),
                //点击确定按钮事件
                beSureBtnClick: (props, key) => tableButtonClick.call(that, props, 'defrozenConfirm', text, record, index)
            });
            break;
        // 解冻确认
        case 'defrozenConfirm':
            //自定义请求数据
            let data7 = {
                pk: record && record.pk_accid && record.pk_accid.value,
                defrozendate: this.state.defrozendate,
                ts: record && record.ts && record.ts.value
            };
            ajax({
                url: '/nccloud/tmpub/tmbd/acciddefrozen.do',
                data: data7,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000009') });/* 国际化处理： 解冻成功*/
                        refreshHtml.call(props, that);
                    }
                }
            });
            break;
        //销户
        case 'destroy':
            // props.modal.show('destroyModel',{
            //     title: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000010'),/* 国际化处理： 销户确认提示*/
			// 	content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000011'),/* 国际化处理： 此操作不可逆！您确认销户吗？*/
            //     color:'warning',
            //     //点击确定按钮事件
            //     beSureBtnClick: tableButtonClick.bind(this, props, 'destroyConfirm', text, record, index)
            // });
            promptBox({
                color: "warning",
                content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000011'),/* 国际化处理： 此操作不可逆！您确认销户吗？*/
                //点击确定按钮事件
                beSureBtnClick: tableButtonClick.bind(this, props, 'destroyConfirm', text, record, index)
            });
            break;
        // 销户确认
        case 'destroyConfirm':
            //自定义请求数据
            let makebilldata = {
                pk: record && record.pk_accid && record.pk_accid.value,
                ts: record && record.ts && record.ts.value
            };
            ajax({
                url: '/nccloud/tmpub/tmbd/acciddestroy.do',
                data: makebilldata,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        /* 国际化处理： 销户成功*/
                        toast({ color: 'success', content: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000012') });
                        refreshHtml(props);
                    }
                }
            });
            break;    
        //刷新
        case 'refresh':
            refreshHtml(props);
            break;
    }
};
//刷新列表信息
function refreshHtml(props, that) {
    if(!props){
        props = that.props;
    }
    if(!props.table){
        props = props.props;
    }
    //分页
    let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
    //查询condition
    let refreshsearchVal = props.search.getAllSearchData(list_search_id);
    let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid= queryInfo.oid;
    let data = {
        querycondition: refreshsearchVal,
        conditions: refreshsearchVal && refreshsearchVal.conditions,
        pageInfo: refreshpageInfo,
        pagecode: list_page_id,
        //查询区编码
        queryAreaCode: list_search_id,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        oid: oid,  
        querytype: 'tree',
    };
    ajax({
        url: '/nccloud/tmpub/tmbd/accidquery.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    props.table.setAllTableData(list_table_id, data[list_table_id]);
                } else {
                    props.table.setAllTableData(list_table_id, { rows: [] });
                }
            }
        }
    });   
}

/*0GI1xcoeligdpMeXoHBphk/plwy/y1Rk8TCZrEPwBW/L3h7TD6vjjJziN9ONf5kF*/