//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,print,high,cardCache,cacheTools,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const {PrintOutput} = high
const {NCPopconfirm, NCIcon,NCTabs}=base;
const NCTabPane=NCTabs.NCTabPane;
const {setDefData, getDefData,getCurrentLastId } = cardCache;
const dataSource = "supligergrade-list";
const key_list = "key_list";
const key_search = "key_search";
import './index.less'
import '../../../public/uapbdstyle/uapbd_style_common.less'
// import './index.less';

//业务单元参照
import CorpDefaultTreeRef from  '../../../../uapbd/refer/org/CorpDefaultTreeRef'

const pageId = '10141486_list';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'paraminfo';            //表头id
const oId = '1001Z010000000008RLK';     //查询区oid
const appid = '0001Z0100000000012Q7';   //注册按钮id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_suppliergrade';           //列表主键
const queryListUrl = '/nccloud/uapbd/suppliergradesys/query.do';           //通过查询区域查询url
const queryPageUrl = '/nccloud/uapbd/suppliergradesys/query.do';  //分页查询url
const printUrl = '/nccloud/uapbd/suppliergradesys/print.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/suppliergradesys/del.do';                 //删除url
const enablestateUrl = '/nccloud/uapbd/suppliergradesys/disenable.do';   //卡片查询url

const isShowOffEnable = true;			//是否启用“显示停用”功能

