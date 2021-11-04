//4prg4SsHcHRCMh7vQKzFQQO2VCGfTHjJoLyw/sRhxG598jaoF23xoZnas6wrPP5R
import {ajax, base, toast, cardCache, print, output, printer,high, getBusinessInfo} from 'nc-lightapp-front';
const {PrintOutput}=high;
let {setDefData, getDefData} = cardCache;
import manageModePlugin from '../../../../../public/utils/ManageModeUtils';
import confirmUtil from '../../../../../public/pubComponent/confirmUtil/confirmUtil';
import BankaccuseModel from '../../../bankaccuse/index';

const ajaxurl = '/nccloud/uapbd/bankacc/baseActionCard.do';
const printUrl = '/nccloud/uapbd/bankacc/mainPrint.do';
export default function (props, key) {
    let {formId, gridId, datasource, NODE_TYPE, appcode, pagecode, controlorg} = props.config;
    let numberofrows = props.cardTable.getNumberOfRows(gridId);
    let checkedRows = numberofrows === 0 ? '' : props.cardTable.getCheckedRows(gridId);
    let formdata = props.form.getAllFormValue(formId);
    let formItemsValue = props.form.getFormItemsValue(formId, ['pk_org', 'pk_group', 'pk_bankaccbas', 'enablestate', 'accstate']);
    let editurl = '/card';
    //不需要走管控模式的按钮
    let noManageBtn = ['btnAdd', 'btnSave', 'btnSaveAdd', 'btnSubFreeze', 'subFreeze',
        'subUnFreeze', 'btnCancel', 'btnSubAdd', 'btnRefrensh',
        'btnPrint', 'print', 'outPut', 'btnUpgrade', 'btnCopy'];
    if (!noManageBtn.includes(key)) {
        //如果是资金的单据则不需要走管控校验
        if (!(!!props.getUrlParam('vbilltype') && props.getUrlParam('vbilltype') == 'opentrasact' )
            || !(!!props.getUrlParam('reqfrom') && props.getUrlParam('reqfrom') == 'tam' )) {
            let rem = manageModePlugin.call(this,NODE_TYPE, formItemsValue[0].value, formItemsValue[1].value, getDefData('PermissionOrgIDs', datasource), getBusinessInfo().groupId);
            if (!rem.editFlag) {
                toast({
                    color: 'warning',
                    content: rem.message
                });
                return;
            }
        }
    }
    switch (key) {
        case 'btnAdd':
            // 卡片态新增前保存id到缓存中
            let id = props.getUrlParam('id');
            setDefData('id', datasource, id);
            props.setUrlParam({
                'status': 'add',
                'appcode': appcode,
                'id': id
            });
            this.buttonToggleShow(props);
            this.setDefaultValue();
            break;
        case 'btnEdit':
            !!formItemsValue[2].value && ajax({
                url: ajaxurl,
                data: {
                    pk_bankaccbas: [formItemsValue[2].value],
                    NODE_TYPE: NODE_TYPE,
                    pagecode: pagecode,
                    actionName: key
                },
                success: (res) => {
                    let {success, data} = res;
                    if (success) {
                        if (data && data.message) {
                            //内部账号不能修改
                            toast({color: 'warning', title: data.message});
                        } else {
                            //账号字段添加正则校验
                            let meta = props.meta.getMeta();
                            meta[formId].items.map((item)=>{
                                if (item.attrcode == 'accnum') {
                                    item.reg = new RegExp('^[A-Za-z0-9@\\-_￥$]+$');
                                    item.errorMessage = this.state.json['10140BANKACC-000023'];
                                    props.form.setFormItemsValue(formId,item);
                                }
                            });

                            props.setUrlParam({
                                status: 'edit',
                                id: formItemsValue[2].value,
                                'appcode': appcode
                            });
                            props.form.setFormItemsDisabled(formId, {
                                'accnum': formItemsValue[3].value !== '1',
                                'enablestate': true,
                                'pk_org': !!!(props.getUrlParam('status') === 'add' && NODE_TYPE === 'ORG_NODE'),
                                'issigned':true
                            });
                            this.buttonToggleShow(props);
                        }
                    }
                }
            });
            break;
        case 'btnDel':
            debugger;
            formItemsValue[4].value === '3' && toast({
                color: 'warning',
                content: this.state.json['10140BANKACC-000028']/* 国际化处理： 已经销户的账户不允许删除！*/
            });
            !!formItemsValue[2].value && formItemsValue[4].value !== '3' && confirmUtil.call(this,{
                title: this.state.json['10140BANKACC-000097'], /* 国际化处理： 询问*/
                content: this.state.json['10140BANKACC-000030'], /* 国际化处理： 是否确认删除？*/
                beSureBtnClick: () => {
                    confirmUtil.call(this,{
                        title: this.state.json['10140BANKACC-000097'], /* 国际化处理： 询问*/
                        content: this.state.json['10140BANKACC-000031'], /* 国际化处理： 删除时要做业务引用校验，可能等待时间较长，是否确认删除？*/
                        beSureBtnClick: () => {
                            ajax({
                                url: ajaxurl,
                                data: {
                                    pk_bankaccbas: [formItemsValue[2].value],
                                    actionName: key
                                },
                                success: (res) => {
                                    let {success, data} = res;
                                    if (success) {
                                        if (data && data.hasOwnProperty('message') && data.message) {
                                            toast({color: 'warning', title: data.message});
                                        } else {
                                            toast({
                                                color: 'success',
                                                title: this.state.json['10140BANKACC-000032']
                                            });
                                            /* 国际化处理： 删除成功！*/
                                            //删除成功 跳到下一条数据
                                            //获取下一个pk
                                            let nextpk  = props.cardPagination.getNextCardPaginationId({id:formItemsValue[2].value,status:3});
                                            //设置删除了的pkstatus为3
                                            props.cardPagination.setCardPaginationId({id:formItemsValue[2].value,status:3});
                                            props.setUrlParam({id:nextpk});
                                            this.getdata(nextpk);
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
            break;
        case 'btnSave':
            debugger;
            cardSaveorSaveAdd.call(this, props, key, editurl, this.showEnablestateBtn.bind(this, props,'btnsave'));
            let CardData2 = props.createMasterChildData(pagecode, formId, gridId);
            let enablestate2 = CardData2['head']['bankaccount']['rows'][0]['values']['enablestate'];
            let issigned2 = CardData2['head']['bankaccount']['rows'][0]['values']['issigned'];
            if(enablestate2.value=="1" && issigned2.value==true){
            props.openTo("/zjcmp_cd/cd/96h10119/main/index.html#/card", {
                status: "add",
                srcFunCode:'96H10119',
                appcode: '96H10119',
                pagecode: '96H10119_CARD'
            });
                return;
            }
        break;
        case 'btnSaveAdd':
            cardSaveorSaveAdd.call(this, props, key, editurl, this.setDefaultValue.bind(this));
            break;
        case 'btnCancel':
            debugger;
            confirmUtil.call(this,{
                title: this.state.json['10140BANKACC-000015'], /* 国际化处理： 询问？*/
                content: this.state.json['10140BANKACC-000033'], /* 国际化处理： 是否确定取消？*/
                beSureBtnClick: () => {
                    //资金卡户管理opento参数
                    let vbilltype = props.getUrlParam('vbilltype');
                    //如果是资金开户管理点击取消
                    if (vbilltype !=  undefined && vbilltype === 'opentrasact' &&
                        props.getUrlParam('copyFlag') !== 'copy') {
                        props.form.EmptyAllFormValue(formId);
                        props.form.setFormStatus(formId, 'browse');
                        props.cardTable.setTableData(gridId, {rows: []});
                        props.button.setButtonVisible(
                            ['btnAdd', 'btnEdit', 'btnDel',
                                'btnEnableDisable', 'btnAssist',
                                'btnSubAccGrant', 'btnSubFreeze',
                                'btnPrint', 'btnSave', 'btnCancel', 'btnSaveAdd',
                                'btnSubAdd', 'btnSubDelete', 'btnCopy', 'btnRefrensh'], false);
                        //props.button.setButtonVisible([], true);
                        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                        this.setState(this.state);
                    } else {
                        //修改态取消
                        if (props.getUrlParam('status') === 'edit') {
                            //修改取消
                            props.form.cancel(formId);
                            props.cardTable.resetTableData(gridId);
                            props.setUrlParam({
                                status: 'browse',
                                id: formItemsValue[2].value,
                                appcode: appcode
                            });
                            this.buttonToggleShow(props);
                            //新增态取消
                        } else {
                            //复制取消
                            if (props.getUrlParam('copyFlag') === 'copy') {
                                ajax({
                                    url: ajaxurl,
                                    data: {
                                        pk_bankaccbas: [props.getUrlParam('id')],
                                        NODE_TYPE: NODE_TYPE,
                                        pagecode: pagecode,
                                        actionName: key,
                                        billcode: props.form.getFormItemsValue(formId, 'code').value,
                                        pk_org:props.form.getFormItemsValue(formId, 'pk_org').value,
                                        pk_group:props.form.getFormItemsValue(formId, 'pk_group').value,
                                        currentOrg:this.state.currentOrg
                                    },
                                    success: (res) => {
                                        let {success, data} = res;
                                        if (success) {
                                            props.setUrlParam({
                                                status: 'browse',
                                                id: props.getUrlParam('id'),
                                                appcode: appcode
                                            });

                                            this.getdata(props.getUrlParam('id'), () => {
                                                this.buttonToggleShow(props);
                                            });
                                        }
                                    }
                                });
                            } else {
                                //新增取消
                                ajax({
                                    url: ajaxurl,
                                    data: {
                                        pk_bankaccbas: [getDefData('id', datasource)],
                                        NODE_TYPE: NODE_TYPE,
                                        pagecode: pagecode,
                                        actionName: key,
                                        billcode: props.form.getFormItemsValue(formId, 'code').value,
                                        pk_org:props.form.getFormItemsValue(formId, 'pk_org').value,
                                        pk_group:props.form.getFormItemsValue(formId, 'pk_group').value,
                                        currentOrg:this.state.currentOrg
                                    },
                                    success: (res) => {
                                        let {success, data} = res;
                                        if (success) {
                                            if (!!props.getUrlParam('id')) {
                                                props.setUrlParam({
                                                    status: 'browse',
                                                    id: props.getUrlParam('id'),
                                                    'appcode': appcode
                                                });
                                                this.getdata(props.getUrlParam('id'), () => {
                                                    this.buttonToggleShow(props);
                                                });
                                            } else {
                                                props.setUrlParam({
                                                    status: 'browse',
                                                    id: getDefData('id', datasource),
                                                    'appcode': appcode
                                                });
                                                props.form.EmptyAllFormValue(formId);
                                                props.cardTable.setTableData(gridId, {rows: []});
                                                this.buttonToggleShow(props, 'btncancel');
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                },
                cancelBtnClick: () => {
                    return;
                }
            });
            break;
        case 'btnSubAdd':
            props.cardTable.addRow(gridId, undefined, {
                'acctype': {value: '0', display: this.state.json['10140BANKACC-000034']}, /* 国际化处理： 活期*/
                'fronzenstate': {value: '0', display: this.state.json['10140BANKACC-000035']}, /* 国际化处理： 正常*/
                'overdraftmny': {value: 0, display: ''},
                'overdrafttype': {value: '1', display: this.state.json['10140BANKACC-000036']}, /* 国际化处理： 提示*/
                'payarea': {value: '0', display: this.state.json['10140BANKACC-000037']}
            });
            /* 国际化处理： 不限制*/
            break;
        case 'btnSubDelete':
            let cardtablerows = props.cardTable.getCheckedRows(gridId);
            if (cardtablerows.length === 0) {
                toast({color: 'warning', title: this.state.json['10140BANKACC-000006']});
                /* 国际化处理： 请选择数据操作！*/
                return;
            } else {
                let indexarr = [];
                cardtablerows.map((e) => {
                    indexarr.push(e.index);
                });
                props.cardTable.delRowsByIndex(gridId, indexarr);
                props.button.setButtonDisabled(['btnSubDelete'],true);
            }
            break;
        case 'btnRefrensh':
            !!formItemsValue[2].value && this.getdata(formItemsValue[2].value, () => {
                toast({
                    color: 'success',
                    title: this.state.json['10140BANKACC-000038']/* 国际化处理： 刷新成功！*/
                })
            });
            break;
        case 'btnCopy':
            debugger;
            setDefData('id',props.config.datasource,formItemsValue[2].value);
            props.setUrlParam({
                status:'add',
                id:formItemsValue[2].value,
                copyFlag:'copy',
                appcode:props.config.appcode
            });
            this.getCopydata.call(this,this.buttonToggleShow.bind(this,props));
            break;
        case'btnEnableDisable':
        case'btnEnable':
        debugger;
        // let CardData = props.createMasterChildData(pagecode, formId, gridId);
        // let enablestate = CardData['head']['bankaccount']['rows'][0]['values']['enablestate'];
        // let issigned = CardData['head']['bankaccount']['rows'][0]['values']['issigned'];
        // if(enablestate.value=="1" && issigned.value==true){
        //     props.openTo("/zjcmp_cd/cd/96h10119/main/index.html#/card", {
        //         status: "add",
        //         srcFunCode:'96H10119',
        //         appcode: '96H10119',
        //         pagecode: '96H10119_CARD'
        //     });
            
        //     return;
        // }
            formItemsValue[3].value === '2' || enableDisableSwitch.call(this, props, key, () => {
                this.getdata(formItemsValue[2].value);
            });
            formItemsValue[3].value === '2' && toast({
                color: 'warning',
                title: this.state.json['10140BANKACC-000039']/* 国际化处理： 已经启用的数据，无法启用！*/
            });
            break;
        case'btnDisable':
            formItemsValue[3].value === '3' || enableDisableSwitch.call(this, props, key, () => {
                this.getdata(formItemsValue[2].value);
            });
            formItemsValue[3].value === '3' && toast({
                color: 'warning',
                title: this.state.json['10140BANKACC-000040']/* 国际化处理： 已经停用的数据，无法停用！*/
            });
            break;
        case'btnAdjustOrg':
            props.form.setFormStatus(controlorg, 'add');
            props.form.EmptyAllFormValue(controlorg);
            props.modal.show('adjustForm', {
                beSureBtnClick: () => {
                    //获取选中组织
                    let controlorgvalue = props.form.getFormItemsValue(controlorg, 'controlorg');
                    if (!controlorgvalue.value) {
                        toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000041']});
                        /* 国际化处理： 请选择核算归属组织！*/
                        return;
                    }
                    confirmUtil.call(this,{
                        'title': this.state.json['10140BANKACC-000029'], /* 国际化处理： 询问*/
                        'content': this.state.json['10140BANKACC-000042'], /* 国际化处理： 是否同时停用修改前核算归属组织的使用权？*/
                        beSureBtnClick: () => {
                            ajax({
                                url: ajaxurl,
                                data: {
                                    'pk_bankaccbas': [formItemsValue[2].value],
                                    'newOrg': controlorgvalue.value,
                                    'pagecode': pagecode,
                                    'enableswitch': true,
                                    'actionName': key

                                },
                                success: (res) => {
                                    let {success, data} = res;
                                    if (success) {
                                        if (data) {
                                            if(data.hasOwnProperty('message')){
                                                toast({
                                                    'color': 'warning',
                                                    'title': this.state.json['10140BANKACC-000091']
                                                });
                                            }else{
                                                if (data.hasOwnProperty('head') && data.head && data.head[formId]) {
                                                    props.form.setAllFormValue({[formId]: data.head[formId]});
                                                }
                                                if (data.hasOwnProperty('body') && data.body && data.body[gridId]) {
                                                    props.cardTable.setTableData(gridId, data.body[gridId])
                                                }
                                                toast({
                                                    'color': 'success',
                                                    'title': this.state.json['10140BANKACC-000001']
                                                });
                                                /* 国际化处理： 操作成功！*/
                                                //返回成功关闭模态框
                                                props.modal.close('adjustForm');
                                            }
                                        }
                                    }

                                }
                            });
                        },
                        cancelBtnClick: () => {
                            ajax({
                                url: ajaxurl,
                                data: {
                                    'pk_bankaccbas': [formItemsValue[2].value],
                                    'newOrg': controlorgvalue.value,
                                    'enableswitch': false,
                                    'pagecode': pagecode,
                                    'actionName': key
                                },
                                success: (res) => {
                                    let {success, data} = res;
                                    if (success) {
                                        if (data) {
                                            if (data.hasOwnProperty('head') && data.head && data.head[formId]) {
                                                props.form.setAllFormValue({[formId]: data.head[formId]});
                                            }
                                            if (data.hasOwnProperty('body') && data.body && data.body[gridId]) {
                                                props.cardTable.setTableData(gridId, data.body[gridId])
                                            }
                                            toast({
                                                'color': 'success',
                                                'title': this.state.json['10140BANKACC-000001']
                                            });
                                            /* 国际化处理： 操作成功！*/
                                            //返回成功关闭模态框
                                            props.modal.close('adjustForm');
                                        }


                                    }
                                }
                            });

                        },
                        'leftBtnName': this.state.json['10140BANKACC-000043'], /* 国际化处理： 是*/
                        'rightBtnName': this.state.json['10140BANKACC-000018'], /* 国际化处理： 否*/

                    });
                },
                cancelBtnClick: () => {
                    props.modal.close('adjustForm');
                }
            });
            break;
        case'btnCancelAcc':
            //销户
            confirmUtil.call(this,{
                title: this.state.json['10140BANKACC-000029'], /* 国际化处理： 询问*/
                content: this.state.json['10140BANKACC-000044'], /* 国际化处理： 是否确认销户？*/
                beSureBtnClick: () => {
                    confirmUtil.call(this,{
                        'content': this.state.json['10140BANKACC-000045'], /* 国际化处理： 银行账户销户为不可逆行操作，是否确认销户？*/
                        'title': this.state.json['10140BANKACC-000029'], /* 国际化处理： 询问*/
                        beSureBtnClick: () => {
                            ajax({
                                url: ajaxurl,
                                data: {
                                    pk_bankaccbas: [formItemsValue[2].value],
                                    actionName: key,
                                    pagecode: pagecode
                                },
                                success: (res) => {
                                    let {success, data} = res
                                    if (success) {
                                        if (data && data.hasOwnProperty('message') && data.message) {
                                            toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000090']});
                                        } else {
                                            if (data.hasOwnProperty('head') && data.head && data.head[formId]) {
                                                props.form.setAllFormValue({[formId]: data.head[formId]});
                                            }
                                            if (data.hasOwnProperty('body') && data.body && data.body[gridId]) {
                                                props.cardTable.setTableData(gridId, data.body[gridId])
                                            }
                                            this.showEnablestateBtn.call(this, props);
											 props.button.setButtonDisabled(['btnEdit','btnDel','btnSubAccGrant'],true);
                                            toast({
                                                'color': 'success',
                                                'title': this.state.json['10140BANKACC-000046']
                                            });
                                            /* 国际化处理： 操作成功!*/
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
            break;
        case'btnUpgrade':
            confirmUtil.call(this,{
                title: this.state.json['10140BANKACC-000015'], /* 国际化处理： 询问？*/
                content: this.state.json['10140BANKACC-000062'], /* 国际化处理： 是否确认升级？*/
                size: 'lg',
                beSureBtnClick: () => {
                    ajax({
                        url: ajaxurl,
                        data: {
                            pk_bankaccbas: [formItemsValue[2].value],
                            actionName: key
                        },
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                if (data && data.message) {
                                    if(data.message == '000092'){
                                        toast({color: 'warning', title: this.state.json['10140BANKACC-000092']});
                                    }else{
                                        toast({color: 'warning', title: this.state.json['10140BANKACC-000093']});
                                    }
                                } else {
                                    this.getdata(formItemsValue[2].value, () => {
                                        toast({
                                            color: 'success',
                                            title: this.state.json['10140BANKACC-000063']/* 国际化处理： 升级成功！*/
                                        })
                                    });
                                }
                            }
                        }
                    });
                }
            });
            break;
        case'btnSubAccGrant':
        case'subAccGrant':
            if (formdata.rows[0].values.accstate.value === '3') {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000047']});
                /* 国际化处理： 已经销户的账户无法授权！*/
                return;
            }
            if (checkedRows.length === 0) {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000048']});
                /* 国际化处理： 请您选择一条子户账户操作！*/
                return;
            }
            ajax({
                url: '/nccloud/uapbd/bankacc/queryBankType.do',
                data: {
                    pk_list: [formdata.rows[0].values.pk_banktype.value]
                },
                success: (res) => {
                    let {success, data} = res;

                    if (success) {
                        if (data && data.hasOwnProperty('message')) {
                            toast({'color': 'warning', 'title': data.message});
                            return;
                        } else {
                            this.accountGrantModal.show(true, false);
                        }
                    }
                }
            });
            break;
        case'subAcc':
            if (formdata.rows[0].values.accstate.value === '3') {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000047']});
                /* 国际化处理： 已经销户的账户无法授权！*/
                return;
            }
            if (checkedRows.length === 0) {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000048']});
                /* 国际化处理： 请您选择一条子户账户操作！*/
                return;
            }
            props.button.setButtonVisible(['modalSave', 'modalCancel'], false);
            props.modal.show('checkOrg', {
                'title': this.state.json['10140BANKACC-000049'], /* 国际化处理： 银行账户使用权*/
                'content': <BankaccuseModel {...this.props} {
                    ...{
                        currentPkbankaccbas: formItemsValue[2].value,
                        currentPkbankaccsub: checkedRows[0].data.values.pk_bankaccsub.value,
                        json: this.state.json
                    }}/>,
                'size': 'lg',
                'noFooter': true
            });
            break;
        case'subAccUngrant':
            if (formdata.rows[0].values.accstate.value === '3') {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000050']});
                /* 国际化处理： 已经销户的账户无法取消授权！*/
                return;
            }
            if (checkedRows.length === 0) {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000048']});
                /* 国际化处理： 请您选择一条子户账户操作！*/
                return;
            }
            //如果是内部账户
            ajax({
                url: '/nccloud/uapbd/bankacc/queryBankType.do',
                data: {
                    pk_list: [formdata.rows[0].values.pk_banktype.value]
                },
                success: (res) => {
                    let {success, data} = res;

                    if (success) {
                        if (data && data.hasOwnProperty('message')) {
                            toast({'color': 'warning', 'title': data.message});
                            return;
                        } else {
                            this.accountGrantModal.show(false, false);
                        }
                    }
                }
            });

            break;
        case'btnSubFreeze':
        case'subFreeze':
            if (checkedRows.length === 0) {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000051']});
                /* 国际化处理： 请您选择要冻结的子户*/
                return;
            }
            //销户不能冻结 0 正常 1冻结 2部分冻结 3销户
            if (formdata.rows[0].values.accstate.value === '3') {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000052']});
                /* 国际化处理： 已经销户的账户无法冻结*/
                return;
            }
            //已经全部冻结不能冻结
            if (checkedRows[0].data.values.fronzenstate.value === '1') {
                toast({'color': 'warning', 'title': this.state.json['10140BANKACC-000053']});
                /* 国际化处理： 已经冻结的账户无法冻结！*/
                return;
            }
            props.modal.show('subFreezeForm', {
                beSureBtnClick: () => {
                    if (!this.state.selectedValue) {
                        toast({
                            'color': 'warning',
                            'title': this.state.json['10140BANKACC-000054']/* 国际化处理： 请选择冻结类型！*/
                        });
                        return;
                    }
                    if (this.state.selectedValue === 'part' && !this.state.inputValue) {
                        toast({
                            'color': 'warning',
                            'title': this.state.json['10140BANKACC-000055']/* 国际化处理： 请输入冻结金额！*/
                        })
                        return;
                    }
                    if (this.state.selectedValue === 'part' && checkedRows.find(i => i.data.values.acctype.value === '1')) {
                        toast({
                            color: 'warning',
                            title: this.state.json['10140BANKACC-000056']/* 国际化处理： 定期类型的账户不能部分冻结！*/
                        });
                        return;
                    }
                    ajax({
                        url: ajaxurl,
                        data: {
                            pk_bankaccbas: [formItemsValue[2].value],
                            pagecode: pagecode,
                            FreezeType: this.state.selectedValue,//冻结类型
                            Freezemny: this.state.inputValue,//冻结金额
                            pk_bankaccsub: [checkedRows[0].data.values.pk_bankaccsub.value],
                            actionName: 'btnSubFreeze'
                        },
                        success: (res) => {

                            let {success, data} = res;
                            if (success) {
                                if (data && data.hasOwnProperty('message') && data.message) {
                                    toast({'color': 'info', 'content': data.message});
                                } else {
                                    this.state.selectedValue = '';
                                    this.state.inputValue = '';
                                    this.setState(this.state);
                                    props.modal.close('subFreezeForm');
                                    toast({'color': 'success', 'content': this.state.json['10140BANKACC-000046']});
                                    /* 国际化处理： 操作成功!*/
                                    this.getdata(formItemsValue[2].value);
                                }
                            }
                        }
                    });
                },
                cancelBtnClick: () => {
                    this.state.selectedValue = '';
                    this.state.inputValue = '';
                    this.setState(this.state);
                    props.modal.close('subFreezeForm');
                }
            });
            break;
        case'subUnFreeze':
            if (checkedRows.length === 0) {
                toast({'color': 'info', 'content': this.state.json['10140BANKACC-000057']});
                /* 国际化处理： 请您选择要解冻的子户！*/
                return;
            }
            // 正常 和销户不能解冻 0 正常 1冻结 2部分冻结 3销户
            if (formdata.rows[0].values.accstate.value === '3') {
                toast({'color': 'info', 'content': this.state.json['10140BANKACC-000058']});
                /* 国际化处理： 已经销户的账户无法解冻！*/
                return;
            }
            //正常的账户不能解冻
            if (checkedRows[0].data.values.fronzenstate.value === '0') {
                toast({'color': 'info', 'content': this.state.json['10140BANKACC-000059']});
                /* 国际化处理： 没有冻结的子户无法解冻！*/
                return;
            }
            props.modal.show('subUnFreezeForm', {
                beSureBtnClick: () => {

                    if (!this.state.selectedValue) {
                        toast({
                            'color': 'info',
                            'content': this.state.json['10140BANKACC-000060']/* 国际化处理： 请选择解冻类型！*/
                        });
                        return;
                    }
                    if (this.state.selectedValue === 'part' && !this.state.inputValue) {
                        toast({
                            'color': 'info',
                            'content': this.state.json['10140BANKACC-000061']/* 国际化处理： 请输入解冻金额！*/
                        })
                        return;
                    }
                    ajax({
                        url: ajaxurl,
                        data: {
                            pk_bankaccbas: [formItemsValue[2].value],
                            pagecode: pagecode,
                            FreezeType: this.state.selectedValue,//冻结类型
                            Freezemny: this.state.inputValue,//冻结金额
                            pk_bankaccsub: [checkedRows[0].data.values.pk_bankaccsub.value],
                            actionName: key
                        },
                        success: (res) => {
                            let {success, data} = res;
                            if (success) {
                                if (data && data.hasOwnProperty('message') && data.message) {
                                    toast({'color': 'info', 'content': data.message});
                                } else {
                                    this.state.selectedValue = '';
                                    this.state.inputValue = '';
                                    this.setState(this.state);
                                    props.modal.close('subUnFreezeForm');
                                    toast({'color': 'success', 'content': this.state.json['10140BANKACC-000046']});
                                    /* 国际化处理： 操作成功!*/
                                    this.getdata(formItemsValue[2].value);
                                }
                            }

                        }
                    });
                },
                cancelBtnClick: () => {
                    this.state.selectedValue = '';
                    this.state.inputValue = '';
                    this.setState(this.state);
                    props.modal.close('subUnFreezeForm');
                }
            });
            break;
        case'btnPrint':
        case'print':
            print(
                'pdf',
                printUrl,
                {
                    funcode: '10140BACCG',
                    nodekey: props.config.nodekey,
                    oids: [formItemsValue[2].value],
                    appcode: '10140BACCG'

                }
            );
            break;
        case'output':
            this.printOutData([formItemsValue[2].value]);
            // debugger
            // output({
            //     url: printUrl,
            //     data: {
            //         funcode: props.config.appcode,
            //         nodekey: props.config.nodeKey,//功能节点编码，即模板编码
            //         oids: [formItemsValue[2].value],
            //         outputType: 'output'
            //     }
            // });
            break;
        //附件
        case 'AttachmentBtn':
            debugger;
            cardAttachment.call(this, props);
            break;

        default:
            break;
    }
}

//卡片附件
export function cardAttachment(props) {
    debugger;
    let {formId, gridId, pagecode, datasource, appcode} = props.config;
    let CardData = props.createMasterChildData(pagecode, formId, gridId);
    let billId = CardData['head']['bankaccount']['rows'][0]['values']['pk_bankaccbas'].value;
    let billNo = CardData['head']['bankaccount']['rows'][0]['values']['code'].value;
    this.setState({
        showUploader: !this.state.showUploader,
        billId:billId,
        billNo:billNo
    });
}

function enableDisableSwitch(props, id, callback) {
    let {NODE_TYPE, formId} = props.config;
    let formItemsValue = props.form.getFormItemsValue(formId, ['pk_bankaccbas']);
    let modalContent = id === 'btnDisable' ? {
        title: this.state.json['10140BANKACC-000064'],
        content: this.state.json['10140BANKACC-000065']
    } : {title: this.state.json['10140BANKACC-000066'], content: this.state.json['10140BANKACC-000067']};
    /* 国际化处理： 停用成功！,是否确认要停用？,启用成功！,是否确认要启用？*/
    let toastitle = id === 'btnDisable' ?this.state.json['10140BANKACC-000096'] : this.state.json['10140BANKACC-000095'];
    confirmUtil.call(this,{
        title: toastitle,
        content: modalContent.content,
        beSureBtnClick: () => {
            ajax({
                url: id === 'btnDisable' ? '/nccloud/uapbd/bankacc/batchDisable.do' : '/nccloud/uapbd/bankacc/batchEnable.do',
                data: [formItemsValue[0].value],
                success: (res) => {
                    let {success, data} = res;
                    if (success) {
                        if (data && data.hasOwnProperty('message') && data.message) {
                            toast({'color': 'info', 'content': data.message});
                        } else {
                            toast({'color': 'success', 'title': modalContent.title});
                        }
                        callback.call(this);
                    }

                }
            });
        }
    });
}

function cardSaveorSaveAdd(props, id, editurl, callback) {
    debugger;
    let {formId, gridId, pagecode, datasource, appcode} = props.config;
    let CardData = props.createMasterChildData(pagecode, formId, gridId);
    let accnum = CardData['head']['bankaccount']['rows'][0]['values']['accnum'];


    if(accnum && accnum.value){
        let reg = /^[A-Za-z0-9@\-_￥$]+$/;
        if(!accnum.value.match(reg)){
            props.form.setFormItemFocus(formId,'accnum');
            //toast({'color': 'danger', 'title': this.state.json['10140BANKACC-000023']});
            return;
        }
    }


    if (!props.form.isCheckNow(formId) || !props.cardTable.checkTableRequired(gridId))
        return;
    //添加url标识来分辨开户管理是开户保存还是修改保存
    let urlstatus = props.getUrlParam('status') || 'browse';
    props.validateToSave(CardData,()=>{
        ajax({
            url: '/nccloud/uapbd/bankacc/cardSave.do',
            data: {
                billcard: CardData,
                saveFlag: props.getUrlParam('vbilltype') === 'opentrasact' && urlstatus === 'add' ? 'specil' : 'normal'
            },
            success: (res) => {
                let pk_value = null
                if (res.success) {
                    if (res.data) {
                        if (id === 'btnSave' && res.data.head && res.data.head[formId]) {
                            props.form.setAllFormValue({[formId]: res.data.head[formId]});
                            pk_value = res.data.head[formId].rows[0].values['pk_bankaccbas'].value
                            setDefData('id', datasource, pk_value);
                            props.cardPagination.setCardPaginationId({id:pk_value,status:1});
                        }
                        if (id === 'btnSave' && res.data.body && res.data.body[gridId]) {
                            props.cardTable.setTableData(gridId, res.data.body[gridId])
                        }
                        toast({title: this.state.json['10140BANKACC-000068'], color: 'success'});/* 国际化处理： 保存成功*/
                        props.setUrlParam({
                            status: id === 'btnSave' ? 'browse' : 'add',
                            appcode: appcode,
                            id:res.data.head[formId]['rows'][0].values.pk_bankaccbas.value,
                            vbilltype : '',
                            reqfrom:''
                        });
                        this.buttonToggleShow(props);
                        callback.call(this);
                    }
                }
            }
        });
    },{[formId]:'form',[gridId]:'cardTable'},'card')
}

//4prg4SsHcHRCMh7vQKzFQQO2VCGfTHjJoLyw/sRhxG598jaoF23xoZnas6wrPP5R