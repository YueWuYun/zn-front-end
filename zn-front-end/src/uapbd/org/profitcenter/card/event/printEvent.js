//oqJH2KbjCzzAIli0oBInIWmgUbobslisAqR8XH9UbfBaMUHYrncZr95YEsgBOQgF
import { ajax, base, print, output,toast } from 'nc-lightapp-front';
let { NCMessage } = base;
export default function printEvent(props, id) {
    let _this = this;
    let nodekey = 'rolelist';
    let nodetemp = 'rolelist';
    let print_type = _this.state.print_type;
    if ('card' == print_type) {
        nodekey = 'rolecard';
        nodetemp = 'rolecard';
    }
    let appcode = '10120ROLM';
    let data = getAllPrintData(_this, print_type);
    debugger
    if(data == null || data.length <= 0 ){
        toast({content:_this.state.json['0007'],color:'danger'});
        return false;
    }
    switch (id) {
        case 'printor':
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                '/nccloud/rbac/role/print.do', //后台服务url
                {
                    'funcode': '10120ROLM',
                    'appcode': '10120ROLM',      //小应用编码
                    'nodekey': nodetemp,     //模板节点标识
                    'oids': data   // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印
                }
            )
            break;
        case 'export':
            let export_data = {
                'funcode': appcode,
                'appcode': appcode,
                'nodekey': nodetemp,
                'oids': data,
                'outputType': 'output'
            }
            output({ 'url': '/nccloud/rbac/role/print.do', 'data': export_data, callback: () => { console.log('输出成功') } });
            break;
    }
}
function getAllPrintData(_this, print_type) {
    let pks = [];
    switch (print_type) {
        case 'list':
            let alldata = _this.props.table.getAllTableData('role');
            if(alldata){
                alldata = alldata.rows;
            }
            if (alldata != null && alldata.length > 0) {
                alldata.map((data) => {
                    pks.push(data.values.pk_role.value);
                });
            }
            break;
        case 'card':
            let fd = _this.props.form.getFormItemsValue('role', 'pk_role');
            pks.push(fd.value);
            break;
    }
    return pks;
}
//oqJH2KbjCzzAIli0oBInIWmgUbobslisAqR8XH9UbfBaMUHYrncZr95YEsgBOQgF