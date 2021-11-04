//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,print,high,cardCache,promptBox,cacheTools,getMultiLang,createPageIcon, getBusinessInfo } from 'nc-lightapp-front';
const {NCPopconfirm, NCIcon,NCTabs,NCDiv}=base;
const NCTabPane=NCTabs.NCTabPane;
const {PrintOutput} = high;
const {setDefData, getDefData } = cardCache;
const dataSource = "paramsys-list";
const key_list = "key_list";
const key_search = "key_search";
import './index.less';
import '../../../public/uapbdstyle/uapbd_style_common.less'
import { relativeTimeThreshold } from 'moment';

const pageId = '10140CSSPD_configparam_list';        //pagecode
const searchId = 'queryparam';              //查询区id
const tableId = 'paraminfo';                 //表头id
const oId = '1002Z010000000000WGM';     //查询区oid
const appid = '0001Z0100000000012Q7';   //注册按钮id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_sysconfig_id';           //列表主键
const queryListUrl = '/nccloud/uapbd/paramsys/query.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/paramsys/query.do';  //分页查询url
const printUrl = '/nccloud/uapbd/paramsys/print.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/paramsys/del.do';                 //删除url
const submitBackConfirmUrl = '/nccloud/uapbd/paramsys/submit.do';
const appcode = "10140CSSPD";

class List extends Component {
	constructor(props) {
		super(props);
		this.searchId = searchId;
        this.tableId = tableId;
        this.state = {
            json: {}
        };
        this.lastPk = '';
        this.initTemplate(props);
	}
	componentDidMount() {
        //this.getData(); 平台考虑效率，打开节点不直接加载数据
        // window.onbeforeunload = () => {
        //     return '';
            // alert(123);
			// promptBox({
            //     color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            //     title: "注意",                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
            //     content: '确认删除？',             // 提示内容,非必输
            //     // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            //     // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            //     // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
            //     // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
            //     beSureBtnClick: ()=>{},
            //     cancelBtnClick: () => {}
            // });
        // }
        this.props.button.setDisabled({
            print:true,
            output:true
        });
        this.toggleButton();

        let businessInfo = getBusinessInfo()
        if(businessInfo) {
            this.currUserId = businessInfo.userId
        }
    }
    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10140CSSPD',domainName: 'uapbd',callback});
    }

initTemplate =(props) =>{console.log('initTemplate');

	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
            // appid: appid,//注册按钮的id
            // appcode:'10140CSSPD'
		},
		(data) => {
            console.log('initTemplate');
            console.log(data);
			if (data) {
				if (data.template) {
					let meta = data.template;
                    meta = this.modifierMeta(props, meta)
                    if (data.button) {
                        let button = data.button;
                        props.button.setButtons(button);
                    }
                    props.meta.setMeta(meta);
                    let searchVal = cacheTools.get(searchId);
                    if(searchVal != null && searchVal.conditions != null){
                        props.search.setSearchValue(searchId,searchVal);
                    }
                    //listQuery(props);
				}
                props.button.setPopContent('tabledel',this.state.json['10140CSSPD-000000']);/* 国际化处理： 确认删除？*/
			}
		}
	)
}

