//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK
import { ajax, toast } from 'nc-lightapp-front';

export default function(props, key, text, record, index){
    switch (key) {
        case 'Delete_inner':
            let deleteData = [];
            var data = {
                pk_bill: record.pk_controlarea.value
            }
            deleteData.push(data);
            ajax({
                url: '/nccloud/web/controlarea/ControlareaDeleteAction.do',
                data: {
                    deleteData
                },
                success: (res) => {
                    if (res.success) {
                        toast({ color: 'success', content: this.state.json['38200CA-000005'] });/* 国际化处理： 删除成功*/
                        //删除当前行数据
                        props.table.deleteTableRowsByIndex(this.tableId, index);
                        //删除缓存数据
                        props.table.deleteCacheId(this.tableId, record.pk_controlarea.value);
                        //删行之后控制肩部按钮
                        this.onSelected();
                    }
                }
            });
            break;
        case 'Copy_inner':
            this.props.pushTo('/card', {
                status: 'copy',
                id: record.pk_controlarea.value
            })
            break;
        case 'Edit_inner':
            this.props.pushTo('/card', {
                status: 'edit',
                id: record.pk_controlarea.value
            })
            break;
        default:
            break;
    }
};

//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK