//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表列表

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast,print,cacheTools,high,cardCache,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const {NCPopconfirm, NCIcon,NCTabs}=base;
const NCTabPane=NCTabs.NCTabPane;
const {PrintOutput} = high;
const {setDefData, getDefData ,deleteCacheById} = cardCache;
const dataSource = "setpart-list";
const key_list = "key_list";
const key_search = "key_search";
import './index.less';

//业务单元参照
import CorpDefaultTreeRef from  '../../../../uapbd/refer/org/CorpDefaultTreeRef'
import '../../../public/uapbdstyle/uapbd_style_common.less'

const pageId = '10141486org_list';        //pagecode
const searchId = 'search';              //查询区id
const tableId = 'paraminfo';                 //表头id
// const oId = '1002Z81000000000HGVY';     //查询区oid
const appid = '0001Z0100000000012Q7';   //注册按钮id
const linkItem = 'project_code';        //列表卡片跳转字段
const pk_item = 'pk_setpart';           //列表主键
const queryListUrl = '/nccloud/uapbd/setpart/query.do';           //通过查询区域查询url
const printUrl = '/nccloud/uapbd/setpart/print.do';           //打印url
const queryPageUrl = '/nccloud/uapbd/setpart/query.do';  //分页查询url
const deleteUrl = '/nccloud/uapbd/setpart/del.do';                 //删除url



