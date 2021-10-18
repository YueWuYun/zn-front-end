/*DepWUwL0r5SDVXzy0cJE0RG05lfP4ujMb6Qx2a7JLl/tNkLI9059dkCB11Yz4xZ6*/
import {  toast, print } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [收款结算]-打印按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const printBtn = function () {
    if (!this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000003') });/* 国际化处理： 操作失败，无数据!*/
        return;
    }
    print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/recbill/recbillprintcard.do',
        {
            // billtype: printcard_billtype,  //单据类型
            // funcode: printcard_funcode, //功能节点编码，即模板编码
            nodekey: Templatedata.printcard_nodekey,     //模板节点标识：单据模版初始化
            // printTemplateID: printcard_templetid, //输出打印模板id
            appcode: this.props.getSearchParam('c'),
            oids: [this.props.form.getFormItemsValue(this.formId, 'pk_recbill').value]

        }
    );
}

/*DepWUwL0r5SDVXzy0cJE0RG05lfP4ujMb6Qx2a7JLl/tNkLI9059dkCB11Yz4xZ6*/