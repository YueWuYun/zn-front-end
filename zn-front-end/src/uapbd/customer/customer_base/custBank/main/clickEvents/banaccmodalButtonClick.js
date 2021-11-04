//uMJiZnb87MJ82QRQMxF4aGwgIroJiFjs2KjmlbStLzTFkhoKPlZxJrUUbTjrNGLpBKOS+sEKbWmx
//y87bZ/AFUA==
import {toast, ajax} from 'nc-lightapp-front';
import confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';

export default function (props, id) {
    const {modalGrid, modalCardTable} = this.config;
    const {custParam} = this.state.custBankParam;
    //let checkedRows = props.editTable.getCheckedRows(modalGrid);
    let allrows = props.editTable.getAllRows(modalGrid);
    let noCheckedBtns = ['bammodalAdd', 'bammodalFilter', 'bammodalRef', 'bamShowDisabled', 'bammodalimport', 'bammodalexport'];
    if (this.state.showList && (this.state.currentCustPk === '' || this.state.currentCustBankPk === '' || this.state.currentBankaccbas === '') && !noCheckedBtns.includes(id)) {
        toast({
            color: 'warning', title: this.state.json['10140CUST-000019']/* 国际化处理： 请选择数据操作！*/
        });
        return
    }
    switch (id) {
        case'bammodalAdd':
            this.toogleCardOrList(props, 'add', 'card', () => {
                let obj = Object.assign({
                    pk_org: this.currentOrg,
                    pk_cust: this.currentCustPk,
                    accname: this.currentCustName,
                    pagecode: props.config.pagecode
                }, this.config);
                obj.pk_bankaccbas = '';
                this.setState({
                    currentCustPk: allrows.length !== 0 && allrows[allrows.length - 1].values.pk_cust.value || '',
                    currentBankaccbas: allrows.length !== 0 && allrows[allrows.length - 1].values.pk_bankaccbas.value || '',
                    currentCustBankPk: allrows.length !== 0 && allrows[allrows.length - 1].values.pk_custbank.value || ''
                }, () => {
                    this.loadCardData(props, obj, () => {
                    });
                });
            });
            break;
        case'bammodalEdit':
            ajax({
                url: '/nccloud/uapbd/custbankacc/operateHandle.do',
                data: Object.assign({
                    pk_cust: this.state.currentCustPk,
                    pk_custbank: this.state.currentCustBankPk,
                    pk_bankaccbas: this.state.currentBankaccbas,
                    actionName: id,
                    pagecode: props.config.pagecode
                }, this.config),
                success: (res) => {
                    let {success, data} = res;
                    if (success) {
                        this.setState(this.state, () => {
                            this.toogleCardOrList(props, 'edit', 'card', () => {
                                this.setCardData.call(this,data);
                            });
                        });
                    }
                }
            });
            break;
        case'bammodalDel':
            confirmUtil.call(this, {
                title: this.state.json['10140CUST-000034'], /* 国际化处理： 确认删除*/
                content: this.state.json['10140CUST-000041'], /* 国际化处理： 确认删除所选数据？*/
                beSureBtnClick: () => {
                    this.buttonOperator.call(this, props, id, {
                        pk_cust: this.state.currentCustPk,
                        pk_custbank: this.state.currentCustBankPk,
                        pk_bankaccbas: this.state.currentBankaccbas,
                        actionName: id
                    }, () => {
                        this.state.showList && this.loadGridData(props, () => {
                            // toast({color: 'success', content: '数据加载成功！'});
                        });
                        this.state.showCard && emptyModal.call(this, props);
                    });
                }
            })

            break;

        //废弃的按钮
        case'bammodalFilter':
            break;
        case'bammodalexport':
            // this.setState({

            //     },()=>{
            //         this.props.modal.show('exportFileModal');
            //     });
            this.props.modal.show('custbank');
            break;
        case'bamShowDisabled':
            this.setState({
                showSeal: !this.state.showSeal
            }, () => {
                this.loadGridData(props, () => {
                    // toast({color: 'success', content: '数据加载成功！'});
                });
            });

            break;
        case'bammodalEnable':
        case'bammodalDisable':
            //
            confirmUtil.call(this, {
                title: id === 'bammodalEnable' ? this.state.json['10140CUST-000042'] : this.state.json['10140CUST-000043'], /* 国际化处理： 确认启用,确认停用*/
                content: this.state.json['10140CUST-000044'], /* 国际化处理： 确认执行操作？*/
                beSureBtnClick: () => {
                    this.buttonOperator.call(this, props, id, Object.assign({
                        pk_cust: this.state.currentCustPk,
                        pk_bankaccbas: this.state.currentBankaccbas,
                        pk_custbank: this.state.currentCustBankPk,
                        pagecode: props.config.pagecode,
                        actionName: id
                    },this.config), (data) => {
                        this.state.showList && this.loadGridData(props, () => {
                            // toast({color:'success',content:'数据加载成功！'});
                        });
                        this.state.showCard && this.setCardData(data);
                    });
                }
            });
            break;
        case'bammodalRef':
            //刷新
            //列表刷新
            this.state.showList && this.loadGridData(props, () => {
                toast({
                    color: 'success',
                    title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                });
            });
            //卡片刷新
            this.state.showCard && this.loadCardData(props, Object.assign({
                pk_cust: this.state.currentCustPk,
                pk_bankaccbas: this.state.currentBankaccbas,
                pk_custbank: this.state.currentCustBankPk,
                pagecode: props.config.pagecode
            },this.config), () => {
                toast({
                    color: 'success',
                    title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
                });
            });
            break;
        case'bammodalSave':
            props.form.isCheckNow('accbasinfo') && doSave.call(this, props, this.config, custParam, (data) => {
                let {cardTableData, custFormData, bankFormData} = data;
                let {modalCustForm, modalBankForm, modalCardTable} = this.config;
                this.setState({
                    currentCustPk: custFormData[modalCustForm].rows[0].values.pk_cust.value,
                    currentBankaccbas: bankFormData[modalBankForm].rows[0].values.pk_bankaccbas.value,
                    currentCustBankPk: custFormData[modalCustForm].rows[0].values.pk_custbank.value
                }, () => {
                    this.toogleCardOrList(props, 'browse', 'card', () => {
                        this.setCardData.call(this,data,()=>{
                            toast({color: 'success', content: this.state.json['10140CUST-000037']});
                            /* 国际化处理： 保存成功！*/
                        });

                    });
                })
            });
            break;
        case'bammodalSaveAdd':
            props.form.isCheckNow('accbasinfo') && doSave.call(this, props, this.config, custParam, () => {
                this.toogleCardOrList(props, 'edit', 'card', () => {
                    this.loadCardData(props, Object.assign({
                        pk_org: this.currentOrg,
                        pk_cust: this.currentCustPk,
                        accname: this.currentCustName,
                        pagecode: props.config.pagecode
                    }, this.config), () => {
                        //  toast({color:'success',content:'新增成功！'});
                    });
                });
            });
            break;
        case'bammodalCancel':
            confirmUtil.call(this, {
                title: this.state.json['10140CUST-000038'], /* 国际化处理： 确认取消*/
                content: this.state.json['10140CUST-000045'], /* 国际化处理： 确认取消？*/
                beSureBtnClick: () => {
                    //修改点取消
                    if(this.state.componentStatus === 'edit'){
                        this.toogleCardOrList(props, 'browse', 'card', () => {
                            this.props.form.cancel(this.config.modalCustForm);
                            this.props.form.cancel(this.config.modalBankForm);
                            this.props.cardTable.resetTableData(this.config.modalCardTable);
                        });
                     //新增点取消
                    }else if(this.state.componentStatus === 'add'){
                            //列表无数据新增点取消
                        if (this.state.currentCustBankPk == '' || this.state.currentCustPk == '' || this.state.currentBankaccbas == '') {
                            this.toogleCardOrList(props, 'browse', 'card', () => {
                                emptyModal.call(this, props);
                            });
                            //列表有数据新增点取消
                        } else {
                            let param = Object.assign({
                                pk_cust: this.state.currentCustPk,
                                pk_bankaccbas: this.state.currentBankaccbas,
                                pk_custbank: this.state.currentCustBankPk,
                                pagecode: props.config.pagecode,
                                actionName: 'check'
                            }, this.config);
                            this.toogleCardOrList(props, 'browse', 'card', () => {
                                this.loadCardData(props, param, () => {
                                });
                            });
                        }
                    }else{
                        //imposible
                    }


                }
            });
            break;
        case'bammodalSubAdd':
            props.cardTable.addRow(modalCardTable, undefined, true);
            break;
        case'bammodalSubDel':
            if (this.state.showCard) {
                let cardtablecheckedrows = props.cardTable.getCheckedRows(modalCardTable);
                if (cardtablecheckedrows.length === 0) {
                    toast({color: 'info', title: this.state.json['10140CUST-000019']});
                    /* 国际化处理： 请选择数据操作！*/
                    return;
                } else {
                    let indexarr = [];
                    cardtablecheckedrows.map((e) => {
                        indexarr.push(e.index);
                    });
                    props.cardTable.delRowsByIndex(modalCardTable, indexarr);
                    props.button.setButtonDisabled(['bammodalSubDel'], true);
                }
            }
            break;
        default:
            break;
    }
}

