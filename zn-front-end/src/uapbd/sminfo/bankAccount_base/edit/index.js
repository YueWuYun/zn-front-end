//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, {Component} from 'react';
import {ajax, base, toast,high, cardCache,getBusinessInfo,createPageIcon} from 'nc-lightapp-front';
const {PrintOutput,NCUploader}=high;
let {getDefData, setDefData} = cardCache;
const {NCAffix, NCFormControl, NCRadio, NCBackBtn,NCDiv} = base;
import {
    headBtnClick, oprButtonClick,
    formAfterEvents, modalafterEvent, cardBodyAfterEdit,
    cardBodyBeforeEdit, formBeforeEvents, cardTableOnSelected,
    cardTableOnSelectedAll, pageInfoClick
} from './events'
import AccountGrantModal from '../AccountGrant/AccountGrantModal';
import './index.less'
import manageModePlugIn from "../../../public/utils/ManageModeUtils";
import Utils from '../../../public/utils';
const queryCardUrl = '/nccloud/uapbd/bankacc/queryCardData.do';   //卡片查询url
const ajaxurl = '/nccloud/uapbd/bankacc/baseActionCard.do'
const printUrl = '/nccloud/uapbd/bankacc/mainPrint.do';
class BankAccountCardBase extends Component {
    constructor(props) {
        super(props);
        this.config = props.config;
        this.config.appcode = props.getSearchParam('c');
        this.modifierMeta = this.modifierMeta.bind(this);
        this.buttonToggleShow = this.buttonToggleShow.bind(this);
        let status = this.props.getUrlParam('status') || 'browse';
        this.state = {
			accstate:'3',
            loadLang: false,
            pk_org: '',
            totalcount: 0,
            applycount: 0,
            selectedValue: '',
            inputValue: 0,
            currentOrg: '',
            context: {},
            pageFlag: props.config.pageFlag,
            netbankinftp: '',
            pageStatus: status,
            json: {},
            x: '',
            printpks:[],
            emptyPk_bankdocflag: true, //是否手动清空开户银行
            // 附件相关 start
			//单据pk
			billId: '',
			//附件管理使用单据编号
			billno: '',
			//控制附件弹出框
			showUploader: false,
			//控制弹出位置
			target: null,
			// 附件相关 end
        }
        let tempParam = {
            pagecode: props.config.pagecode,//页面id
        }, langParam = {
            moduleId: "10140BANKACC", domainName: 'uapbd'
        }
        this.loadTempAndLang(props, tempParam, langParam, (tempdata, mutiJson, inlt) => {
            this.resetStateAfterLoadLang(mutiJson, inlt, tempdata, (data) => {
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        let buttonAry = [];
                        data.button.map((obj) => {
                            if (obj.hasOwnProperty('area') && obj.hasOwnProperty('key') && obj.area === 'currency-opr-col') {
                                buttonAry.push(obj.key);
                            }
                        });
                        this.modifierMeta(props, meta, buttonAry)
                        props.meta.setMeta(meta, () => {
                            this.initData();
                        });
                    }
                    if (data.button) {
                        let button = data.button;
                        let headButtonAry = [];
                        props.button.setButtons(button);
                        data.button.map((obj) => {
                            if (obj.hasOwnProperty('area') && obj.hasOwnProperty('key') && obj.area === 'header-button-area') {
                                headButtonAry.push(obj.key);
                            }
                        });
                        this.buttonToggleShow(props);
                    }
                }
            })
        })
    }
    //多语处理
    loadTempAndLang = (props, tempParam, langParam, callback) => {
        let temp, lang, inlt;
        props.createUIDom(tempParam, (data) => {
            temp = data;
            if (!!lang) {
                callback && callback(temp, lang, inlt);
            }
        });
        let langCallback = (multiJson, json, inlt) => {
            lang = multiJson;
            inlt = inlt;
            if (!!temp) {
                callback && callback(temp, lang, inlt);
            }
        }
        props.MultiInit.getMultiLang(Object.assign(langParam, {callback: langCallback}));
    }
    resetStateAfterLoadLang = (mutiJson, inlt, tempdata, callback) => {
        this.state.context = tempdata.context;
        this.state.currentOrg = tempdata.context.pk_org,
            this.state.json = mutiJson;
        this.state.x = inlt;
        this.state.loadLang = true;
        this.setState(this.state, callback.call(this, tempdata))
    }
    //meta修正
    modifierMeta = (props, meta, buttonAry) => {
        let status = props.getUrlParam('status') || 'browse';
        let formId = props.config.formId;
        let gridId = props.config.gridId;
        meta[formId].status = status;
        meta[gridId].status = status;

        //账号字段添加正则校验
        let accnameitem = meta[formId]['items'].find(item => item['attrcode'] === 'accnum');
        //accnameitem.reg = new RegExp('^[^\u4e00-\u9fa5]+$');
        accnameitem.reg = new RegExp('^[A-Za-z0-9@\\-_￥$]+$');
        accnameitem.errorMessage = this.state.json['10140BANKACC-000023'];

        //银行账户-财务组织新增所属组织添加主组织参照权限过滤
        if (props.config.NODE_TYPE === 'ORG_NODE') {
            let pk_orgitem = meta[formId]['items'].find(item => item['attrcode'] === 'pk_org');
            pk_orgitem.queryCondition = () => {
                return {
                    AppCode: props.config.appcode,
                    TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                }
            }
        }
        //银行总账户参照添加过滤条件
        let bankaccoutitem = meta[formId]['items'].find(item => item['attrcode'] === 'corrgeneaccount');
        bankaccoutitem.queryCondition = () => {
            return {
                GridRefActionExt: 'nccloud.web.uapbd.sminfo.bankacc.extendRef.CorrgeneaccoutGridRefModelExtendRef'
            }
        }
        //开户银行参照添加过滤条件
        let bankdocItem = meta[formId]['items'].find(item => item['attrcode'] === 'pk_bankdoc');
        bankdocItem.queryCondition = () => {
            return {
                TreeRefActionExt: 'nccloud.web.uapbd.sminfo.bankacc.extendRef.BankaccTreeSqlBuilder'
            }
        }
        //银行类别参照添加过滤条件
        let bankTypeItem = meta[formId]['items'].find(item => item['attrcode'] === 'pk_banktype');
        bankTypeItem.queryCondition = () => {
            return {
                GridRefActionExt: 'nccloud.web.uapbd.sminfo.bankacc.extendRef.BankTypeSqlBuilder'
            }
        }
        //网银接口类别添加拓展条件
        let netbankItem = meta['ebankinfo']['items'].find(item => item['attrcode'] === 'pk_netbankinftp');
        netbankItem.queryCondition = () => {
            return {
                GridRefActionExt: 'nccloud.web.uapbd.sminfo.bankacc.extendRef.NetbankTemplateDefaultRefModelExtendRef'
            }
        }

        let porCol = {
            attrcode: 'opr',
            label: this.state.json['10140BANKACC-000069'], /* 国际化处理： 操作*/
            visible: true,
            className: 'table-opr',
            width: 200,
            itemtype: 'customer',
            fixed: 'right',
            render(text, record, index) {
                let status = props.cardTable.getStatus(gridId);
                buttonAry = status === 'browse' ? ['btnSubExtend'] : []
                return props.button.createOprationButton(buttonAry, {
                    area: 'currency-opr-col',
                    onButtonClick: oprButtonClick.bind(this, record, index)
                });
            }
        };
        meta[gridId].items.push(porCol);

        return meta;
    }
    //切换页面状态
    buttonToggleShow = (props, btnname) => {
        let status = props.getUrlParam('status') || 'browse';
        let formId = props.config.formId;
        let gridId = props.config.gridId;
        let flag = status === 'browse' ? true : false;
        //资金联查参数
        let reqfrom = props.getUrlParam('reqfrom');
        //资金卡户管理opento参数
        let vbilltype = props.getUrlParam('vbilltype');
        if (reqfrom !== undefined && reqfrom == 'tam' || vbilltype !== undefined && vbilltype == 'opentrasact') {
            if (status === 'browse') {
                //资金联查银行账户卡片按钮状态
                //如果是从tam那边节点联查打开的卡片
                props.button.setButtonVisible(
                    ['btnAdd', 'btnEdit', 'btnDel',
                        'btnEnableDisable','btnDisable','btnAssist',
                        'btnSubAccGrant', 'btnSubFreeze',
                        'btnPrint', 'btnCopy', 'btnRefrensh',], true);
                props.button.setButtonVisible(['btnSubAdd', 'btnSubDelete', 'btnSave', 'btnSaveAdd', 'btnCancel'], false);
                props.button.setButtonDisabled(['btnAdd', 'btnEnableDisable', 'btnEnable', 'btnDisable','btnSubDelete'], true);

                props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

            } else {
                //资金开户管理opento卡片按钮状态
                props.button.setButtonVisible(
                    ['btnAdd', 'btnEdit', 'btnDel',
                        'btnEnableDisable','btnDisable', 'btnAssist',
                        'btnSubAccGrant', 'btnSubFreeze',
                        'btnPrint', 'btnCopy', 'btnRefrensh'], false);
                props.button.setButtonVisible(['btnSave', 'btnSaveAdd', 'btnCancel', 'btnSubAdd', 'btnSubDelete'], true);
                props.button.setButtonDisabled(['btnSubDelete'],true);
                props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
            }
        } else {
            props.button.setButtonVisible([
                'btnEdit','btnDisable',
                'btnDel', 'btnRefrensh', 'btnEnableDisable',
                'btnAssist', 'btnSubAccGrant', 'btnSubFreeze',
                'btnPrint', 'btnCopy', 'btnSubDelete'], flag && btnname !== 'btncancel');
            props.button.setButtonVisible(['btnSave', 'btnCancel', 'btnSubAdd', 'btnSubDelete'], !flag && btnname !== 'btncancel');
            props.button.setButtonVisible(['btnAdd'], flag);
            props.button.setButtonVisible(['btnSave', 'btnCancel', 'btnSubAdd', 'btnSubDelete'], !flag && btnname !== 'btncancel');
            props.button.setButtonVisible(['btnSaveAdd'], status === 'add' && btnname !== 'btncancel');
            props.button.setButtonDisabled(['btnSubDelete'],true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', flag && btnname !== 'btncancel');
        }
        props.form.setFormStatus(formId, status);
        props.cardTable.setStatus(gridId, flag ? 'browse' : 'edit');
        //返回按钮
        props.BillHeadInfo.setBillHeadInfoVisible({
            showBackBtn: status === 'browse'
        });
        this.setState({
            pageStatus: props.form.getFormStatus(formId)
        });
    }
    //生命周期事件
    componentDidUpdate() {
        if (this.state.pageStatus === 'browse') {
            window.onbeforeunload = null;
        } else {
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

	// 附件的关闭点击
	onHideUploader = () => {
        debugger;
		this.setState({
			showUploader: false
		})
	}

    beforeUpload(billId, fullPath, file, fileList) {
        // 参数：单据id，当前选中分组path、当前上传文件对象，当前文件列表
        //console.log(billId, fullPath, file, fileList);

        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            // alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000053'))/* 国际化处理： 只支持jpg格式图片*/
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            // alert(this.props.MutiInit.getIntl("36320FDA") && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000054'))/* 国际化处理： 上传大小小于2M*/
        }
        return isJPG && isLt2M;
        // 备注： return false 不执行上传  return true 执行上传
    }
    //按钮显隐 是否禁用处理
    showEnablestateBtn = (props,flag) => {
        let {formId} = props.config;
        let formItemsValue = props.form.getFormItemsValue(formId, ['enablestate', 'accstate','pk_org','pk_group']);

        let status = this.props.getUrlParam('status') || 'browse';

        //如果是销户而且要置灰的按钮
        props.button.setButtonDisabled(
            ['btnUpgrade', 'btnCancelAcc', 'btnAdjustOrg',
                'btnSubAccGrant', 'subAccGrant', 'subAcc',
                'subAccUngrant', 'btnEdit', 'btnDel',
                'btnSubFreeze', 'subFreeze', 'subUnFreeze'], formItemsValue[1].value === '3' );
        if((!!flag && flag != 'btnsave') || !!!flag){
            let rem = manageModePlugIn.call(this,
                props.config.NODE_TYPE,
                formItemsValue[2].value,
                formItemsValue[3].value,
                this.state.context.PermissionOrgIDs,
                getBusinessInfo().groupId);
            props.button.setButtonDisabled(['btnEdit','btnDel','btnSubAccGrant',
                'subAccGrant', 'subAcc', 'subAccUngrant','btnCancelAcc', 'btnAdjustOrg'], !rem.editFlag);
            props.button.setButtonDisabled(['btnEnableDisable', 'btnEnable'], !rem.editFlag||(formItemsValue[0].value === '2' && status == 'browse'));
            props.button.setButtonDisabled(['btnDisable'],!rem.editFlag||( formItemsValue[0].value !== '2' && status == 'browse'));
        }
    }
    //初始化数据
    initData = () => {
        let copyflag = this.props.getUrlParam('copyFlag');
        let vbilltype = this.props.getUrlParam('vbilltype');
        let pk = this.props.getUrlParam('id') || this.props.getUrlParam('cid');
        let status = this.props.getUrlParam('status') || 'browse';
        let applyid = this.props.getUrlParam('applyid');
        let ts = this.props.getUrlParam('ts');
        if (pk && pk !== 'undefined' && (status === 'browse' || status === 'edit')) {
            this.getdata(pk);
        } else {
            if (pk && pk != 'undefined' && copyflag === 'copy') {
                this.getCopydata();
            } else {
                if (vbilltype != 'undefined' && vbilltype === 'opentrasact') {
                    this.loadCardDataFromFund(applyid, ts);
                } else {
                    this.setDefaultValue();
                }
            }
        }
    }
    //meta修正
    modifierMetaAgain = (props, data) => {
        let {formId, NODE_TYPE} = props.config;
        props.form.setFormItemsDisabled(formId, {
            'code': data['userjson'] == 'diseditable' ? true : false,
            'accnum': data['head'][formId].rows[0].values.enablestate.value !== '1',
            'enablestate': true,
            'pk_org': !!!(props.getUrlParam('status') === 'add' && NODE_TYPE === 'ORG_NODE'),
            //'issigned':true,
            'corrgeneaccount':true,
            'pk_banktype':false
        });
        this.showEnablestateBtn(props);
    }
    //资金开户管理获取数据
    loadCardDataFromFund = (applyid, ts) => {
        let requestParam = {
            'applyid': applyid,
            'ts': ts,
            'pagecode': this.config.pagecode
        }
        ajax({
            url: '/nccloud/tam/accounttracsact/bankacccardquery4fundaction.do',
            data: requestParam,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        if (res.data.head) {
                            this.props.form.setAllFormValue({[this.config.formId]: data.head[this.config.formId]});
                            let {formId, NODE_TYPE} = this.props.config;
                            this.props.form.setFormItemsDisabled(formId, {
                                'code': data['userjson'] == 'diseditable' ? true : false,
                                'accnum': data['head'][formId].rows[0].values.enablestate.value !== '1',
                                'enablestate': true,
                                // 'pk_org': !!!(this.props.getUrlParam('status') === 'add' && NODE_TYPE === 'ORG_NODE'),
                                //'issigned':true,
                                'corrgeneaccount':true,
                                //2019-03-06 修改 根据bug NCCLOUD-115682  调整  
                                'pk_org':true,
                                'pk_bankdoc':true,
                                'pk_banktype':true,
                                'arapprop':true,
                                'accattribute':true,
                                'genebranprop':true,
                                'groupaccount':true,
                                'financeorg':true,
                                'controlorg':true,
                                'accxhdate':true,
                                'address':true,
                                'contactpsn':true,
                                'tel':true
                            });
                            //
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(this.config.gridId, data.body[this.config.gridId]);
                        }
                    }else{
                        this.props.setUrlParam({
                            status:'browse',
                            vbilltype : '',
                            reqfrom:''
                        });
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.cardTable.setTableData(this.config.gridId, {rows: []});
                        this.buttonToggleShow(this.props, 'btncancel');
                    }
                }
            }
        })


    }
    //获取复制数据
    getCopydata = (callback) => {
        let requestParam = {
            pk_bankaccbas: [getDefData('id', this.config.datasource)],
            NODE_TYPE: this.config.NODE_TYPE,
            pagecode: this.config.pagecode,
            actionName: 'btnCopy'
        };
        ajax({
            url: ajaxurl,
            data: requestParam,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        let {message,head,body} = data;
                        if(message){
                            toast({color:'warning',title:message});
                            return;
                        }
                        if (head) {
                            this.props.form.setAllFormValue({[this.config.formId]: data.head[this.config.formId]});
                            this.modifierMetaAgain(this.props, data);
                        }
                        if (body) {
                            this.props.cardTable.setTableData(this.config.gridId, data.body[this.config.gridId]);
                        }
                    }
                    callback && callback.call(this);
                }
            }
        });
    }
    //设置默认值
    setDefaultValue = () => {
        let {formId, gridId, datasource} = this.config;
        let requestParam = {
            pk_bankaccbas: [getDefData('id', this.config.datasource)],
            NODE_TYPE: this.config.NODE_TYPE,
            pagecode: this.config.pagecode,
            actionName: 'btnAdd',
            currentOrg: this.state.currentOrg
        };
        ajax({
            url: ajaxurl,
            data: requestParam,
            success: (res) => {
                let {success, data} = res;
                let {billcard, OrgIds} = data;
                let {head, body} = billcard;
                if (success) {
                    if (data && OrgIds) {
                        this.setState({
                            context:{
                                PermissionOrgIDs:OrgIds
                            }
                        },()=>{
                            setDefData('PermissionOrgIDs', datasource, OrgIds);
                            if (data && billcard && head) {
                                this.props.form.EmptyAllFormValue(formId)
                                this.props.form.setFormStatus(formId, "add");
                                Utils.filterEmptyData(head[formId].rows[0].values);
                                this.props.form.setAllFormValue({[formId]: head[formId]});
                                this.modifierMetaAgain(this.props, billcard);
                            }
                            if (data && billcard && body) {
                                this.props.cardTable.setTableData(gridId, body[gridId]);
                            }
                        })
                    }
                }
            }
        });

    }
    printOutData = (data) =>{
        if(data.length<1){
            data = [getDefData('id', this.config.datasource)];
        }
        this.setState({
            printpks: data
        },this.refs.printOutput.open());
    }
    //通过单据id查询单据信息
    getdata = (pk, callback) => {

        let {formId, gridId,datasource,NODE_TYPE,pagecode,appcode} = this.config;
        let requestParam = {
            pk_bankaccbas: [pk],
            NODE_TYPE: NODE_TYPE,
            pagecode: pagecode,
            pageInfo: {},
            appcode:appcode
        };
        pk && ajax({
            url: queryCardUrl,
            data: requestParam,
            success: (res) => {
                let {success, data} = res;
                if (success) {
                    if (data) {
                        if (data.head) {
							this.setState({accstate:data.head[formId].rows[0].values.accstate.value});
                            this.props.form.setAllFormValue({[formId]: data.head[formId]});
                            this.setState({
                                context: {
                                    PermissionOrgIDs:data.head['userjson'].split(', ')
                                }
                            },()=>{
                                setDefData('PermissionOrgIDs', datasource, data.head['userjson'].split(', '));
                                this.modifierMetaAgain(this.props, data);
                            });
                            debugger
                            if(this.state.accstate === '3'){
                                this.props.button.setButtonDisabled(['btnEdit','btnDel','btnSubAccGrant'],true);
                            }else{
                                this.props.button.setButtonDisabled(['btnEdit','btnDel','btnSubAccGrant'],false);
                            }
                        }
                        if (data.body) {
                            this.props.cardTable.setTableData(this.config.gridId, data.body[this.config.gridId]);
                        }
                        callback && callback.call(this);
                        //如果根据pk查询返回data为null,数据被删除 清空表单，只设置新增按钮
                    }else{
                        this.props.setUrlParam({
                            status:'browse'
                        });
                        this.props.form.EmptyAllFormValue(this.config.formId);
                        this.props.cardTable.setTableData(this.config.gridId, {rows: []});
                        this.buttonToggleShow(this.props, 'btncancel');
                    }
                }
            }
        });
    }
    //单据保存方法
    modelSave = (props) => {
        props.cardTable.closeModel(this.config.gridId);
        this.saveClick();
    }
    //获取列表肩部信息
    getTableHead = () => {
        let {button} = this.props;
        let {createButtonApp} = button;
        let status = this.props.getUrlParam("status");
        return (
            <div className="shoulder-definition-area">
                <div className='definition-search'>
                    {status == 'browse' ?
                        <div>
                            {/*<span className="definition-search-title">详细信息 | 总计：</span>*/}
                            {/*<span className='count'>{this.state.totalcount}</span><span>条</span>*/}
                        </div> :
                        <span className="definition-search-title"></span>}
                </div>
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'definition-icons',//按钮注册中的按钮区域
                        onButtonClick: headBtnClick.bind(this)
                    })}
                </div>
            </div>
        )
    }
    //核算归属组织模态框
    adjustForm = () => {
        const {form} = this.props;
        const {createForm} = form;
        return (
            <div>
                <div className="nc-bill-form-area">
                    {createForm(this.config.controlorg, {
                        onAfterEvent: modalafterEvent.bind(this)
                    })}
                </div>
            </div>
        )

    }
    //子户冻结 解冻点击事件
    onCheckFreeze = (value) => {
        this.state.selectedValue = value
        this.setState(this.state);
    }
    //冻结金额onchange事件
    inputValueChange = (value) => {
        this.state.inputValue = value;
        this.setState(this.state);
    }
    //冻结金额失去焦点事件
    inputOnBlur = (value) => {
        let  reg =new RegExp('^\\d{1,11}$') ;  //定义正则表达式
        if(!reg.test(value)){
            // toast({
            //     color:'warning',
            //     content:this.state.json['10140BANKACC-000094']
            // });
            value = value.substring(0,11);
            this.setState({inputValue: value});
        }else{
            this.setState({inputValue: value});

        }
    }
    //子户冻结模态框
    subFreezeForm = (flag) => {
        let freezetype =
            flag === 'freeze' ?
                this.state.json['10140BANKACC-000070'] :
                this.state.json['10140BANKACC-000071'];
        return (
            <div>
                <NCRadio.NCRadioGroup
                    name="freeSum"
                    selectedValue={this.state.selectedValue}
                    onChange={this.onCheckFreeze.bind(this)}>
                    <NCRadio value="all">{this.state.json['10140BANKACC-000077']}{freezetype}</NCRadio>{/* 国际化处理： 全额*/}
                    <NCRadio value="part">{this.state.json['10140BANKACC-000078']}{freezetype}</NCRadio>{/* 国际化处理： 部分*/}
                </NCRadio.NCRadioGroup>
                <div style={{display: this.state.selectedValue === 'part' ? '' : 'none'}}>
                    <h3>{freezetype}{this.state.json['10140BANKACC-000079']}</h3>{/* 国际化处理： 金额*/}
                    <NCFormControl value={this.state.inputValue} onChange={this.inputValueChange.bind(this)}
                                   onBlur={this.inputOnBlur.bind(this)} type="input" className="demo-input"/>
                </div>
            </div>
        )
    }
    //返回按钮事件处理
    handleReturnBtn = () => {
        this.props.pushTo('/list', {
            status: 'browse',
            pagecode:this.props.config.pagecode_list,
            'appcode': this.props.config.appcode
        });
    }
    //回写Iban编码
    writebackIbanCode = (ibancode) => {
        ibancode.value && this.props.form.setFormItemsValue(this.config.formId,{
            'accnum':ibancode
        });
    }
    //自定义渲染
    renderPage() {
        let {cardTable, form, button, modal, cardPagination, BillHeadInfo} = this.props;
        const {createCardPagination} = cardPagination;
        const {createBillHeadInfo} = BillHeadInfo;
        let {createForm} = form;
        let {createCardTable} = cardTable;
        let {createButtonApp} = button;
        let {createModal} = modal;
        let status = this.props.getUrlParam('status') || 'browse';
        // 附件相关内容变量
        debugger;
		let { showUploader, target, billno, billId, showNCbackBtn } = this.state;
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                    <NCAffix>
                        <NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
                            <div className='header-title-search-area'>
                                {createBillHeadInfo({
                                    title:this.config.NODE_TYPE === 'GROUP_NODE' ? this.state.json['10140BANKACC-000072'] : this.state.json['10140BANKACC-000073'],
                                    backBtnClick: this.handleReturnBtn.bind(this)
                                })}
                            </div>
                            <div className="header-button-area">
                                {createButtonApp({
                                    area: 'header-button-area',//按钮注册中的按钮区域
                                    //buttonLimit: 5,
                                    onButtonClick: headBtnClick.bind(this)
                                    //popContainer: document.querySelector('.header-button-area')
                                })}
                            </div>
                            <div className='header-button-cardPagination'>
                                {createCardPagination({
                                    handlePageInfoChange: pageInfoClick.bind(this),
                                    dataSource: this.config.datasource,
                                    urlPkname: 'id'
                                })}
                            </div>
                        </NCDiv>
                    </NCAffix>
                    <div className="nc-bill-form-area">
                        {createForm(this.config.formId, {
                            onAfterEvent: formAfterEvents.bind(this),
                            onBeforeEvent: formBeforeEvents.bind(this)
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area edit-card-table">
                        {createCardTable(this.config.gridId, {
                            tableHead: this.getTableHead.bind(this),
                            onAfterEvent: cardBodyAfterEdit.bind(this),
                            onBeforeEvent: cardBodyBeforeEdit.bind(this),
                            onSelected: cardTableOnSelected.bind(this),
                            onSelectedAll:cardTableOnSelectedAll.bind(this),
                            showIndex: true,
                            showCheck: true,
                            hideColSet: () => {
                                return false;
                            }
                        })}
                    </div>
                </div>
                {createModal('adjustForm', {
                    'hasCloseBtn': true,
                    'title': this.state.json['10140BANKACC-000074'], /* 国际化处理： 核算归属组织设置界面*/
                    'content': this.adjustForm(),
                    'size': 'lg',
                    'userControl': true,
                })}
                {createModal('checkOrg', {
                    'hasCloseBtn': true,
                })}
                {createModal('subFreezeForm', {
                    'hasCloseBtn': true,
                    'title': this.state.json['10140BANKACC-000075'], /* 国际化处理： 子户冻结*/
                    'content': this.subFreezeForm.call(this, 'freeze'),
                    'size': 'lg',
                    'userControl': true
                })}
                {createModal('subUnFreezeForm', {
                    'hasCloseBtn': true,
                    'title': this.state.json['10140BANKACC-000076'], /* 国际化处理： 子户解冻*/
                    'content': this.subFreezeForm.call(this, 'defreeze'),
                    'size': 'lg',
                    'userControl': true
                })}


                <PrintOutput
                    ref='printOutput'
                    url={printUrl}
                    data={{
                        funcode: '10140BACCG',
                        nodekey: this.props.config.nodekey,//功能节点编码，即模板编码
                        oids: this.state.printpks,
                        outputType: 'output'
                    }}
                    //callback={this.onSubmit}
                >
                </PrintOutput>

                {/* 这里是附件上传组件的使用，需要传入三个参数 */}
                <div className="nc-faith-demo-div2">
                        {showUploader &&
                            <NCUploader
                                billId={billId}
                                billNo={billno}
                                onHide={this.onHideUploader}
                                // beforeUpload={this.beforeUpload}
                                customInterface={
                                    {
                                        queryLeftTree: '/nccloud/uapbd/bankacc/lefttree.do',
                                        queryAttachments: '/nccloud/uapbd/bankacc/query.do'
                                    }
                                }
                            />
                        }
                    </div>

                <AccountGrantModal ref={(item => this.accountGrantModal = item)}
                                   {...this.props}
                                   {...{json: this.state.json}}/>
            </div>
        );
    }
    //组件渲染
    render() {
        return (
            <div>{this.state.loadLang ? this.renderPage() : <div/>}</div>
        )
    }
}
export default BankAccountCardBase;



//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65