//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
/**
 * 物料按规则批改---卡片
 * @author yinshb
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,toast,getBusinessInfo,createPageIcon,promptBox,getMultiLang } from 'nc-lightapp-front';
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef/index'
import Rule from './rule';
const {NCSelect,NCDiv} = base;
const NCOption = NCSelect.NCOption;

var pagecodeValues = {};
var formid = 'base';
var tableid = 'rule';

const urls = {
    'queryBatchUpdateRuleTeam' : "/nccloud/uapbd/batchupdaterule/queryBatchUpdateRuleTeam.do",
    'readFromXml' : "/nccloud/uapbd/batchupdaterule/readFromXml.do",
    'wirteToXml' : "/nccloud/uapbd/batchupdaterule/writeToXml.do",
    'queryBatchUpdateTab' : '/nccloud/uapbd/material/queryBatchUpdateTab.do',
    'saveRuleTeam':'/nccloud/uapbd/batchupdaterule/saveRuleTeam.do',
    'delBatchUpdateRuleTeam':'/nccloud/uapbd/batchupdaterule/delBatchUpdateRuleTeam.do',
    'executeBatchUpRuleTeam':'/nccloud/uapbd/batchupdaterule/executeBatchUpRuleTeam.do'
}
const mdId = 'c7dc0ccd-8872-4eee-8882-160e8f49dfad';



let initTemplate = (props,modifierMeta,callback) => {
    props.createUIDom({
        pagecode : pagecodeValues.pagecode
    },(data)=>{
        data.button && props.button.setButtons(data.button);
        props.button.setButtonsVisible({
            ruleTeamAdd: false,
            ruleTeamEdit: false,
            ruleTeamDel: false,
            ruleTeamSave: false,
            Cancel : false,
            cardRefresh: false,
            execute:false,
            tableAdd:false,
            tableEdit:false,
            tableDel:false
        });
        let meta = data.template;
        meta = modifierMeta(meta);
        props.meta.setMeta(meta);
        setTimeout(() => {
            callback();
        }, 0);
    });
}


class Batchupdaterule extends Component {
    constructor(props){
        super(props);
        this.config = props.config;
        this.id = props.getUrlParam('id');
        this.pageStatus = props.getUrlParam('status');
        this.pageStatus = this.pageStatus ? this.pageStatus : 'browse';
        pagecodeValues = this.config.pagecodeValues;
        //页面state
        this.state = {
            formStatus : this.pageStatus,
            rule : {},
            form : {},
            tabs : [],
            options : [],
            BusinessUnit_enable : false,
            BusinessUnit : {
                refcode : props.getUrlParam('refcode'),
                refname : props.getUrlParam('refname'),
                refpk : props.getUrlParam('refpk'),
            },
            pk_org : [],
            json:{}
        };
        initTemplate(this.props,this.modifierMeta,()=>{
            this.props.form.setFormStatus(formid,this.state.formStatus);
            if(this.state.formStatus === 'add'){
                this.props.form.EmptyAllFormValue(formid);//清空表单数据
                //TODO 清空表格数据
                this.getAddData(()=>{
                    this.updateFormInput();
                    this.updatePageButton('add');
                    //处理组织默认值
                    let businessInfo = getBusinessInfo();
                    let pk_org = {};
                    if(this.props.config.node_type === 'ORG_NODE'){
                        pk_org.value = this.state.BusinessUnit.refpk;
                        pk_org.display = this.state.BusinessUnit.refname;
                    }else{
                        pk_org.value = businessInfo.groupId;
                        pk_org.display = businessInfo.groupName;
                    }
                    this.props.form.setFormItemsValue(formid,{pk_group:{value:businessInfo.groupId,display:businessInfo.groupName},pk_org:pk_org});
                });
            }else{
                this.getData(()=>{
                    this.props.form.setFormStatus(formid,this.state.formStatus);
                    this.updateFormInput();
                    this.updatePageButton(this.pageStatus);
                });
            }
        });
        this.initUpdateTab();
    }

    componentWillMount(){
        let callback = (json) => {
            console.log(this.state.json);
            this.setState({json});
        }
        getMultiLang({moduleId: '10140BURG',domainName: 'uapbd',callback});
    }

    /**
 * 初始化天
 */
