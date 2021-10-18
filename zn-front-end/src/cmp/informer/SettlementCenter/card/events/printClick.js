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
    //打印
    if (key == 'printbtn') {
        print(
            'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            '/nccloud/cmp/pub/print.do',
            {
                appcode:'36070AISC',
                nodekey: '36070AISCC', //模板节点标识
                oids: [that.props.form.getFormItemsValue('form_inform_01', 'pk_informer').value],
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
                    appcode:'36070AISC',
                    nodekey: '36070AISCC', //模板节点标识
                    outputType: 'output',
                    oids: [that.props.form.getFormItemsValue('form_inform_01', 'pk_informer').value],
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