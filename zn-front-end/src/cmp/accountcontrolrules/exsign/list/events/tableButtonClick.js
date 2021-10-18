/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base  ,toast} from 'nc-lightapp-front';
import buttonClick from './buttonClick';
import {setButtonVisible,onDelete} from './initRestMoneyDate';
import { requesturl } from '../../cons/requesturl.js';
function tableButtonClick (props, key, text, records, index) {
    let json1 = this.state.json;
    
    let tableId = 'exsign_table';
    let pageId = '36070BAES_L01';
    let record = records.values;
    let _this = this;
    let pk = record.pk_accexsign.value;
    let ts = record.ts.value;
    let pktsmap = {};
    let indexarr = [];
    pktsmap[pk] = ts;
    indexarr.push(index);
    let data = {
        pktsmap:pktsmap,
    }
    switch (key) {
        // 表格操作按钮
        case 'innerantiaudit':
            //取消复核
            ajax({
                url: '/nccloud/cmp/bankaccountbook/initrestmoneyantiaudit.do',
                data: data,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                         if (data.flag == 'true') {
                            toast({ color: 'success', content: json1['36070BAES-000015'] });/* 国际化处理： 取消复核成功*/
                            _this.refreshHtml();
                        }else{
                            // data会返回错误信息
                            toast({ color: 'info', content: data.message });
                        }
                    }else{
                        toast({ color: 'warning', content: json1['36070BAES-000016'] });/* 国际化处理： 取消复核失败，请稍后再试！*/
                    }
                }
            });
            break;
        case 'rowUnlock':
            ajax({
                url: requesturl.unlock,
                data: {
                    pkTsMap : pktsmap
                },
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        // refreshHtml();
                        toast({ color: 'success', content: json1['36070BAES-000009'] });/* 国际化处理： 保存成功*/
                        // setButtonVisible(props,true);
                        _this.toggleShow();
                    }
                }
            });
            break;
        case 'rowEdit':
            //修改
            // props.syncTree.setNodeDisable('tree', true);//控制树的节点不可编辑
            props.editTable.setStatus(tableId, 'edit', setButtonVisible(props,false));
            // props.button.setButtonVisible(['refresh'],false);
            let keys = ['pk_bankaccsub','userid',"tempassword"];
            props.editTable.setEditableRowKeyByIndex(tableId, index, keys, true);
            
            // props.editTable.setEditableRowByIndex(tableId, 0, false);
            // props.editTable.setEditableRowByIndex(tableId, numarr, false);
            // props.editTable.setEditableRowByRowId(tableId, rowid, false);
            //需要设置将其他行设置成不可编辑
    
            //通过rowid设置某些行的某些字段的可编辑性
            //props.editTable.setEditableRowKeyByRowId(tableId, rowid, one, true);
            //props.cardTable.setEditableByRowId(tableId, rowid, one, true);
            //根据表格index设置某几行可编辑性
            //props.editTable.setEditableRowByIndex(tableId, index, true);
            //props.editTable.pasteRow(tableId, text, index);
            
            //根据表格rowid设置某几行的可编辑性
            //props.editTable.setEditableRowByRowId(tableId,rowid,true);

            //根据表格rowid和key设置表格某行某字段的可编辑性
            //props.editTable.setEditableByKey(tableId, rowid, one, true);
            break;
        case 'rowDelete':
            ajax({
                url: requesturl.delete,
                data: {
                    pkTsMap : pktsmap
                },
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        // refreshHtml();
                        toast({ color: 'success', content: json1['36070BAES-000009'] });/* 国际化处理： 保存成功*/
                        // setButtonVisible(props,true);
                        _this.toggleShow();
                    }
                }
            });
            break;
        default:
            console.log(key, index);
            break;
    }
};
export default tableButtonClick;

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/