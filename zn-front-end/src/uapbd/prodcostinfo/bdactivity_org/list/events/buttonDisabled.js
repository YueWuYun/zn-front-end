//0jBm33jdgw5HSmJ5nji1WxGDEeyTnnSSHv95XT5TDjMMIf68/Lmu8O5U+dxKAkpK




export default function buttonDisabled(props,status,id){
    let flag = false;//true 是不可操作，false是可操作
    let checkRows = this.props.editTable.getCheckedRows(this.tableId);
    let alldata = this.props.editTable.getAllRows(this.tableId);
    switch (id) {
        case 'Add'://新增
            if(!this.state.pk_org.refpk){//工厂不存在的话
                flag =true;	
            }

            break;
        case 'Delete'://删除
            if(checkRows.length == 0){
                flag =true;			
            }
            if(!this.state.pk_org.refpk){//工厂不存在的话
                flag =true;	
            }
            break;
        case 'Edit'://修改
            if(!alldata || alldata.length == 0){
                flag =true;
            }
            if(!this.state.pk_org.refpk){//工厂不存在的话
                flag =true;	
            }
            break;
        case 'Enable'://启用
            if(checkRows.length == 0){
                flag =true;			
            }
            if(!this.state.pk_org.refpk){//工厂不存在的话
                flag =true;	
            }
            break;
        case 'Disable'://停用
            if(checkRows.length == 0){
                flag =true;			
            }
            if(!this.state.pk_org.refpk){//工厂不存在的话
                flag =true;	
            }
            break;
        case 'Print'://打印
            if(checkRows.length == 0){
                flag =true;			
            }
            if(!this.state.pk_org.refpk){//工厂不存在的话
                flag =true;	
            }
            break;
        case 'Output'://输出
            if(checkRows.length == 0){
                flag =true;			
            }
            if(!this.state.pk_org.refpk){//工厂不存在的话
                flag =true;	
            }
            break;
        case 'Refresh'://刷新

            break;
        case 'Save'://保存
           
            break;
        case 'Cancel'://取消
            
            break;
        case 'Refresh'://刷新
            
            break;

        default:
            break;    
    }
    return flag;

}
//0jBm33jdgw5HSmJ5nji1WxGDEeyTnnSSHv95XT5TDjMMIf68/Lmu8O5U+dxKAkpK