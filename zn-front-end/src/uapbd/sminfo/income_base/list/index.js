//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,cacheTools,print,high,getBusinessInfo,promptBox,createPageIcon,excelImportconfig} from 'nc-lightapp-front';
import createUIDom from '../../../public/utils/BDCreateUIDom';
const {NCPopconfirm, NCIcon,NCTabs}=base;
const NCTabPane=NCTabs.NCTabPane;
const {PrintOutput,ExcelImport} = high;
const { NCDiv } = base;
const dataSource = 'uapbd.sminfo.income.data'
const pageId = '10140INCMG_incomelist';        //pagecode
const searchId = 'searcharea';              //查询区id
const tableId = 'pk_group';                 //表头id
const oId = '1001Z01000000000NHP1';     //查询区oid
const appid = '0001Z010000000001PR5';   //注册按钮id
const linkItem = 'code';        		//列表卡片跳转字段
const pk_item = 'pk_income';           //列表主键
const queryListUrl = '/nccloud/uapbd/sminfo/IncomeListQuery.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/sminfo/IncomeQueryPageGridByPks.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/sminfo/IncomeDelete.do';                 //删除url
const printUrl =  '/nccloud/uapbd/sminfo/IncomePrint.do';                  //列表打印url
const validUrl = '/nccloud/uapbd/sminfo/IncomeValid.do';                   //权限校验
const tableBtnAry = ["editline","delline"];		//表格列操作按钮
const globalId = 'GLOBLE00000000000000';            //全局常量值
//
// let initTemplate =(props) =>{
//
// 	let _this = this;
//
// }

