//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//银行账户使用权模态框列表
import React, {Component} from 'react';
import{ajax,toast} from 'nc-lightapp-front';
import {modalbtnClick, modalOnSelected, onModaltableAfterEdit,modalOnSelectedAll} from './clickEvents';
import Utils from "../../../public/utils";

class BankaccuseModel extends Component{
    constructor(props){
        super(props);
        this.config = props.config;
        this.state = {
            currentPkbankaccbas:props.currentPkbankaccbas,
            currentPkbankaccsub:props.currentPkbankaccsub,
            json:props.json
        }
    }
    componentDidMount(){
        this.loadBankaccuseData(this.initializeBtns.bind(this));
    }

    initializeBtns = ()=>{
        this.props.button.setMainButton['modalAdd',true];
        this.props.button.setMainButton['modalSave',false];
        this.props.button.setButtonDisabled(['modalEnable','mbtnEnable','mbtnDisable','modalDelete'],true);
    }
    //加载银行账户使用权列表数据
    loadBankaccuseData = (callback) => {
        ajax({
            url: '/nccloud/uapbd/bankacc/baseAction.do',
            data: {
                pk_bankaccbas: this.state.currentPkbankaccbas&&[this.state.currentPkbankaccbas],
                pk_bankaccsub:this.state.currentPkbankaccsub&&[this.state.currentPkbankaccsub],
                actionName: 'usufruct',
                pagecode: this.config.pagecode
            },
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        if(data.hasOwnProperty('message')){
                            toast({color:'warning',title:data.message});
                        }else {
                            data[this.config.bankaccuse].rows = Utils.convertGridEnablestate(data[this.config.bankaccuse].rows);
                            this.props.editTable.setTableData(this.config.bankaccuse, data[this.config.bankaccuse]);
                            this.props.button.setButtonVisible(['modalSave', 'modalCancel'], false);
                            this.props.modal.show('checkOrg');
                            callback && callback.call(this,data[this.config.bankaccuse].rows);
                        }
                    }else{
                        this.props.editTable.setTableData(this.config.bankaccuse, {
                            rows: []
                        });
                        callback && callback.call(this,[]);
                    }
                    this.initializeBtns.call(this);
                }
            }
        });
    }
    onAddRowCallback = ()=>{
        let{bankaccuse,gridId} = this.config;
        let alltabledata = this.props.editTable.getAllData(bankaccuse);
        if(this.config.pageFlag === 'list'){
            this.props.editTable.setValByKeyAndIndex(bankaccuse,alltabledata.rows.length-1,'pk_bankaccbas',
                this.props.table.getCheckedRows(gridId)[0].data.values.pk_bankaccbas)
        }else{
            this.props.editTable.setValByKeyAndIndex(bankaccuse,alltabledata.rows.length-1,
                'pk_bankaccbas', this.props.cardTable.getCheckedRows(gridId)[0].data.values.pk_bankaccbas);
            this.props.editTable.setValByKeyAndIndex(bankaccuse,alltabledata.rows.length-1,
                'pk_bankaccsub',this.props.cardTable.getCheckedRows(gridId)[0].data.values.pk_bankaccsub);


        }
    }
    render(){
        const {button, editTable} = this.props;
        const {createButtonApp} = button;
        const {createEditTable} = editTable;
        return (
            <div className="nc-single-table">
                <div className="nc-singleTable-header-area" >
                    {/* 按钮区  btn-group */}
                    <div className="header-button-area-modal" style={{width:'100%',textAlign:'right'}}>
                        {createButtonApp({
                            area: 'openmodal-button-area',
                            buttonLimit: 5,
                            onButtonClick: modalbtnClick.bind(this)
                        })}
                    </div>
                </div>
                {/* 列表区 */}
                <div className="nc-singleTable-table-area">
                    {createEditTable(this.config.bankaccuse, {
                        onAfterEvent: onModaltableAfterEdit.bind(this),
                        onSelected:modalOnSelected.bind(this),
                        onSelectedAll:modalOnSelectedAll.bind(this),
                        showIndex: true,
                        showCheck: true,
                        isAddRow:true,
                        addRowCallback:this.onAddRowCallback.bind(this)
                    })}
                </div>
            </div>
        )
    }
}
export default BankaccuseModel;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65