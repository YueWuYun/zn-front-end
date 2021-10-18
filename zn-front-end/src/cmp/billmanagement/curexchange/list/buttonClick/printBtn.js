/*DepWUwL0r5SDVXzy0cJE0RG05lfP4ujMb6Qx2a7JLl/tNkLI9059dkCB11Yz4xZ6*/
import { createPage, ajax, base, high, toast, cardCache,print } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
/**
 * [外币兑换]-打印按钮
 * @param {*} props  
 */
export const printBtn = function () {

    let printData = this.props.table.getCheckedRows(this.tableId);

    if (printData.length == 0) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000068')   // 提示内容,非必输/* 国际化处理： 请选择数据，进行打印!*/
        })
        return;
    }
    let pks = [];
    printData.forEach((item) => {
        pks.push(item.data.values.pk_cruexchange.value);
    });
    print(
        'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
        '/nccloud/cmp/curexchange/curexchangeprint.do',
        {
            // billtype: printlist_billtype,  //单据类型
            // funcode: printlist_funcode, //功能节点编码，即模板编码
            nodekey: Templatedata.printlist_nodekey,     //模板节点标识
            // printTemplateID: printcard_templetid, //输出打印模板id
            appcode: this.props.getSearchParam('c'),
            oids: pks   // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,

        }
    );
}

/*DepWUwL0r5SDVXzy0cJE0RG05lfP4ujMb6Qx2a7JLl/tNkLI9059dkCB11Yz4xZ6*/