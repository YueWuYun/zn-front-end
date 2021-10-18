/*VIVQ5yoPOAICGXFovgjjvIVBD54R8nurL0e9lyRmTFcToNJhCGURlLc4zsV7xS7x*/
import {  toast, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [收款]-打印清单按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const printDetailBtn = function () {
    let printData = this.props.table.getCheckedRows(this.tableId);

    if (printData.length == 0) {
        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000080') });/* 国际化处理： 请选择数据，进行打印!*/
        return;
    }
    let pks = [];
    printData.forEach((item) => {
        pks.push(item.data.values.pk_recbill.value);
    });
    print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/recbill/recbillprint.do',
        {
            // billtype: printlist_billtype,  //单据类型
            // funcode: printlist_funcode, //功能节点编码，即模板编码
             // printTemplateID: printlist_templetid, //输出打印模板id
            appcode: this.props.getSearchParam('c'),//小应用code
            nodekey: Templatedata.printlist_nodekey,     //模板节点标识
            oids: pks   // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,

        }
    );
}

/*VIVQ5yoPOAICGXFovgjjvIVBD54R8nurL0e9lyRmTFcToNJhCGURlLc4zsV7xS7x*/