function emptyModal(props) {
    props.form.EmptyAllFormValue('cardcustbankacc');
    props.form.EmptyAllFormValue('accbasinfo');
    props.cardTable.setTableData('bankaccsub', {rows: []});
    props.button.setButtonVisible(this.state.browseBtns, false);
    props.button.setButtonVisible(this.state.editBtns, false);
    props.button.setButtonVisible(['bammodalAdd'], true)
}

function doSave(props, config, custParam, callback) {
    let {modalCustForm, modalBankForm, modalCardTable} = config;
    let custinfo = props.form.getAllFormValue(modalCustForm);
    custinfo.areacode = modalCustForm;
    let bankaccinfo = props.form.getAllFormValue(modalBankForm);
    bankaccinfo.areacode = modalBankForm;
    let bankaccsubinfo = props.cardTable.getAllData(modalCardTable);
    bankaccsubinfo.areacode = modalCardTable;
    ajax({
        url: '/nccloud/uapbd/custbankacc/doSave.do',
        data: {
            custFormData: {
                model: custinfo,
                pageid: props.config.pagecode
            },
            bankFormData: {
                model: bankaccinfo,
                pageid: props.config.pagecode
            },
            cardTableData: {
                model: bankaccsubinfo,
                pageid: props.config.pagecode
            },
            custParam: custParam
        },
        success: (res) => {
            let {success, data} = res;
            if (success) {
                if (data) {
                    callback.call(this, data);
                }
            }

        }
    })
}


//uMJiZnb87MJ82QRQMxF4aGwgIroJiFjs2KjmlbStLzTFkhoKPlZxJrUUbTjrNGLpBKOS+sEKbWmx
//y87bZ/AFUA==