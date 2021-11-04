//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, ajax ,NCCreateSearch,toast,createButtonApp,cardTable,promptBox,createPageIcon} from 'nc-lightapp-front';
import UpgradeHeadForm from "../component/upgradeHead";
import SupBaseInfo from "../component/supbaseinfo";
import SupupgradeQueryList from "../component/supupgradeQueryList";
import SupplierRefTreeGridRef from "../../../../uapbd/refer/supplier/SupplierRefTreeGridRef";
import NotifyModel from "../component/notifymodel";
import {BaseUtils} from "../../../public/utils";

const {NCMessage:Message} = base;
const {NCTabs, NCTabsControl,NCAffix} = base;
const NCTabPane = NCTabs.NCTabPane;
let pageCode='1317SUUG_supupgrade',appid='0001Z010000000002950',defaultKey="0";
const GLOBE = 'GLOBLE00000000000000';
var urls = {
    queryGroupInfoUrl:"/nccloud/uapbd/customersupplier/querygroupinfo.do",
    saveUrl:'/nccloud/uapbd/customersupplier/savesupplier.do',
    queryCurrOrg : "/nccloud/uapbd/bankacc/querycurrorg.do",
    querySupBaseInfoUrl:"/nccloud/uapbd/customersupplier/querysupbaseinfo.do",
    repaireSupplier:"/nccloud/uapbd/customersupplier/repairesupplier.do"
}
class CustomerSupplier extends Component{
    constructor(props){
        super(props);
        this.config = Object.assign({
            title:'',
            pageCode:"1317SUUG_supupgrade",
            modalFormId:'',
            supbaseInfo:{
                baseFormId:'supplier_baseInfo',
                bankTableId:'supbankacc',
                linkTableId:'suplinkman',
                countryTableId:'supcountrytaxes'
            },
            appid:'0001Z010000000002950'//按钮注册
        },this.props.config);
        this.state = {
            upperGrop:'',
            baseData:'',
            curOrg:'',
            supplier:{},
            formulamsg:{},
            json:{},
            inlt:{}
        }
        this.initData = this.initData.bind(this);
        this.confirmUpgrade = this.confirmUpgrade.bind(this);
        this.saveAction = this.saveAction.bind(this);
        //this.setBaseInfoData = this.setBaseInfoData.bind(this);
        this.getCurrOrg = this.getCurrOrg.bind(this);
        this.loadBaseInfo = this.loadBaseInfo.bind(this);

        let callback = (json,status,inlt)=> {
            this.state.json = json;//多语对象
            this.state.inlt = inlt;//用来处理占位符
            /* 国际化处理： 供应商升级*/
            this.config.title = this.state.json['1317SUUG-000033'];
            this.state.title = this.state.json['1317SUUG-000033'];

            this.initTemplate(this.props,()=>{
                this.initData();
            });
        }
        //加载多语文件
        this.props.MultiInit.getMultiLang({moduleId: '1317SUUG',domainName: 'uapbd',callback});
    }

    /**
     * 加载模板
     * @param props
     * @param callback
     */
    initTemplate = (props,callback)=>{
        let pagecode ;
        try{
            pagecode = props.getUrlParam('pageCode');
        }catch(e){
            pagecode = pageCode;
        }
        if(!pagecode)
            pagecode = pageCode;
        props.createUIDom(
            {
                pagecode: pagecode//页面id
                //appid: appid//注册按钮的id
            },
            function (data){
                if(data){
                    if(data.template){
                        let meta = data.template;
                        props.meta.setMeta(meta);
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        props.button.setButtonVisible(['Upgrade','RepairData'],true);
                        props.button.setButtonVisible(['Notify','Save','Cancel',],false);
                    }
                    callback && callback();
                }
            }
        )
    }
    initData(){
        var me = this;
        try{
            pageCode = me.props.getUrlParam('pageCode');
            defaultKey = me.props.getUrlParam('key');
        }catch(e){
            pageCode = '1317SUUG_supupgrade';
            defaultKey = "0";
        }
        if(!pageCode)
            pageCode = '1317SUUG_supupgrade';
        if(!defaultKey)
            defaultKey = "0";
    }
    /**
     * 获取当前登录用户组织
     */
    getCurrOrg(){
        var me = this;
        let requestparam = {
            type:'org'
        }
        ajax({
            url: urls['queryCurrOrg'],
            data:requestparam,
            success: function (res) {
                if(res.success){
                    me.state.curOrg = {
                        refpk:res.data.pk_org,
                        refcode:res.data.code,
                        refname:res.data.name
                    };
                    me.setState(me.state);
                }
            }
        })
        console.log(this.state);
    }
    componentDidMount(){
        this.props.button.setButtonsVisible({
            Upgrade:true,
            Save:false,
            Cancel:false,
            RepairData:true
        });
        //获取当前登录人信息
        this.getCurrOrg();
    }
    /**
     * 点击页签
     * @param key
     */
    onChangeFun(key){
        var me = this;
        switch (key){
            case "0":
                me.props.button.setButtonVisible(['Upgrade','RepairData'],true);
                me.props.button.setButtonVisible(['Notify', 'Save','Cancel',],false);
                break;
            case "1":
                me.props.button.setButtonVisible(['Upgrade','Save','Cancel','RepairData'],false);
                me.props.button.setButtonVisible(['Notify'],false);
                break;
        }
    }