function modifierMeta(props, meta) {

    // let businessInfo = getBusinessInfo();
    // let pkGroup = businessInfo.groupId;

	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.col = '3';
        if((item.attrcode == 'pk_org')){

            item.isMultiSelectedEnabled = true;
            if(props.nodeType == 'org')
            {
                item.queryCondition = function () {
                    return {
                        AppCode:'10140INCMO',
						TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder'
                    }
                }
                item.isRunWithChildren=true
            }
            else{
                item.queryCondition = function () {
                    return {
                        AppCode:'10140INCMG',
						TreeRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgWithGroupSQLBuilder'
                    }
                }
            }
        }
		return item;
	})
	meta[tableId].pagination = true;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		//item.width = 150;
		if (item.attrcode == linkItem) {
			item.render = (text, record, index) => {
				return (
					<span
                        style={{color: '#007ace', cursor: 'pointer' }}
						onClick={() => {
							let searchVal = props.search.getAllSearchData(searchId);
							cacheTools.set("searchParams",searchVal);
							cacheTools.set('preid',record[pk_item].value);
							cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
							props.pushTo(props.cardUrl, {
                                appcode:props.appcode,
                                pagecode:props.pagecode_card,
								status: 'browse',
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
		label: props.MutiInit.getIntl("10140INCMG") && props.MutiInit.getIntl("10140INCMG").get('10140INCMG-000001'), //this.state.json['10140INCMG-000001'],/* 国际化处理： 操作*/ 
        width: 200,
        itemtype:'customer',
		fixed: 'right',
		className : 'table-opr',
		visible: true,
		render: (text, record, index) => {

            // 只能修改本级数据
            let btnArray=[];
            if(record['pk_org'].value == globalId && props.nodeType == 'global'){
                btnArray = ['editline', 'delline'];
            }
            else if(record['pk_org'].value==record['pk_group'].value && props.nodeType == 'group'){
                btnArray = ['editline', 'delline'];
            }
            else if(record['pk_org'].value != record['pk_group'].value && props.nodeType == 'org'){
                btnArray = ['editline', 'delline'];
            }

			return props.button.createOprationButton(
				btnArray,
				{
					area: "table-opr-area",
					buttonLimit: 3,
					onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
				}
			)
		}
	});
	return meta;
}

function tableButtonClick(props, id, text, record, index){
	switch(id){

		case 'editline':
            valid(props,record,()=> {
                props.pushTo(props.cardUrl, {
                    appcode: props.appcode,
                    pagecode: props.pagecode_card,
                    status: 'edit',
                    id: record[pk_item].value
                });
            })
			break;
		case 'delline':
            valid(props,record,()=> {
                ajax({
                    url: deleteUrl,
                    data:
                        {
                            pk_org: cacheTools.get('pk_org'),
                            deleteinfo: [
                                {
                                    id: record[pk_item].value,
                                    ts: record.ts.value
                                }
                            ]
                        },
                    success: (res) => {
                        if (res.success) {
                            toast({color: 'success', title: props.MutiInit.getIntl("10140INCMG") && props.MutiInit.getIntl("10140INCMG").get('10140INCMG-000015')}) //this.state.json['10140INCMG-000015'],/* 国际化处理： 删除成功！*/
                            props.table.deleteTableRowsByIndex(tableId, index);
                            let tableData = props.table.getAllTableData(tableId).rows;
                            let selectData = props.table.getCheckedRows(tableId);
                            if(selectData && selectData.length>0){
                                //行删除之后，如果没有勾选的数据，那么删除按钮置灰
                                props.button.setButtonDisabled(['delete'], false);
                            }else{
                                //行删除之后，如果没有勾选的数据，那么删除按钮置灰
                                props.button.setButtonDisabled(['delete'], true);
                            }
                            if(tableData && tableData.length>0){
                                props.button.setButtonDisabled(['printGrp', 'output'], false);
                            }else{
                                props.button.setButtonDisabled(['printGrp', 'output'], true);
                            }
                        }
                    }
                });
            })
			break;
		default:
            console.log(id, index);
            break;

	}
}

//权限校验
function valid(props,record,callback){

    let pks = [];

    if(record){

        pks.push(record[pk_item].value);
    }
    else{

        let rows = props.table.getCheckedRows(tableId);

        if(rows.length === 0){
            toast({content: props.MutiInit.getIntl("10140INCMG") && props.MutiInit.getIntl("10140INCMG").get('10140INCMG-000016'),color:'warning'});/* 国际化处理： 勾选操作数据！*/
            return;
        }

        rows.forEach((item,key)=>{
            pks.push(item.data.values[pk_item].value);
        });
    }

    let data = {
        pks,
        nodeType:props.nodeType
    }
    ajax({
        url:validUrl,
        data,
        success:(res)=>{
            callback && callback();
        }
    })
}

class List extends Component {

	constructor(props) {
		super(props);
		this.searchId = searchId;
		this.tableId = tableId;
		this.state = {
                title:'',
                json: {},
                context: {
                    nodeType: props.nodeType,
                    pk_org: '',
                    pk_org_v: '',
                    org_Name: '',
                    org_v_Name: '',
                    mdid: '',
                    title:'',
                    PermissionOrgIDs: []
                }
			};

      this.initTemplate(props);
	}
	
	  //初始化单据模板
    initTemplate = (props,callback) => {
        let that = this;
        createUIDom(props)(
            {
                pagecode:props.pagecode_list//页面id
            // appcode:props.config.appcode//注册按钮的id
            },
            {
                moduleId: '10140INCMG',domainName: 'uapbd'
            },
            (data, langData)=>{ //(data, langData)
                if(langData){
                    this.state.json = langData;
                    if(props.nodeType == 'group'){
						that.state.title = this.state.json['10140INCMG-000000']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 收款协议-集团*/
					}else{
						that.state.title= this.state.json['10140INCMG-000025']//this.state.json['10140CSCLG-000000'],/* 国际化处理： 收款协议-业务单元*/
					}
                }
                if (data) {

                    if (data.button) {
                        let button = data.button;
                        // setTimeout(() =>{
                            
                        // });
                        props.button.setButtons(button);
                        props.button.setButtonDisabled(['delete', 'printGrp', 'output'], true);
                        props.button.setPopContent('delline','确定要删除吗？') /* 设置操作列上删除按钮的弹窗提示 */
                        debugger;
                        let excelimportconfig = excelImportconfig(props,'uapbd',props.billType,true,'',{appcode: props.appcode,pagecode: props.pagecode_card},()=>{
                            var searchPkorg=this.props.search.getSearchValByField( this.searchId, 'pk_org' );
                            searchPkorg && searchPkorg.display && this.refreshAction(props);
                        });
                        props.button.setUploadConfig("import",excelimportconfig);
                        props.button.setButtons(data.button);
                    }
                    if (data.template) {
                        let meta = data.template;
                        let context = data.context;
                        this.state.context = Object.assign(this.state.context, context);
                        meta = modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                        let hasSearched = cacheTools.get("hasSearched");
                        let searchVal =cacheTools.get("searchParams");
                        if (searchVal !== 'undefined' && searchVal && searchVal.conditions) {
                        } else {
                            searchVal = {
                                conditions: [],
                                logic: 'and'
                            }
                            props.nodeType === 'org' && searchVal.conditions.push({
                                field: 'pk_org',
                                value: {
                                    firstvalue: this.state.context.pk_org,
                                    secondvalue: ''
                                },
                                oprtype: '=',
                                display: this.state.context.org_Name
                            });
                            this.props.search.setSearchValue(searchId, searchVal);
                        }
                        if(hasSearched && hasSearched === 1){//hasSearched 为1表示有过查询，从缓存获取查询模板条件

                            if(searchVal && searchVal != false){
                                props.search.setSearchValue(searchId,searchVal.conditions);
                            }

                            //获取查询模板信息
                            let queryInfo = this.props.search.getQueryInfo(this.searchId);
                            let OID = queryInfo.oid;

                            let data = {
                                querycondition:searchVal,
                                // custcondition:{
                                //     conditions:[{
                                //         field:'pk_group',
                                //         value:{
                                //             firstvalue:null
                                //         },
                                //         oprtype:'='
                                //     }]
                                // },
                                custcondition:{},
                                pagecode:props.pagecode_list,
                                nodeType:props.nodeType,
                                queryAreaCode:searchId,
                                pageInfo: cacheTools.get('pageInfo')?cacheTools.get('pageInfo'):props.table.getTablePageInfo(tableId),
                                querytype:'tree',
                                oid:OID,//cacheTools.get('orgunit_searchoid')
                            };
                            // let data = {
                            //     conditions: searchVal==null?null:searchVal.conditions,
                            //     pageInfo: cacheTools.get('pageInfo')?cacheTools.get('pageInfo'):props.table.getTablePageInfo(tableId),
                            //     pagecode: props.pagecode_list,
                            //     queryAreaCode: searchId,  //查询区编码
                            //     oid: OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                            //     queryType:'tree',
                            //     nodeType:props.nodeType
                            // };

                            ajax({
                                url: queryListUrl,
                                data,
                                success: (res) => {
                                    if(res.data){
                                        props.table.setAllTableData(tableId, res.data[tableId]);
                                        props.button.setButtonDisabled(['printGrp','output'], false);
                                    }else{
                                        props.button.setButtonDisabled(['printGrp','output'], true);
                                        //toast({content:this.state.json['10140INCMG-000019'],color:"warning"});/* 国际化处理： 无数据！*/
                                    }
                                },
                                error : (res)=>{
                                    console.log(res.message);
                                }
                            });
                        }
                        else{
                            if(props.nodeType == 'group'){
                                let businessInfo = getBusinessInfo();
                                let pkGroup = businessInfo==null?'pkGroup':businessInfo.groupId;
                                props.search.setSearchValByField(searchId, 'pk_org',{value: pkGroup,display:this.state.json['10140INCMG-000020']})    /* 国际化处理： 当前集团*/
                            }
                        }
                    }
                    callback && callback();
                }
            }
        )
		}

	componentDidMount() {
        // UE 要求打印下拉只有输出，确认规范后按钮注册再改。！！！
        this.props.button.setButtonsVisible({
            'print':false
        });
	}

    buttonClick(props, id) {
        switch (id) {
            case 'add':
                props.pushTo(props.cardUrl,{
                    appcode:props.appcode,
                    pagecode:props.pagecode_card,
                    status:'add'
                })
                cacheTools.remove('preid');
                
                break;
            // case 'editline':
            //     props.linkTo(props.cardUrl,{
            //         appcode:props.appcode,
            //         pagecode:props.pagecode_card,
				// 	status:'edit',
				// 	id: props.record[pk_item].value
            //     })
            //     break;
            case 'refresh':
                this.refreshAction(props,()=>{
                    toast({title:this.state.json['10140INCMG-000010'],color:"success"});/* 国际化处理： 刷新成功！*/
                });
                break;
            case 'delete':
                valid(props,null,()=>{
                    promptBox({color:"warning",
                    title: this.state.json['10140INCMG-000012'],/* 国际化处理： 注意*/
                    hasCloseBtn:false,
                    content: this.state.json['10140INCMG-000013'],/* 国际化处理： 确认删除？*/
                    beSureBtnClick: this.deleteAction.bind(this)
                })})
                break;
            case 'printGrp':
                this.onPrint();
                break;
            case 'print':
                this.onPrint();
                break;
            case 'output':
                this.onOutput();
                break;
            case 'export':
                this.setState(this.state,()=>{
                    this.props.modal.show('exportFileModal');
                });
                break; 
            default:
                break;
        }
    }

    // 行选中事件
    onSelected = () => {
        let rows = this.props.table.getCheckedRows(tableId);
        if (rows && rows.length > 0) {
            //this.props.button.setButtonDisabled(['delete', 'printGrp', 'output'], false);
            //打印使用都能使用列表态
            this.props.button.setButtonDisabled(['delete'], false);
        } else {
            //this.props.button.setButtonDisabled(['delete', 'printGrp', 'output'], true);
            this.props.button.setButtonDisabled(['delete'], true);
        }
        this.setState(this.state);
    }

    //打印
    onPrint=()=>{

        let allData = this.props.table.getAllTableData(tableId);

        if(allData.length === 0){
            toast({content:this.state.json['10140INCMG-000006'],color:'warning'});/* 国际化处理： 无可打印数据！*/
            return;
        }

        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        print(
            'pdf',
            printUrl,
            {
                appcode:this.props.appcode,
                funcode:this.props.printFunCode,//功能节点编码
                nodekey:this.props.printNodeKey,//模板节点编码
                oids:pks
            },false
        )
    }
    //输出
    onOutput=()=>{

        let allData = this.props.table.getAllTableData(tableId);
        if(allData.length === 0){
            toast({content:this.state.json['10140INCMG-000007'],color:'warning'});/* 国际化处理： 无可输出的数据！*/
            return;
        }
        let pks = [];

        allData.rows.forEach((item,key)=>{
            pks.push(item.values[pk_item].value);
        });
        this.setState({
            ids : pks
        },this.refs.printOutput.open());
    }

	doubleClick = (record, index, e)=>{
		
            
        console.log(this.state.json['10140INCMG-000021']);/* 国际化处理： 双击*/
        console.log(this)
        let searchVal = this.props.search.getAllSearchData(searchId);
		cacheTools.set("searchParams", searchVal);
		cacheTools.get("searchParams");
        cacheTools.set('preid',this.props.getUrlParam('id'));
        this.props.pushTo(this.props.cardUrl, {
            appcode:this.props.appcode,
            pagecode:this.props.pagecode_card,
            status: 'browse',
            id: record[pk_item].value
        });
	}

    deleteAction = () =>{
        let data = this.props.table.getCheckedRows(tableId);
        let that = this;
        let params = {
			pk_org: cacheTools.get('pk_org'),
			deleteinfo:data.map((v)=>{
            let id = v.data.values[pk_item].value;
            let ts = v.data.values.ts.value;
            return {
                id,ts
            }
			})
		}
        console.log(params)
        ajax({
            url: deleteUrl,
            data: params,
            success: (res) => {
                toast({color:"success",title:that.state.json['10140INCMG-000015']});/* 国际化处理： 删除成功！*/
                that.props.button.setButtonDisabled(['delete'], true);
                that.refreshAction(that.props);
            }
        });
    }

    refreshAction =(props,callback=null)=>{
        let searchVal = props.search.getAllSearchData(searchId);
        console.log(searchVal);
        if(searchVal != false){

            //获取查询模板信息
            let queryInfo = this.props.search.getQueryInfo(this.searchId);
            let OID = queryInfo.oid;

            let data = {
                querycondition:searchVal,
                // custcondition:{
                //     conditions:[{
                //         field:'pk_group',
                //         value:{
                //             firstvalue:null
                //         },
                //         oprtype:'='
                //     }]
                // },
                custcondition:{},
                pagecode:props.pagecode_list,
                nodeType:props.nodeType,
                queryAreaCode:searchId,
                pageInfo: props.table.getTablePageInfo(tableId),
                querytype:'tree',
                oid:OID,//cacheTools.get('orgunit_searchoid')
            };

            // let data = {
            //     conditions: searchVal==null?null:searchVal.conditions,
			// 	pageInfo: props.table.getTablePageInfo(tableId),
            //     pagecode: props.pagecode_list,
            //     queryAreaCode:searchId,  //查询区编码
            //     oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            //     queryType:'tree',
            //     nodeType:props.nodeType
            // };
    
            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);
                    if(res.data){
                        props.table.setAllTableData(tableId, res.data[tableId]);
                        props.button.setButtonDisabled(['printGrp','output'], false);
                        //toast({title:this.state.json['10140INCMG-000010'],color:"success"});/* 国际化处理： 刷新成功！*/
                        callback&&callback();
                    }else{
                        props.table.setAllTableData(tableId, {rows:[]});
                        props.button.setButtonDisabled(['printGrp','output'], true);
                        //toast({title:this.state.json['10140INCMG-000010'],color:"success"});/* 国际化处理： 刷新成功！*/
                        callback&&callback();
                    }

                    //查询时执行显示公式前端适配
                    if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                        props.dealFormulamsg(
                            res.formulamsg,  //参数一：返回的公式对象
                            {                //参数二：界面使用的表格类型
                                [tableId]:"table"
                            }
                        );
                    }

                    props.button.setButtonDisabled(['delete'], true);
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
	   
		cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
		
        let data = {
			'pk_org':cacheTools.get('pk_org'),
            'allpks': pks,
            'pageid': props.pagecode_list
        };
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
            }
        });
    }

    clickSearchBtn = (props,searchVal)=>{
            
		console.log(searchVal);
		
		searchVal.conditions.map((cond)=>{
			if(cond.field == 'pk_org'){

                 //集团节点初始化时会在查询区默认为当前集团，但是没初始化好时，getBusinessInfo 获取不到，所以pk_org赋值为‘pkGroup’，此处再取一次
                if(props.nodeType == 'group' && cond.value.firstvalue == 'pkGroup'){
                    let businessInfo = getBusinessInfo();
                    let pkGroup = businessInfo==null?null:businessInfo.groupId;
                    cond.value.firstvalue = pkGroup;
                }

				cacheTools.set('pk_org',cond.value.firstvalue);
			}
		})
		cacheTools.set("hasSearched",1);
		cacheTools.set("searchParams",searchVal);
		cacheTools.set('pageInfo',props.table.getTablePageInfo(tableId));
        let metaData = props.meta.getMeta();

        //获取查询模板信息
        let queryInfo = this.props.search.getQueryInfo(this.searchId);
        let OID = queryInfo.oid;

        // let conditions = [];
        // let custcondition = {};
		// conditions.push({display:'',field:'nodetype',oprtype:'like',value:{firstvalue:props.nodeType,secondvalue:null}});
		// custcondition = {conditions,logic:'or'};

        let data = {
            querycondition:searchVal,
            // custcondition:{
            //     conditions:[{
            //         field:'pk_group',
            //         value:{
            //             firstvalue:null
            //         },
            //         oprtype:'='
            //     }]
            // },
            custcondition:{},
            pagecode:props.pagecode_list,
            nodeType:props.nodeType,
            queryAreaCode:searchId,
            pageInfo: props.table.getTablePageInfo(tableId),
            querytype:'tree',
            oid:OID,//cacheTools.get('orgunit_searchoid')
        };

        // let data = {
        //     conditions: searchVal==null?null:searchVal.conditions,
		// 	pageInfo: props.table.getTablePageInfo(tableId),
        //     pagecode: props.pagecode_list,
        //     queryAreaCode:searchId,  //查询区编码
        //     oid:OID,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        //     queryType:'tree',
        //     nodeType:props.nodeType
        // };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if(res.data){
                    props.table.setAllTableData(this.tableId, res.data[tableId]);
                    props.button.setButtonDisabled(['printGrp', 'output'], false);
                    toast({content:this.state.json['10140INCMG-000022']+res.data[tableId].rows.length+this.state.json['10140INCMG-000023'],color:"success"});/* 国际化处理： 查询成功，共,条*/
                }else{
                    props.table.setAllTableData(this.tableId, {rows:[]});
                    props.button.setButtonDisabled(['printGrp', 'output'], true);
                    toast({content:this.state.json['10140INCMG-000024'],color:"warning"});/* 国际化处理： 未查询出符合条件的数据！*/
                }
            },
            error : (res)=>{
                console.log(res.message);
            }
        });
    }

	render() {
		let { table, button, search,modal,BillHeadInfo} = this.props;
		let {createModal} = modal;
		let buttons  = this.props.button.getButtons();
		// buttons = buttons.sort((a,b)=>{
		// 	return b.btnorder - a.btnorder;
		// });
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
        let { createButtonApp , getButtons } = button;
        const {createBillHeadInfo} = BillHeadInfo;
		return (<div className="nc-bill-list">
				<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
					<div className='header-title-search-area'>
                        {createBillHeadInfo({ 
                            title:this.state.title,
                            initShowBackBtn:false
                        })}
                    </div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'header-button-area',
							buttonLimit: 3, 
							onButtonClick: this.buttonClick.bind(this), 
							popContainer: document.querySelector('.header-button-area')
	
						})}
					</div>
				</NCDiv>
				<div className="nc-bill-search-area" fieldid='nc-bill-searchId'>
					{NCCreateSearch(this.searchId, {
						clickSearchBtn: this.clickSearchBtn.bind(this)
					})}
				</div>
				{/* <div style={{height:'10px'}}></div> */}
				<div className="nc-bill-table-area" fieldid='nc-bill-tableId'>
					{createSimpleTable(this.tableId, {
						handlePageInfoChange: this.pageInfoClick,
                        tableModelConfirm: this.tableModelConfirm,
                        dataSource:dataSource,
                        pkname: pk_item,
						showIndex:true,
						showCheck:true,
                        onRowDoubleClick: this.doubleClick.bind(this),
                        onSelected: this.onSelected.bind(this),
                        onSelectedAll: this.onSelected.bind(this)
					})}
				</div>
				{createModal('delete', {
							title: this.state.json['10140INCMG-000012'],/* 国际化处理： 注意*/
							content: this.state.json['10140INCMG-000013'],/* 国际化处理： 确认删除？*/
							beSureBtnClick: this.deleteAction.bind(this)
				})}
                <PrintOutput
                    ref='printOutput'
                    url={printUrl}
                    data={{
                        appcode:this.props.appcode,
                        funcode:this.props.printFunCode,//功能节点编码
                        nodekey:this.props.printNodeKey,//模板节点编码
                        oids : this.state.ids,
                        outputType : 'output'
                    }}
                />
                <ExcelImport
                {...this.props}
                moduleName ='uapbd'//模块名
                billType = {this.props.billType}//单据类型
                selectedPKS = {[]}
                appcode={this.props.appcode}
                pagecode={this.props.pagecode_card}
            />
			</div>
		);
	}
}

List = createPage({
    billinfo:[{
        billtype: 'grid',
        pagecode: pageId,
        headcode: tableId
    }],
	initTemplate: [],
	mutiLangCode: '10140INCMG'
})(List);

// ReactDOM.render(<List />, document.querySelector('#app'));
export default List;

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65