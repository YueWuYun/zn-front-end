//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS
import {ajax, base, toast, cardCache, print, printer, output, getBusinessInfo} from 'nc-lightapp-front';
let {setDefData, getDefData} = cardCache;
import manageModePlugIn from '../../../../../public/utils/ManageModeUtils';
import confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
import getAssignOrgdata from '../../../checkAssignOrg/function/getAssignOrgdata';
import CustBank from '../../../custBank/main/index';//银行账户模态框
import CustAddress from '../../../custAddress/index';//地址簿modal
import CustRename from '../../../custRename/index';//地址簿modal
import custBusinessPortraits  from '../../../commonFunc/CustBusinessPortraits';
const ajaxurl = {
    'baseAction': '/nccloud/uapbd/customer/baseAction.do',
    'printUrl': '/nccloud/uapbd/customer/mainPrint.do'
};
export default function (props, id) {
    let status = props.getUrlParam('status') || 'browse';
    let {formId, subGrid2, subGrid3, NODE_TYPE, appcode, datasource} = props.config;

    let meta;
    let formItemArr = props.form.getFormItemsValue(formId, [
        'pk_customer', 'pk_org', 'name',
        'code', 'ename', 'shortname',
        'pk_group', 'enablestate', 'frozenflag',
        'pk_supplier', 'pk_customerpf', 'pk_areacl',
        'issupplier', 'taxpayerid', 'mnecode']);
    //需要走管控模式的按钮
    let needMangeModeBtns = [
        'btnEdit', 'btnDelete',
        'btnEnable', 'btnDisable', 'enable',
        'freeze', 'btnFreeze', 'btnUnFreeze',
        'btnDistrib', 'distribute', 'btnCancelDis',
        'btnBankAcc', 'btnAddress', 'btnCheckApply',
        'btnAttachment', 'btnGenerate', 'btnCorrelation'];
    //在数组中的按钮需要走管控模式
    if (needMangeModeBtns.includes(id)) {
        let rem = manageModePlugIn.call(this, NODE_TYPE, formItemArr[1].value, formItemArr[6].value, getDefData('PermissionOrgIDs', datasource), getBusinessInfo().groupId);
        if (!rem.editFlag) {
            toast({
                color: 'warning',
                content: rem.message
            });
            return;
        }
    }
    switch (id) {
        case 'btnAdd':
            beforeAddCopy.call(this, props, () => {
                props.setUrlParam({
                    status: 'add',
                    appcode: appcode
                });
                //如果有默认模板新增加载的是默认模板的数据
                if (Object.keys(this.importTempletDlg.state.defaultExtBillcard).length !== 0) {
                    this.importTempletDlg.setDefaultTemp(this.buttontoggleShow.bind(this, props))(props);
                } else {
                    this.setDefaultValue(this.buttontoggleShow.bind(this, props));
                }
            });
            break;
        case 'btnEdit':
            ajax({
                url: ajaxurl.baseAction,
                data: {
                    pk_customer: formItemArr[0].value,
                    actionName: id
                },
                success: (res) => {
                    let {success, data} = res;
                    success && props.setUrlParam({
                        status: 'edit',
                        id: props.getUrlParam('id'),
                        appcode: appcode
                    });
                    props.form.setFormItemsDisabled(props.config.formId, {
                        'pk_org': true,
                    });
                    this.buttontoggleShow(props);
                }
            });
            break;
        case 'btnDelete':
            //如果已经是供应商就不允许删除！
            if (!!formItemArr[9].value && formItemArr[12].value) {
                toast({content: this.state.json['10140CUST-000185'], color: 'warning'});
                return;
            } else {
                this.DeleteDialog.showDialog();
            }

            break;
        case 'btnCopy':
            beforeAddCopy.call(this, props, () => {
                props.setUrlParam({
                    status: 'add',
                    id: props.getUrlParam('id'),
                    copyFlag: 'copy',
                    appcode: appcode
                });
                this.getCopyData(formItemArr[0].value, this.buttontoggleShow.bind(this, props));
            });
            break;
        case 'btnSaveAdd':
            this.modelSave('', props, (data) => {
                props.setUrlParam({
                    status: 'add',
                    appcode: appcode
                });
                this.setDefaultValue(this.buttontoggleShow.bind(this, props));

            });
            break;
        case 'btnSave':
            this.modelSave('', props, (data) => {
                this.setCardData(props, data);
            });
            break;
        case 'btnCancel':
            confirmUtil.call(this, {
                title: this.state.json['10140CUST-000038'], /* 国际化处理： 确认取消*/
                content: this.state.json['10140CUST-000065'], /* 国际化处理： 是否确认取消？*/
                beSureBtnClick: () => {
                    //编辑态取消
                    if (status === 'edit') {
                        //修改取消
                        props.form.cancel(formId);
                        props.cardTable.resetTableData(subGrid2);
                        props.cardTable.resetTableData(subGrid3);
                        props.setUrlParam({
                            status: 'browse',
                            id: props.getUrlParam('id'),
                            appcode: appcode
                        });
                        this.buttontoggleShow(props,'',this.toogleBtnState.bind(this));
                    }
                    else {
                        //复制取消
                        if (props.getUrlParam('copyFlag')) {
                            ajax({
                                url: ajaxurl.baseAction,
                                data: {
                                    actionName: id,
                                    billcode: props.form.getFormItemsValue(formId, 'code').value,
                                    pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
                                    pk_group: props.form.getFormItemsValue(formId, 'pk_group').value
                                },
                                success: (res) => {
                                    let {success, data} = res;
                                    if (success) {
                                        //卡片态复制取消
                                        setDefData('id', datasource, props.getUrlParam('id'));
                                        props.setUrlParam({
                                            status: 'browse',
                                            appcode: appcode
                                        });
                                        this.getdata(props.getUrlParam('id'), this.buttontoggleShow.bind(this, props,'',this.toogleBtnState.bind(this)));
                                    }
                                }
                            });

                        } else {
                            //新增取消
                            ajax({
                                url: ajaxurl.baseAction,
                                data: {
                                    actionName: id,
                                    billcode: props.form.getFormItemsValue(formId, 'code').value,
                                    pk_org: props.form.getFormItemsValue(formId, 'pk_org').value,
                                    pk_group: props.form.getFormItemsValue(formId, 'pk_group').value
                                },
                                success: (res) => {
                                    let {success, data} = res;
                                    if (success) {
                                        //卡片态新增取消
                                        if (!!props.getUrlParam('id')) {
                                            setDefData('id', datasource, props.getUrlParam('id'));
                                            props.setUrlParam({
                                                status: 'browse',
                                                appcode: appcode
                                            });
                                            this.getdata(props.getUrlParam('id'), this.buttontoggleShow.bind(this, props,'',this.toogleBtnState.bind(this)));
                                        } else {
                                            //列表态新增取消
                                            setDefData('id', datasource, null);
                                            props.setUrlParam({
                                                status: 'browse',
                                                appcode: appcode
                                            });
                                            this.cleanBillCard.call(this, () => {
                                                this.buttontoggleShow(props, 'btncancel');
                                            });

                                        }

                                    }
                                }
                            })
                        }
                    }
                },
                cancelBtnClick: () => {
                    return;
                }
            });
            break;
        case 'btnRefrensh':
            this.getdata(formItemArr[0].value, this.buttontoggleShow.bind(this, props,'',this.toogleBtnState.bind(this)));
            toast({
                color: 'success',
                title: this.state.json['10140CUST-000066']/* 国际化处理： 刷新成功！*/
            });
            break;
        case 'subGridAdd':
            props.cardTable.addRow(gridId);
            props.cardTable.setStatus(gridId, 'edit');
            break;
        case 'enable':
        case'btnEnable':
            formItemArr[7].value === '2' || enableFrozenToogle.call(this, props, id, 'enablestate', () => {
                this.getdata(formItemArr[0].value,this.toogleBtnState.bind(this));
            });
            formItemArr[7].value === '2' && toast({
                color: 'warning',
                title: this.state.json['10140CUST-000067']/* 国际化处理： 已经启用的数据，无法启用！*/
            });
            break;
        case'btnDisable':
            formItemArr[7].value === '3' || enableFrozenToogle.call(this, props, id, 'enablestate', () => {
                this.getdata(formItemArr[0].value,this.toogleBtnState.bind(this));
            });
            formItemArr[7].value === '3' && toast({
                color: 'warning',
                title: this.state.json['10140CUST-000068']/* 国际化处理： 已经停用的数据，无法停用！*/
            });
            break;
        case'freeze':
        case'btnFreeze':
            formItemArr[8].value || enableFrozenToogle.call(this, props, id, 'frozenflag', () => {
                this.getdata(formItemArr[0].value,this.toogleBtnState.bind(this));
            });
            formItemArr[8].value && toast({
                color: 'warning',
                title: this.state.json['10140CUST-000069']/* 国际化处理： 已经冻结的数据，无法冻结！*/
            });
            break;
        case'btnUnFreeze':
            formItemArr[8].value && enableFrozenToogle.call(this, props, id, 'frozenflag', () => {
                this.getdata(formItemArr[0].value,this.toogleBtnState.bind(this));
            });
            formItemArr[8].value || toast({
                color: 'warning',
                title: this.state.json['10140CUST-000070']/* 国际化处理： 没有冻结的数据，无法解冻！*/
            });
            break;
        case'btnBatchEdit':
        case'batchEdit':
            //批改
            this.batchEditModal.show(formItemArr);
            break;
        case'btnGuideEdit':
            //向导批改
            this.batchEditStepModal.show([formItemArr[0].value]);
            break;
        case'distribute':
        case'btnDistrib':
            //分配
            this.assignModal.show('assign');
            break;
        case'btnCancelDis':
            //取消分配
            this.assignModal.show('cancelAssign');
            break;
        case'btnGuideDis':
            //向导分配
            this.assignStepModal.show([formItemArr[0].value]);
            break;
        case'btnCheckOrg':
            //已分配组织查询
            props.modal.show('checkAssignOrgModal');
            getAssignOrgdata.call(this, props, id, formItemArr[0]);
            break;
        case'btnCheckOrgBase':
            //查看组织档案
            props.modal.show('checkOrgbase');
            break;
        case'btnCheckByOrg':
            //客户按组织查看
            props.modal.show('checkByOrg');
            break;
        case'btnGenerate':
            //生成供应商
            let isfreecust = props.form.getFormItemsValue(formId, ['isfreecust', 'issupplier']);
            if (isfreecust[0].value === true) {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000071']});
                /* 国际化处理： 散户不能为客商！*/
                return;
            }
            if (isfreecust[1].value === true) {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000072']});
                /* 国际化处理： 已经是供应商不能生成供应商！*/
                return;
            }
            meta = props.meta.getMeta();
            let pk_supclassitem = meta[props.config.createSupplier]['items'].find(item => item.attrcode === 'pk_supplierclass');
            if (!!pk_supclassitem) {
                pk_supclassitem.queryCondition = () => {
                    return {
                        pk_org: props.config.NODE_TYPE === 'GLOBE_NODE' ?
                            'GLOBLE00000000000000' :
                            props.config.NODE_TYPE === 'ORG_NODE' ?
                                formItemArr[1].value : '',
                    }
                }
            }
            props.meta.setMeta(meta, () => {
                ajax({
                    url: ajaxurl.baseAction,
                    data: {
                        actionName: id,
                        pk_org: formItemArr[1].value,
                        pk_customer: formItemArr[0].value
                    },
                    success: (res) => {
                        let {success, data} = res;
                        if (success) {
                            props.form.setFormStatus(props.config.createSupplier, 'edit');
                            props.form.setAllFormValue({
                                [props.config.createSupplier]: {
                                    areacode: [props.config.createSupplier],
                                    rows: [{
                                        values: {
                                            "pk_org": formItemArr[1],
                                            "code": !!data && !!data['billcode'] ? {
                                                value: data['billcode'],
                                                display: data['billcode']
                                            } :formItemArr[3],
                                            "name": formItemArr[2],
                                            "ename": formItemArr[4],
                                            'shortname': formItemArr[5],
                                            'pk_supplierclass': {
                                                value: '',
                                                display: ''
                                            },
                                            'pk_supplier': formItemArr[9],
                                            'iscustomer': {
                                                value: true
                                            },
                                            'pk_areacl': formItemArr[11],
                                            'taxpayerid': formItemArr[13],
                                            'mnecode': formItemArr[14]
                                        }
                                    }]
                                }
                            });
                            props.form.setFormItemsDisabled(props.config.createSupplier, {'code': !!data &&  data['isEdit'] === 'diseditable'});

                            props.modal.show('oprGenerate', {
                                leftBtnName: this.state.json['10140CUST-000004'], /* 国际化处理： 确定*/
                                rightBtnName: this.state.json['10140CUST-000005'], /* 国际化处理： 取消*/
                                beSureBtnClick: () => {
                                    let formData = props.form.getAllFormValue(props.config.createSupplier);
                                    if (!formData.rows[0].values.pk_supplierclass.value) {
                                        toast({'color': 'warning', 'title': this.state.json['10140CUST-000073']});
                                        /* 国际化处理： 供应商基本分类不能为空！*/
                                        return;
                                    }
                                    ajax({
                                        url: '/nccloud/uapbd/customer/generateSupplier.do',
                                        data: {
                                            userjson: formItemArr[0].value,
                                            gridmodel: formData
                                        },
                                        success: (res) => {
                                            let {success, data} = res;
                                            if (success) {

                                                if (data) {
                                                    props.modal.close('oprGenerate');
                                                    toast({
                                                        'color': 'success',
                                                        'title': this.state.json['10140CUST-000046']
                                                    });
                                                    /* 国际化处理： 操作成功！*/
                                                    this.getdata(formItemArr[0].value);
                                                }
                                            }
                                        }
                                    });
                                },
                                cancelBtnClick: () => {
                                    ajax({
                                        url:ajaxurl.baseAction,
                                        data:{
                                            pk_org:formItemArr[0].value,
                                            pk_group:formItemArr[6].value,
                                            billcode:!!data && data['billcode'] || "",
                                            actionName:'rollbackCode'
                                        },
                                        success:(res)=>{
                                            let{success} = res;
                                            if(success){
                                                props.modal.close('oprGenerate');
                                            }
                                        }
                                    })

                                },
                                closeModalEve: () => {
                                    ajax({
                                        url:ajaxurl.baseAction,
                                        data:{
                                            pk_org:formItemArr[0].value,
                                            pk_group:formItemArr[6].value,
                                            billcode:!!data && data['billcode'] || "",
                                            actionName:'rollbackCode'
                                        },
                                        success:(res)=>{
                                            let{success} = res;
                                            if(success){
                                                props.modal.close('oprGenerate');
                                            }
                                        }
                                    })

                                }
                            });

                        }
                    }
                })
            });
            break;
        case'btnCorrelation':
            //关联供应商
            let fmitems = props.form.getFormItemsValue(formId, ['isfreecust', 'custprop', 'dataoriginflag', 'pk_org']);
            if (fmitems[0].value === true) {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000074']});
                /* 国际化处理： 散户不能成为客商！*/
                return;
            }
            if (fmitems[1].value === '1') {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000075']});
                /* 国际化处理： 内部客户不能进行关联操作！*/
                return;
            }
            if (fmitems[2].value === '1') {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000076']});
                /* 国际化处理： 上级下发的客户不能进行关联操作！*/
                return;
            }
            meta = props.meta.getMeta()
            let pk_supplier_item = meta[props.config.associateSup]['items'].find(item => item['attrcode'] === 'pk_supplier');

            pk_supplier_item.queryCondition = () => {
                return {
                    pk_org: fmitems[3].value,
                    GridRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.CustRelationSupGridExtendRef'
                }
            }
            props.meta.setMeta(meta, () => {
                props.form.setAllFormValue({
                    [props.config.associateSup]: {
                        areacode: [props.config.associateSup],
                        rows: [{
                            values: {
                                "pk_customer": formItemArr[0],
                                "pk_org": formItemArr[1],
                                "code": formItemArr[3],
                                "name": formItemArr[2],
                                "pk_supplier": formItemArr[9]
                            }
                        }]
                    }
                });
                props.form.setFormStatus(props.config.associateSup, 'edit');
                props.modal.show('oprCorrelation', {
                    leftBtnName: this.state.json['10140CUST-000004'], /* 国际化处理： 确定*/
                    rightBtnName: this.state.json['10140CUST-000005'], /* 国际化处理： 取消*/
                    beSureBtnClick: () => {
                        let formData = props.form.getAllFormValue(props.config.associateSup);
                        ajax({
                            url: '/nccloud/uapbd/customer/associateSupplier.do',
                            data: {
                                gridModel: formData
                            },
                            success: (res) => {
                                let {success, data} = res;
                                if (success) {
                                    if (data) {
                                        if (data.hasOwnProperty('mesType') && data.mesType) {
                                            if (data.mesType === '1') {
                                                toast({
                                                    'color': 'warning',
                                                    'title': this.state.json['10140CUST-000187']
                                                });
                                                /*请选择要关联的供应商！*/

                                            } else if (data.mesType === '2') {
                                                confirmUtil.call(this, {
                                                    title: this.state.json['10140CUST-000025'], /* 国际化处理： 询问*/
                                                    content: this.state.json['10140CUST-000188'], /*解除客商关系可能会对业务数据产生影响，是否确定解除关系？*/
                                                    beSureBtnClick: () => {
                                                        //发送解除客户关系请求
                                                        ajax({
                                                            url: '/nccloud/uapbd/customer/releaseRelation.do',
                                                            data: {
                                                                pk: formData.rows[0].values.pk_customer.value
                                                            },
                                                            success: (res) => {
                                                                let {success, data} = res;
                                                                if (success) {
                                                                    toast({
                                                                        'color': 'success',
                                                                        'title': this.state.json['10140CUST-000077']/* 国际化处理： 解除客商关系成功！*/
                                                                    });
                                                                    props.modal.close('oprCorrelation');
                                                                    this.getdata(formItemArr[0].value);
                                                                }
                                                            }
                                                        });
                                                    },
                                                    cancelBtnClick: () => {
                                                        //关闭模态框
                                                        //props.modal.close('oprCorrelation');
                                                    }
                                                });
                                            } else if (data.mesType === '3') {
                                                confirmUtil.call(this, {
                                                    title: this.state.json['10140CUST-000025'], /* 国际化处理： 询问*/
                                                    content: data.message,
                                                    beSureBtnClick: () => {
                                                        //已有关联供应商，重新建立客商关系
                                                        ajax({
                                                            url: '/nccloud/uapbd/customer/rebuildRelation.do',
                                                            data: {
                                                                gridmodel: formData
                                                            },
                                                            success: (res) => {
                                                                let {success, data} = res;
                                                                if (success) {
                                                                    toast({
                                                                        'color': 'success',
                                                                        'title': this.state.json['10140CUST-000078']/* 国际化处理： 关联成功！*/
                                                                    });
                                                                    props.modal.close('oprCorrelation');
                                                                    this.getdata(formItemArr[0].value);
                                                                }
                                                            }
                                                        })

                                                    },
                                                    cancelBtnClick: () => {
                                                        //关闭模态框
                                                        //props.modal.close('oprCorrelation');
                                                    }
                                                })
                                            } else {
                                                toast({
                                                    'color': 'warning',
                                                    'title': data.message
                                                });
                                            }
                                        }
                                    } else {
                                        props.modal.close('oprCorrelation');
                                        toast({'color': 'success', 'title': this.state.json['10140CUST-000078']});
                                        /* 国际化处理： 关联成功！*/
                                        this.getdata(formItemArr[0].value);
                                    }
                                }
                            }
                        });

                    },
                    cancelBtnClick: () => {
                        //关闭模态框
                        props.modal.close('oprCorrelation');
                    },
                    closeModalEve: () => {
                        //关闭模态框
                        props.modal.close('oprCorrelation');
                    }
                });
            })
            break;
        case'btnBankAcc':
            //银行账户
            props.modal.show('custBankacc', {
                noFooter: true,
                title: this.state.json['10140CUST-000079'], /* 国际化处理： 客户银行账户*/
                size: 'lg',
                content: <CustBank {...this.props} {...{
                    'currentCustPk': formItemArr[0].value,
                    'currentCustName': formItemArr[2].value,
                    'currentOrg': this.state.currentOrg,
                    'json': this.state.json
                }}/>,
                closeModalEve:()=>{
                    //这段代码为了防止点击X就关闭模态框，因为关之前要先弹出提示
                    props.modal.show('custBankacc');
                    props.form.getFormStatus('accbasinfo')  !== 'browse' && confirmUtil.call(this,{
                        title: this.state.json['10140CUST-000081'], /* 国际化处理： 确认关闭*/
                        content: this.state.json['10140CUST-000082'], /* 国际化处理： 是否确认关闭？*/
                        beSureBtnClick: () => {
                            //  props.editTable.setStatus('custAddress', 'browse');
                            props.modal.close('custBankacc');
                        }
                    });
                    props.form.getFormStatus('accbasinfo') !== 'browse' || props.modal.close('custBankacc');
                }
            });
            break;
        case'btnAddress':
            //地址簿
            props.modal.show('custAddress', {
                content: <CustAddress {...props} {...{
                    currentOrg: this.state.currentOrg,
                    currentCustPk: formItemArr[0].value,
                    json: this.state.json,
                    pk_saleorg: '',
                    actionName: id
                }}/>,
                closeModalEve: () => {
                    //这段代码为了防止点击X就关闭模态框，因为关之前要先弹出提示
                    //如果不加会先关闭modal然后弹出提示
                    props.modal.show('custAddress');
                    props.editTable.getStatus('custAddress') !== 'browse' && confirmUtil.call(this,{
                        title: this.state.json['10140CUST-000081'], /* 国际化处理： 确认关闭*/
                        content: this.state.json['10140CUST-000082'], /* 国际化处理： 是否确认关闭？*/
                        beSureBtnClick: () => {
                            props.editTable.setStatus('custAddress', 'browse');
                            props.modal.close('custAddress');
                        }
                    });
                    props.editTable.getStatus('custAddress') !== 'browse' || props.modal.close('custAddress');
                }
            });
            break;
            case'btnRename':
            //地址簿
            props.modal.show('custRename', {
                content: <CustRename {...props} {...{
                    currentOrg: this.state.currentOrg,
                    currentCustPk: formItemArr[0].value,
                    json: this.state.json,
                    pk_saleorg: '',
                    actionName: id
                }}/>,
                closeModalEve: () => {
                    //这段代码为了防止点击X就关闭模态框，因为关之前要先弹出提示
                    //如果不加会先关闭modal然后弹出提示
                    props.modal.show('custRename');
                    props.editTable.getStatus('custrename') !== 'browse' && confirmUtil.call(this,{
                        title: this.state.json['10140CUST-000081'], /* 国际化处理： 确认关闭*/
                        content: this.state.json['10140CUST-000082'], /* 国际化处理： 是否确认关闭？*/
                        beSureBtnClick: () => {
                            props.editTable.setStatus('custrename', 'browse');
                            props.modal.close('custRename');
                        }
                    });
                    props.editTable.getStatus('custrename') !== 'browse' || props.modal.close('custRename');
                }
            });
            break;
        case'btnPrint':
        case'print':
            print(
                'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
                ajaxurl.printUrl,
                {
                    funcode: '10140CUB',      //功能节点编码，即模板编码
                    nodekey: 'basecard',    //模板节点标识
                    oids: [formItemArr[0].value],
                    appcode: '10140CUB'
                }
            );
            break;
        case'btnOutput':
            output({
                url: ajaxurl.printUrl,
                data: {
                    funcode: '10140CUB',      //功能节点编码，即模板编码
                    outputType: 'output',
                    nodekey: 'basecard',
                    oids: [formItemArr[0].value]
                }
            });
            break;
        case'btnAttachment':
            this.state.showUploader = true;
            this.setState(this.state);
            break;
        case'btnCheckApply':

            //申请单查询
            !!formItemArr[10].value && props.openTo('/uapbd/customer/custapply/main/#/card', {
                'id': formItemArr[10].value,
                'pagecode': '10140CUSTPF_custpfcard',
                'appcode': '10140CUSTPF',
                'status': 'browse',
                'showBtn': 'false'
            })
            !!formItemArr[10].value || toast({color: 'info', title: this.state.json['10140CUST-000083']});
            /* 国际化处理： 该客户不是申请生成，没有申请单！*/
            break;
        case'btnSaveTmp':
            this.importTempletDlg.show({
                title: 'saveTemp'
            });
            break;
        case'btnCustinfo':
            custBusinessPortraits.call(this,formItemArr[2].value);
            break;
        default:
            break;
    }
}

