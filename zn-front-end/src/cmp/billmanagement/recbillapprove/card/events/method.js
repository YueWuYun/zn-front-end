/*0hfPh7RC56HIRVbsBd6OoeZATc9uZXNJ2TBMtPz9kj68CSubxv3DM13o1H2KzHP6*/
import { ajax, toast, cacheTools, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import { imageView, imageScan } from 'sscrp/rppub/components/image';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil';//凭证
/**
 * 附件按钮
 */
export const annexBtn = function () {
    let pk_rec_2 = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;;//单据pk
    let bill_no_2 = this.props.form.getFormItemsValue(this.formId, 'bill_no').value;;//单据编号
    if (!pk_rec_2) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002')
        });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    this.billId = pk_rec_2;
    this.billno = bill_no_2;
    this.setState({
        showUploader: !this.state.showUploader,
        target: null
    })
}
/**
 * 打印
 */
export const printBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002')
        });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/recbill/recbillprintcard.do',
        {
            nodekey: Templatedata.printcard_nodekey,     //模板节点标识：单据模版初始化
            appcode: Templatedata.printcard_funcode,
            oids: [this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value]

        }
    );
}
/**
 * 输出
 */
export const outputBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002')
        });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let pks = [];
    pks.push(this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value);
    output({
        url: '/nccloud/cmp/recbill/recbillprintcard.do',
        data: {
            nodekey: Templatedata.printcard_nodekey,
            appcode: Templatedata.printcard_funcode,
            oids: pks,
            outputType: 'output'
        }
    });
}
/**
 * 联查单据
 */
export const linkquerybillBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({
            color: 'warning',
            content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002')
        });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let showbilltrackpk = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    let billtrack_billtype = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
    if (showbilltrackpk) {
        this.setState({
            showbilltrack: true,//显示联查单据
            showbilltracktype: billtrack_billtype,//单据类型
            showbilltrackpk: showbilltrackpk//单据pk
        });
    }
}
/**
 * 审批详情
 */
export const querymsgBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    let billid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill') && this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    let approve_billtype = this.props.form.getFormItemsValue(this.formId, 'trade_type') && this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
    this.billtype = approve_billtype
    this.billId = billid;//单据pk
    this.setState({
        show: true,
    });

}
/**
 * 联查凭证
 */
export const queryvoucherBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    linkVoucherApp(
        this.props,
        this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_group').value,
        this.props.form.getFormItemsValue(this.formId, 'pk_org').value,
        this.props.form.getFormItemsValue(this.formId, 'trade_type').value,
        this.props.form.getFormItemsValue(this.formId, 'bill_no').value,
    );
}
/**
 * 联查计划预算
 */
export const queryconsumeBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000013') });/* 国际化处理： 无数据，无法进行操作!*/
        return;
    }
    let queryconsume_pk = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    let data = { pk: queryconsume_pk, pageid: this.pageId };
    ajax({
        url: '/nccloud/cmp/recbill/linkplan.do',
        data: data,
        success: (res) => {
            let { success, data } = res;
            if (success && res.data) {
                if (res.data.hint && res.data.hint.length > 0) {
                    toast({ color: 'warning', content: res.data.hint });
                    return;
                } else {
                    this.setState({
                        showInspection: true,
                        sourceData: res.data
                    });
                }
            }
        }
    });
}
/**
 * 联查协同单据
 */
export const querysynbillBtn = function () {
    let querysynbillArr = [];
    let querysynbillBtn_pk_upbill, querysynbillBtn_pk_recbill
    if (this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        querysynbillBtn_pk_recbill = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
        querysynbillArr.push(querysynbillBtn_pk_recbill);//上后主键
    }
    if (this.props.form.getFormItemsValue(this.formId, 'pk_upbill ').value) {
        querysynbillBtn_pk_upbill = this.props.form.getFormItemsValue(this.formId, 'pk_upbill ').value;
        querysynbillArr.push(querysynbillBtn_pk_upbill);//上后主键
    }

    if (!(querysynbillBtn_pk_upbill && querysynbillBtn_pk_recbill)) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }

    let confirmdate = {
        pks: querysynbillArr
    }
    ajax({
        url: '/nccloud/cmp/recbill/linkbillconfirm.do',
        data: confirmdate,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                //处理选择数据
                cacheTools.set(Templatedata.synbill_cachekey, querysynbillArr);
                this.props.openTo('/cmp/billmanagement/paybill/linkcard/index.html',
                    {
                        appcode: Templatedata.synbill_paybillcode,
                        pagecode: Templatedata.synbill_pagecode,
                        status: 'browse',
                        src: Templatedata.synbill_paybillsrc,
                        name: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000015'),/* 国际化处理： 付款结算联查*/
                    });
            }
        }
    });
}
/**
 * 影像查看
 */
export const imageviewBtn = function () {
    let billShowInfoMap = {};
    let openShowbillid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    if (!openShowbillid) {
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002') });/* 国际化处理： 操作失败，无数据!*/
    }
    billShowInfoMap['pk_billid'] = openShowbillid;
    billShowInfoMap['pk_billtype'] = this.props.form.getFormItemsValue(this.formId, 'bill_type').value;
    billShowInfoMap['pk_tradetype'] = this.props.form.getFormItemsValue(this.formId, 'trade_type').value;
    billShowInfoMap['pk_org'] = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    //查询数据
    imageView(billShowInfoMap, 'iweb');
}
/**
 * 影像扫描
 */
export const imagescanBtn = function () {
    let ScanData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
    let openbillid = this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value;
    if (!openbillid) {
      toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBMAPP") && this.props.MutiInit.getIntl("36070RBMAPP").get('36070RBMAPP-000002') });/* 国际化处理： 操作失败，无数据!*/
    }
    let billInfoMap = {};
    billInfoMap['pk_billid'] = openbillid;
    billInfoMap['pk_billtype'] = ScanData.head[this.formId].rows[0].values.bill_type.value;
    billInfoMap['pk_tradetype'] = ScanData.head[this.formId].rows[0].values.trade_type.value;;
    billInfoMap['pk_org'] = ScanData.head[this.formId].rows[0].values.pk_org.value;;
    billInfoMap['BillType'] = ScanData.head[this.formId].rows[0].values.trade_type.value;
    billInfoMap['BillDate'] = ScanData.head[this.formId].rows[0].values.creationtime.value;
    billInfoMap['Busi_Serial_No'] = ScanData.head[this.formId].rows[0].values.pk_recbill.value;
    billInfoMap['OrgNo'] = ScanData.head[this.formId].rows[0].values.pk_org.value;
    billInfoMap['BillCode'] = ScanData.head[this.formId].rows[0].values.bill_no.value;
    billInfoMap['OrgName'] = ScanData.head[this.formId].rows[0].values.pk_org.value;
    billInfoMap['Cash'] = ScanData.head[this.formId].rows[0].values.primal_money.value;
    imageScan(billInfoMap, 'iweb');
}
/*0hfPh7RC56HIRVbsBd6OoeZATc9uZXNJ2TBMtPz9kj68CSubxv3DM13o1H2KzHP6*/