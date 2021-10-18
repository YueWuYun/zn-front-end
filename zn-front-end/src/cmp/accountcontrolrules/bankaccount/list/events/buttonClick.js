/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base  ,toast ,print} from 'nc-lightapp-front';
import {setButtonVisible,onDelete,onCancel ,constData} from './initRestMoneyDate';
export default function buttonClick(json1, props, id) {
    /**设置小应用按钮事件 */
    let invokethis = this;
    //let checkeddate = props.editTable.getCheckedRows(this.tableId);
    // 财务组织
    let pkorg = this.props.search.getAllSearchData(this.searchId);
    let pkorgvalue = null;
    if (pkorg && pkorg.conditions[0] && pkorg.conditions[0].value && pkorg.conditions[0].value.firstvalue) {
        pkorgvalue = pkorg.conditions[0].value.firstvalue;
    }
    if(pkorgvalue == null){
        toast({ color: 'warning', content: json1['36070BACR-000000'] });/* 国际化处理： 请选择财务组织*/
        return;
    }
    // 资金形态
    let fundcode = null;
    let fundname = null;
    let fundtree = invokethis.getFundform();
    if (fundtree && fundtree.refcode) {
        fundcode = fundtree.refcode;
        if(fundcode && fundcode==0){
           fundname = json1['36070BACR-000032'];
        }else if(fundcode && fundcode==1){
           fundname = json1['36070BACR-000033'];
        }
        //fundname = fundtree.refname;
    }
   
    //刷新按钮
    if (id == constData.refresh) {
        this.refreshHtml();
        return;
    }
    let pktsmap = {};
    // 过滤的不符合条件的数据
    let error = [];
    // 列表操作的索引数组
    let indexarr = [];
    switch (id) {
        //保存
        case 'Save':
            props.syncTree.setNodeDisable('tree', false);//控制树的节点可编辑
            props.button.setButtonVisible(['refresh'],true);
           
            let alldata = props.editTable.getAllRows('pk_bankaccount_table');
            let searchdata = props.search.getAllSearchData('search');
            
            
            let bodydate = {
                areacode : 'pk_bankaccount_table',
                areaType : 'table',
                rows : alldata,
                pagecode: '36070BACR_L01',
            };
            ajax({
                url: '/nccloud/cmp/bankaccount/bankaccountsave.do',
                data: {
                    pk_org : this.pk_org,
                    pk_group : this.pk_group,
                    pk_bankaccbas : this.pk_bankaccbas,
                    pk_bankaccrule : this.pk_bankaccrule,
                    
                    body : bodydate,
                    pageid : '36070BACR_L01'
                },
                success: function (res) {
                    let { success, data } = res;
                    if (success) {
                        // refreshHtml();
                        toast({ color: 'success', content: json1['36070BACR-000009'] });/* 国际化处理： 保存成功*/
                        // NCMessage.create({ content: '审批成功', color: 'success', position: 'top' });
                        setButtonVisible(props,true);
                        invokethis.refreshHtml();
                    }
                }
            });
            break;

        /**修改 */
        case 'Edit':
            props.syncTree.setNodeDisable('tree', true);//控制树的节点不可编辑
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
                 

                // let savecurrtype = valvalue.pk_currtype.value;
               
            })
            // setEditableRowKeyByIndex(tableId, index, key, flag)
            break;
        /**刷新 */
        case 'Refresh':
            invokethis.refreshHtml();
            break;
        
        case 'Cancel':
            props.syncTree.setNodeDisable('tree', false);//控制树的节点可编辑
            props.button.setButtonVisible(['refresh'],true);
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
        case 'Exsign':
            props.openTo('/cmp/accountcontrolrules/exsign/list/index.html', {
                srcFunCode:'36070BACR',
                pk_org:pkorgvalue,
                appcode: '36070BAES',
                pagecode: '36070BAES_L01',
                status: 'browse'
            });
            break;
    }
}


/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/