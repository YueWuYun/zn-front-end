/*81e8pN1UAJUY+gXnAY0hHPnMSFs3znzXjZvN2BMWBFUgDuHo2aXiYxbNdmqqoryg*/
import { print, base ,toast} from 'nc-lightapp-front';
import { tableId, pagecode, funcode, printTemplateID } from '../constants';
let { NCMessage } = base;
/**
 * 打印，输出
 * @param {*} props 
 * @param {*} key 
 */
export function printClick(that, props, key) {
    let printData = props.table.getCheckedRows(tableId);
    let pks = [];
    printData.forEach((item) => {
        pks.push(item.data.values.pk_informer.value);
    });
    if (pks.length == 0) {
        toast({ content: that.props.MutiInit.getIntl("36070AISC") && that.props.MutiInit.getIntl("36070AISC").get('36070AISC-000050'), color: 'warning' });/* 国际化处理： 请选择一条数据！*/
        return;
    }
    //打印
    if (key == 'print') {
        print(
            'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            '/nccloud/cmp/pub/print.do',
            {
                appcode:'36070AISC',
                nodekey: '36070AISCL', //模板节点标识
                oids: pks,// 功能节点的数据主键   
                userjson: 'nccloud.pub.cmp.informer.print.datasource.InformerPrintDataSource'
            }
        );
    }
    //输出
    if (key == 'printout') {
        // that.refs.printOutput.open();
        that.setState(
            {
                outputData: {
                    appcode:'36070AISC',
                    nodekey: '36070AISCL', //模板节点标识
                    outputType: 'output',
                    oids: pks,
                    userjson:'nccloud.pub.cmp.informer.print.datasource.InformerPrintDataSource'
                }
            },
            () => {
                that.refs.printOutput.open();
            }
        );
    }

}

/*81e8pN1UAJUY+gXnAY0hHPnMSFs3znzXjZvN2BMWBFUgDuHo2aXiYxbNdmqqoryg*/