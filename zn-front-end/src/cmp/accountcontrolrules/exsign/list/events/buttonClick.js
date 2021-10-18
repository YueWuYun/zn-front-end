/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base  ,toast ,print} from 'nc-lightapp-front';
import {setButtonVisible,onDelete,onCancel ,constData} from './initRestMoneyDate';
import { requesturl } from '../../cons/requesturl.js';
import initTemplate from './initTemplate';
export default function buttonClick(json1, props, id) {
    /**设置小应用按钮事件 */
    let invokethis = this;
    //let checkeddate = props.editTable.getCheckedRows(this.tableId);
    // 财务组织
    // let pkorg = this.props.search.getAllSearchData(this.searchId);
    // let pkorgvalue = null;
    // if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
    //     pkorgvalue = pkorg.conditions[0].value.firstvalue;
    // }
    

   
    //刷新按钮
    if (id == constData.refresh) {
        this.refreshHtml();
        return;
    }
    
    
    
    // 过滤的不符合条件的数据
    let error = [];
    // 列表操作的索引数组
    let indexarr = [];
    switch (id) {
        case 'Add':
            
            let number = props.editTable.getNumberOfRows(this.tableId);
            // 资金形态的默认值
            let addfundcode = { 'pk_bankaccsub.name':{display:null, value:null}, 'userid.user_name': {value:null} }
            props.editTable.addRow(this.tableId, number,true,addfundcode);
            setButtonVisible(props,false);
            break;
        //保存
        case 'Save':
            // props.syncTree.setNodeDisable('tree', false);//控制树的节点可编辑
            props.button.setButtonVisible(['Save','Refresh'],true);
           
            let alldata = props.editTable.getChangedRows('exsign_table');
            let pktsmap = {};
            if(alldata[0].values.pk_accexsign && alldata[0].values.ts){
                let pk = alldata[0].values.pk_accexsign.value;
                let ts = alldata[0].values.ts.value;
                pktsmap[pk] = ts;
            }
           
            
            ajax({
                url: requesturl.save,
                data: {
                    srcFunCode:this.srcFuncode,
                    rows:alldata,
                    pk_org : this.pk_org,
                    pkTsMap : pktsmap
                },
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        // refreshHtml();
                        toast({ color: 'success', content: json1['36070BAES-000009'] });/* 国际化处理： 保存成功*/
                      
                        setButtonVisible(props,true);
                        invokethis.toggleShow();
                    }
                }
            });
            break;

        /**修改 */
        case 'Edit':
            // props.syncTree.setNodeDisable('tree', true);//控制树的节点不可编辑
            props.editTable.setStatus(this.tableId, 'edit', null);
            setButtonVisible(props,false);
            let tabledata = props.editTable.getAllRows(this.tableId);
            tabledata.forEach((val,index)=>{
                let valvalue = val.values;
                //最低余额控制
                let islowmnycontrol = valvalue.islowmnycontrol.value;
                if(!islowmnycontrol){
                    props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'lowmoney', false);
                    props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'lowmnycontrolsche', false);
                }else{
                    props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'lowmoney', true);
                    props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'lowmnycontrolsche',true);
                }
                //最高余额控制
                let ishighmnycontrol = valvalue.ishighmnycontrol.value;
                if(!ishighmnycontrol){
                    props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'highmoney', false);
                    props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'highmnycontrolsche', false);
                }else{
                    props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'highmoney', true);
                    props.editTable.setEditableRowKeyByIndex(this.tableId, index, 'highmnycontrolsche',true);
                }
                 
console.log('---------------'+islowmnycontrol);
                // let savecurrtype = valvalue.pk_currtype.value;
               
            })
            // setEditableRowKeyByIndex(tableId, index, key, flag)
            break;
        /**刷新 */
        case 'Refresh':
            invokethis.refreshHtml();
            
            break;
        
        case 'Cancel':
         
            // props.editTable.cancelEdit('table_area');
            // props.editTable.setStatus('table_area', 'browse', null);
            // setButtonVisible(props,true);
            let cancelcon = json1['36070BACR-000019'];/* 国际化处理： 取消之后您的编辑数据将不可用，是否确认取消？*/
            props.ncmodal.show('onDelete',{
                title: json1['36070BACR-000020'],/* 国际化处理： 确认取消*/
                content: cancelcon,
                color:'warning',
                //点击确定按钮事件
                beSureBtnClick: onCancel.bind(this, props)
            });
            //invokethis.refreshHtml();
            break;    
    }
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/