initDay = () => {
    return [];
}

/**
 * 初始化周
 */
initWeek = () => {
    let week = [
        {
            value : 1 , display : this.state.json['10140BURG-000014']/* 国际化处理： 星期日*/
        },
        {
            value : 2 , display : this.state.json['10140BURG-000015']/* 国际化处理： 星期一*/
        },
        {
            value : 3 , display : this.state.json['10140BURG-000016']/* 国际化处理： 星期二*/
        },
        {
            value : 4 , display : this.state.json['10140BURG-000017']/* 国际化处理： 星期三*/
        },
        {
            value : 5 , display : this.state.json['10140BURG-000018']/* 国际化处理： 星期四*/
        },
        {
            value : 6 , display : this.state.json['10140BURG-000019']/* 国际化处理： 星期五*/
        },
        {
            value : 7 , display : this.state.json['10140BURG-000020']/* 国际化处理： 星期六*/
        }
    ];
    return week;
}

/**
 * 初始化月
 */
initMonth = () => {
    let month = [];
    for(let i=1;i<=28;i++){
        month.push({
            value : i,
            display : i+this.state.json['10140BURG-000030']/* 国际化处理： 日*/
        });
    }
    return month;
}

    /**
     * 初始化批改页签
     */
    initUpdateTab = () => {
        ajax({
            url : urls['queryBatchUpdateTab'],
            data : {mdId:mdId},
            success : (res) => {
                let {data} = res;
                if(data && data.tab){
                    data.tab.forEach(item => {
                        this.state.options.push(<NCOption value={item.pk_batchupdatetab}>{item.name}</NCOption>)
                        this.state.tabs.push(item);
                    });
                    this.setState(this.state);
                }
            }
        })
    }


    /**
     * 加工处理meta
     */
    modifierMeta = (meta) => {
        let that = this;
        meta['rule_team'].items.forEach(item=>{
            if(item.attrcode === 'frequencytype'){//周期类型
                item.itemtype = 'select';
                item.options = [
                    {
                        value : 3,display:this.state.json['10140BURG-000021']/* 国际化处理： 每日*/
                    },
                    {
                        value : 4,display:this.state.json['10140BURG-000022']/* 国际化处理： 每周*/
                    },
                    {
                        value : 5,display:this.state.json['10140BURG-000023']/* 国际化处理： 每月*/
                    }
                ];
            }else if(item.attrcode === 'executeday'){
                item.itemtype = 'select';
                item.options = this.initDay();
            }
        });
        let opr = {
            attrcode: 'opr',
            key : 'opr',
            label: this.state.json['10140BURG-000001'],/* 国际化处理： 操作*/
            visible: true,
            className:'table-opr',
            width:200,
            itemtype: 'customer',
            fixed:'right',
            render:(text, record, index) => {
                return this.props.button.createOprationButton(
                    ['tableEdit'],
                    {
                        area:'table_line',
                        buttonLimit:3,
                        onButtonClick : (props,id) => {
                            switch (id){
                                case 'tableEdit' ://行删除操作
                                    this.rule.show([record]);
                                    break;
                            }
                        }
                    }
                );
            }
        };
        meta[tableid].items.push(opr);
        return meta;
    }

    /**
     * 获取新增是默认的卡片数据
     */
    getAddData = (callback) => {
        //处理meta
        let meta = this.props.meta.getMeta();
        meta['rule_team'].items.forEach(item=>{
            if(item.attrcode === 'executeday'){
                item.options = this.initDay();
            }
        })
        this.props.meta.setMeta(meta);
        setTimeout(() => {
            callback && callback();
        }, 0);
    }

    /**
     * 查询卡片数据
     */
    getData = (callback) => {
        ajax({
            url : urls['queryBatchUpdateRuleTeam'],
            data : {pagecode : pagecodeValues.pagecode,pk:this.id},
            success : (res) => {
                let {data}  = res;
                console.log(data);
                if(data && data.head && data.head[formid] && data.head[formid].rows && data.head[formid].rows.length > 0){
                    let frequencytype = data.head[formid].rows[0].values.frequencytype.value;
                    let isautoexecute = data.head[formid].rows[0].values.isautoexecute.value;
                    let meta = this.props.meta.getMeta();
                    if(frequencytype === '5'){
                        meta['rule_team'].items.forEach(item=>{
                            if(item.attrcode === 'executeday'){
                                item.options = this.initMonth();
                            }
                        });
                    }else if(frequencytype === '4'){
                        meta['rule_team'].items.forEach(item=>{
                            if(item.attrcode === 'executeday'){
                                item.options = this.initWeek();
                            }
                        });
                    }else{
                        meta['rule_team'].items.forEach(item=>{
                            if(item.attrcode === 'executeday'){
                                item.options = this.initDay();
                            }
                        });
                    }
                    this.props.meta.setMeta(meta,()=>{
                        if(data && data.head && data.head[formid]){
                            this.props.form.setAllFormValue({[formid]:data.head[formid]});
                        }
                        if(data && data.bodys && data.bodys[tableid]){
                            this.props.cardTable.setTableData(tableid,data.bodys[tableid]);
                        }
                    });
                }else{
                    this.props.form.EmptyAllFormValue(formid);
                    this.props.cardTable.setTableData(tableid,{rows: []});
                }
                setTimeout(() => {
                    callback && callback(data);
                }, 0);
            }
        });
    }

    updateFormInput = () => {
        let isautoexecute = this.props.form.getFormItemsValue(formid,'isautoexecute');
        if( isautoexecute && isautoexecute.value){//自动执行
            let frequencytype = this.props.form.getFormItemsValue(formid,'frequencytype');
            this.props.form.setFormItemsDisabled(formid,{frequencytype:false,executeday:frequencytype && frequencytype.value === '3',executetime:false});
            if(frequencytype && frequencytype.value === '3'){
                this.props.form.setFormItemsRequired(formid,{frequencytype:true,executeday:false,executetime:true});
            }else{
                this.props.form.setFormItemsRequired(formid,{frequencytype:true,executeday:true,executetime:true});
            }
        }else{//手动执行
            this.props.form.setFormItemsDisabled(formid,{frequencytype:true,executeday:true,executetime:true});
            this.props.form.setFormItemsRequired(formid,{frequencytype:false,executeday:false,executetime:false});
        }
    }

    /**
     * 翻页组件点击事件
     */
    pageInfoClick = (props,pk) => {
        if(pk && pk !== this.materialID){
            this.props.cardPagination.setCardPaginationId({id:pk});
            this.props.setUrlParam({id:pk,status:'browse'});
            this.id = pk;
            this.getData();
        }
    }

    /**
     * 表单编辑后事件
     */
    afterEvent = (props, moduleId, key, value,oldValue) => {
        if(key === 'isautoexecute'){
            if(value && value.value){//自动执行
                let frequencytype = this.props.form.getFormItemsValue(formid,'frequencytype');
                this.props.form.setFormItemsDisabled(formid,{frequencytype:false,executeday:frequencytype && frequencytype.value === '3',executetime:false});
                this.props.form.setFormItemsRequired(formid,{frequencytype:true,executeday:true,executetime:true});
                this.props.form.setFormItemsValue(formid,{'frequencytype':{value:3},'executeday':{},'executetime':{value:'22:00:00',display:'22:00:00'}});
            }else{//手动执行
                this.props.form.setFormItemsDisabled(formid,{frequencytype:true,executeday:true,executetime:true});
                this.props.form.setFormItemsValue(formid,{'frequencytype':{},'executeday':{},'executetime':{}});
                this.props.form.setFormItemsRequired(formid,{frequencytype:false,executeday:false,executetime:false});
                let meta = this.props.meta.getMeta();
                meta['rule_team'].items.forEach(item=>{
                    if(item.attrcode === 'executeday'){
                        item.options = [];
                    }
                });
                this.props.meta.setMeta(meta);
            }
        }else if(key === 'frequencytype'){//周期类型
            this.props.form.setFormItemsValue(formid,{'executeday':{}});
            let options = [];
            if(value.value == 3){
                options = this.initDay();
                this.props.form.setFormItemsRequired(formid,{frequencytype:true,executeday:false,executetime:true});
            }else if(value.value == 4){
                options = this.initWeek();
                this.props.form.setFormItemsRequired(formid,{frequencytype:true,executeday:true,executetime:true});
				this.props.form.setFormItemsDisabled(formid,{frequencytype:false,executeday:false,executetime:false});
            }else if(value.value == 5){
                options = this.initMonth();
                this.props.form.setFormItemsRequired(formid,{frequencytype:true,executeday:true,executetime:true});
				this.props.form.setFormItemsDisabled(formid,{frequencytype:false,executeday:false,executetime:false});
            }
            let meta = this.props.meta.getMeta();
            meta['rule_team'].items.forEach(item=>{
                if(item.attrcode === 'executeday'){
                    item.options = options;
                }
            });
            this.props.meta.setMeta(meta);
        }

    }

    /**
     * 子表编辑后事件
     */
    onTableAfterEvent = () => {

    }

    /**
     * 子表肩部按钮点击事件
     */
    tableButtonClick = (props,id) => {
        switch(id){
            case 'tableAdd':
                this.rule.show();
                break;
            case 'tableEdit' :
                let rows = this.props.cardTable.getCheckedRows(tableid);
                if(rows.length != 1){
                    toast({title:this.state.json['10140BURG-000024'],color:'warning',content:this.state.json['10140BURG-000025']});/* 国际化处理： 提示,只能选择一行数据进行编辑*/
                    return;
                }
                this.rule.show(rows);
                break;
            case 'tableDel':
                let delrows = this.props.cardTable.getCheckedRows(tableid);
                if(!delrows || delrows.length < 1){
                    toast({title:this.state.json['10140BURG-000024'],color:'warning',content:this.state.json['10140BURG-000026']});/* 国际化处理： 提示,请选择要删除的数据*/
                    return;
                }
                let delIndex = [];
                delrows.forEach(item=>{
                    delIndex.push(item.index);
                });
                this.props.cardTable.delRowsByIndex(tableid,delIndex);
                break;
        }
    }

    /**
     * 子表肩部按钮
     */
    getTableHead = () => {
        let {button} = this.props;
		let { createButtonApp } = button;
        return (
			<div className="shoulder-definition-area">
				<div className="definition-icons">
					{createButtonApp({
						area: 'table_head',//按钮注册中的按钮区域
						onButtonClick: this.tableButtonClick
					})}
				</div>	
			</div>
        )
    }

    /**
     * 按钮点击事件
     */
    onButtonClick = (props,id) => {
        let that = this;
        switch(id){
            case 'execute':
                let execute_pk = this.props.form.getFormItemsValue(formid,'pk_batchupruleteam');
                let execute_ts = this.props.form.getFormItemsValue(formid,'ts');
                if(!execute_pk || !execute_pk.value){
                    return;
                }
                ajax({
                    url : urls['executeBatchUpRuleTeam'],
                    data : {pk:execute_pk.value,ts:execute_ts.value},
                    success : (res) => {
                        let {success} = res;
                        if(success){
                            toast({title:this.state.json['10140BURG-000007'],color:'success'});/* 国际化处理： 执行成功！*/
                            this.getData();
                        }
                    }
                })
                break;
            case 'ruleTeamAdd':
                this.getAddData(()=>{
                    this.props.form.setFormStatus(formid,'add');
                    this.setState({formStatus:'add'});
                    this.updateFormInput();
                    this.updatePageButton('add');
                    let businessInfo = getBusinessInfo();
                    let pk_org = {};
                    if(this.props.config.node_type === 'ORG_NODE'){
                        pk_org.value = this.state.BusinessUnit.refpk;
                        pk_org.display = this.state.BusinessUnit.refname;
                    }else{
                        pk_org.value = businessInfo.groupId;
                        pk_org.display = businessInfo.groupName;
                    }
                    console.log(formid);
                    //清空表单
                    this.props.form.EmptyAllFormValue(formid);
                    this.props.form.setFormItemsValue(formid,{pk_group:{value:businessInfo.groupId,display:businessInfo.groupName},pk_org:pk_org});
                    //清空子表
                    this.props.cardTable.setTableData(tableid,{rows: []});
                });
                break;
            case 'ruleTeamEdit':
                this.props.form.setFormStatus(formid,'eidt');
                this.setState({formStatus:'edit'});
                this.updateFormInput();
                this.updatePageButton('edit');
                break;
            case 'Cancel':
                this.props.form.cancel(formid);
                this.setState({formStatus:'browse'});
                this.updatePageButton('browse');
                this.getData();
                break;
            case 'ruleTeamDel':
                let pk = this.props.form.getFormItemsValue(formid,'pk_batchupruleteam');
                let ts = this.props.form.getFormItemsValue(formid,'ts');
                if(!pk || !pk.value){
                    return;
                }
                promptBox({
                    color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140BURG-000024'], /* 国际化处理： 提示*/
					content: this.state.json['10140BURG-000027'], /* 国际化处理： 确定删除该条数据吗？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140BURG-000028'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140BURG-000029'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick:()=>{
                        ajax({
                            url : urls['delBatchUpdateRuleTeam'],
                            data : {pk:pk.value,ts:ts.value},
                            success : (res) => {
                                let { success , data} = res;
                                if(success){
                                    toast({title:this.state.json['10140BURG-000002'],color:'success'});/* 国际化处理： 删除成功！*/
                                    this.id = this.props.cardPagination.getNextCardPaginationId({id:pk.value,status:3});
                                    this.props.cardPagination.setCardPaginationId({id:this.id});
                                    this.getData(()=>{this.updatePageButton('browse')});
                                }
                            }
                        });
                    }
                });
                
                break;
            case 'ruleTeamSave':
                let CardData = this.props.createMasterChildData(pagecodeValues.pagecode, formid, tableid);
                let reqData = {
                    pageid : CardData.pageid,
                    head : CardData.head,
                    bodys : CardData.body,
                }
                ajax({
                    url : urls['saveRuleTeam'],
                    data : reqData,
                    success : (res) => {
                        let {data} = res;
                        if(data && data.head && data.head[formid]){
                            this.id = data.head[formid].rows[0].values.pk_batchupruleteam.value;
                            this.props.form.setAllFormValue({[formid]:data.head[formid]});
                        }
                        if(data && data.bodys && data.bodys[tableid]){
                            this.props.cardTable.setTableData(tableid,data.bodys[tableid]);
                        }
                        this.props.form.setFormStatus(formid,'browse');
                        this.setState({formStatus : 'browse'});
                        this.updatePageButton('browse');
                        this.getData();
                    }
                })
                
                break;
            case 'cardRefresh':
                this.getData();
                break;
            case 'Reback':
                props.pushTo('/list',{
                pagecode:this.props.config.pagecodelist});
                break;
        }
    }

    updatePageButton = (status) => {
        if(status === 'browse'){
            //浏览态
            this.props.button.setButtonsVisible({
                ruleTeamAdd: true,
                ruleTeamEdit: true,
                ruleTeamDel: true,
                ruleTeamSave: false,
                Cancel : false,
                cardRefresh: true,
                execute:true,
                tableAdd:false,
                tableEdit:false,
                tableDel:false
            });
            let ruleTeamAdd=false,ruleTeamEdit=false, ruleTeamDel=false,execute=false,cardRefresh=false;
            if(this.props.config.node_type === 'ORG_NODE'){
                this.setState({BusinessUnit_enable:false});
                if(this.state.BusinessUnit.refname && this.state.BusinessUnit.refpk){
                    ruleTeamAdd=false;
                    ruleTeamEdit=false;
                    ruleTeamDel=false;
                    execute=false;
                    cardRefresh=false;
                }else{
                    ruleTeamAdd=true;
                    ruleTeamEdit=true;
                    ruleTeamDel=true;
                    execute=true;
                    cardRefresh=true;
                }
            }
            let execute_pk = this.props.form.getFormItemsValue(formid,'pk_batchupruleteam');
            if(!execute_pk || !execute_pk.value){
                ruleTeamEdit=true;
                ruleTeamDel=true;
                execute=true;
                cardRefresh=true;
            }
            this.props.button.setDisabled({
                ruleTeamAdd: ruleTeamAdd,
                ruleTeamEdit: ruleTeamEdit,
                ruleTeamDel: ruleTeamDel,
                execute:execute,
                cardRefresh:cardRefresh
            });
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }else if(status === 'add'){
            //新增
            this.props.button.setButtonsVisible({
                ruleTeamAdd: false,
                ruleTeamEdit: false,
                ruleTeamDel: false,
                ruleTeamSave: true,
                Cancel : true,
                cardRefresh: false,
                execute:false,
                tableAdd:true,
                tableEdit:true,
                tableDel:true
            });
            this.setState({BusinessUnit_enable:true});
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else if(status === 'edit'){
            //编辑态
            this.props.button.setButtonsVisible({
                ruleTeamAdd: false,
                ruleTeamEdit: false,
                ruleTeamDel: false,
                ruleTeamSave: true,
                Cancel : true,
                cardRefresh: false,
                execute:false,
                tableAdd:true,
                tableEdit:true,
                tableDel:true
            });
            this.setState({BusinessUnit_enable:true});
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }
    }

    BusinessUnitChange = (value) => {
        this.setState({
            BusinessUnit : value
        },()=>{
            this.updatePageButton('browse');
        });
    }

    render(){
        let { button,cardTable,form,cardPagination,BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
        let { createForm } = form;
        let {createCardTable } = cardTable;
        let { createButtonApp } = button;
        let that = this;
        const { createCardPagination } = cardPagination;
        return (
            <div className="nc-bill-card">
                <div className="nc-bill-top-area">
                    <NCDiv className="nc-bill-header-area" areaCode={NCDiv.config.HEADER}>
                        <div className="header-title-search-area">
                            {createBillHeadInfo({
                                title:this.state.json["10140BURG-000011"],/* 国际化处理： 批改规则*/
                                initShowBackBtn:this.state.formStatus != 'add' && this.state.formStatus != 'edit',
                                backBtnClick : ()=>{this.onButtonClick(this.props,'Reback')}
                            })}
                        </div>{/* 国际化处理： 批改规则*/}
                        <div className="header-title-search-area">
                            {this.props.config.node_type === 'ORG_NODE' && <BusinessUnitTreeRef
                                value = {this.state.BusinessUnit}
                                fieldid= {'BusinessUnitTreeRef'}
                                disabled = {this.state.BusinessUnit_enable}
                                onChange = {this.BusinessUnitChange}
                            />}
                        </div>
                        <div className="header-button-area">
                            {createButtonApp({
                                area: 'card_head',
                                buttonLimit: 3, 
                                onButtonClick: this.onButtonClick, 
                                popContainer: document.querySelector('.header-button-area')
        
                            })}
                        </div>
                        <div className='header-cardPagination-area' style={{float:'right'}}>
                            { createCardPagination({
                                handlePageInfoChange:this.pageInfoClick,
                                datasource:this.config.datasource
                            }) }
                        </div>
                    </NCDiv>
                    <div className="nc-bill-form-area">
                        {createForm(formid, {
                            expandArr : ['rule_team'],
                            onAfterEvent: this.afterEvent
                        })}
                    </div>
                </div>
                <div className="nc-bill-bottom-area">
                    <div className="nc-bill-table-area">
                        {createCardTable(tableid, {
                            tableHead: this.getTableHead,
                            onAfterEvent: this.onTableAfterEvent,
                            showCheck: true,
                            showIndex: true
                        })}
                    </div>
                </div>

                <Rule ref={(value)=>{this.rule = value}} json={this.state.json} tabs={this.state.tabs} options={this.state.options} {...this.props} />
            </div>
        )
    }

}

Batchupdaterule = createPage({
    initTemplate: function(){},
    //mutiLangCode: '10140MATERIAL'
})(Batchupdaterule);
export default Batchupdaterule;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65