class List extends Component {
	constructor(props) {console.log('constructor');console.log(props);
		super(props);
		this.searchId = props.config.searchId;
        this.tableId = props.config.tableId;
        //显示停用复选框的状态标志
        this.state = {
            checked: false,//判断 显示停用按钮是否选中
            curSelectedNode: null, //直接点击树节点操作按钮时 用于记录selectedNode
            method: null,//记录当前的操作，add=新增，edit=修改
            configs: {},
            curOrg: null,
            json: {}
        }
        this.cardUrl = ""
        if(props.config.nodetype == 'group'){
            this.cardUrl = "/uapbd/material/setpart-grp/card/index.html";
        }else{
            this.cardUrl = "/uapbd/material/setpart-org/card/index.html";
        }
        this.initTemplate(props);
	}
	componentDidMount() {
		//this.getData(); 平台考虑效率，打开节点不直接加载数据
        this.toggleButton(this.props);
        this.props.button.setDisabled({
            delete: true,
            print: true,
            output: true
        });
        this.props.button.setButtonVisible({
            delete: false,
            print: false,
            output: false
        });
        // if(this.props.config.nodetype == 'org'){
        //     this.props.button.setDisabled({'add':true});
        // }

        // let searchVal = cacheTools.get(this.props.config.searchId);
        // console.log(searchVal);
        // this.props.search.setSearchValue(this.props.config.searchId,searchVal);
    }

    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10141486',domainName: 'uapbd',callback});
    }
    
    initTemplate =(props) =>{

        let _this = this;
        props.createUIDom(
            {
                pagecode: props.config.pageCode,//页面id
                // appid: config.appid,//注册按钮的id
                // appcode: config.appcode
            },
            (data) => {console.log('inittemplage');console.log(data);
                if (data) {
                    if (data.template) {
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta);
                        if (data.button) {
                            let button = data.button;
                            props.button.setButtons(button);
                        }
                        props.meta.setMeta(meta);
                        let searchVal = cacheTools.get(props.config.searchId);
                        if(searchVal != null && searchVal.conditions != null){
                            props.search.setSearchValue(props.config.searchId,searchVal);
                        }
                    }
                }
                props.button.setPopContent('tabledel',this.state.json['10141486-000002']);/* 国际化处理： 确认删除？*/
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
            for(let i = 0; i < searchItems.length; i++){console.log(searchItems[i].attrcode);
                if(searchItems[i].attrcode == 'cmaterialoid.code'){//物料编码
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                    searchItems[i].isShowDisabledData = true;
                    searchItems[i].queryCondition = () => {
                        return {
                            setpartsflag : 'Y',
                        };
                    };
                }
                if(searchItems[i].attrcode == 'cmaterialoid.name'){//物料编码
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                    searchItems[i].isShowDisabledData = true;
                    searchItems[i].queryCondition = () => {
                        return {
                            setpartsflag : 'Y',
                        };
                    };
                }
                if(searchItems[i].attrcode == 'pk_setpart_b.cmaterialoid'){//物料编码
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                    searchItems[i].isShowDisabledData = true;
                    searchItems[i].queryCondition = () => {
                        return {
                            setpartsflag : 'Y',
                        };
                    };
                }
                if(searchItems[i].attrcode == 'pk_setpart_b.cmaterialoid.name'){//物料编码
                    searchItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                    searchItems[i].isShowDisabledData = true;
                    searchItems[i].queryCondition = () => {
                        return {
                            setpartsflag : 'Y',
                        };
                    };
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
                                    let searchVal = props.search.getAllSearchData(props.config.searchId);
                                    // props.CacheTools.set("searchParams",searchVal);
                                    // props.CacheTools.set('preid',record[config.pk_item].value);
                                    props.pushTo('/card', {
                                        pagecode:props.config.pageCodeCard,
                                        status: 'browse',
                                        id: record['pk_setpart'].value//列表卡片传参
                                    });
                                }}
                            >
                                {record && record['cmaterialvid'] && record['cmaterialvid'].display}
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
                label: this.state.json['10141486-000000'],/* 国际化处理： 操作*/
                width: 300,
                fixed: 'right',
                className : 'table-opr',
                itemtype: 'customer',
                visible: true,
                render: (text, record, index) => {
                    // return props.button.createOprationButton(
                    //     ['tableedit','tabledel'],
                    //     {
                    //         area: "table-button-area",
                    //         buttonLimit: 3,
                    //         onButtonClick: (props, id) => tableButtonClick(props, id, text, record, index)
                    //     }
                    // )
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
                            {/* <span
                                style={{cursor: 'pointer',display:'none' }}
                                onClick={() => {
                                    // if(record['pk_group'].value != record['pk_org'].value){
                                    //     toast({content:"集团节点只能维护当前登录集团的数据！",color:"warning"});
                                    //     return;
                                    // }
                                    // props.linkTo('/uapbd/material/setpart-grp/card/index.html', {
                                    // 	status: 'edit',
                                    // 	id: record[config.pk_item].value
                                    // });
                                    props.pushTo('/card', {
                                        status: 'browse',
                                        id: record[props.config.pk_item].value
                                    });
                                }}
                            >{this.state.json['10141486-000013']/* 国际化处理： 详情}</span> */}
                            
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
                            <span
                                style={{cursor: 'pointer',fontSize: '13px'}}
                                onClick={() => {
                                    let pks = [record[props.config.pk_item].value];
                                    print(
                                        'pdf',
                                        printUrl,
                                        {
                                            billtype:'',//单据类型
                                            funcode:props.config.appcode,//功能节点编码，即模板编码
                                            nodekey:'',//模板节点标识
                                            oids:pks,//单据pk
                                            outputType:'print'
                                        }
                                    );
                                }}
                            >{this.state.json['10141486-000035']/* 国际化处理： 打印*/}</span>
                        </span>
                    );
                }
            });
            return meta;
        }
    tableButtonClick(props, id, text, record, index){
        console.log(props.config.nodetype);
        console.log(record);
        if(id == 'tableedit'){
            if(props.config.nodetype == 'group'){
                if(record['pk_group'].value != record['pk_org'].value){
                    toast({content:this.state.json['10141486-000018'],color:"warning"});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
                    return;
                }
            }else if(props.config.nodetype == 'org'){
                // if(pk_org != this.state.curOrg){
                if(record['pk_group'].value == record['pk_org'].value){
                    toast({content:this.state.json['10141486-000001'],color:"warning"});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                    return;
                }
            }
            props.pushTo('/card', {
                status: 'edit',
                pagecode:props.config.pageCodeCard,
                id: record[props.config.pk_item].value
            });
        }else if(id == 'tabledel'){
            // if(record['pk_group'].value != record['pk_org'].value){
            //     toast({content:"集团节点只能维护当前登录集团的数据！",color:"warning"});
            //     return;
            // }
            if(props.config.nodetype == 'group'){
                if(record['pk_group'].value != record['pk_org'].value){
                    toast({content:this.state.json['10141486-000018'],color:"warning"});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
                    return;
                }
            }else if(props.config.nodetype == 'org'){
                // if(pk_org != this.state.curOrg){
                if(record['pk_group'].value == record['pk_org'].value){
                    toast({content:this.state.json['10141486-000001'],color:"warning"});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                    return;
                }
            }
            ajax({
                url: deleteUrl,
                data: {deleteinfo:[{
                    id: record[props.config.pk_item].value,
                    ts: record.ts.value
                }]},
                success: (res) => {
                    if (res.success) {
                        toast({ color: 'success', content: this.state.json['10141486-000003'] });
                        let allData3 = props.table.getAllTableData(props.config.tableId);
                        allData3.rows.splice(index,1)
                        allData3.allpks.splice(index,1)
                        props.table.setAllTableData(props.config.tableId, allData3)
                        //deleteCacheById(pk_item,this.id,dataSource);
                        //props.table.deleteTableRowsByIndex(props.config.tableId, index);
                    }
                }
            });
        }
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
        console.log(id);
        switch (id) {
            case 'print':
                let allD = this.props.table.getAllTableData(this.props.config.tableId);
                let pks = [];
                allD.rows.forEach((item,index)=>{
                    console.log(item);
                    if(item.selected == true){
                        pks.push(item.values['pk_setpart'].value);
                    }
                });console.log('printPks');console.log(pks);
                print(
                    'pdf',
                    printUrl,
                    {
                        billtype:'',//单据类型
                        funcode:props.config.appcode,//功能节点编码，即模板编码
                        nodekey:'',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'print'
                    }
                );
                break;
            case 'output':
                allD = this.props.table.getAllTableData(this.props.config.tableId);
                pks = [];
                allD.rows.forEach((item,index)=>{
                    if(item.selected == true){
                        pks.push(item.values['pk_setpart'].value);
                    }
                });console.log('printPks');console.log(pks);
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
                        funcode:props.config.appcode,//功能节点编码，即模板编码
                        nodekey:'',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'print'
                    }
                );
                break;
            case 'add':
                props.pushTo('/card',{
                    pagecode:props.config.pageCodeCard,
                    status:'add',
                    id:''
                })
                // this.props.CacheTools.remove('preid');
                break;
            case 'edit':
                let oid = '';
                let data = props.table.getCheckedRows(this.tableId);
                console.log(data);
                if(data.length != 1){
                    toast({content:this.state.json['10141486-000004'],color:"warning"});/* 国际化处理： 只能单选*/
                    return;
                }
                oid = data[0].data.values['pk_setpart'].value;
                props.pushTo('/card',{
                    pagecode:props.config.pageCodeCard,
                    status:'edit',
                    id:oid
                })
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
            
        console.log(this.state.json['10141486-000005']);/* 国际化处理： 双击*/
        console.log(record);console.log(index);console.log(e);
        let searchVal = this.props.search.getAllSearchData(this.props.config.searchId);
        // this.props.CacheTools.set("searchParams", searchVal);
        // this.props.CacheTools.set('preid',props.getUrlParam('id'));
        console.log(cacheTools);
        console.log(searchVal);
        cacheTools.set(this.props.config.searchId, searchVal);
        this.props.pushTo('/card', {
            pagecode:this.props.config.pageCodeCard,
            status: 'browse',
            id: record[pk_item].value
        });
    }
    
    selectedChange = (props) =>{
        let data = props.table.getCheckedRows(this.tableId);
        console.log(data);
        if(data.length == 1){
            this.props.button.setDisabled({
                delete: false,
                print:false,
                output:false
            });
        }else{
            this.props.button.setDisabled({
                delete: true,
                print:true,
                output:true
            });
        }
    }

    deleteAction = (props) =>{
        let data = props.table.getCheckedRows(this.tableId);
        console.log(data)
        if(data.length != 1){
            toast({content:this.state.json['10141486-000004'],color:"warning"});/* 国际化处理： 只能单选*/
            return;
        }
        promptBox({
            color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
            title: this.state.json['10141486-000006'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
            content: this.state.json['10141486-000007'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
            // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
            // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
            // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
            // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
            beSureBtnClick: () =>{
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
                        toast({color:"success",title:this.state.json['10141486-000008']});/* 国际化处理： 删除成功！*/
                        this.refreshAction(props);
                    }
                });
            }
            // cancelBtnClick: () => {
            //     console.log('cancelBtnClick');
            //     this.props.modal.close('cancelConfirmModal');
            // }
        });
        // props.modal.show('delete',{
        //     color:"warning",
        //     title:'提示',
        //     content:'确认删除？',
        //     cancelBtnClick:()=>{console.log('cancelBtnClick');
        //         this.props.modal.close('confirmModal');
        //     },
        //     beSureBtnClick:()=>{
        //         let params = {deleteinfo:data.map((v)=>{
        //             let id = v.data.values[pk_item].value;
        //             let ts = v.data.values.ts.value;
        //             return {
        //                 id,ts
        //             }
        //         })}
        //         console.log(params)
        //         ajax({
        //             url: deleteUrl,
        //             data: params,
        //             success: (res) => {
        //                 toast({color:"success",content:"删除成功"});
        //                 this.refreshAction(props);
        //             }
        //         });
        //     }
        // })
    }

    refreshAction =(props,flag)=>{console.log(this.state.curOrg);
        // if(this.props.config.nodetype === "org" && (this.state.curOrg == null || this.state.curOrg.length < 1)){
        //     return;
        // }
        let searchVal = props.search.getAllSearchData(searchId);
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        console.log('refreshAction');
        console.log(pageInfo);
        console.log(searchVal);
        console.log(this.props.meta.getMeta());
        let metaData = this.props.meta.getMeta();
        if(searchVal != false){
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
                pageInfo: pageInfo,
                appcode: this.props.config.appcode,
                pageCode: pageId,
                queryAreaCode:searchId,  //查询区编码
                oid:metaData.search.oid,//this.props.config.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
                queryType:'tree',
                querytype:'tree',
                template:this.props.config.template
            };
    
            ajax({
                url: queryListUrl,
                data,
                success: (res) => {
                    console.log(res);
                    if(res.data){
                        props.ViewModel.setData(dataSource, {
                            simpleTable: {
                                allpks: res.data[props.config.tableId].allpks
                            }
                        });
                        let l_rows = res.data[props.config.tableId].rows;
                        if(l_rows != null && l_rows.length > 0){
                            for(let i = 0; i < l_rows.length; i++){
                                if(l_rows[i].values.pk_org.value == l_rows[i].values.pk_org.display){
                                    l_rows[i].values.pk_org.display = '';
                                }
                            }
                        }
                        res.data[props.config.tableId].rows = l_rows;
                        props.table.setAllTableData(props.config.tableId, res.data[props.config.tableId]);
                        setDefData(key_list,dataSource,res.data[this.props.config.tableId]);
                    }else{
                        props.table.setAllTableData(this.tableId, {rows:[]});
                        //toast({content:"无数据",color:"warning"});
                    }
                    console.log(this.state.curOrg);
                    if(flag == 'refresh'){
                        toast({title:this.state.json['10141486-000009'],color:"success"});/* 国际化处理： 刷新成功！*/
                    }
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
            "pageid": pageId
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
                        setDefData(key_list,dataSource,data[props.config.tableId]);
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
        let searchVal = this.props.search.getAllSearchData(this.props.config.searchId);
        cacheTools.set(this.props.config.searchId, searchVal);
        if(val.refcode == null){
            return;
        }
        let value = this.props.search.getSearchValByField( this.searchId, field );
        console.log(value);
        if(field === 'cmaterialoid.code'){//成套件编码
            value.display = val.refcode;
            value.value.firstvalue = val.refcode;
        }else if(field === 'cmaterialoid.name'){//成套件名称
            value.display = val.refname;
            value.value.firstvalue = val.refname;
        }else if(field === 'pk_setpart_b.cmaterialoid'){//配件名称
            // value.display = val.refcode;
            // value.value.firstvalue = val.refcode;
        }else if(field === 'pk_setpart_b.cmaterialoid.name'){//配件名称
            // value.display = val.refname;
            // value.value.firstvalue = val.refname;
        }
        value.value = value.value.firstvalue;
        this.props.search.setSearchValByField(this.searchId,field,value);
        console.log(this.props.search.getSearchValByField(this.searchId,field));
    }

    clickSearchBtn = (props,searchVal)=>{console.log(searchVal);
        // if(this.props.config.nodetype === "org" && (this.state.curOrg == null || this.state.curOrg.length < 1)){
        //     return;
        // }
        searchVal =this.props.search.getAllSearchData(this.props.config.searchId);
        console.log(searchVal);
        // props.CacheTools.set("searchParams",searchVal);
        console.log('clickSearchBtn');
        console.log(searchVal);
        let metaData = this.props.meta.getMeta();
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
            appcode: this.props.config.appcode,
            pageCode: pageId,
            queryAreaCode:searchId,  //查询区编码
            oid:metaData.search.oid,//this.props.config.oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            queryType:'tree',
            querytype:'tree',
            template:this.props.config.template
        };

        ajax({
            url: queryListUrl,
            data,
            success: (res) => {
                console.log(res);
                if(res.data){
                    this.props.ViewModel.setData(dataSource, {
                        simpleTable: {
                            allpks: res.data[props.config.tableId].allpks
                        }
                    });
                    let l_rows = res.data[props.config.tableId].rows;
                    if(l_rows != null && l_rows.length > 0){
                        for(let i = 0; i < l_rows.length; i++){
                            if(l_rows[i].values.pk_org.value == l_rows[i].values.pk_org.display){
                                l_rows[i].values.pk_org.display = '';
                            }
                        }
                    }
                    res.data[props.config.tableId].rows = l_rows;
                    setDefData(key_list,dataSource,data[this.props.config.tableId]);
                    this.props.table.setAllTableData(this.tableId, res.data[this.props.config.tableId]);
                    toast({content:this.state.json['10141486-000010']+res.data.ic_setpart.pageInfo.total+this.state.json['10141486-000011'],color:'success'});/* 国际化处理： 查询成功，共,条数据。*/
                }else{
                    this.props.table.setAllTableData(this.tableId, {rows:[]});
                    toast({content:this.state.json['10141486-000012'],color:'warning'});/* 国际化处理： 未查询出符合条件的数据。*/
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
            //value:this.state.configs[id]?this.state.configs[id].value:[],
            onChange:function (val) {
                console.log('onChange--'+val);
                console.log(val);
                if(val == null || val.refpk == null || val.refpk.length < 1){
                    return;
                }
                this.props.button.setDisabled({'add':false});
                this.state.curOrg = val.refpk;
                cacheTools.set('curOrg',this.state.curOrg); 
                this.refreshAction(this.props);
                // this.loadTree();//重新加载树
                // var temp= Object.assign(this.state.configs[id],{value:val});
                // this.setState(Object.assign (this.state.configs,temp));
            }.bind(this)
        }
        //this.state.configs[id]=obj;
        // var result_param= Object.assign(obj, param)
        return obj;
    }

	render() {
		let { table, button, search,modal } = this.props;
		let buttons  = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createSimpleTable } = table;
		let { NCCreateSearch } = search;
        let { createButton, getButtons } = button;
        let { createButtonApp } = button;
        let { createModal } = modal;

        let createOrgRender = () => {
            return '';
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
                                TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
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
						showCheck:false,
                        onRowDoubleClick: this.doubleClick.bind(this),
                        dataSource: dataSource,
                        selectedChange:this.selectedChange.bind(this),
                        onSelected: this.selectedChange.bind(this),                        // 左侧选择列单个选择框回调
                        onSelectedAll: this.selectedChange.bind(this),
                        pkname:'pk_setpart'
                    })}
                    {createModal('delete', {
                        title: this.state.json['10141486-000006'],/* 国际化处理： 注意*/
                        content: this.state.json['10141486-000007'],/* 国际化处理： 确认删除？*/
                    })}
                    <PrintOutput
                        ref='printOutput'
                        url={printUrl}
                        data={{
                            funcode: '10141486',
                            nodekey:'',
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