function enableFrozenToogle(props, id, btnflag, callback) {

    let formId = props.config.formId;
    let modalContent = btnflag === 'enablestate' ?
        id === 'btnDisable' ?
            {
                content: this.state.json['10140CUST-000084'],
                title: this.state.json['10140CUST-000085']
            } : {
                content: this.state.json['10140CUST-000086'],
                title: this.state.json['10140CUST-000087']
            } : /* 国际化处理： 确定停用,停用成功！,确定启用,启用成功！*/
        id === 'btnUnFreeze' ?
            {
                content: this.state.json['10140CUST-000088'],
                title: this.state.json['10140CUST-000089']
            } : {content: this.state.json['10140CUST-000090'], title: this.state.json['10140CUST-000091']};
    /* 国际化处理： 确定解冻,解冻成功！,确定冻结,冻结成功！*/
    confirmUtil.call(this, {
        title: modalContent.content,
        content: modalContent.content + this.state.json['10140CUST-000092'], /* 国际化处理： 所选数据？*/
        beSureBtnClick: () => {
            ajax({
                url: btnflag === 'enablestate' ?
                    '/nccloud/uapbd/customer/enableCust.do' :
                    '/nccloud/uapbd/customer/batchFreezeCust.do',
                data: {
                    pkcustList: [props.form.getFormItemsValue(formId, 'pk_customer').value],
                    actionName: id
                },
                success: (res) => {
                    let {success, data} = res;

                    if (success) {
                        toast({color: 'success', title: modalContent.title});
                        callback.call(this);
                    }
                }
            });
        }
    });
}




function beforeAddCopy(props, callback) {
    ajax({
        url: ajaxurl.baseAction,
        data: {
            actionName: 'beforeAddCopy'
        },
        success: (res) => {
            let {success, data} = res;
            if (success) {
                if (data && data.hasOwnProperty('message')) {
                    toast({color: 'warning', title: data.message});
                } else {
                    callback.call(this);
                }
            }
        }
    });
}

//Hm9gUKDDwtNjV7Mk8onAzr9DUo704BcJoJv5Znsjzx9f/s8HZNIhOCwchwqXz1DS