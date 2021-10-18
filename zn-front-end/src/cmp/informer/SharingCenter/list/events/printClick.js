/*81e8pN1UAJUY+gXnAY0hHPnMSFs3znzXjZvN2BMWBFUgDuHo2aXiYxbNdmqqoryg*/
import { print, base } from 'nc-lightapp-front';
import { tableId, pagecode, funcode, printTemplateID } from '../constants';
let { NCMessage } = base;
/**
 * 打印，输出
 * @param {*} props 
 * @param {*} key 
 */
export function printClick(that, key) {
    let printData = that.props.table.getCheckedRows(tableId);
    let pks = [];
    printData.forEach((item) => {
        pks.push(item.data.values.pk_informer.value);
    });
    if (pks.length == 0) {
       toast({ content: props.MutiInit.getIntl("36070AISCC") && props.MutiInit.getIntl("36070AISCC").get('36070AISCC-000009'), color: 'warning' });/* 国际化处理： 请选择一条数据！*/
        return;
    }
    //打印
    if (key == 'printbtn') {
        print(
            'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            '/nccloud/cmp/pub/print.do',
            {
                appcode:'36070AISCC',
                nodekey: '36070AISCCL', //模板节点标识
                oids: pks,// 功能节点的数据主键   
                userjson: 'nccloud.pub.cmp.informer.print.datasource.InformerPrintDataSource'
            }
        );
    }
    //输出
    if (key == 'printout') {
        that.refs.printOutput.open();
        that.setState(
            {
                outputData: {
                    appcode:'36070AISCC',
                    nodekey: '36070AISCCL', //模板节点标识
                    outputType: 'output',
                    oids: pks,
                    userjson: 'nccloud.pub.cmp.informer.print.datasource.InformerPrintDataSource'
                }
            },
            () => {
                that.refs.printOutput.open();
            }
        );
    }

}

/*81e8pN1UAJUY+gXnAY0hHPnMSFs3znzXjZvN2BMWBFUgDuHo2aXiYxbNdmqqoryg*/