class List extends Component {
	constructor(props) {console.log('constructor');console.log(props);
		super(props);
		this.searchId = props.config.searchId;
        this.tableId = props.config.tableId;
        this.lastPk = null;
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
        this.initTemplate(props);
	}
	componentDidMount() {
		//this.getData(); 平台考虑效率，打开节点不直接加载数据
        this.toggleButton(this.props);
        this.props.button.setDisabled({
            delete: true,
            print: true,
            output: true,
        });
    }
    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10140SGRADEG',domainName: 'uapbd',callback});
    }

    initTemplate =(props) =>{

        let _this = this;
        props.createUIDom(
            {
                pagecode: props.config.pageCode,//页面id
                // appcode: config.appcode,
                // appid: config.appid//注册按钮的id
            },
            (data) => {console.log('inittemplage');console.log(data);
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta)
                        props.meta.setMeta(meta);
                        let searchVal = cacheTools.get("searchParams");
                        if(searchVal != null){
                            props.search.setSearchValue(props.config.searchId,searchVal);
                        }
                        // let searchVal = props.search.getAllSearchData("search");
                        // console.log('searchParams');
                        // console.log(searchVal);
                        // if(searchVal == null || searchVal == false){
                        //     searchVal = [];
                        // }
                        //searchVal = [];
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
                                queryType:'tree'
                            };
                    
                            ajax({
                                url: queryListUrl,
                                data,
                                success: (res) => {
                                    console.log('queryListUrl');
                                    console.log(res);
                                    if(res.data){console.log(11);console.log(res.data[props.config.tableId]);
                                        let data = res.data[props.config.tableId];
                                        if(data.rows != null && data.rows.length > 0){
                                            this.props.button.setDisabled({
                                                print: false,
                                                output: false,
                                            });
                                        }else{
                                            this.props.button.setDisabled({
                                                print: true,
                                                output: true,
                                            });
                                        }
                                        for(let i = 0; i < data.rows.length; i++){
                                            if(data.rows[i].values['enablestate'].value == '2'){
                                                data.rows[i].values['enablestate'].value = true;
                                            }else{
                                                data.rows[i].values['enablestate'].value = false;
                                            }
                                        }
                                        props.table.setAllTableData(props.config.tableId, data);
                                        setDefData(key_list,dataSource,data);
                                    }else{
                                        //toast({content:"无数据",color:"warning"});
                                        this.props.button.setDisabled({
                                            print: true,
                                            output: true,
                                        });
                                        setDefData(key_list,dataSource,{rows:[]});
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
                    props.button.setPopContent('tabledel',this.state.json['10140SGRADEG-000000'])/* 国际化处理： 确认删除？*/
                }
            }
        )
    }
    tableButtonClick = (props, id, text, record, index) => {
        console.log(record);
        if(id == 'tableedit'){
            props.pushTo('/card', {
                pagecode:'10140SGRADEG_bsgrade_card',
                status: 'edit',
                id: record[props.config.pk_item].value
            });
        }
        if(id == 'tabledel'){
                // return(
                //     <NCPopconfirm
                //         trigger="click"
                //         placement="top"
                //         content='确定删除？'
                //         onClose={() => {
                            ajax({
                                url: deleteUrl,
                                data: {deleteinfo:[{
                                    id: record[props.config.pk_item].value,
                                    ts: record.ts.value
                                }]},
                                success: (res) => {
                                    if (res.success) {
                                        toast({ color: 'success', title: this.state.json['10140SGRADEG-000001'] });/* 国际化处理： 删除成功！*/
                                        props.table.deleteTableRowsByIndex(props.config.tableId, index);
                                    }
                                }
                            });
                    //     }}
                    // ></NCPopconfirm>
                // )
            };
    }
    modifierMeta = (props, meta) => {
            meta[props.config.searchId].items = meta[props.config.searchId].items.map((item, key) => {
                item.col = '3';
                return item;
            });
            
            //查询参数参照
            let searchItems = meta[props.config.searchId].items;
            for(let i = 0; i < searchItems.length; i++){
                if(searchItems[i].attrcode == 'cmaterialoid.code'){//物料编码
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                }
                if(searchItems[i].attrcode == 'cmaterialoid.name'){//物料编码
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                }
                if(searchItems[i].attrcode == 'pk_setpart_b.cmaterialoid'){//物料编码
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                }
                if(searchItems[i].attrcode == 'pk_setpart_b.cmaterialoid.name'){//物料编码
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                }
            }
    
            meta[props.config.tableId].pagination = true;
            meta[props.config.tableId].items = meta[props.config.tableId].items.map((item, key) => {
                //item.width = 150;
                if (item.attrcode == 'cmaterialvid') {//
                    item.render = (text, record, index) => {
                        return (
                            <span
                                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={() => {
                                    let searchVal = props.search.getAllSearchData(searchId);
                                    props.CacheTools.set("searchParams",searchVal);
                                    props.CacheTools.set('preid',record[props.config.pk_item].value);
                                    props.pushTo('/card', {
                                        pagecode:'10140SGRADEG_bsgrade_card',
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
                label: this.state.json['10140SGRADEG-000002'],/* 国际化处理： 操作*/
                attrcode: 'opr',
                key: 'opr',
                itemtype: 'customer',
                fixed: 'right',
                className: 'table-opr',
                visible: true,
                render: (text, record, index) => {
                    return (
                        <span className="table-slef-set-long">
                            {/* <NCIcon
                                type="uf-pencil-s"
                                onClick={() => {
                                    props.linkTo('../card/index.html', {
                                        status: 'edit',
                                        id: record.crevecontid.value
                                    });
                                }}
                            /> */}
                            {/*<span
                                style={{cursor: 'pointer' }}
                                onClick={() => {
                                    console.log(record);
                                    props.pushTo('/card', {
                                        status: 'browse',
                                        id: record[props.config.pk_item].value
                                    });
                                }}
                            >
                                <a>{this.state.json['10140SGRADEG-000019']/* 国际化处理： 详情}</a>
                            </span><span>&nbsp; &nbsp;</span>*/}
                            <span
                                style={{cursor: 'pointer' }}
                                onClick={() => {
                                    console.log(record);
                                    props.pushTo('/card', {
                                        status: 'edit',
                                        pagecode:'10140SGRADEG_bsgrade_card',
                                        id: record[props.config.pk_item].value
                                    });
                                }}
                            >
                                {
                                    props.button.createOprationButton(
                                        ['tableedit','tabledel-'],
                                        {
                                            area: "table-button-area",
                                            buttonLimit: 3,
                                            onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                                        }
                                    )
                                }
                            </span><span>&nbsp;</span>
                            <NCPopconfirm
                                trigger="click"
                                placement="top"
                                content={this.state.json['10140SGRADEG-000003']/* 国际化处理： 确定删除？*/}
                                onClose={() => {
                                    ajax({
                                        url: deleteUrl,
                                        data: {deleteinfo:[{
                                            id: record[props.config.pk_item].value,
                                            ts: record.ts.value
                                        }]},
                                        success: (res) => {
                                            if (res.success) {
                                                toast({ color: 'success', content: this.state.json['10140SGRADEG-000004'] });/* 国际化处理： 删除成功*/
                                                props.table.deleteTableRowsByIndex(props.config.tableId, index);
                                            }
                                        }
                                    });
                                }}
                            >
                                <span style={{cursor: 'pointer' }}>
                                {
                                    props.button.createOprationButton(
                                        ['tableedit-','tabledel'],
                                        {
                                            area: "table-button-area",
                                            buttonLimit: 3,
                                            onButtonClick: (props, id) => this.tableButtonClick(props, id, text, record, index)
                                        }
                                    )
                                }
                                </span>
                            </NCPopconfirm>
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
            if(this.props.config.nodetype == 'org' && this.state.curOrgObj == null){
                return;
            }
            this.refreshAction();
        });
        // if(this.props.config.nodetype == 'org' && this.state.curOrgObj == null){
        //     return;
        // }
        // this.refreshAction();
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

    selectedChange = (props) =>{
        let checkedRows = this.props.table.getCheckedRows(this.tableId);
        console.log(checkedRows.length);
        if(checkedRows.length == 0){
            console.log(this.state.json['10140SGRADEG-000005']);/* 国际化处理： 禁用*/
            setTimeout(()=>{
                this.props.button.setDisabled({
                    delete: true
                });
            },1);
            
        }else{
            console.log(this.state.json['10140SGRADEG-000006']);/* 国际化处理： 启用*/
            setTimeout(()=>{
                this.props.button.setDisabled({
                    delete: false
                });
            },1);
        }
    }

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
                    pks.push(item.values['pk_suppliergrade'].value);
                });
                let checkeddata = this.props.table.getCheckedRows(this.tableId);
                if(checkeddata != null && checkeddata.length > 0){
                    pks = [];
                    for(let i = 0; i < checkeddata.length; i++){
                        pks.push(checkeddata[i].data.values['pk_suppliergrade'].value);
                    }
                }
                console.log(checkeddata);
                console.log('printPks');console.log(pks);
                print(
                    'pdf',
                    printUrl,
                    {
                        billtype:'',//单据类型
                        funcode:'10140SGRADEG',//功能节点编码，即模板编码
                        nodekey:'osgrade',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'print'
                    }
                );
                break;
            case 'output':
                allD = this.props.table.getAllTableData(this.tableId);
                pks = [];
                allD.rows.forEach((item,index)=>{
                    pks.push(item.values['pk_suppliergrade'].value);
                });
                checkeddata = this.props.table.getCheckedRows(this.tableId);
                if(checkeddata != null && checkeddata.length > 0){
                    pks = [];
                    for(let i = 0; i < checkeddata.length; i++){
                        pks.push(checkeddata[i].data.values['pk_suppliergrade'].value);
                    }
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
                        funcode:'10140SGRADEG',//功能节点编码，即模板编码
                        nodekey:'osgrade',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'output'
                    }
                );
                break;
            case 'add':
                console.log(this.lastPk);
                props.pushTo('/card',{
                    status:'add',
                    pagecode:'10140SGRADEG_bsgrade_card',
                    id: this.lastPk
                })
                // this.props.CacheTools.remove('preid');
                break;
            case 'edit':
                props.pushTo('/card',{
                    pagecode:'10140SGRADEG_bsgrade_card',
                    status:'edit'
                })
                break;	
            case 'refresh':
                this.refreshAction(props,'refresh');
                break;
            case 'delete':
                promptBox({
                    color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                    title: this.state.json['10140SGRADEG-000007'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                    content: this.state.json['10140SGRADEG-000000'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
                    // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                    // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                    // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                    // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                    beSureBtnClick: () => {
                        this.deleteAction(props);
                    }
                    // cancelBtnClick: () => {
                    //     console.log('cancelBtnClick');
                    //     this.props.modal.close('cancelConfirmModal');
                    // }
                })
                // props.modal.show('confirmModal',{
                //     color:"warning",
                //     title:'提示',
                //     content:'确认删除选中数据？',
                //     beSureBtnClick:()=>{
                //         this.deleteAction(props);
                //     }
                // });
                break;
            default:
                break;
        }
    }

	doubleClick = (record, index, e)=>{
            
        console.log(this.state.json['10140SGRADEG-000008']);/* 国际化处理： 双击*/
        console.log(record);
        let searchVal = this.props.search.getAllSearchData("search");
        // this.props.CacheTools.set("searchParams", searchVal);
        // this.props.CacheTools.set('preid',props.getUrlParam('id'));
        this.props.pushTo('/card', {
            status: 'browse',
            pagecode:'10140SGRADEG_bsgrade_card',
            id: record[pk_item].value
        });
	}

    deleteAction = (props) =>{
        let data = this.props.table.getCheckedRows(this.tableId);
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
                toast({color:"success",content:this.state.json['10140SGRADEG-000004']});/* 国际化处理： 删除成功*/
                let data = this.props.table.getCheckedRows(this.tableId);
                console.log(data);
                if(data != null && data.length > 0){
                    let rowIds = [];
                    for(let i = 0; i < data.length; i++){
                        // rowIds.push(data[i].data.rowId);
                        rowIds.push(data[i].index);
                        //this.props.table.deleteTableRowsByRowId(this.tableId,data[i].data.rowId);  
                    }
                    props.table.deleteTableRowsByIndex(this.tableId,rowIds);  
                }
                this.selectedChange(this.props);
                //this.refreshAction(props);
            }
        });
    }

    refreshAction =(props,flag)=>{
        let searchVal = this.props.search.getAllSearchData(searchId);
        let queryInfo = this.props.search.getQueryInfo(searchId);
        let oid = queryInfo.oid;
        console.log(searchVal);
        if(searchVal != null){
            let data = {
                querycondition:{
                    conditions: searchVal == null?null:searchVal.conditions,
                    logic: searchVal == null?null:searchVal.logic,
                },
                custcondition:{
                    conditions:[
                        {field:'nodetype',value:{firstvalue:this.props.config.nodetype}},
                        {field:'curOrg',value:{firstvalue:this.state.curOrg}},
                        {field:'isShowOff',value:{firstvalue:this.state.isShowOff?'1':'0'}}
                    ]
                },
                pageInfo: this.props.table.getTablePageInfo(this.tableId),
                pagecode: pageId,
                queryAreaCode:searchId,  //查询区编码
                oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                queryType:'tree',
                querytype:'tree',
                isShowOff: this.state.isShowOff?'1':'0'
            };
    
            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);
                    console.log(this);
                    if(res.data){
                        this.props.ViewModel.setData(dataSource, {
                            simpleTable: {
                                allpks: res.data[this.tableId].allpks
                            }
                        });
                        let data = res.data[this.tableId];
                        if(data.rows.length > 0){
                            this.lastPk = data.rows[data.rows.length - 1].values[pk_item].value;
                        }
                        if(data.rows != null && data.rows.length > 0){
                            this.props.button.setDisabled({
                                print: false,
                                output: false,
                            });
                        }else{
                            this.props.button.setDisabled({
                                print: true,
                                output: true,
                            });
                        }
                        for(let i = 0; i < data.rows.length; i++){
                            if(data.rows[i].values['enablestate'].value == '2'){
                                data.rows[i].values['enablestate'].value = true;
                            }else{
                                data.rows[i].values['enablestate'].value = false;
                            }
                        }
                        setDefData(key_list,dataSource,data);
                        this.props.table.setAllTableData(this.tableId, data);
                        if(flag == 'search'){
                            toast({content:this.state.json['10140SGRADEG-000009']+res.data.supplier_grade_sys.pageInfo.total+this.state.json['10140SGRADEG-000010'],color:'success'});/* 国际化处理： 查询成功，共,条数据。*/
                        }
                        // props.table.setAllTableData(this.tableId, res.data[this.tableId]);
                    }else{
                        setDefData(key_list,dataSource,{rows:[]});
                        if(flag == 'search'){
                            toast({content:this.state.json['10140SGRADEG-000011'],color:'warning'});/* 国际化处理： 未查询出符合条件的数据。*/
                        }
                        this.props.table.setAllTableData(this.tableId, {rows:[]});
                        this.props.button.setDisabled({
                            print: true,
                            output: true,
                        });
                        //toast({content:"无数据",color:"warning"});
                    }
                    console.log('flag == refresh===='+flag);
                    if(flag == 'refresh'){
                        toast({title:this.state.json['10140SGRADEG-000012'],color:'success'});/* 国际化处理： 刷新成功！*/
                    }
                    this.selectedChange(props).bind(this);
                },
                error : (res)=>{
                    console.log(res.message);
                }
            });
        }
    }

    pageInfoClick = (props, config, pks)=>{
        this.refreshAction(props,'page');
        return;
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let searchVal = props.search.getAllSearchData(searchId);
        // 后台还没更新，暂不可用
        let data = {
            "allpks": pks,
            "pageid": pageId,
            'pageInfo':pageInfo,
            conditions: searchVal == null?null:searchVal.conditions,
            custconditions:[
                {field:'nodetype',value:{firstvalue:this.props.config.nodetype}},
                {field:'curOrg',value:{firstvalue:this.state.curOrg}},
                {field:'isShowOff',value:{firstvalue:this.state.isShowOff?'1':'0'}}
            ],
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
                        let data = res.data[this.tableId];
                        for(let i = 0; i < data.rows.length; i++){
                            if(data.rows[i].values['enablestate'].value == '2'){
                                data.rows[i].values['enablestate'].value = true;
                            }else{
                                data.rows[i].values['enablestate'].value = false;
                            }
                        }
                        setDefData(key_list,dataSource,data);
                        props.table.setAllTableData(this.tableId, data);
                        // props.table.setAllTableData(props.config.tableId, data[props.config.tableId]);
                    } else {
                        props.table.setAllTableData(props.config.tableId, { rows: [] });
                    }
                }
            }
        });
    }

    onAfterEvent = (props,moduleId,key,value,changedrows,record,index,method,m,n,o) => {
        console.log(props+'-'+moduleId+'-'+key+'-'+value+'-'+changedrows+'-'+record+'-'+index+'-'+method+'-'+m+'-'+n+'-'+o);
        console.log(changedrows);
        console.log(index);
        if(key == 'enablestate'){
            // if(this.pk == null || this.pk.length < 1 || this.pk == 'undefined'){
            //     return;
            // }
            let requestParam = {
                enablestate:value?'2':'1',
                pk:index.values[pk_item].value
            };console.log(props);
            ajax({
                url:enablestateUrl,
                data:requestParam,
                success:(result)=>{
                    toast({title:value?this.state.json['10140SGRADEG-000013']:this.state.json['10140SGRADEG-000014'],color:"success"});/* 国际化处理： 启用成功！,停用成功！*/
                }
            });
            return;
            props.modal.show('confirmModal',{
                color:"warning",
                title:this.state.json['10140SGRADEG-000015'],/* 国际化处理： 提示*/
                content:value?this.state.json['10140SGRADEG-000016']:this.state.json['10140SGRADEG-000017'],/* 国际化处理： 确认启用该数据？,确认停用该数据？*/
                cancelBtnClick:()=>{console.log('cancelBtnClick');
                    // let rowid = props.table.getClickRowIndex(this.tableId).record.rowId;console.log(rowid);
                    // let flag = props.editTable.getValByKeyAndRowId(this.tableId,rowid,'enablestate');console.log(flag);
                    props.table.setValByKeyAndRowId(this.tableId,index.rowId,'enablestate',{value:!value});
                },
                closeModalEve:()=>{console.log('closeModalEve');
                    // let rowid = props.table.getClickRowIndex(this.tableId).record.rowId;console.log(rowid);
                    // let flag = props.editTable.getValByKeyAndRowId(this.tableId,rowid,'enablestate');console.log(flag);
                    props.table.setValByKeyAndRowId(this.tableId,index.rowId,'enablestate',{value:!value});
                },
                beSureBtnClick:()=>{
                    ajax({
                        url:enablestateUrl,
                        data:requestParam,
                        success:(result)=>{
                            toast({title:value?this.state.json['10140SGRADEG-000013']:this.state.json['10140SGRADEG-000014'],color:"success"});/* 国际化处理： 启用成功！,停用成功！*/
                        }
                    });
                }
            });
        }
    }

    onSearchAfterEvent = (field, val) => {
        let searchVal = this.props.search.getAllSearchData(this.searchId);
        cacheTools.set("searchParams", searchVal);
        console.log('onSearchAfterEvent');
        console.log(field);
        console.log(val);
        return;
        if(val.refcode == null){
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
        this.refreshAction(props,'search');
        return;
        console.log(searchVal);
        // props.CacheTools.set("searchParams",searchVal);
        console.log('clickSearchBtn');
        console.log(searchVal);
        let metaData = props.meta.getMeta();
        let data = {
            conditions: searchVal == null?null:searchVal.conditions,
            custconditions:[
                {field:'nodetype',value:{firstvalue:this.props.config.nodetype}},
                {field:'curOrg',value:{firstvalue:this.state.curOrg}},
                {field:'isShowOff',value:{firstvalue:this.state.isShowOff?'1':'0'}}
            ],
            pageInfo: {
                pageIndex: 0,
                pageSize: 10,
                total: 0,
                totalPage: 0
            },
            pagecode: pageId,
            queryAreaCode:searchId,  //查询区编码
            oid:oId,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            queryType:'tree'
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if(res.data){
                    setDefData(key_list,dataSource,res.data[this.props.config.tableId]);
                    props.table.setAllTableData(this.tableId, res.data[this.props.config.tableId]);
                }else{
                    props.table.setAllTableData(this.tableId, {rows:[]});
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
		let { table,editTable, button, search,modal } = this.props;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
        });
        let {NCFormControl,NCCheckbox} = base;
        let { createSimpleTable } = table;
        let { createEditTable } = editTable;
		let { NCCreateSearch } = search;
        let { createButton, getButtons } = button;
        let { createButtonApp } = button;
        let { createModal } = modal;

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
                        {createPageIcon()}
					    <h2 className='title-search-detail'>{this.state.json[this.props.config.nodeName]}</h2></div>
                    {createOrgRender()}
                    {/* 显示停用数据 */}
                    <div className="title-search-detail">
                        {isShowOffEnable?(
                            <span className="showOff">
                                <NCCheckbox
                                    checked={this.state.isShowOff}
                                    onChange={this.showOffChange.bind(this)}
                                    // disabled={this.state.showOffDisable}
                                >{this.state.json['10140SGRADEG-000020']/* 国际化处理： 显示停用*/}</NCCheckbox>
                            </span>
                        ):('')}
                    </div>
					<div className="header-button-area">
                        {createButtonApp({
                            area: 'header-button-area',//按钮注册中的按钮区域
                            //buttonLimit: 5, 
                            onButtonClick: this.buttonClick.bind(this) 
                            //popContainer: document.querySelector('.header-button-area')
                        })}</div></div>
				<div className="nc-bill-search-area">
					{NCCreateSearch(this.searchId, {
                        clickSearchBtn: this.clickSearchBtn.bind(this),
                        onAfterEvent: this.onSearchAfterEvent.bind(this),  //编辑后事件
					})}
				</div>
				<div style={{height:'0px',backgroundColor:'#EDEDED'}}></div>
				<div className="nc-bill-table-area">
                    {/* {createSimpleTable(this.tableId, { */}
                    {createSimpleTable(this.tableId, {
						handlePageInfoChange: this.pageInfoClick,
						tableModelConfirm: this.tableModelConfirm,
						showIndex:true,
						showCheck:true,
                        onRowDoubleClick: this.doubleClick.bind(this),
                        onSelected:this.selectedChange.bind(this),
                        onSelectedAll:this.selectedChange.bind(this),
                        onAfterEvent:this.onAfterEvent.bind(this),
                        dataSource:dataSource,
                        pkname:pk_item,
                        onRowDoubleClick: this.doubleClick.bind(this)
                    })}
                    {createModal('confirmModal', {
							title: this.state.json['10140SGRADEG-000018'],/* 国际化处理： 注意*/
							content: this.state.json['10140SGRADEG-000000']/* 国际化处理： 确认删除？*/
                        })}
                    <PrintOutput
                        ref='printOutput'
                        url={printUrl}
                        data={{
                            funcode: '10140SGRADEG',
                            nodekey:'osgrade',
                            oids: this.state.pks,
                            outputType: 'output'
                        }}
                    />
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