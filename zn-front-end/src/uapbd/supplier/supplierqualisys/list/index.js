//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,print,cardCache,cacheTools,getBusinessInfo,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const {NCPopconfirm, NCIcon,NCTabs,NCCheckbox,NCBackBtn}=base;
const NCTabPane=NCTabs.NCTabPane;
const {setDefData, getDefData } = cardCache;
const dataSource = "supplierqualisys-list";
const key_list = "key_list";
const key_search = "key_search";
// import './index.less';

//业务单元参照
import CorpDefaultTreeRef from  '../../../../uapbd/refer/org/CorpDefaultTreeRef'

const isShowOffEnable = true;			//是否启用“显示停用”功能
const pageId = '10140SAQSG_qualidoc_list';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'supqualidoc';                 //表头id
const oId = '1001Z01000000000A9LN';     //查询区oid
const appid = '0001Z010000000001NMZ';   //注册按钮id
const linkItem = 'code';        //列表卡片跳转字段
const pk_item = 'pk_supqualidoc';           //列表主键
const queryListUrl = '/nccloud/uapbd/supplierqualisys/list.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/supplierqualisys/list.do';  //分页查询url
const printUrl = '/nccloud/uapbd/supplierqualisys/print.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/supplierqualisys/del.do';                 //删除url
let businessInfo = getBusinessInfo();

