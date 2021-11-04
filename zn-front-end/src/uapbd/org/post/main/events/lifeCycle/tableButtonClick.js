//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK
import {ajax, base, toast } from 'nc-lightapp-front';
let {NCMessage } = base;
import Utils from '../../../../../public/utils';
import {convertGridEnablestateToSave} from "../../../../../public/utils/tableUtil";
const {convertGridEnablestate} = Utils;
let gridId = 'GRID10100POST';
let pagecode = '10100POST_post';
let ajaxurl = {
    edit: '/nccloud/uapbd/post/edit.do'

}
export default function(record,index, props, key){
    let recordVal = record.values;

    switch (key) {
        // 表格操作按钮
        case 'oprExtend':
            props.editTable.openModel(gridId,'edit', record, index);
            this.gridStatusChange();
            break;
        case 'oprEdit':
            ajax({
                url: ajaxurl.edit,
                data: {
                    model: {
                        rows: convertGridEnablestateToSave([Utils.clone(record)]),
                    },
                    pageid: pagecode
                },
                success: (res) => {
                    let {success} = res;
                    if(success){
                        props.editTable.openModel(gridId, 'edit', record, index);
                        this.gridStatusChange();
                    }
                }
            });
            break;
        case 'oprDelete':
            if(recordVal['dataoriginflag']['value'] ==='-1'){
                NCMessage.create({content: this.state.json['10100POST-000033'], color: 'warning'});///* 国际化处理： 系统预置，无法删除！*/
                 return;
            }else{
                if(!!!recordVal.pk_post.value && recordVal.pk_org.value && recordVal.postcode.value){
                    //如果删除的是新增的数据
                    let rollbackcodearr = this.state.rollbackcodeObj;
                    rollbackcodearr.push({
                        pk_org:recordVal.pk_org.value,
                        postcode:recordVal.postcode.value
                    });
                    this.setState({
                        rollbackcodeObj: rollbackcodearr
                    },()=>{
                        props.editTable.deleteTableRowsByIndex(gridId, index,false);
                        this.props.button.setButtonDisabled({
                            'btnDel': true,
                            'btnCopy': true
                        });
                    });
                }else{
                    props.editTable.deleteTableRowsByIndex(gridId, index,false);
                    this.props.button.setButtonDisabled({
                        'btnDel': true,
                        'btnCopy': true
                    });
                }
            }
            break;
        case 'oprDeleteBrowse':
            if(recordVal['dataoriginflag']['value'] ==='-1'){
                NCMessage.create({content: this.state.json['10100POST-000033'], color: 'warning'});///* 国际化处理： 系统预置，无法删除！*/
                return;
            }else{
                let rows = Utils.convertGridEnablestateToSave([Utils.clone(record)]);
                let paramData = {
                    'pageid':pagecode,
                    'gridModel':{
                        'pageinfo':{},
                        'areacode':gridId,
                        'rows':rows
                    }
                }
                ajax({
                    url: '/nccloud/uapbd/post/deletepost.do',
                    data: paramData,
                    success: (res) => {
                        if (res.success) {
                            props.editTable.deleteTableRowsByIndex(gridId, index,true);
                            toast({ color: 'success', title: this.state.json['10100POST-000034'] });/* 国际化处理： 删除成功*/
                            this.props.button.setButtonDisabled({
                                'btnDel': true,
                                'btnCopy': true
                            });
                        }
                    }
                });
            }
            break;
        default:
            console.log(key, index);
            break;
    }
}

//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK