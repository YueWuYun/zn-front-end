//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK

import { ajax, base, toast } from 'nc-lightapp-front';

export default function (props, key, text, record, index) {

    switch (key) {
      
        case 'Delete_inner'://删行
            
            let status = this.props.editTable.getStatus(this.tableId);
            if(status == 'edit'){
                this.props.editTable.deleteTableRowsByIndex(this.tableId, index);
                this.toggleShow();
            }else{
                let grid = {
                    model : {
                        rows:[{status :'3',rowid:record.rowid ,values:record.values}]
                    },
                    pageid : this.pageId
                }
                ajax({
                    url: '/nccloud/uapbd/bdactivity/save.do',
                    data: {
                        grid: grid,
                    },
                    success: (res) => {
                        if (res.success) {
                            toast({ color: 'success', content: this.state.json['10140ACTB-000013'] });/* 国际化处理： 删除成功*/
                            //保存成功重新查询一遍数据
                            this.props.editTable.setStatus(this.tableId,'browse');
                            this.getTableData();
                        }
                    }
                });
            }
            
            break;
        //启用
		case "Enable_inner":
                this.enableFun('single', record.values.cactivityid.value,index);
          break;
        //禁用
        case  "Disable_inner":
                this.disableFun('single',record.values.cactivityid.value,index);
          break;
        
        default:
            break;
    }
};



//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK