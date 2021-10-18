/*81e8pN1UAJUY+gXnAY0hHPnMSFs3znzXjZvN2BMWBFUgDuHo2aXiYxbNdmqqoryg*/
import { print, base } from 'nc-lightapp-front';
let tableId = 'table';
let pagecode = '36070AILLINK';
let formId = 'form';
let { NCMessage } = base;
/**
 * 打印，输出
 * @param {*} props 
 * @param {*} key 
 */
export function printClick(that, props, key) {
    let pk = props.form.getFormItemsValue(formId, ['pk_informer'])[0].value;
    let pks = [pk];
    //打印
    if (key == 'print') {
        print(
            'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            '/nccloud/cmp/pub/print.do',
            {
                appcode: '36070AISC',
                nodekey: '36070AISCC', //模板节点标识
                oids: pks,// 功能节点的数据主键  
                userjson: 'nccloud.pub.cmp.informer.print.datasource.InformerPrintDataSource'
            }
        );
    }
    //输出
    if (key == 'printout') {
        that.setState(
            {
                outputData: {
                    appcode: '36070AISC',
                    nodekey: '36070AISCC', //模板节点标识
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