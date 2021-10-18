/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base, toast, cacheTools, print } from 'nc-lightapp-front';
let { NCMessage } = base;

import { 
    app_id, module_id, list_page_id, list_search_id, list_table_id, appcode, oid 
} from '../../cons/constant.js';

export default function buttonClick(props, id) {
    switch (id) {
        // 打印
        case 'Print':
            let printData= props.table.getCheckedRows(this.tableId);
            if(printData.length <= 0){
                NCMessage.create({ content: '请选择数据', color: 'warning', position: 'top' });
                return;
            }
            let printpks=[];
            printData.forEach((item) => { 
                printpks.push(item.data.values.pk_calendar.value);
            });
            print(
                //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                'pdf',
                '/nccloud/fts/workdatequery/workdatequeryprint.do',
                {
                    printTemplateID: '1001Z61000000002L2BA',
                    //功能节点编码，即模板编码
                    funcode: appcode,
                    //模板节点标识
                    nodekey: 'nccloud',     
                    // 功能节点的数据主键 oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
                    oids: printpks, 
                }
            );  
            break;
        // 输出
        case 'output':
            let outputData= props.table.getCheckedRows(this.tableId);
            if(outputData.length <= 0){
                NCMessage.create({ content: '请选择数据', color: 'warning', position: 'top' });
                return;
            }
            let outputpks=[];
            outputData.forEach((item) => { 
                outputpks.push(item.data.values.pk_calendar.value);
            });
            this.setState({
                outputData: {
                    printTemplateID: '1001Z61000000002L2BA',
                    //功能节点编码，即模板编码
                    funcode: appcode,
                    //模板节点标识
                    nodekey: 'nccloud',
                    // oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,   
                    oids: outputpks,
                    outputType: 'output'
                }
            },() => {
                this.refs.printOutput.open();
            });
            break;
        // 刷新
        case 'refresh':
            let pageInfo = props.table.getTablePageInfo(this.tableId);
            let searchVal = props.search.getAllSearchData(list_search_id);
            if(searchVal && searchVal.conditions){
                let data={
                    conditions: searchVal.conditions || searchVal,
                    pageInfo: pageInfo,
                    pagecode: list_page_id,
                    //查询区编码
                    queryAreaCode: list_search_id,
                    //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                    oid: oid,
                    queryType: 'simple'
                };
                ajax({
                    url: '/nccloud/fts/workdatequery/querydetail.do',
                    data: data,
                    success: (res) => {
                        let { success, data } = res;
                        if (success) {
                            if(data){
                                this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                            }else{
                                this.props.table.setAllTableData(this.tableId, {rows:[]});
                            }
                        }
                    }
                });
            }
            break;
        default:
            break;
    }
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/