class List extends Component {
	constructor(props) {console.log('constructor');console.log(props);
		super(props);
		this.searchId = props.config.searchId;
        this.tableId = props.config.tableId;
        //显示停用复选框的状态标志
        this.state = {
            checked: false,//判断 显示停用按钮是否选中
            isShowOff: false,
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            method: null,//记录当前的操作，add=新增，edit=修改
            configs: {},
            curOrg: null,
            json: {}
        }
        this.cardUrl = "";
        this.listUrl = "";
        this.mainUrl = "";
        if(this.props.config.nodetype == 'group'){
            this.cardUrl = "/uapbd/supplier/supplierqualisys_grp/card/index.html";
            this.listUrl = "/uapbd/supplier/supplierqualisys_grp/list/index.html";
            this.mainUrl = "/uapbd/supplier/supplierqualisys_grp/main/index.html";
        }else{
            this.cardUrl = "/uapbd/supplier/supplierqualisys_org/card/index.html";
            this.listUrl = "/uapbd/supplier/supplierqualisys_org/list/index.html";
            this.mainUrl = "/uapbd/supplier/supplierqualisys_org/main/index.html";
        }
        this.initTemplate(props);
	}
	componentDidMount() {
		//this.getData(); //平台考虑效率，打开节点不直接加载数据
        this.toggleButton(this.props);
        console.log(this.props.config);
        console.log(this.props.config.defaultOrg);
        if(this.props.config.defaultOrg.pk_org != null && this.props.config.defaultOrg.pk_org.length > 0){
            setTimeout(()=>{
                this.props.search.setSearchValByField(this.searchId,'pk_org',{value:this.props.config.defaultOrg.pk_org, display:this.props.config.defaultOrg.org_Name});
            },1000);
        }
    }
    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10140SAQSG',domainName: 'uapbd',callback});
    }

    initTemplate =(props) =>{

        let _this = this;
        props.createUIDom(
            {
                pagecode: props.config.pageCode,//页面id
                // appcode:config.appcode,
                // appid: config.appid//注册按钮的id
            },
            (data) => {console.log('inittemplage');console.log(data);
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                        businessInfo = getBusinessInfo();
                        if(businessInfo != null){
                            props.search.setSearchValByField(props.config.searchId,'pk_org',{value:businessInfo.groupId,display:businessInfo.groupName});
                        }let searchVal = cacheTools.get("searchParams");
                        console.log('searchParams');
                        console.log(searchVal);
                        if(searchVal == null || searchVal == false){
                            searchVal = [];
                        }searchVal = [];
                        if(searchVal && searchVal != false || true){
                            // searchVal.map((v)=>{
                            // 	props.search.setSearchValByField('searchArea',v.field,v.display);
                            // 	return v;
                            // })
                            // props.search.setSearchValue(config.searchId,searchVal);
                            let data = {
                                conditions: searchVal,
                                pageInfo: {
                                    pageIndex: 0,
                                    pageSize: 10,
                                    total: 0,
                                    totalPage: 0
                                },
                                pagecode: props.config.pageId,
                                queryAreaCode: props.config.searchId,  //查询区编码
                                oid: props.config.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                                queryType:'tree',
                                template:props.config.template
                            };
                            let { hasCacheData } = props.table;
                            if(hasCacheData(dataSource)){
                                console.log(this.state.json['10140SAQSG-000061']);/* 国际化处理： 使用缓存*/
                                return;
                            }
                            ajax({
                                url: queryListUrl,
                                data,
                                success: (res) => {
                                    console.log('queryListUrl');
                                    console.log(res);
                                    if(res.data){console.log(11);console.log(res.data[props.config.tableId]);
                                        setDefData(key_list,dataSource,res.data[props.config.tableId]);
                                        props.table.setAllTableData(props.config.tableId, res.data[props.config.tableId]);
                                        //toast({content:'查询成功，共'+res.data[config.tableId].pageInfo.total+'条数据。',color:'success'});
                                    }else{
                                        //toast({content:'未查询出符合条件的数据。',color:'warning'});
                                    }
                                },
                                error : (res)=>{
                                    console.log(res);
                                }
                            });
                        }
                    }
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    console.log(data.context);
                    props.config.defaultOrg = {pk_org:data.context.pk_org,org_Name:data.context.org_Name};
                }
            }
        )
    }
    
    modifierMeta = (props, meta) => {
            meta[props.config.searchId].items = meta[props.config.searchId].items.map((item, key) => {
                item.col = '3';
                return item;
            });
            
            //查询参数参照
            let searchItems = meta[props.config.searchId].items;
            for(let i = 0; i < searchItems.length; i++){
                if(searchItems[i].attrcode == 'pk_org'){//所属组织
                    searchItems[i].isRunWithChildren =true;
                }
                if(searchItems[i].attrcode == 'pk_qualitype'){//资质分类
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/SupplierQualiTypeTreeRef/index.js';
                }
            }
    
            meta[props.config.tableId].pagination = true;
            meta[props.config.tableId].items = meta[props.config.tableId].items.map((item, key) => {
                //item.width = 150;
                if (item.attrcode == 'cmaterialvid') {//
                    item.render = (text, record, index) => {
                        return (
                            <span
                                style={{color: '#007ace', cursor: 'pointer' }}
                                onClick={() => {
                                    let searchVal = props.search.getAllSearchData(searchId);
                                    props.CacheTools.set("searchParams",searchVal);
                                    props.CacheTools.set('preid',record[props.config.pk_item].value);
                                    props.pushTo('/card', {
                                        pagecode:props.config.pageCodeCard,
                                        status: 'browse',
                                        id: record['pk_setpart'].value//列表卡片传参
                                    });
                                }}
                            >
                                {record && record['cmaterialvid'] && record['cmaterialvid'].value}
                            </span>
                        );
                    };
                }
                return item;
            });
            //添加操作列
            console.log("meta push");
            meta[props.config.tableId].items.push({
                attrcode: 'opr',
                label: this.state.json['10140SAQSG-000001'],/* 国际化处理： 操作*/
                width: 200,
                fixed: 'right',
                className : 'table-opr',
                visible: true,
                render: (text, record, index) => {
                    return (
                        <span>
                            {/* <NCIcon
                                type="uf-pencil-s"
                                onClick={() => {
                                    props.linkTo('../card/index.html', {
                                        status: 'edit',
                                        id: record.crevecontid.value
                                    });
                                }}
                            /> */}
                            <span
                                style={{cursor: 'pointer' }}
                                onClick={() => {
                                    props.pushTo('/card', {
                                        pagecode:props.config.pageCodeCard,
                                        status: 'browse',
                                        id: record[props.config.pk_item].value
                                    });
                                }}
                            >
                                {this.state.json['10140SAQSG-000058']/* 国际化处理： 详情*/}
                            </span><span>&nbsp; &nbsp;</span>
                            {/* <NCPopconfirm
                                trigger="click"
                                placement="top"
                                content='确定删除？'
                                onClose={() => {
                                    ajax({
                                        url: deleteUrl,
                                        data: {deleteinfo:[{
                                            id: record[config.pk_item].value,
                                            ts: record.ts.value
                                        }]},
                                        success: (res) => {
                                            if (res.success) {
                                                toast({ color: 'success', content: '删除成功' });
                                                props.table.deleteTableRowsByIndex(config.tableId, index);
                                            }
                                        }
                                    });
                                }}
                            >
                                <span style={{cursor: 'pointer' }}>删除</span>
                            </NCPopconfirm> */}
                        </span>
                    );
                }
            });
            return meta;
        }
    
    //显示停用数据
	showOffChange(){
		this.setState({
			isShowOff : !this.state.isShowOff
        },()=>{
            // if(this.props.config.nodetype == 'org' && this.state.curOrgObj == null){
            //     return;
            // }
            this.refreshAction(this.props);
        });
		// this.getData(this.state.isShowOff);
	}

     //切换页面状态
    toggleButton = (props) => {return;
        let status = props.getUrlParam('status');
        let flag = status === 'browse' ? false : true;
        //按钮的显示状态
        if(status == 'edit' || status == 'add'){
            props.button.setButtonVisible(['edit','add','back','delete','refresh'],false);
            props.button.setButtonVisible(['save','cancel','addline'],true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else{
            props.button.setButtonVisible(['save','cancel','addline'],false);
            props.button.setButtonVisible(['add','edit','delete','back','refresh'],true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
        props.form.setFormStatus(formId, status);
        props.cardTable.setStatus(tableId, status);
    };

	getButtonNames = (codeId) => {
		if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
			return 'main-button'
		}else {
			return 'secondary - button'
		}
	};

    buttonClick(props, id) {
        switch (id) {
            case 'print':
                let allD = this.props.table.getAllTableData(this.tableId);
                let pks = [];
                allD.rows.forEach((item,index)=>{
                    pks.push(item.values['pk_supqualidoc'].value);
                });console.log('printPks');console.log(pks);
                print(
                    'pdf',
                    printUrl,
                    {
                        billtype:'',//单据类型
                        funcode:'10140SAQSG',//功能节点编码，即模板编码
                        nodekey:'nccloud',//模板节点标识
                        oids:pks,//单据pk
                    }
                );
                break;
            case 'add':
                props.pushTo('/card',{
                    pagecode:props.config.pageCodeCard,
                    status:'add'
                })
                // this.props.CacheTools.remove('preid');
                break;
            case 'edit':
                props.pushTo('/card',{
                    pagecode:props.config.pageCodeCard,
                    status:'edit'
                })
                break;
            case 'back':
                props.pushTo('/main',{
                    pagecode:props.config.pageCode,
                    status:'browse'
                });
                break;		
            case 'refresh':
                this.refreshAction(props,'refresh');
                break;
            case 'delete':
                this.deleteAction(props);
                break;
            default:
                break;
        }
    }

	doubleClick = (record, index, e)=>{
            
        console.log(this.state.json['10140SAQSG-000063']);/* 国际化处理： 双击*/
        console.log(this)
        let searchVal = this.props.search.getAllSearchData("search");
        // this.props.CacheTools.set("searchParams", searchVal);
        // this.props.CacheTools.set('preid',props.getUrlParam('id'));
        this.props.pushTo('/card', {
            pagecode:props.config.pageCodeCard,
            status: 'browse',
            id: record[pk_item].value
        });
	}

    deleteAction = (props) =>{
        let data = props.table.getCheckedRows(tableId);
        console.log(data)
        let params = {deleteinfo:data.map((v)=>{
            let id = v.data.values[pk_item].value;
            let ts = v.data.values.ts.value;
            return {
                id,ts
            }
        })}
        console.log(params)
        ajax({
            url: deleteUrl,
            data: params,
            success: (res) => {
                toast({color:"success",title:this.state.json['10140SAQSG-000014']});/* 国际化处理： 删除成功,删除成功*/
                this.refreshAction(props);
            }
        });
    }

    refreshAction =(props,flag)=>{
        let searchVal = props.search.getAllSearchData(searchId);
        let queryInfo = this.props.search.getQueryInfo(searchId);
        let oid = queryInfo.oid;
        console.log(searchVal);
        if(searchVal != false){
            let data = {
                querycondition:{
                    conditions: searchVal == null?null:searchVal.conditions,
                    logic: searchVal == null?null:searchVal.logic,
                },
                custcondition:{
                    conditions:[
                        {field:'nodetype',value:{firstvalue:props.config.nodetype}},
                        {field:'curOrg',value:{firstvalue:this.state.curOrg}},
                        {field:'isShowOff',value:{firstvalue:this.state.isShowOff?'1':'0'}}
                    ]
                },
                pageInfo: {
                    pageIndex: 0,
                    pageSize: 10,
                    total: 0,
                    totalPage: 0
                },
                pagecode: pageId,
                queryAreaCode:searchId,  //查询区编码
                oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                queryType:'tree',
                querytype:'tree',
                template:props.config.template,
                showOfff:this.state.isShowOff
            };
    
            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);
                    if(res.data){
                        setDefData(key_list,dataSource,res.data[tableId]);
                        props.table.setAllTableData(tableId, res.data[tableId]);
                    }else{
                        props.table.setAllTableData(tableId, {rows:[]});
                        //toast({content:"无数据",color:"warning"});
                    }
                    if(flag == 'refresh'){
                        toast({title:this.state.json['10140SAQSG-000005'],color:"success"});/* 国际化处理： 刷新成功！*/
                    }
                },
                error : (res)=>{
                    console.log(res.message);
                }
            });
        }
    }

    pageInfoClick = (props, config, pks)=>{
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchVal = props.search.getAllSearchData(searchId);
        // 后台还没更新，暂不可用
        let data = {
            querycondition:{
                conditions: searchVal == null?null:searchVal.conditions,
                logic: searchVal == null?null:searchVal.logic,
            },
            custcondition:{
                conditions:[
                    {field:'nodetype',value:{firstvalue:props.config.nodetype}},
                    {field:'curOrg',value:{firstvalue:this.state.curOrg}},
                    {field:'isShowOff',value:{firstvalue:this.state.isShowOff?'1':'0'}}
                ]
            },
            "allpks": pks,
            "pageid": pageId,
            'pageInfo':pageInfo,
            pagecode: pageId,
            queryAreaCode:searchId,  //查询区编码
            oid:oId,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            queryType:'tree',
            querytype:'tree',
            template:props.config.template,
            showOfff:this.state.isShowOff
        };
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: queryPageUrl,
            data: data,
            success: function(res) {
                let { success, data } = res;
                if (success) {
                    if (data) {console.log(props);
                        setDefData(key_list,dataSource,res.data[props.config.tableId]);
                        props.table.setAllTableData(props.config.tableId, data[props.config.tableId]);
                    } else {
                        props.table.setAllTableData(props.config.tableId, { rows: [] });
                    }
                }
            }
        });
    }

    onSearchAfterEvent = (field, val) => {
        console.log('onSearchAfterEvent');
        console.log(field);
        console.log(val);
        let searchVal = this.props.search.getAllSearchData(this.searchId,false);
        cacheTools.set("searchParams", searchVal);
        if(val == null || val == undefined|| val.refcode == null || val.refcode == undefined){
            return;
        }
        let value = this.props.search.getSearchValByField( this.searchId, field );
        if(field === 'cmaterialoid.code'){//成套件编码
            value.display = val.refcode;
            value.value.firstvalue = val.refcode;
        }else if(field === 'cmaterialoid.name'){//成套件名称
            value.display = val.refname;
            value.value.firstvalue = val.refname;
        }else if(field === 'pk_setpart_b.cmaterialoid'){//配件名称
            value.display = val.refcode;
            value.value.firstvalue = val.refcode;
        }else if(field === 'pk_setpart_b.cmaterialoid.name'){//配件名称
            value.display = val.refname;
            value.value.firstvalue = val.refname;
        }
        value.value = value.value.firstvalue;
        this.props.search.setSearchValByField(this.searchId,field,value);
        console.log(this.props.search.getSearchValByField(this.searchId,field));
    }

    clickSearchBtn = (props,searchVal)=>{
        console.log('clickSearchBtn');
        searchVal = this.props.search.getAllSearchData("search");
        let queryInfo = this.props.search.getQueryInfo("search");
        let oid = queryInfo.oid;
        console.log(searchVal);
        let metaData = props.meta.getMeta();
        let data = {
            querycondition:{
                conditions: searchVal == null?null:searchVal.conditions,
                logic: searchVal == null?null:searchVal.logic,
            },
            custcondition:{
                conditions:[
                    {field:'nodetype',value:{firstvalue:this.props.config.nodetype}},
                    {field:'curOrg',value:{firstvalue:this.state.curOrg}}
                ]
            },
            pageInfo: {
                pageIndex: 0,
                pageSize: 10,
                total: 0,
                totalPage: 0
            },
            pagecode: pageId,
            queryAreaCode:searchId,  //查询区编码
            oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            queryType:'tree',
            querytype:'tree',
            template:this.props.config.template,
            showOfff:this.state.isShowOff
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if(res.data){
                    props.table.setAllTableData(this.tableId, res.data[this.props.config.tableId]);
                    toast({content:this.state.json['10140SAQSG-000064']+res.data[this.props.config.tableId].pageInfo.total+this.state.json['10140SAQSG-000065'],color:'success'});/* 国际化处理： 查询成功，共,条数据。*/
                }else{
                    props.table.setAllTableData(this.tableId, {rows:[]});
                    toast({content:this.state.json['10140SAQSG-000066'],color:'warning'});/* 国际化处理： 未查询出符合条件的数据。*/
                    //toast({content:"无数据",color:"warning"});
                }
            }/*,
            error : (res)=>{
                console.log(res.message);
            }*/
        });
    }

    //参照回写方法
    createCfg(id,param){
        // console.log('createCfg');
        // console.log(id);
        // console.log(param);
        var obj={
            value:this.state.configs[id]?this.state.configs[id].value:[],
            onChange:function (val) {
                console.log('onChange--'+val);
                console.log(val);
                this.state.curOrg = val.refpk;
                this.refreshAction(this.props);
                // this.loadTree();//重新加载树
                // var temp= Object.assign(this.state.configs[id],{value:val});
                // this.setState(Object.assign (this.state.configs,temp));
            }.bind(this)
        }
        this.state.configs[id]=obj;
        var result_param= Object.assign(obj, param)
        return result_param;
    }

	render() {
		let { table, button, search } = this.props;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
        let { createButton, getButtons } = button;
        let { createButtonApp } = button;

        let createOrgRender = () => {
            return  this.props.config.nodetype && this.props.config.nodetype === 'org' ? (
                <div className="search-box">
                {CorpDefaultTreeRef({
                    // onChange:this.onOrgChange.bind(this),
                    // value:this.state.curOrg
                    //placeholder: '重写这个参照的名字',
                    //如果需要对参照过滤 可以加queryCondition参数
                    //queryCondition:{
                    //}
                }=this.createCfg("CorpDefaultTreeRef",{
                    "pid":"",
                    "keyword":"",
                    "pageInfo":{
                        "pageIndex":0,
                        "pageSize":10,
                        "totalPage":"0"
                    },
                        queryCondition: function(){
                            return {
                                //此处可以添加参数
                                isShowDisabledData: true,
                            };
                        }}))}
                </div>
            ) : '';
        };

		return (<div className="nc-bill-list">
				<div className='nc-bill-header-area'>
					<div className='header-title-search-area'>
                    <NCBackBtn className='title-search-detail' style={{marginRight:'6px',marginTop: '8px'}}
                                           onClick={ this.buttonClick.bind(this,this.props,'back') }></NCBackBtn>
                        {createPageIcon()}
					    <h2 className='title-search-detail'>{this.state.json[this.props.config.nodeName]}</h2></div>
                    {/* {createOrgRender()} */}
                    {/* 显示停用数据 */}
						<div className="title-search-detail">
							{isShowOffEnable?(
								<span className="showOff">
									<NCCheckbox
										checked={this.state.isShowOff}
										onChange={this.showOffChange.bind(this)}
										// disabled={this.state.isShowOff}
									>{this.state.json['10140SAQSG-000055']/* 国际化处理： 显示停用*/}</NCCheckbox>
								</span>
							):('')}
						</div>
					<div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',//按钮注册中的按钮区域
                            //buttonLimit: 5, 
                            onButtonClick: this.buttonClick.bind(this) 
                            //popContainer: document.querySelector('.header-button-area')
                        })}
					</div>
				</div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
                        clickSearchBtn: this.clickSearchBtn.bind(this),
                        onAfterEvent: this.onSearchAfterEvent.bind(this),  //编辑后事件
					})}
				</div>
				<div style={{height:'0px',backgroundColor:'#EDEDED'}}></div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: this.pageInfoClick,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:true,
                        showCheck:true,
                        dataSource: dataSource,
						onRowDoubleClick: this.doubleClick.bind(this)
					})}
				</div>
			</div>
		);
	}
}

// List = createPage({
// 	initTemplate: initTemplate
// })(List);

// ReactDOM.render(<List />, document.querySelector('#app'));

export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65