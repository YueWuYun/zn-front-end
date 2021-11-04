//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/
import {ajax, base, toast, cardCache, getBusinessInfo} from 'nc-lightapp-front';

let {setDefData, getDefData} = cardCache;
import manageModePlugIn from '../../../../../public/utils/ManageModeUtils';
import CustBank from '../../../custBank/main/index';
import CustAddress from "../../../custAddress/index";
import CustRename from "../../../custRename/index";
import confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
import custBusinessPortraits  from '../../../commonFunc/CustBusinessPortraits';

const ajaxurl = {
    'baseAction': '/nccloud/uapbd/customer/baseAction.do'
}
export default function (record, index, props, key) {
    let meta;
    let {appcode, NODE_TYPE, pushCardUrl} = props.config;
    let {PermissionOrgIDs} = this.state.context;
    //操作不需要管控模式的按钮
    let manageModeBtns = [];
    if (!manageModeBtns.includes(key)) {
        let pk_org = record.pk_org.value;
        let pk_group = record.pk_group.value;
        let rem = manageModePlugIn.call(this, NODE_TYPE, pk_org, pk_group, PermissionOrgIDs, getBusinessInfo().groupId);
        if (!rem.editFlag) {
            toast({
                'color': 'warning',
                'content': rem.message
            });
            return;
        }
    }
    setDefData('id', this.config.datasource, record.pk_customer.value);
    switch (key) {
        // 表格操作按钮
        case 'oprEdit':
            ajax({
                url: ajaxurl.baseAction,
                data: {
                    pk_customer: record.pk_customer.value,
                    actionName: key
                },
                success: (res) => {
                    let {success, data} = res;
                    success && props.pushTo(pushCardUrl, {
                        'status': 'edit',
                        'id': record.pk_customer.value,
                        pagecode:props.config.pagecodecard,
                        'appcode': appcode
                    });
                }
            });
            break;
        case 'oprDelete':
            if (!!record.pk_supplier.value && record.issupplier.value) {
                toast({content: this.state.json['10140CUST-000185'], color: 'warning'});
                return;
            } else {
                this.setState({
                    deleteRecord: [{
                        index: index,
                        data: {values: record}
                    }]
                }, () => {
                    this.DeleteDialog.showDialog();
                });
            }
            break;
        case 'oprCopy':
            this.beforeAddCopy(props, () => {
                setDefData('id', this.config.datasource, record['pk_customer'].value);
                props.pushTo(pushCardUrl, {
                    status: 'add',
                    id: record.pk_customer.value,
                    copyFlag: 'copy',
                    pagecode:props.config.pagecodecard,
                    'appcode': appcode
                });
            });
            break;
        case 'oprAcc':
            //客户银行账户模态框加载列表
            props.modal.show('custBankacc', {
                noFooter: true,
                title: this.state.json['10140CUST-000079'], /* 国际化处理： 客户银行账户*/
                size: 'lg',
                content: <CustBank {...this.props} {...{
                    'currentCustPk': record.pk_customer.value,
                    'currentCustName': record.name.value,
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
        case 'oprAddress':
            //地址簿
            props.modal.show('custAddress', {
                noFooter: true,
                title: this.state.json['10140CUST-000080'], /* 国际化处理： 客户收货地址*/
                size: 'lg',
                content: <CustAddress {...props} {...{
                    currentOrg: this.state.currentOrg,
                    currentCustPk: record.pk_customer.value,
                    json: this.state.json,
                    pk_saleorg: '',
                    actionName: 'oprAddress'
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
        case 'oprRename':
            //客户更名
            props.modal.show('custRename', {
                noFooter: true,
                title: this.state.json['10140CUST-0010001'], /* 国际化处理： 客户收货地址*/
                size: 'lg',
                content: <CustRename {...props} {...{
                    currentOrg: this.state.currentOrg,
                    currentCustPk: record.pk_customer.value,
                    json: this.state.json,
                    pk_saleorg: '',
                    actionName: 'oprRename'
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
        case'oprUnfreeze':
            !record.frozenflag.value || disAbleFreeze.call(this, 'freeze', props, record, key, () => {
                this.loadGridData(this.getLoadParmData(props));
            });
            !record.frozenflag.value && toast({
                color: 'warning',
                title: this.state.json['10140CUST-000070']/* 国际化处理： 没有冻结的数据，无法解冻！*/
            });
            break;
        case 'oprFreeze':
            record.frozenflag.value || disAbleFreeze.call(this, 'freeze', props, record, key, () => {
                this.loadGridData(this.getLoadParmData(props));
            });
            record.frozenflag.value && toast({
                color: 'warning',
                title: this.state.json['10140CUST-000069']/* 国际化处理： 已经冻结的数据，无法冻结！*/
            });
            break;

        case'oprEnable':
            record.enablestate.value === '2' || disAbleFreeze.call(this, 'disable', props, record, key, () => {
                this.loadGridData(this.getLoadParmData(props));
            });
            record.enablestate.value === '2' && toast({
                color: 'warning',
                title: this.state.json['10140CUST-000067']/* 国际化处理： 已经启用的数据，无法启用！*/
            });
            break;
        case'oprDisable':
            record.enablestate.value === '3' || disAbleFreeze.call(this, 'disable', props, record, key, () => {
                this.loadGridData(this.getLoadParmData(props));
            });
            record.enablestate.value === '3' && toast({
                color: 'warning',
                title: this.state.json['10140CUST-000068']/* 国际化处理： 已经停用的数据，无法停用！*/
            });
            break;
        case 'oprGenerate':
            //生成供应商
            //散户不能成为客商
            if (record.isfreecust.value === true) {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000071']});
                /* 国际化处理： 散户不能为客商！*/
                return;
            }
            if (record.issupplier.value === true) {
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
                            'GLOBLE00000000000000' : props.config.NODE_TYPE === 'ORG_NODE' ? record.pk_org.value : '',
                    }
                }
            }
            props.meta.setMeta(meta, () => {
                ajax({
                    url: ajaxurl.baseAction,
                    data: {
                        actionName: key,
                        pk_org: record.pk_org.value,
                        pk_customer: record.pk_customer.value
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
                                            "pk_org": record.pk_org,
                                            "code": !!data && !!data['billcode'] ? {
                                                value: data['billcode'],
                                                display: data['billcode']
                                            } : record.code,
                                            "name": record.name,
                                            "ename": record.ename,
                                            "shortname": record.shortname,
                                            "pk_supplierclass": {
                                                value: '',
                                                display: ''
                                            },
                                            'pk_supplier': record.pk_supplier,
                                            'iscustomer': {
                                                value: true
                                            },
                                            "pk_areacl": record.pk_areacl,
                                            'taxpayerid': record.taxpayerid,
                                            'mnecode': record.mnecode
                                        }
                                    }]
                                }
                            });
                            props.form.setFormItemsDisabled(props.config.createSupplier, {'code': !!data && data['isEdit'] === 'diseditable'});
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
                                            userjson: record.pk_customer.value,
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
                                                    this.loadGridData(this.getLoadParmData(props));
                                                }
                                            }
                                        }
                                    });
                                },
                                cancelBtnClick: () => {

                                    ajax({
                                        url:ajaxurl.baseAction,
                                        data:{
                                            pk_org:record.pk_org.value,
                                            pk_group:record.pk_group.value,
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
                                            pk_org:record.pk_org.value,
                                            pk_group:record.pk_group.value,
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
                });
            });
            break;
        case 'oprCorrelation':
            //关联供应商
            if (record.isfreecust.value === true) {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000074']});
                /* 国际化处理： 散户不能成为客商！*/
                return;
            }
            if (record.custprop.value === '1') {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000075']});
                /* 国际化处理： 内部客户不能进行关联操作！*/
                return;
            }
            if (record.dataoriginflag.value === '1') {
                toast({'color': 'warning', 'title': this.state.json['10140CUST-000076']});
                /* 国际化处理： 上级下发的客户不能进行关联操作！*/
                return;
            }
            props.form.setFormStatus(props.config.associateSup, 'edit');
            props.form.setAllFormValue({
                [props.config.associateSup]: {
                    areacode: [props.config.associateSup],
                    rows: [{
                        values: {
                            "pk_customer": record.pk_customer,
                            "pk_org": record.pk_org,
                            "code": record.code,
                            "name": record.name,
                            "pk_supplier": record.pk_supplier
                        }
                    }]
                }
            });
            meta = props.meta.getMeta()
            let pk_supplier_item =
                meta[props.config.associateSup]
                    ['items'].find(item => item['attrcode'] === 'pk_supplier');
            pk_supplier_item.queryCondition = () => {
                return {
                    pk_org: record.pk_org.value,
                    GridRefActionExt: 'nccloud.web.uapbd.customer.baseinfo.extendRef.CustRelationSupGridExtendRef'
                }
            }
            props.meta.setMeta(meta, () => {
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
                                        if (data.hasOwnProperty('mesType') && data.hasOwnProperty('message')) {
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
                                                                    this.loadGridData(this.getLoadParmData(props));
                                                                    toast({
                                                                        'color': 'success',
                                                                        'title': this.state.json['10140CUST-000077']/* 国际化处理： 解除客商关系成功！*/
                                                                    });
                                                                    props.modal.close('oprCorrelation');
                                                                    this.loadGridData(this.getLoadParmData(props));
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
                                                                    this.loadGridData(this.getLoadParmData(props));
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
                                        this.loadGridData(this.getLoadParmData(props));
                                    }
                                }
                            }
                        });

                    },
                    cancelBtnClick: () => {
                        props.modal.close('oprCorrelation');
                    },
                    closeModalEve: () => {
                        props.modal.close('oprCorrelation');
                    }
                });
            });
            break;
        case 'oprCheckApply':
            //申请单查询
            !!record.pk_customerpf.value && props.openTo('/uapbd/customer/custapply/main/#/card', {
                'appcode': '10140CUSTPF',
                'pagecode': '10140CUSTPF_custpfcard',
                'id': record.pk_customerpf.value,
                'status': 'browse',
                'showBtn': 'false'
            })
            !!record.pk_customerpf.value || toast({color: 'warning', title: this.state.json['10140CUST-000083']});
            /* 国际化处理： 该客户不是申请生成，没有申请单！*/
            break;
        case 'oprAttachment':
            //附件管理
            this.state.showUploader = true;
            this.setState(this.state);
            break;
        case'oprCustinfo':
            custBusinessPortraits.call(this,record.name.value);
            break;
        default:
            console.log(key, index);
            break;
    }
}

