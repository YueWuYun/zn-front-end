//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/
import {ajax, base, toast,getBusinessInfo} from 'nc-lightapp-front';

const ajaxurl = '/nccloud/uapbd/bankacc/baseActionCard.do';

export default  function(record, index, props, key){
    let gridId = props.config.gridId;
    switch (key) {
        // 表格操作按钮
        // case 'btnSubDelete':
        //     props.cardTable.delRowsByIndex(gridId,index);
        //     break;
        case'btnSubExtend':
            props.cardTable.toggleRowView(gridId,record);
            props.button.setButtonTitle('btnSubExtend',this.state.json['10140BANKACC-000088']);
            break;
        case'btnSubClose':
            props.cardTable.toggleRowView(gridId,record);
            break;
        // case'btnSubInsert':
        //    props.cardTable.addRow(gridId,index,{
        //        'acctype':{value:'0',display:'活期'},
        //        'fronzenstate':{value:'0',display:'正常'},
        //        'overdraftmny':{value:0,display:''},
        //        'overdrafttype':{value:'1',display:'提示'},
        //        'payarea':{value:'0',display:'不限制'}});
        //     break;
        default:
            console.log(key, index);
            break;
    }
}

//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/