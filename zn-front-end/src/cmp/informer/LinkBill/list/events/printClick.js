/*81e8pN1UAJUY+gXnAY0hHPnMSFs3znzXjZvN2BMWBFUgDuHo2aXiYxbNdmqqoryg*/
import { print, base } from 'nc-lightapp-front';
let tableId='table';
let pagecode='36070AILLINK';
let { NCMessage } = base;
/**
 * 打印，输出
 * @param {*} props 
 * @param {*} key 
 */
export function printClick(that, props, key) {
    let printData = props.table.getAllTableData(tableId).rows;
    let pks = [];
    printData.forEach((item) => {
        pks.push(item.values.pk_informer.value);
    });
    //打印
    if (key == 'printbtns') {
        print(
            'pdf',  
            '/nccloud/cmp/pub/print.do',
            {
                appcode:'36070AISC',
                nodekey: '36070AISCL', //模板节点标识
                oids: pks,  
                userjson: 'nccloud.pub.cmp.informer.print.datasource.InformerPrintDataSource'
            }
        );
    }
    //输出
    if (key == 'printout') {
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