function disAbleFreeze(btnFlag, props, record, key, callback) {
    //冻结/解冻
    let modalContent = btnFlag === 'freeze' ?
        key === 'oprFreeze' ?
            this.state.json['10140CUST-000090'] : this.state.json['10140CUST-000088'] : /* 国际化处理： 确定冻结,确定解冻*/
        key === 'oprEnable' ?
            this.state.json['10140CUST-000086'] : this.state.json['10140CUST-000084'];
    /* 国际化处理： 确定启用,确定停用*/
    confirmUtil.call(this, {
        title: this.state.json['10140CUST-000025'], /* 国际化处理： 询问*/
        content: modalContent + this.state.json['10140CUST-000092'], /* 国际化处理： 所选数据？*/
        beSureBtnClick: () => {
            ajax({
                url: ajaxurl.baseAction,
                data: {
                    pk_customer: record.pk_customer.value,
                    actionName: key
                },
                success: (res) => {
                    let {success, data} = res;
                    if (success) {
                        toast({color: 'success', title: this.state.json['10140CUST-000046']});
                        /* 国际化处理： 操作成功！*/
                        callback.call(this);
                    }
                }
            });

        }
    });
}


//th5dUYlCtRcSwcP0dc6xh54/6jI/CTRN4kAYLVg1EqKEcNw43Ht5fJ0FvDE7JJn/