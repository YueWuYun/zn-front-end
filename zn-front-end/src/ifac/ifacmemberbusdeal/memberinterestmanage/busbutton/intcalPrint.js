/*w1FzcHwPZeSAVPj0dhBe5BetSPMTCjuL/fZwpOp5uKmk9sxqnkVYXnunehTiAabY*/

import { ajax, toast,print } from 'nc-lightapp-front';

/**
 * 内部活期账户计息打印操作
 * @param {*} props 
 * @param {*} list_table_id 
 * @param {*} url 
 * @param {*} app_code 
 * @param {*} type 
 */
export const calculatePrint = function (props, list_table_id,url,app_code, type) {
    let printData = props.table.getCheckedRows(list_table_id);
    if (printData.length < 1) {
        toast({
            color: 'warning',
            content: this.state.json['36340FDICC-000001']/**国际化处理：未选中行 */
        });
        return;
    }
    let pks=[];          
    let pk ,pk_intobj;          
    printData.forEach((item) => { 
        //获取行主键值
        pk = item.data.values.pk_depositreceipt.value;;
        pks.push(pk);
    });

    if(!type||type==='LIST'){
        print(
            'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
            url,
            {
                appcode:app_code,
                userjson:type,
                oids:pks
            }
        ) ;
    }else{
        this.setState(
            {
                outputData: {
                    appcode:app_code,
                    nodekey: null, //模板节点标识
                    outputType: type,
                    oids: pks
                }
            },
            () => {
                this.refs.printOutput.open();
            }
        );
    }
}
/*w1FzcHwPZeSAVPj0dhBe5BetSPMTCjuL/fZwpOp5uKmk9sxqnkVYXnunehTiAabY*/