    /**
     * 升级
     */
    confirmUpgrade(flag){
        var me = this;
        if(flag == 'upgrade'){
            me.props.button.setButtonsVisible({
                Save:true,
                Upgrade:false,
                Cancel:true,
                RepairData:false
            });
            me.UpgradeHeadForm.form.setFormItemsDisabled('supupgrade',{'sourceorg':true,'sourcesup':true});
            //将后台判断是否清空分类逻辑放到前台处理
            let pk_org = me.state.baseData.classVo ? me.state.baseData.classVo.pk_org : '';
            let pk_group = me.state.baseData.classVo ? me.state.baseData.classVo.pk_group : '';
            let pk_supplierclass = me.SupBaseInfo.form.getFormItemsValue('supplier_baseInfo','pk_supplierclass');
            let emptyClass = (me.state.upperGrop.pk_group == GLOBE && pk_org != GLOBE)|| (pk_org != pk_group && pk_org!=GLOBE);

            //将所属组织设置为上级集团或全局
            me.SupBaseInfo.form.setFormItemsValue('supplier_baseInfo',{
                pk_org:{value:me.state.upperGrop.pk_group,display:me.state.upperGrop.name},
                pk_supplierclass:emptyClass ? {value:'',display:''} : pk_supplierclass
            });
            emptyClass && toast({content:me.state.json['1317SUUG-000035'],color : 'warning'});/* 国际化处理： 如下字段:[供应商基本分类]被清空，需要重新修改选择！*/
            //设置供应商分类过滤条件
            let meta = me.SupBaseInfo.meta.getMeta();
            meta['supplier_baseInfo'].items.find((item) => item.attrcode == 'pk_supplierclass').queryCondition = {
                pk_org: me.SupBaseInfo.form.getFormItemsValue('supplier_baseInfo','pk_org').value
            };
            me.SupBaseInfo.meta.setMeta(meta);

            me.SupBaseInfo.form.setFormStatus('supplier_baseInfo','edit');
            me.SupBaseInfo.button.setDisabled({
                AddLine:false,
                BatchDel:false
            });
            me.SupBaseInfo.button.setButtonVisible(['AddLine','BatchDel'],true);
        }
        if(flag == 'cancel'){
            promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['1317SUUG-000043'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
				content: this.state.json['1317SUUG-000082'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['1317SUUG-000083'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['1317SUUG-000043'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: () => {
                    me.props.button.setButtonsVisible({
                        Save:false,
                        Upgrade:true,
                        Cancel:false,
                        RepairData:true
                    });
                    me.UpgradeHeadForm.form.setFormItemsDisabled('supupgrade',{'sourceorg':false,'sourcesup':false});
                    me.SupBaseInfo.form.setFormStatus('supplier_baseInfo','browse');
                    me.SupBaseInfo.button.setButtonVisible(['AddLine','BatchDel'],false);
                    //重新设置表单数据，避免取消前进行了一些更改
                    me.SupBaseInfo.form.cancel('supplier_baseInfo');
                    me.SupBaseInfo.cardTable.resetTableData('suplinkman');
                    //me.setBaseInfoData(me.state.baseData);
                }   // 确定按钮点击调用函数,非必输
			})
        }
        if(flag == 'save'){
            me.props.button.setButtonsVisible({
                Save:false,
                Upgrade:true,
                Cancel:false,
                RepairData:true
            });
            me.UpgradeHeadForm.form.setFormItemsDisabled('supupgrade',{'sourceorg':false,'sourcesup':false});
            me.SupBaseInfo.form.setFormStatus('supplier_baseInfo','browse');
            me.SupBaseInfo.button.setButtonVisible(['AddLine','BatchDel'],false);
        }
        me.SupBaseInfo.cardTable.setStatus('suplinkman','browse');
    }

    /**
     * 保存
     * @param type
     */
    saveAction(callback){
        let me = this;
        // 校验一下是否必输项已经填写
        if(!me.SupBaseInfo.form.isCheckNow('supplier_baseInfo')) {
            return
        }
        me.SupBaseInfo.cardTable .filterEmptyRows('suplinkman',[]);
        let cardData = me.SupBaseInfo.createExtCardData('1317SUUG_supbaseinfo','supplier_baseInfo',['supbankacc','suplinkman','supcountrytaxes']);

        let businessLogic = ()=>{
            ajax({
                url: urls['saveUrl'],
                data: cardData,
                success: (result) => {
                    if(result.success){
                        //设置表单浏览态
                        me.SupBaseInfo.form.setFormStatus('1317SUUG_supbaseinfo', 'browse');
                        me.confirmUpgrade('save');
                        toast({title : this.state.json['1317SUUG-000022'],color : 'success'});/* 国际化处理： 保存成功！*/
                        if(callback)
                            callback();
                        //处理保存成功后显示公式回显问题
                        me.loadBaseInfo(me.UpgradeHeadForm.form.getFormItemsValue('supupgrade','sourcesup').value,(finalData)=>{
                            me.setBaseInfoData(finalData);
                        });
                    }
                }
            });
        }
        me.SupBaseInfo.validateToSave(cardData,businessLogic,{[me.config.supbaseInfo.formId]:'form',[me.config.supbaseInfo.tableIds]:'cardTable'},'card');
    }
    /**
     * 按钮点击事件
     * @param id
     */
    onButtonClick(props,id) {
        var me = this;
        switch (id.toLowerCase()) {
            case 'upgrade':
                let sourcesup = me.UpgradeHeadForm.form.getFormItemsValue('supupgrade','sourcesup');
                if(!sourcesup.value){
                    toast({content: me.state.json['1317SUUG-000036'], color: 'warning'});/* 国际化处理： 请选择源供应商*/
                    return;
                }
                let iscustomer = me.SupBaseInfo.form.getFormItemsValue('supplier_baseInfo','iscustomer');
                if(iscustomer && iscustomer.value){
                    Message.create({content: me.state.json['1317SUUG-000037'], color: 'warning'});/* 国际化处理： 不支持客商的升级*/
                    return;
                }
                let currOrg = me.UpgradeHeadForm.form.getFormItemsValue('supupgrade','sourceorg');
                //处理升级一次后继续升级情况
                let baseOrg = me.SupBaseInfo.form.getFormItemsValue('supplier_baseInfo','pk_org');
                if(baseOrg)
                    currOrg = baseOrg;
                //若已为全局，则提示不能继续升级
                if(currOrg.value == GLOBE){
                    Message.create({content: me.state.json['1317SUUG-000038'], color: 'warning'});/* 国际化处理： 全局级数据不支持升级*/
                    return;
                }
                //请求参数
                let requestParam = {
                    pk_org:currOrg.value
                }
                ajax({
                    url: urls["queryGroupInfoUrl"],
                    data:requestParam,
                    success: (res) =>{
                        let{success,data} = res;
                        if(success){
                            if(data){
                                me.state.upperGrop = data;
                                me.setState(me.state);
                            }
                            let showGroup = me.state.upperGrop.code == 'global' ? "" : this.state.json['1317SUUG-000039'];/* 国际化处理： 集团*/
                            promptBox({
                                color:'warning',
                                noFooter:false,
                                userControl:true,
                                title:me.state.json['1317SUUG-000040'],/* 国际化处理： 询问*/
                                content:me.state.inlt.get('1317SUUG-000049',{upGroupName:`${me.state.upperGrop.name}${showGroup}`}),/* 国际化处理： 你确定要将该供应商升级至,吗,升级后该供应商的主组织将被替换为,点击,确定,按钮执行升级操作,点击,取消,则不执行升级*/
                                beSureBtnClick:me.confirmUpgrade.bind(this,'upgrade'),
                                cancelBtnClick:me.confirmUpgrade.bind(this,'cancel')
                            });
                        }
                    }
                });
                console.log(me.state.upperGrop)
                break;
            case 'save':
                me.saveAction();
                break;
            case 'cancel':
                me.confirmUpgrade('cancel');
                break;
            case 'repairdata':
                let modalConfig = {
                    isShowUnit:true,
                    onChange:this.onSupplierChange.bind(this),
                    value:this.state.supplier,
                    queryCondition:()=>{
                        return {
                            //自定义过滤条件
                            GridRefActionExt:'nccloud.web.uapbd.customersupplier.action.SupplierRepairFilterAction',
                            pk_org:me.state.curOrg.refpk
                        }
                    }
                }
                me.props.modal.show('modal',{
                    noFooter:false,
                    size:'lg',
                    userControl:false,
                    title:me.state.json['1317SUUG-000041'],/* 国际化处理： 修复供应商*/
                    leftBtnName:me.state.json['1317SUUG-000042'],/* 国际化处理： 修复*/
                    rightBtnName:me.state.json['1317SUUG-000043'],/* 国际化处理： 取消*/
                    content:<SupplierRefTreeGridRef {...modalConfig}/>,
                    beSureBtnClick:me.repaireSupplier.bind(this)
                });
                break;
            case 'notify':
                me.props.modal.show('modal',{
                    noFooter:false,
                    userControl:false,
                    title:me.state.json['1317SUUG-000044'],/* 国际化处理： 发送通知消息*/
                    leftBtnName:me.state.json['1317SUUG-000045'],/* 国际化处理： 发送*/
                    rightBtnName:me.state.json['1317SUUG-000043'],/* 国际化处理： 取消*/
                    content:<NotifyModel/>,
                    beSureBtnClick:me.repaireSupplier.bind(this),
                    cancelBtnClick:()=>{
                        me.props.modal.close('modal');
                    }
                });
                break;
        }
    }

    /**
     * 供应商修复  记录选中的供应商
     * @param value
     */
    onSupplierChange(value){
        this.state.supplier = value;
        this.state.userControl = false;
        this.setState(this.state,()=>{
            this.props.modal.close('modal');
            this.onButtonClick.call(this,this.props,'repairdata');
        });
    }

    /**
     * 修复供应商数据
     * @param pk_supplier
     */
    repaireSupplier(callback){
        let me = this;
        let supplier = me.state.supplier;
        if(!supplier.refpk)
            return;
        let requestParam = {
            pk_supplier : supplier.refpk
        }
        ajax({
            url: urls['repaireSupplier'],
            data:requestParam,
            success: function (res) {
                if(res.success){
                    toast({title : me.state.json['1317SUUG-000046'],color : 'success'});/* 国际化处理： 修复成功！*/
                    callback && callback();
                }
            }
        })
    }

    /**
     * 加载基本信息
     * @param pk
     * @returns {{}}
     */
    loadBaseInfo(pk,callback){
        let me = this;
        if(!pk)
            return;
        let requestParams = {
            pk_supplier:pk,
            type:'0'
        }
        let finalData={};
        ajax({
            url: urls['querySupBaseInfoUrl'],
            data:requestParams,
            success: function (res) {
                let { success, data ,formulamsg} = res;
                if (formulamsg && formulamsg instanceof Array && formulamsg.length > 0) {
                    me.SupBaseInfo.dealFormulamsg(
                        formulamsg,
                        {
                            [me.config.supbaseInfo.baseFormId]:'form',
                            [me.config.supbaseInfo.bankTableId]:'cardTable',
                            [me.config.supbaseInfo.linkTableId]:'cardTable',
                            [me.config.supbaseInfo.countryTableId]:'cardTable'
                        }
                    );
                }
                if(success){
                    let {billCard,supplierClassVo} = data;
                    finalData = {
                        [me.config.supbaseInfo.baseFormId]:billCard.head[me.config.supbaseInfo.baseFormId],
                        [me.config.supbaseInfo.bankTableId]:billCard.bodys[me.config.supbaseInfo.bankTableId],
                        [me.config.supbaseInfo.linkTableId]:billCard.bodys[me.config.supbaseInfo.linkTableId],
                        [me.config.supbaseInfo.countryTableId]:billCard.bodys[me.config.supbaseInfo.countryTableId],
                        classVo:supplierClassVo
                    };
                }
                callback && callback(finalData);
            }
        });
        return finalData;
    }
    /**
     * 选择源供应商后加载明细数据
     * @param data
     * @param formulamsg baseinfo公式信息
     */
    setBaseInfoData(data,formulamsg){
        var me = this;
        me.state.baseData = data;
        //me.state.formulamsg = formulamsg;
        me.setState(me.state,()=>{
            //设置baseInfo表单数据
            me.SupBaseInfo.form.setAllFormValue({'supplier_baseInfo':data.supplier_baseInfo});
            //控制一下对应业务单元字段是否可编辑
            let supprop = data.supplier_baseInfo.rows[0].values.supprop.value
            me.SupBaseInfo.form.setFormItemsDisabled('supplier_baseInfo',{pk_financeorg: supprop == 0})
            me.SupBaseInfo.form.setFormItemsRequired('supplier_baseInfo',{pk_financeorg: supprop == 1})
            setTimeout(()=>{
                if(data.supbankacc){
                    me.SupBaseInfo.cardTable.setTableData('supbankacc',data.supbankacc);
                }else{
                    me.SupBaseInfo.cardTable.setTableData('supbankacc',{rows:[]});
                }
                if(data.suplinkman){
                    me.SupBaseInfo.cardTable.setTableData('suplinkman',data.suplinkman);
                }else{
                    me.SupBaseInfo.cardTable.setTableData('suplinkman',{rows:[]});
                }
                if(data.supcountrytaxes){
                    me.SupBaseInfo.cardTable.setTableData('supcountrytaxes',data.supcountrytaxes);
                }else{
                    me.SupBaseInfo.cardTable.setTableData('supcountrytaxes',{rows:[]});
                }
            },0);
        });
    }
    render(){
        var me = this;
        const {button,modal} = me.props;
        let { createModal } = modal;  //模态框
        let { createButtonApp } = button;

        let headConfig = {
            title:me.state.json['1317SUUG-000033'],
            loadBaseInfo:me.loadBaseInfo,
            setBaseInfoData : me.setBaseInfoData.bind(this),
            json: me.state.json
        }
        let baseConfig = {
            json:me.state.json,
            inlt:me.state.inlt
        }
        const{ BillHeadInfo}=this.props;
        const{ createBillHeadInfo}=BillHeadInfo
        const{ NCDiv} =base;
        return (
            <div className="nc-bill-list">
                <NCDiv areaCode={NCDiv.config.HEADER} >
                    <div className="nc-bill-header-area">
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title: this.state.json['1317SUUG-000033'],/* 国际化处理： 供应商升级 */
                                initShowBackBtn: false
                                })}
                            {/* {createPageIcon()}
                            <h2 className="title-search-detail" fieldid={me.state.title+"_title"}>{me.state.title}</h2> */}
                        </div>
                        {/* 按钮组 btn-group*/}
                        <div className="header-button-area">
                            {createButtonApp({
                                area: 'header',
                                buttonLimit: 3,
                                onButtonClick: me.onButtonClick.bind(this),
                                popContainer: document.querySelector('.header-button-area')
                            })}
                        </div>
                    </div>
                    </NCDiv>
                {createModal('modal',{noFooter:false})}
                {/*<div className="tab-definInfo-area">*/}
                <NCTabs navtype="turn" defaultActiveKey={defaultKey} onChange={this.onChangeFun.bind(this)}>
                    <NCTabPane tab={me.state.json['1317SUUG-000047']} key="0">{/* 国际化处理： 升级处理*/}
                        <div className="card-area">
                            <div style={{ height: '10px' }} />
                            <UpgradeHeadForm config={headConfig} ref={(UpgradeHeadForm)=>{me.UpgradeHeadForm=UpgradeHeadForm}}/>
                            <SupBaseInfo {...baseConfig} ref={(SupBaseInfo)=>{me.SupBaseInfo=SupBaseInfo}}/>
                        </div>
                    </NCTabPane>
                    <NCTabPane tab={me.state.json['1317SUUG-000048']} key="1">{/* 国际化处理： 历史查询*/}
                        <div className="card-area" style={{marginTop:10}}>
                            <SupupgradeQueryList {...baseConfig} ref={(SupupgradeQueryList)=>{me.SupupgradeQueryList=SupupgradeQueryList}}/>
                        </div>
                    </NCTabPane>
                </NCTabs>

            </div>
        )
    }
}
export default CustomerSupplier = createPage({
    //initTemplate:initTemplate
})(CustomerSupplier);
ReactDOM.render(<CustomerSupplier/>, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65