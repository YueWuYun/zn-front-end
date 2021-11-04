//Fobj0VaQ3TIOZM26Kin1BCmlI5prm0WFiDMAqu2X4/qhtv9yN2ft4Aq7Fqg+zi+GJeEl+UKsx9GP
//6LgW49FTYw==
import {ajax,toast} from 'nc-lightapp-front';
import {showBankAccDialog,showAddressBookDialog,approveSupplier} from './SupplierUtils';

/**
 * liupzhc
 * 供应商列表按钮action
 */

/**
 * 供应商主列表按钮点击事件
 * @param props
 * @param id
 */
export const onMainTableButtonClick= function (props, id){

    let selectedRecords = null;
    switch(id){
        case 'Add':
            this.setState({openCard:!this.state.openCard,param:{status:'add'}},()=>{
                this.initPageData(this.setCardValue,this.setCardStatus);

            })

            break;
        case 'Edit':
            selectedRecords = this.props.cardTable.getCheckedRows(this.state.table.id);
            selectedRecords && selectedRecords.length == 1 ?
                this.setState(
                    {
                        batchParam:[selectedRecords],
                        param:{pk_supplier:selectedRecords[0].data.values['pk_supplier'].value,status:'edit'},
                        oldParam:{pk_supplier:selectedRecords[0].data.values['pk_supplier'].value,status:'edit'},
                        openCard:!this.state.openCard
                    },
                    ()=>{
                        this.initPageData(this.setCardValue,this.setCardStatus);
                    }):
                toast({title:'提示',content:"请选择一张单据进行修改！",color:'warning'});
            break;
        case 'Delete'://批量删除
            selectedRecords = this.props.cardTable.getCheckedRows(this.state.table.id);
            selectedRecords && selectedRecords.length >= 1 ?this.onDeleteMainTableSupplier(selectedRecords):
                toast({content:'请选择要删除的单据！',color:'warning'});break;

        case 'Save':
            this.props.form.isCheckNow(this.state.card.form.formId);
            //卡片所有数据
            let data = this.props.createExtCardData(this.state.pageId, this.state.card.form.formId, Object.keys(this.state.card.table.tabldIds).filter(key=>{return this.state.card.table[key].relate == 'agg'}));
            ajax({
                url:this.state.urls.saveUrl,
                data:data,
                success:(res)=>{
                    if(res.success){

                        this.props.form.setAllFormValue({[this.state.card.form.formId]:res.data.head[this.state.card.form.formId]});//设置表单数据
                        this.props.form.setFormStatus(this.state.form.formId,'browse');
                        //设置表格数据
                        !!res.data.table && Object.keys(this.state.card.table.tableId).forEach((key)=>{
                            this.props.cardTable.setTableData(this.state.card.table[key].tableId, res.data.body[this.state.card.table[key].tableId]);
                            this.props.cardTable.setStatus(this.state.card.table[key].tableId,'browse');
                        });
                        //成功提示
                        toast({ color: 'success', content: '保存成功' });
                    }
                }
            });
            break;
        case 'Copy'://复制
            selectedRecords = this.props.cardTable.getCheckedRows(this.state.table.id);
            selectedRecords && selectedRecords.length == 1 ?
                this.setState(
                    {
                        param:{pk_supplier:selectedRecords[0].data.values['pk_supplier'].value,status:'add'},
                        oldParam:{pk_supplier:selectedRecords[0].data.values['pk_supplier'].value,status:'add'},
                        openCard:!this.state.openCard
                    },
                    ()=>{
                        this.initPageData(this.setCardValue,this.setCardStatus,this.state.urls.copySupplierUrl);
                        this.setState({param:{status:'add',pk_supplier:null}});
                    }):
                toast({title:'提示',content:"请选择一张单据进行复制！",color:'warning'});
            break;
        case 'Refresh':
            this.onSearch(this.setTableData);
            break;
        case 'BankAccount'://银行账户
            selectedRecords = this.props.cardTable.getCheckedRows(this.state.table.id);//获得选中行
            selectedRecords && selectedRecords.length == 1 ?
                showBankAccDialog.call(this,selectedRecords[0].data.values['pk_supplier'].value):
                toast({title:'提示',content:"请选中一张单据！",color:'warning'});
            break;
        case 'Approve':
        case 'Menu_Approve':
            approveSupplier.call(this,{approve:true});
            break;
        case 'UnApprove':
            approveSupplier.call(this,{approve:false});
            break;
        case 'Freeze'://冻结
            
            break;
        case 'UnFreeze'://解冻

    }
}


export const onSupMainTableOprBtnClick = function(record,index, props, key){
    switch(key){
        case 'Copy':
            this.setState(
                {
                    param:{pk_supplier:record['pk_supplier'].value,status:'add'},
                    oldParam:{pk_supplier:record['pk_supplier'].value,status:'add'},
                    openCard:!this.state.openCard
                },
                ()=>{
                    this.initPageData(this.setCardValue,this.setCardStatus,this.state.urls.copySupplierUrl);
                    this.setState({param:{status:'add',pk_supplier:null}});
                });
            break;
        case 'Edit':
            this.setState(
                {
                    param:{pk_supplier:record['pk_supplier'].value,status:'edit'},
                    oldParam:{pk_supplier:record['pk_supplier'].value,status:'edit'},
                    openCard:!this.state.openCard
                },
                ()=>{
                    this.initPageData(this.setCardValue,this.setCardStatus);
                });
            break
        case 'DeleteLine':
            this.setState({delParam:{
                    delPks:[record['pk_supplier'].value],
                    ts:{[record['pk_supplier'].value]:record.ts.value},
                    indexs:[index]
                }},()=>{
                debugger
                this.DeleteDialog.showDialog();
            })
            break;
        case 'BankAccount'://银行账户
            showBankAccDialog.call(this,record['pk_supplier'].value);
            break;
        case 'AddressBook':
            showAddressBookDialog.call(this,record['pk_supplier'].value);
            break;

    }
}

/**
 * 设置主列表按钮状态
 * @returns {*}
 */
export const setMainTableButtonStatus = function(){
    let dataNum = this.props.cardTable.getNumberOfRows(this.state.table.id);
    if(dataNum>0){
        this.props.button.setButtonsVisible(['Add','Edit','Delete','Copy','BatchUpdate','Refresh','Assign','BankAccount','AddressBook','Approve','Freeze','AssistFun','Associate','OrgBrowse','BrowseOrgDoc','Print'],true);
    }else{
        this.props.button.setButtonsVisible(['Add','Refresh','OrgBrowse','BrowseOrgDoc'],true);
        this.props.button.setButtonsVisible(['Edit','Delete','Copy','BatchUpdate','Assign','BankAccount','AddressBook','Approve','Freeze','AssistFun','Associate','Print'],false);
    }
    return dataNum;
}
//Fobj0VaQ3TIOZM26Kin1BCmlI5prm0WFiDMAqu2X4/qhtv9yN2ft4Aq7Fqg+zi+GJeEl+UKsx9GP
//6LgW49FTYw==