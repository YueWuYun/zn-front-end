/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/
import { createPage, ajax, base  ,toast} from 'nc-lightapp-front';
import buttonClick from './buttonClick';
import {setButtonVisible,onDelete} from './initRestMoneyDate';
function tableButtonClick (props, key, text, records, index) {
    let json1 = this.state.json;
    let searchId = 'search_area';
    let tableId = 'table_area';
    let pageId = '360701OB_L01';
    let record = records.values;
    let _this = this;
    let pk = record.pk_initdata.value;
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
                            toast({ color: 'success', content: json1['360701OB-000015'] });/* 国际化处理： 取消复核成功*/
                            _this.refreshHtml();
                        }else{
                            // data会返回错误信息
                            toast({ color: 'info', content: data.message });
                        }
                    }else{
                        toast({ color: 'warning', content: json1['360701OB-000016'] });/* 国际化处理： 取消复核失败，请稍后再试！*/
                    }
                }
            });
            break;
        case 'inneraudit':
            //复核
            let pkorg = props.search.getAllSearchData(searchId);
            let pkfirstvalue = null;
            if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
                pkfirstvalue = pkorg.conditions[0].value;
            }
            if(pkfirstvalue==null || pkfirstvalue.firstvalue==null){
                toast({ color: 'warning', content: json1['360701OB-000000'] });/* 国际化处理： 请选择财务组织*/
                return;
            }
            data['pk_org'] = pkfirstvalue.firstvalue;
            
            ajax({
                url: '/nccloud/cmp/bankaccountbook/initrestmoneyaudit.do',
                data: data,
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        toast({ color: 'success', content: json1['360701OB-000012'] });/* 国际化处理： 复核成功*/
                        //props.table.deleteTableRowsByIndex(tableid, indexArr5)//直接删除table中的行列
                    }else{
                        toast({ color: 'warning', content: json1['360701OB-000013'] });/* 国际化处理： 复核失败，请稍后再试！*/
                    }
                    _this.refreshHtml();
                }
            });

            
            break;
        case 'inneredit':
            //修改
            props.syncTree.setNodeDisable('tree', true);//控制树的节点不可编辑
            props.editTable.setStatus(tableId, 'edit', setButtonVisible(props,false));
            props.button.setButtonVisible(['refresh'],false);
            let keys = ['pk_account','init_primal'];
            // 本行币种
            let pk_currtype = record.pk_currtype.value;
            // 组织币种
            let org_currtype = _this.localcurrtype;
            if (org_currtype && org_currtype!=pk_currtype) {
                // 组织本币和本行数据币种不同，期初本币也可以修改
                keys.push('init_local');
            }
            props.editTable.setEditableRowKeyByIndex(tableId, index, keys, true);
            
            //props.editTable.setEditableRowByIndex(tableId, 0, false);
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
        case 'innerdelete':
            //删除按钮
            let approver = record.approver;
            let content = null;
            // 复核人
            if (approver && approver.value) {
                content = <div> {json1['360701OB-000022']}，{json1['360701OB-000023']}？</div>/* 国际化处理： 将会删除失败,是否确定删除*/
            }else{
                content = json1['360701OB-000004'];/* 国际化处理：  删除操作不可逆，是否确定？*/
            }
            // 没有选择可以删除的数据，则提示
            if (JSON.stringify(pktsmap) == '{}')  {
                content = <div>{json1['360701OB-000031']}！</div>/* 国际化处理： 您未选择可以删除的数据*/
            }
            // 弹框
            props.ncmodal.show('onDelete',{
                content: content,
                color:'warning',
                //点击确定按钮事件
                beSureBtnClick: onDelete.bind(_this, props, 'delete',pktsmap,index)
            });
            break;
        default:
            console.log(key, index);
            break;
    }
};
export default tableButtonClick;

/*0GI1xcoeligdpMeXoHBphk/m+ZTUD1FkNh0kQT/vDMfsOQXAGz5ZvRrQwypM3dxN*/