listQuery = (props) => {
    let { hasCacheData } = props.table;
    if(hasCacheData(dataSource)){
        console.log(this.state.json['10140CSSPD-000001']);/* 国际化处理： 初始化使用缓存数据*/
        return;
    }
    console.log(this.state.json['10140CSSPD-000002']);/* 国际化处理： 初始化查询数据*/
    let searchVal =props.search.getAllSearchData(searchId);
    console.log('listQuery');
    console.log(searchVal);
    if(searchVal == null || searchVal == false){
        searchVal = [];
    }searchVal = [];
    if(searchVal && searchVal != false || true){
        // searchVal.map((v)=>{
        // 	props.search.setSearchValByField('searchArea',v.field,v.display);
        // 	return v;
        // })
        props.search.setSearchValue(searchId,searchVal);
        let pageInfo = props.table.getTablePageInfo(tableId);
        let data = {
            conditions: searchVal == null?null:searchVal.conditions,
            pageInfo: pageInfo,
            pagecode: pageId,
            queryAreaCode: searchId,  //查询区编码
            oid: oId,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            queryType:'tree'
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log('queryListUrl');
                console.log(res);
                if(res.data){
                    props.table.setAllTableData(tableId, res.data[tableId]);
                }else{
                    // toast({content:"无数据",color:"warning"});
                }
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }
}
tableButtonClick = (props, id, text, record, index) => {
    console.log(id);console.log(record);console.log(index);
    console.log(cacheTools);
    switch(id){
        case 'tableedit':
            if(record.creator && record.creator.value && record.creator.value != this.currUserId) {
                toast({content:this.state.json['10140CSSPD-000144'],color:'warning'});/* 国际化处理： 您无法对他人创建的申请单进行该操作*/
                return
            }
            props.pushTo('/card', {
                status: 'edit',
                pagecode:'10140CSSPD_configparam_card',
                id: record[pk_item].value
            });
            break;
        case 'tabledel':
            if(record.creator && record.creator.value && record.creator.value != this.currUserId) {
                toast({content:this.state.json['10140CSSPD-000144'],color:'warning'});/* 国际化处理： 您无法对他人创建的申请单进行该操作*/
                return
            }
            if(record['approvestatus'].value != -1){
                toast({content:this.state.json['10140CSSPD-000003'],color:'warning'});/* 国际化处理： 非自由态单据不可删除*/
                return;
            }
            ajax({
                url: deleteUrl,
                data: {deleteinfo:[{
                    id: record[pk_item].value,
                    ts: record.ts.value
                }]},
                success: (res) => {
                    if (res.success) {
                        toast({ color: 'success', title: this.state.json['10140CSSPD-000004'] });/* 国际化处理： 删除成功！*/
                        props.table.deleteTableRowsByIndex(tableId, index);
                    }
                }
            });
            break;
        default:
            break;
    }
}
modifierMeta = (props, meta) => {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
        //item.col = '3';
        console.log(item);
        // if(item.itemtype === 'refer' && (item.refcode == null)){
        //     item.refcode = '';
        // }
        if(item.attrcode === 'pk_org'){console.log(this.state.json['10140CSSPD-000005']);/* 国际化处理： 修改参照pkorg*/
            //item.refcode = '../../../../uapbd/refer/org/OrgVOsWithGlobalAndCurrGroupTreeRefModelOnlyEnabledData/index.js';
            item.refcode = '../../../../uapbd/refer/org/OrgAndOrgTypeCompositeOnlyEnableDataNCTreeRef/index.js';
        }else  if(item.attrcode === 'paraminfo.realparamcode'){console.log(this.state.json['10140CSSPD-000006']);/* 国际化处理： 修改参照*/
            item.refcode = '../../../../uapbd/refer/param/ParamTemplateGridRef/index.js';
            item.queryCondition = () => {
                return{
                    showflag : 'Y',
                    //GridRefActionExt:'nccloud.web.uapbd.ref.param.ParamGridRefExt'
                }
            }
            //参数组织过滤
            // item.queryCondition = () => {
            //     let searchVal = props.search.getSearchValByField( searchId, field )
            //     let searchVal = props.search.getSearchValByField( searchId, 'pk_org' );

            //     console.log('modifierMeta pkorg = '+pk_org);
            //     return {pk_org : pk_org};
            // };
        }
		return item;
	})
	meta[tableId].pagination = true;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
        //item.width = 150;
        if(item.itemtype === 'refer' && (item.refcode == null)){
            item.refcode = '';
        }
		if (item.attrcode == linkItem) {
			item.render = (text, record, index) => {
				return (
					<span
                        style={{color: '#007ace', cursor: 'pointer' }}
						onClick={() => {
							// let searchVal = props.search.getAllSearchData(searchId);
							// props.CacheTools.set("searchParams",searchVal);
							// props.CacheTools.set('preid',record[pk_item].value);
							props.pushTo('/card', {
                                status: 'browse',
                                pagecode:'10140CSSPD_configparam_card',
								id: record[pk_item].value//列表卡片传参
							});
						}}
					>
						{record && record[linkItem] && record[linkItem].value}
					</span>
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.state.json['10140CSSPD-000007'],/* 国际化处理： 操作*/
		width: 300,
        fixed: 'right',
        itemtype: 'customer',
		className : 'table-opr',
		visible: true,
		render: (text, record, index) => {
            console.log(record);
            if(record.approvestatus.value == -1){//自由态才有操作列
                return (
                    <span className="table-slef-set-long">
                            {
                                props.button.createOprationButton(
                                    ['tableedit'],
                                    {
                                        area: "table-area",
                                        buttonLimit: 3,
                                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                                    }
                                )
                            }
                            {
                                props.button.createOprationButton(
                                    ['tabledel'],
                                    {
                                        area: "table-area",
                                        buttonLimit: 3,
                                        onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                                    }
                                )
                            }
                    </span>
                );
            }else{
                // return (
                //     <span className="table-slef-set-long">
                //             {
                //                 props.button.createOprationButton(
                //                     ['tableedit'],
                //                     {
                //                         area: "table-area",
                //                         buttonLimit: 3,
                //                         // onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                //                     }
                //                 )
                //             }
                //             {
                //                 props.button.createOprationButton(
                //                     ['tabledel'],
                //                     {
                //                         area: "table-area",
                //                         buttonLimit: 3,
                //                         // onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                //                     }
                //                 )
                //             }
                //     </span>
                // );
            }
		}
	});
	return meta;
}
	getButtonNames = (codeId) => {
		if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
			return 'main-button'
		}else {
			return 'secondary - button'
		}
    };
    //切换页面状态
    toggleButton(props){
        let status = this.props.getUrlParam('status');
        let flag = status === 'browse' ? false : true;
        // this.props.button.setButtonVisible(['submit','subback','confirm'],false);
        this.props.button.setDisabled({
            submit:true,
            subback:true,
            confirm:true,
        });
        this.selectedChange();
    };

    onRowClick = (props) =>{
        this.selectedChange(props);
    }
    getFocusRowsData = () =>{
        let checkedRows = this.props.table.getAllTableData(this.tableId);
        let clickRow = this.props.table.getClickRowIndex(this.tableId);
        let focusIndex = 0;
        if(clickRow != null && clickRow.index != null){
            focusIndex = clickRow.index;
        }
        checkedRows = checkedRows.rows;
        if(checkedRows.length > 0){
            checkedRows = [checkedRows[focusIndex]];
        }
        return checkedRows;
    }
    selectedChange = (props) =>{
        let checkedRows = this.props.table.getCheckedRows(this.tableId);
        checkedRows = this.getFocusRowsData();
        console.log(checkedRows);
        if(checkedRows.length != 1){
            this.props.button.setDisabled({
                submit:true,
                subback:true,
                confirm:true,
                print:true,
                output:true,
            });
        }else{
            this.props.button.setDisabled({
                print:false,
                output:false,
            });
            let confirmstatus = checkedRows[0].values['approvestatus'].value;
            if(confirmstatus == -1){//自由
                this.props.button.setDisabled({
                    submit:false,
                    subback:true,
                    confirm:true,
                });
            }else if(confirmstatus == 3){//提交
                this.props.button.setDisabled({
                    submit:true,
                    subback:false,
                    confirm:false,
                });
            }else{
                this.props.button.setDisabled({
                    submit:true,
                    subback:true,
                    confirm:true,
                });
            }
        }
    }

    //提交收回确认
    submitBackConfirm = (type) =>{
        let checkedRows = this.props.table.getCheckedRows(this.tableId);
        checkedRows = this.getFocusRowsData();
        if(checkedRows == null || checkedRows.length != 1){
            return;
        }
        ajax({
			url: submitBackConfirmUrl,
            data:{pk: checkedRows[0].values['pk_sysconfig_id'].value,type: type},
			success: (res) => {console.log(res);
                this.props.table.setValByKeyAndRowId(this.tableId,checkedRows[0].rowId,'approvestatus',res.data['paraminfo'].rows[0].values['approvestatus']);
                //this.refreshAction(this.props);
                toast({color:"success",content:this.state.json['10140CSSPD-000010']});/* 国际化处理： 操作成功*/
                this.selectedChange();
			}
		});
    }

    buttonClick(props, id) {
        switch (id) {
            case 'print':
                let allD = this.props.table.getAllTableData(this.tableId);
                allD = this.getFocusRowsData();
                // allD = this.props.table.getCheckedRows(this.tableId);
                console.log(allD);
                let pks = [];
                allD.forEach((item,index)=>{
                    // if(item.selected == true){
                        pks.push(item.values['pk_sysconfig_id'].value);
                    // }
                });
                if(pks.length != 1){
                    toast({content:this.state.json['10140CSSPD-000011'],color:"warning"});/* 国际化处理： 请单选打印*/
                    return;
                }
                console.log('printPks');console.log(pks);
                print(
                    'pdf',
                    printUrl,
                    {
                        billtype:'',//单据类型
                        funcode:'10140CSSPD',//功能节点编码，即模板编码
                        nodekey:'printparam',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'print'
                    }
                );
                break;
            case 'output':
                allD = this.props.table.getAllTableData(this.tableId);
                allD = this.getFocusRowsData();
                pks = [];
                allD.forEach((item,index)=>{
                    // if(item.selected == true){
                        pks.push(item.values['pk_sysconfig_id'].value);
                    // }
                });
                if(pks.length != 1){
                    toast({content:this.state.json['10140CSSPD-000011'],color:"warning"});/* 国际化处理： 请单选打印*/
                    return;
                }
                console.log('printPks');console.log(pks);
                this.setState({
                    pks: pks
                },() => {
                    this.refs.printOutput.open()
                });
                return;
                print(
                    'pdf',
                    printUrl,
                    {
                        billtype:'',//单据类型
                        funcode:'10140CSSPD',//功能节点编码，即模板编码
                        nodekey:'printparam',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'output'
                    }
                );
                break;
            case 'add':
                let tableData = this.props.table.getAllTableData(this.tableId);
                console.log(tableData);
                if(tableData != null && tableData.rows != null && tableData.rows.length > 0){
                    this.lastPk = tableData.rows[tableData.rows.length - 1].values[pk_item].value;
                }
                props.pushTo('/card',{
                    status:'add',
                    pagecode:'10140CSSPD_configparam_card',
                    id: this.lastPk
                });
                // this.props.CacheTools.remove('preid');
                break;
            case 'edit':
                props.pushTo('/card',{
                    pagecode:'10140CSSPD_configparam_card',
                    status:'edit'
                })
                break;	
            case 'refresh':
                this.refreshAction(props);
                break;
            case 'delete':
                this.deleteAction(props);
                break;
            case 'submit':
                this.submitBackConfirm('submit');
                break;
            case 'subback':
                this.submitBackConfirm('subback');
                break;
            case 'confirm':
                this.submitBackConfirm('confirm');
                break;
            default:
                break;
        }
    }

	doubleClick = (record, index, e)=>{
            
        console.log(this.state.json['10140CSSPD-000012']);/* 国际化处理： 双击*/
        console.log(this)
        // let searchVal = this.props.search.getAllSearchData(this.searchId);
        // cacheTools.set("searchParams", searchVal);
        // cacheTools.set('preid',props.getUrlParam('id'));
        this.props.pushTo('/card', {
            status: 'browse',
            pagecode:'10140CSSPD_configparam_card',
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
                toast({color:"success",content:this.state.json['10140CSSPD-000009']});/* 国际化处理： 删除成功*/
                this.refreshAction(props);
            }
        });
    }

    refreshAction =(props,flag)=>{
        let searchVal = props.search.getAllSearchData(searchId);
        let queryInfo = this.props.search.getQueryInfo(this.searchId);
        let oid = queryInfo.oid;
        console.log(searchVal);
        if(searchVal != false){
            let data = {
                querycondition:{
                    conditions: searchVal == null?null:searchVal.conditions,
                    logic: searchVal == null?null:searchVal.logic,
                },
                pageInfo: props.table.getTablePageInfo(this.tableId),
                pagecode: pageId,
                queryAreaCode:searchId,  //查询区编码
                oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                queryType:'tree',
                querytype:'tree'
            };
    
            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);console.log(props.table);
                    if(res.data){
                        setDefData(key_list,dataSource,res.data[tableId]);
                        props.table.setAllTableData(tableId, res.data[tableId]);
                        props.table.focusRowByIndex(this.tableId,0);
                        this.selectedChange();
                        let rows = res.data[tableId].rows;
                        if(rows != null && rows.length > 0){
                            this.lastPk = rows[rows.length - 1].values[pk_item].value;
                        }
                    }else{
                        props.table.setAllTableData(this.tableId, {rows:[]});
                        // toast({content:"无数据",color:"warning"});
                    }
                    if(flag != 'page'){//非分页查询
                        toast({title:this.state.json['10140CSSPD-000013'],color:"success"});/* 国际化处理： 刷新成功！*/
                    }
                },
                error : (res)=>{
                    console.log(res.message);
                }
            });
        }
    }

    pageInfoClick = (props, config, pks)=>{
        //listQuery(props);
        this.refreshAction(props,'page');
        return;
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchVal = props.search.getAllSearchData(searchId);
        // 后台还没更新，暂不可用
        let data = {
            "allpks": pks,
            "pageid": pageId,
            'pageInfo':pageInfo
        };console.log('pageInfoClick:'+queryPageUrl);
        //得到数据渲染到页面
        let that = this;
        ajax({
            url: queryPageUrl,
            data: data,
            success: function(res) {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        props.table.setAllTableData(tableId, data[tableId]);
                    } else {
                        props.table.setAllTableData(tableId, { rows: [] });
                    }
                }
                this.selectedChange();
            }
        });
    }
    onSearchAfterEvent = () => {
        let searchVal = this.props.search.getAllSearchData(this.searchId);
        cacheTools.set("searchParams", searchVal);
    }

    clickSearchBtn = (props,searchVal)=>{
        let queryInfo = this.props.search.getQueryInfo(this.searchId);
        let oid = queryInfo.oid;
        console.log(searchVal);
        // props.CacheTools.set("searchParams",searchVal);
        let metaData = props.meta.getMeta();
        let data = {
            querycondition:{
                conditions: searchVal == null?null:searchVal.conditions,
                logic: searchVal == null?null:searchVal.logic,
            },
            pageInfo: {
                pageIndex: 0,
                pageSize: 10,
                total: 0,
                totalPage: 0
            },
            pagecode: pageId,
            appcode: appcode,
            queryAreaCode:searchId,  //查询区编码
            oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            queryType:'tree',
            querytype:'tree'
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                console.log(props.table);
                if(res.data){
                    setDefData(key_list,dataSource,res.data[tableId]);
                    props.table.setAllTableData(this.tableId, res.data[tableId]);
                    // props.table.selectTableRows(this.tableId,0,true);
                    props.table.focusRowByIndex(this.tableId,0);
                    let rows = res.data[tableId].rows;
                    if(rows != null && rows.length > 0){
                        this.lastPk = rows[rows.length - 1].values[pk_item].value;
                    }
                    toast({content:this.state.json['10140CSSPD-000014']+res.data.paraminfo.pageInfo.total+this.state.json['10140CSSPD-000015'],color:'success'});/* 国际化处理： 查询成功，共,条数据。*/
                }else{
                    props.table.setAllTableData(this.tableId, {rows:[]});
                    toast({content:this.state.json['10140CSSPD-000016'],color:'warning'});/* 国际化处理： 未查询出符合条件的数据。*/
                }
                this.selectedChange();
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }

	render() {
		let { table, button, search,BillHeadInfo } = this.props;
        const {createBillHeadInfo} = BillHeadInfo;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
        let { createButton, getButtons } = button;
        let { createButtonApp } = button;
		return (<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
					<div className='header-title-search-area'>
                        {
                            createBillHeadInfo(
                                {
                                    title :this.state.json['10140CSSPD-000018']/* 国际化处理： 参数修改申请*/,             //标题
                                    initShowBackBtn:false
                                }
                            )}
                    </div>
					<div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',//按钮注册中的按钮区域
                            //buttonLimit: 5, 
                            onButtonClick: this.buttonClick.bind(this) 
                            //popContainer: document.querySelector('.header-button-area')
                        })}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
                        clickSearchBtn: this.clickSearchBtn.bind(this),
                        onAfterEvent: this.onSearchAfterEvent.bind(this),  //编辑后事件
					})}
				</div>
				<div style={{height:'0px',backgroundColor:''}}></div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: this.pageInfoClick,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:true,
                        showCheck:false,
                        onSelected:this.selectedChange.bind(this),
                        onSelectedAll:this.selectedChange.bind(this),
                        onRowDoubleClick: this.doubleClick.bind(this),
                        dataSource: dataSource,
                        onRowClick: this.onRowClick.bind(this),
                    })}
                    <PrintOutput
                        ref='printOutput'
                        url={printUrl}
                        data={{
                            funcode: '10140CSSPD',
                            nodekey:'printparam',
                            oids: this.state.pks,
                            outputType: 'output'
                        }}
                    />
				</div>
			</div>
		);
	}
}

List = createPage({
	initTemplate: () =>{}
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65