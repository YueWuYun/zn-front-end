/*DepWUwL0r5SDVXzy0cJE0RG05lfP4ujMb6Qx2a7JLl/tNkLI9059dkCB11Yz4xZ6*/
import {  toast,print } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [收款]-打印按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const printBtn = function () {
    let printcardData = this.props.table.getCheckedRows(this.tableId);

    if (printcardData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000080') });/* 国际化处理： 请选择数据，进行打印!*/
        return;
    }
    let oidss = [];
    printcardData.forEach((item) => {
        oidss.push(item.data.values.pk_recbill.value);
    });
    print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/recbill/recbillprintcard.do',
        {
            // billtype: printcard_billtype,  //单据类型
            // funcode: printcard_funcode, //功能节点编码，即模板编码
            // printTemplateID: printcard_templetid, //输出打印模板id
            nodekey: Templatedata.printcard_nodekey,     //模板节点标识
            appcode: this.props.getSearchParam('c'),
            oids: oidss   // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,

        }
    );
}

/*DepWUwL0r5SDVXzy0cJE0RG05lfP4ujMb6Qx2a7JLl/tNkLI9059dkCB11Yz4xZ6*/