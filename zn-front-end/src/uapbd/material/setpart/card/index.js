//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast ,print,high,cardCache,promptBox,getMultiLang,createPageIcon} from 'nc-lightapp-front';
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;
const {PrintOutput} = high;
const {setDefData, getDefData,addCache,updateCache,deleteCacheById,getCurrentLastId,getNextId } = cardCache;
const dataSource = "setpart-list";
const key_list = "key_list";
const key_search = "key_search";
import './index.less';

//业务单元参照
import CorpDefaultTreeRef from  '../../../../uapbd/refer/org/CorpDefaultTreeRef'
import deepClone from  '../../../../uapbd/public/utils/deepClone'

const formId = 'ic_setpart';                      //表头id
const tableId = 'ic_setpart_b';            //子表id
const pageId = '10140CSSPD_configparam_card';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='0001Z0100000000012Q7';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/setpart/pagequery.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/setpart/save.do';             //新增保存
const updateUrl = '/nccloud/uapbd/setpart/save.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/setpart/del.do';         //删除
const pk_item = 'pk_setpart';               //单据主键--用于卡片查询刷新
const titleCode = 'cmaterialvid.name';            //单据编码--用于卡片表头显示
const printUrl = '/nccloud/uapbd/setpart/print.do';           //打印url
const unitUrl = '/nccloud/uapbd/setpart/loadUnitInfo.do';
const corpRefValidateUrl = '/nccloud/uapbd/setpart/corpRefValidate.do';

// let initTemplate =(props)=>{
// 	props.createUIDom(
// 		{
// 			pagecode: pageId,//页面id
// 			appid: appId//注册按钮的id
// 		}, 
// 		function (data){
//             console.log("data");
//             console.log(data);
// 			if(data){
// 				if(data.template){
// 					let meta = data.template;
// 					modifierMeta(props, meta)
// 					props.meta.setMeta(meta);
// 					// let status = props.getUrlParam('status');
// 					// if(status && status == 'add'){
// 					// 	props.cardTable.addRow(tableId);
// 					// }
// 				}
// 				if(data.button){
// 					let button = data.button;
//                     props.button.setButtons(button);
//                     console.log('initTemplate');console.log(props);
//                     console.log(props.button.getButtons());
//                     toggleShow(props);
// 				}
// 			}   
// 		}
// 	)
// }

// //切换页面状态
// function toggleShow(props){
//     let status = props.getUrlParam('status');
// 	let flag = status === 'browse' ? false : true;
// 	//按钮的显示状态
// 	if(status == 'edit' || status == 'add'){
// 		props.button.setButtonVisible(['edit','add','back','delete','refresh'],false);
// 		props.button.setButtonVisible(['save','cancel','addline'],true);
// 		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
// 	}else{
// 		props.button.setButtonVisible(['save','cancel','addline'],false);
// 		props.button.setButtonVisible(['add','edit','delete','back','refresh'],true);
// 		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
// 	}
// 	props.form.setFormStatus(formId, status);
// 	props.cardTable.setStatus(tableId, status);
// };

// function modifierMeta(props, meta) {
// 	let status = props.getUrlParam('status');
// 	meta[formId].status = status;
// 	meta[tableId].status = status;
    
//     //修改参照refcode
//     let formItems = meta[formId].items;
//     for(let i = 0; i < formItems.length; i++){
//         if(formItems[i].attrcode === 'pk_org'){console.log('修改参照pkorg');
//             // formItems[i].refcode = '../../../../uapbd/refer/org/AssignedOrgTreeRef/index';
//             formItems[i].refcode = '../../../../uapbd/refer/orgv/BusinessUnitVersionTreeRef/index.js';
//         }
//     }

//     let tableItems = meta[tableId].items;console.log(tableItems);
//     for(let i = 0; i < tableItems.length; i++){
//         if(tableItems[i].attrcode === 'paramcode'){console.log('修改参照');
//             tableItems[i].refcode = '../../../../uapbd/refer/param/ParamGridRef/index.js';
//             //参数组织过滤
//             tableItems[i].queryCondition = () => {
//                 let pk_org = props.form.getFormItemsValue(formId,'pk_org').value;
//                 console.log('modifierMeta pkorg = '+pk_org);
//                 return {pk_org : pk_org};
//             };
//         }
//     }

// 	let porCol = {
// 		attrcode: 'opr',
// 		label: '操作',
//         visible: true,
//         itemtype: 'customer',
// 		className:'table-opr',
// 		width:200,
// 		fixed:'right',
// 		render(text, record, index) {
// 			let status = props.cardTable.getStatus(tableId);
// 			return status === 'browse' ? (
// 				<span
//     				onClick={() => {
//                         props.cardTable.toggleRowView(tableId, record)
        
//                     }}
//                     > 展开
//              	</span>
// 			):(<div className="currency-opr-col">
// 					<span
// 						className="currency-opr-del"
// 						onClick={(e) => {
// 							props.cardTable.openModel(tableId, 'edit', record, index);
// 							e.stopPropagation();
// 						}}
// 					>更多</span>
// 					&nbsp;&nbsp;
// 					<span
// 						className="currency-opr-del"
// 						onClick={(e) => {
// 							props.cardTable.delRowsByIndex(tableId, index);
// 							e.stopPropagation();
// 						}}
// 					>删除</span>
// 				</div>
// 	        );
// 		}
//     };
// 	meta[tableId].items.push(porCol);

// 	return meta;
// }
//切换页面状态
function toggleShow(props){console.log('toggleShow');
    let status = this.props.getUrlParam('status');
    let flag = status === 'browse' ? false : true;
    // status = props.form.getFormStatus(formId);
    //按钮的显示状态
    console.log(status);
    if(status == 'edit' || status == 'add'){
         this.props.button.setButtonVisible(['edit','add','back','delete','refresh','print'],false);
         this.props.button.setButtonVisible(['save','cancel','addline','insert','copy'],true);
        this. props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
         this.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn: false});
    }else{
         this.props.button.setButtonVisible(['save','addline','insert','copy','cancel'],false);
         this.props.button.setButtonVisible(['add','edit','delete','back','refresh','print'],true);
         this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
         this.props.BillHeadInfo.setBillHeadInfoVisible({showBackBtn: true});
    }
     this.props.form.setFormStatus(formId, status);
     this.props.cardTable.setStatus(tableId, status);
}

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.searchId = searchId;
        this.tableId = tableId;
        this.id = '';
		this.state = {
			pk_org : '',
			title_code : '',
			totalcount : 0,
            applycount : 0,
            configs: {},
            curOrg: null,
            json: {}
        }
        this.cardUrl = "";
        this.listUrl = "";
        this.unitInfo = {};
        this.selectedRowid = "";//当前选择的子表rowid
        this.selectedIndex = -1;//当前选择的子表index
        if(props.config.nodetype == 'group'){
            this.cardUrl = "/uapbd/material/setpart-grp/card/index.html";
            this.listUrl = "/uapbd/material/setpart-grp/list/index.html";
        }else{
            this.cardUrl = "/uapbd/material/setpart-org/card/index.html";
            this.listUrl = "/uapbd/material/setpart-org/list/index.html";
        }
        this.initTemplate(props);
	}
	componentDidMount() {
        //this.toggleShow(this.props);
        toggleShow.call(this,this.props);
        console.log('componentDidMount');
		let status = this.props.getUrlParam('status');
		if(status != "add"){
			let	pk = this.props.getUrlParam('id');
			if(pk && pk != 'undefined' && pk.length > 0){
                this.id = pk;
				this.getdata(pk);
			}
		}
		else{
			this.setDefaultValue();
        }
        this.props.button.setDisabled({
            delete: true,
            print: true,
            output: true,
            edit: true
        });
        if(this.props.config.nodetype == 'org'){
            this.props.form.setFormItemsDisabled(this.formId,{'cmaterialvid':true});
        }else{
            this.props.form.setFormItemsDisabled(this.formId,{'cmaterialvid':false});
        }
        this.loadUnitInfo();
        //默认业务单元设置
        setTimeout(()=>{
            console.log('set default unit');
            console.log(this.props.config);
            if(this.props.config.defaultOrg.pk_org != null && this.props.config.defaultOrg.pk_org.length > 0){
                // this.state.configs['CorpDefaultTreeRef']={value:{refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name}};
                // this.state.curOrgObj = {refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name};
                // this.state.curOrg = this.props.config.defaultOrg.pk_org;
                // this.setState(this.state);
                // this.props.form.setFormItemsDisabled(this.formId,{'cmaterialvid':false});
                this.corpRefValidate();
            }
        },500);
        setTimeout(()=>{
        let pk = this.props.form.getFormItemsValue(this.formId, 'pk_setpart').value;
            if(pk == null || pk.length < 1){
                this.props.button.setDisabled({
                    delete: true,
                    print: true,
                    output: true,
                    edit: true
                });
            }else{
                this.props.button.setDisabled({
                    delete: false,
                    print: false,
                    output: false,
                    edit: false
                });
            }
        },1000);
    }
    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10141486',domainName: 'uapbd',callback});
    }
    componentDidUpdate(){
        let formStatus = this.props.form.getFormStatus(this.formId);
        if(formStatus != 'add' && formStatus != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    }

    initTemplate = (props)=>{
        props.createUIDom(
            {
                pagecode: props.config.pageCode,//页面id
                // appid: config.appid,//注册按钮的id
                // appcode: config.appcode
            }, 
            (data) => {
                console.log("data");
                console.log(data);
                if(data){
                    if(data.template){
                        let meta = data.template;
                        this.modifierMeta(props, meta);
                        let status = props.getUrlParam('status');
                        if(status == 'add'){
                            props.form.setFormStatus(props.config.formId, 'add');
                        }
                        props.meta.setMeta(meta);
                        // let status = props.getUrlParam('status');
                        // if(status && status == 'add'){
                        // 	props.cardTable.addRow(tableId);
                        // }
                    }
                    if(data.button){
                        let button = data.button;
                        props.button.setButtons(button);
                        console.log('initTemplate');console.log(props);
                        console.log(props.button.getButtons());
                        
                        let status = props.getUrlParam('status');
                        let flag = status === 'browse' ? false : true;
                        //按钮的显示状态
                        if(status == 'edit' || status == 'add'){
                            props.button.setButtonVisible(['edit','add','back','delete','refresh','print'],false);
                            props.button.setButtonVisible(['save','cancel','addline','insert','copy'],true);
                            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                        }else{
                            props.button.setButtonVisible(['save','cancel','addline','insert','copy'],false);
                            props.button.setButtonVisible(['add','edit','delete','back','refresh','print'],true);
                            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
                        }
                        props.form.setFormStatus(props.config.formId, status);
                        props.cardTable.setStatus(props.config.tableId, status);
                    }
                    props.config.defaultOrg = {pk_org:data.context.pk_org,org_Name:data.context.org_Name};
                    if(this.props.config.defaultOrg.pk_org != null && this.props.config.defaultOrg.pk_org.length > 0){
                        this.corpRefValidate();
                    }

                }   
            }
        )
    }
    
    modifierMeta = (props, meta) => {
        let status = props.getUrlParam('status');
        meta[props.config.formId].status = status;
        meta[props.config.tableId].status = status;
        console.log('modifierMeta');
        // 修改参照refcode
        let formItems = meta[props.config.formId].items;
        for(let i = 0; i < formItems.length; i++){
            if(formItems[i].attrcode === 'cmaterialvid'){
                // formItems[i].refcode = '../../../../uapbd/refer/org/AssignedOrgTreeRef/index';
                formItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';//物料多版本
                formItems[i].queryCondition = () => {
                    return {
                        setpartsflag : 'Y',
                        pk_org:this.state.curOrg,
                        GridRefActionExt:'nccloud.web.uapbd.ref.pub.MaterialMultiVersionGridRefExt'
                    };
                };
            }
        }
    
        let tableItems = meta[props.config.tableId].items;console.log(tableItems);
        for(let i = 0; i < tableItems.length; i++){
            if(tableItems[i].attrcode === 'cmaterialvid'){console.log(this.state.json['10141486-000016']);/* 国际化处理： 配件编码*/
                tableItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                //物料 成套件过滤
                tableItems[i].queryCondition = () => {
                    return {
                        pk_org:this.state.curOrg,
                        GridRefActionExt:'nccloud.web.uapbd.ref.pub.MaterialMultiVersionGridRefExt'
                    };
                };
            }
        }
    
        let porCol = {
            attrcode: 'opr',
            label: this.state.json['10141486-000000'],/* 国际化处理： 操作*/
            visible: true,
            itemtype: 'customer',
            className:'table-opr',
            width:200,
            fixed:'right',
            render:(text, record, index) => {
                let status = props.cardTable.getStatus(props.config.tableId);
                return status === 'browse' ? (
                    <span
                        onClick={() => {
                            props.cardTable.toggleRowView(props.config.tableId, record)
            
                        }}
                        > 
                        {/* 展开 */}
                     </span>
                ):(<div className="currency-opr-col">
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.openModel(props.config.tableId, 'edit', record, index);
                                e.stopPropagation();
                            }}
                        >{this.state.json['10141486-000028']/* 国际化处理： 更多*/}</span>
                        &nbsp;&nbsp;
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.delRowsByIndex(props.config.tableId, index);
                                e.stopPropagation();
                            }}
                        >{this.state.json['10141486-000036']/* 国际化处理： 删除*/}</span>
                    </div>
                );
            }
        };
        meta[props.config.tableId].items.push(porCol);
    
        return meta;
    }
	setDefaultValue = () =>{
        this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:this.state.json['10141486-000017']}});/* 国际化处理： 自由态*/
	}

    buttonClick =(props, id)=>{console.log('buttonClick');console.log(props);console.log(id);
        let _this = this;
        switch (id) {
            case 'print':
                let	pk = this.props.getUrlParam('id');
                if(pk == null || pk == 'undefined'){
                    return
                }
                let pks = [];
                pks.push(pk);
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
                pk = this.props.getUrlParam('id');
                if(pk == null || pk == 'undefined'){
                    return
                }
                pks = [];
                pks.push(pk);
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
            props.form.EmptyAllFormValue(this.formId)
            props.cardTable.setTableData(this.tableId, { rows: [] })
            props.pushTo('/card', {
              status: 'add',
              pagecode:props.config.pageCode,
              id:props.getUrlParam('id')
            })
            toggleShow.call(this,props);
            this.setDefaultValue();
            this.setState(this.state);
            break
          case 'edit':
            let pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
            let pk_group = props.form.getFormItemsValue(this.formId, 'pk_group').value;
            if(props.config.nodetype == 'group'){
                if(pk_org != pk_group){
                    toast({content:this.state.json['10141486-000018'],color:"warning"});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
                    return;
                }
            }else if(props.config.nodetype == 'org'){
                // if(pk_org != this.state.curOrg){
                if(pk_org == pk_group){
                    toast({content:this.state.json['10141486-000001'],color:"warning"});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                    return;
                }
            }
            let l_id = props.getUrlParam('id');
            if(l_id == null || l_id.length < 1 || l_id == 'undefined'){
                toast({content:this.state.json['10141486-000019'],color:"warning"});/* 国际化处理： 没有可修改的数据*/
                return;
            }
            props.pushTo('/card', {
              pagecode:props.config.pageCode,
              status: 'edit',
              id: l_id
            })
            toggleShow.call(this,props);
            this.setState(this.state);
            //重新设置精度
            let cardTableData = props.cardTable.getAllData(this.tableId).rows;
            console.log(cardTableData);
            if(cardTableData != null && cardTableData.length > 0){
                for(let i = 0; i < cardTableData.length; i++){
                    let scale = this.unitInfo[cardTableData[i].values.pk_partunit.value]['bitnumber'];
                    console.log(this.unitInfo[cardTableData[i].values.pk_partunit.value]);
                    if(scale != null){
                        // cardTable.setValByKeyAndIndex(moduleId,index, 'childsnum', { scale: scale });//父含子数
                        // cardTable.setValByKeyAndIndex(moduleId,index, 'partpercent', { scale:scale });//单件单价权树
                        props.cardTable.setValByKeyAndRowId(this.tableId,cardTableData[i].rowid, 'childsnum', { scale: scale });//父含子数
                        props.cardTable.setValByKeyAndRowId(this.tableId,cardTableData[i].rowid, 'partpercent', { scale:scale });//单件单价权树
                    }
                }
            }
            break;
          case 'delete':
            pk_org = props.form.getFormItemsValue(this.formId, 'pk_org').value;
            pk_group = props.form.getFormItemsValue(this.formId, 'pk_group').value;
            if(props.config.nodetype == 'group'){
                if(pk_org != pk_group){
                    toast({content:this.state.json['10141486-000018'],color:"warning"});/* 国际化处理： 集团节点只能维护当前登录集团的数据！*/
                    return;
                }
            }else if(props.config.nodetype == 'org'){
                // if(pk_org != this.state.curOrg){
                if(pk_org == pk_group){
                    toast({content:this.state.json['10141486-000001'],color:"warning"});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/
                    return;
                }
            }
            // this.props.modal.show('delete');
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: this.state.json['10141486-000036'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                content: this.state.json['10141486-000002'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
                // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                beSureBtnClick: this.delConfirm.bind(this),
                // cancelBtnClick: () => {
                //     console.log('cancelBtnClick');
                //     this.props.modal.close('cancelConfirmModal');
                // }
            });
            break
          case 'back':
            // props.linkTo(this.listUrl, {});
            props.pushTo('/list', {
                pagecode:props.config.pageCodeList,
            })
            break
          case 'save':
            this.execValidateFormular(()=>{this.saveClick();});
            //this.saveClick();
            break
          case 'cancel':
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: this.state.json['10141486-000006'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
                content: this.state.json['10141486-000020'],             // 提示内容,非必输/* 国际化处理： 确认取消操作？*/
                // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                beSureBtnClick: ()=>{
                    props.form.cancel(this.formId);
                    // props.cardTable.cancelEdit(this.tableId);
                    props.pushTo('/card', {
                        pagecode:props.config.pageCode,
                        status: 'browse',
                        id: this.id
                    });
                    toggleShow.call(this,props);
                    this.setState(this.state);
                    let id = props.getUrlParam('id');
                    console.log(id);
                    console.log(getCurrentLastId(dataSource));
                    if(id == null || id.length < 1){
                        id = getCurrentLastId(dataSource);
                        console.log(id);
                    }
                    let formpk = props.form.getFormItemsValue(this.formId,'pk_setpart');
                    console.log(formpk);
                    if(formpk != null && formpk.value != null && formpk.value.length > 0){
                        this.props.button.setDisabled({
                            delete: false,
                            print: false,
                            output: false,
                            edit: false
                        });
                        props.button.setButtonVisible(['delete','print','output','edit','refresh'],true);
                        this.getdata(formpk);
                    }else if(id != null && id.length > 0){
                        this.props.button.setDisabled({
                            delete: false,
                            print: false,
                            output: false,
                            edit: false
                        });
                        props.button.setButtonVisible(['delete','print','output','edit','refresh'],true);
                        this.getdata(id);
                    }else{
                        this.props.button.setDisabled({
                            delete: true,
                            print: true,
                            output: true,
                            edit: true
                        });
                        props.button.setButtonVisible(['delete','print','output','edit','refresh'],false);
                        props.form.EmptyAllFormValue(this.formId);
                        this.props.cardTable.setTableData(props.config.tableId, {'rows':[]});
                        // props.pushTo('/list', {
                        //     status: 'browse',
                        //     id: this.id
                        // });
                    }
                },
                // cancelBtnClick: () => {
                //     console.log('cancelBtnClick');
                //     this.props.modal.close('cancelConfirmModal');
                // }
            })
            // props.modal.show('confirmModal',{
            //     color:"warning",
            //     title:'提示',
            //     content:"确认取消操作？",
            //     beSureBtnClick:()=>{
            //         // props.form.EmptyAllFormValue(this.formId);
            //         props.form.cancel(this.formId);
            //         props.editTable.cancelEdit(this.tableId);
            //         props.pushTo('/card', {
            //             status: 'browse',
            //             id: this.id
            //         });
            //         toggleShow(props);
            //     }
            // });
            return;
            if (props.getUrlParam('status') === 'add') {
      
              /*if(props.CacheTools.get("preid")){
                
                props.form.cancel(this.formId);
                props.editTable.cancelEdit(this.tableId);
                props.linkTo('../card/index.html', {
                status: 'browse',
                id: props.CacheTools.get("preid")
                })
                this.toggleShow(props);
              }
              else{
                props.linkTo('../list/index.html', {
                  status: 'browse'
                })
              }*/
            }
            if ((props.getUrlParam('status') === 'edit')) {
              props.form.cancel(this.formId);
            //   props.cardTable.cancelEdit(this.tableId);
              props.pushTo('/card', {
                pagecode:props.config.pageCode,
                status: 'browse',
                id: props.getUrlParam('id')
              })
            }
           toggleShow.call(this,props);
            break
          case 'addline':
            props.cardTable.addRow(this.tableId);
            let allRows = props.cardTable.getAllRows(this.tableId);
            this.selectedIndex = allRows.length - 1;
            break
          case 'insert':
            if(this.selectedIndex > -1){
                props.cardTable.addRow(this.tableId,this.selectedIndex);
            }
            break
          case 'copy':
            allRows = props.cardTable.getAllRows(this.tableId);
            console.log(allRows);
            let rowCount = allRows.length;
            if(rowCount > 0 && this.selectedIndex > -1 && this.selectedIndex < rowCount){
                let selectedRowData = props.cardTable.getRowsByIndexs(this.tableId,this.selectedIndex);
                console.log(selectedRowData);
                selectedRowData = deepClone(selectedRowData);
                selectedRowData[0].values['pk_setpart_b'].value = null;
                selectedRowData[0].values['pk_setpart_b'].value = null;
                selectedRowData[0].status='2';
                props.cardTable.addRow(this.tableId,rowCount,selectedRowData[0].values,true);
                this.selectedIndex = rowCount;
            }
            break
          case 'refresh':
            // props.linkTo('../card/index.html', {
            //   status:props.getUrlParam('status'),
            //   id:this.id
            // })
            let formId = this.props.form.getFormItemsValue(this.formId, 'pk_setpart').value; 
            console.log(formId);
            if(formId != null && formId.length > 0){
                //应该使用当前页面的id
                //this.getdata(this.id,'refresh');
                this.getdata(formId,'refresh');
            }
            // toast({content:'刷新成功',color:'success'});
            break
          default:
            break
        }
    }
    
    pageInfoClick=(props, pk)=>{
        
        let data = {
            "pk": pk,
            "pageid": props.config.pageCode,
            template:props.config.template
        };
        ajax({
            url: queryCardUrl,
            data: data,
            success: (res) =>{console.log('pageInfoClick');console.log(res);
                if (res.data&&res.data.head) {
                    props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                    props.setUrlParam(pk)//动态修改地址栏中的id的值
                    if (res.data.body) {
                        props.cardTable.setTableData(this.tableId, res.data.body[tableId]);
                    }
                    this.props.setUrlParam(pk);
                    this.id = pk;
                }

            }
        });
    }

    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{
        let meta = props.meta.getMeta(tableId);
        let formItems = meta[props.config.formId].items;
        let form = props.form.getAllFormValue(props.config.formId);
        console.log('form afterEvent');
        console.log(i);console.log(s);console.log(g);console.log('end');
        console.log(form.rows[0].values);
        if(i == null || i.values == null){
            this.props.form.setFormItemsValue(this.props.config.formId,{'cmaterialvid.name':{value:null,display:null}});
            this.props.form.setFormItemsValue(this.props.config.formId,{'pk_unit':{value:i.null,display:null}});
            return;
        }
        // form.rows[0].values['cmaterialoid'] = {display: i.refcode, value: i.refpk};
        // form.rows[0].values['cmaterialvid'] = {display: i.refcode, value: i.refpk};
        // form.rows[0].values['cmaterialvid.name'] = {display: i.refname, value: i.refname};
        // form.rows[0].values['pk_unit'] = {display: i.values.measdoc_name.value, value: i.values.pk_measdoc.value};
        this.props.form.setFormItemsValue(this.props.config.formId,{'cmaterialoid':{value:i.refpk,display:i.refcode}});
        this.props.form.setFormItemsValue(this.props.config.formId,{'cmaterialvid':{value:i.refpk,display:i.refcode}});
        this.props.form.setFormItemsValue(this.props.config.formId,{'cmaterialvid.name':{value:i.refname,display:i.refname}});
        this.props.form.setFormItemsValue(this.props.config.formId,{'pk_unit':{value:i.values.pk_measdoc.value,display:i.values.measdoc_name.value}});
    }

	//通过单据id查询单据信息
	getdata = (pk,flag) =>{
        if(pk == null || pk.length < 1 || pk == 'undefined'){
            return;
        }
		let data = {
            pk:pk,
            template:this.props.config.template
        };
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
                    console.log("headdata");
                    console.log(res.data);
                    console.log(this);
					this.props.form.setAllFormValue({ [this.props.config.formId]: res.data.head[this.props.config.formId] });
					let title_code = res.data.head[this.props.config.formId].rows[0].values[titleCode].display;
					this.setState({title_code});
                    this.props.setUrlParam(pk)
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.props.config.tableId, res.data.body[this.props.config.tableId]);
					let totalcount = this.props.cardTable.getNumberOfRows(this.props.config.tableId);
					let arr = this.props.cardTable.getAllRows(this.props.config.tableId);
					let applycount = 0;
					// arr.map((item)=>{
					// 	applycount += parseInt(item.values.pk_project.value);
					// })
                    this.genTableScale();//重新计算精度
                    this.setState({applycount});
                    this.setState({totalcount});
                }
                if(flag == 'refresh'){
                    toast({title:this.state.json['10141486-000009'],color:"success"});/* 国际化处理： 刷新成功！*/
                }
			}
		});
    }
    
    genTableScale = () =>{
        //重新设置精度
        let cardTableData = this.props.cardTable.getAllData(this.tableId).rows;
        console.log(cardTableData);
        if(cardTableData != null && cardTableData.length > 0){
            console.log(this.unitInfo);
            for(let i = 0; i < cardTableData.length; i++){
                if(this.unitInfo == null || this.unitInfo[cardTableData[i].values.pk_partunit.value] == null){
                    continue;
                }
                let scale = this.unitInfo[cardTableData[i].values.pk_partunit.value]['bitnumber'];
                console.log(this.unitInfo[cardTableData[i].values.pk_partunit.value]);
                if(scale != null){
                    // cardTable.setValByKeyAndIndex(moduleId,index, 'childsnum', { scale: scale });//父含子数
                    // cardTable.setValByKeyAndIndex(moduleId,index, 'partpercent', { scale:scale });//单件单价权树
                    this.props.cardTable.setValByKeyAndRowId(this.tableId,cardTableData[i].rowid, 'childsnum', { scale: scale });//父含子数
                    this.props.cardTable.setValByKeyAndRowId(this.tableId,cardTableData[i].rowid, 'partpercent', { scale:scale });//单件单价权树
                }
            }
        }
        this.setState(this.state);
    }

    //校验公式
    execValidateFormular = (callback) =>{
        let CardData = this.props.createMasterChildData(this.props.config.pageCode, this.props.config.formId, this.props.config.tableId);
        console.log(CardData);
        /*let validateData = {
            pageid: this.props.config.pageCode,
            model: {
                areacode: 'head',
                areaType: "form",
                pageinfo: null,
                rows: formData.rows
            }
        };*/
        let tableTypeObj = {[this.props.config.formId]:'form',[this.props.config.tableId]:'cardTable'};
        let billType = 'card';
        this.props.validateToSave( CardData , ()=>{
            console.log('校验公式执行返回成功');
            setTimeout(()=>{callback();},100);
        } , tableTypeObj , billType );
    }
	//保存单据
	saveClick = () =>{
		this.props.cardTable.filterEmptyRows(tableId,['bpriceflag']);
		let CardData = this.props.createMasterChildData(this.props.config.pageCode, this.props.config.formId, this.props.config.tableId);
		console.log(CardData)
		// CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
        let url = saveUrl;//新增保存
		if (this.props.getUrlParam('status') === 'edit') {
            url = updateUrl;//修改保存
            CardData.head[this.props.config.formId].rows[0].status = '1';//修改
		}else if(this.props.getUrlParam('status') === 'add'){
            url = saveUrl;//新增保存
            CardData.head[this.props.config.formId].rows[0].status = '2';//修改
        }
        if(this.props.config.nodetype === 'org' && this.props.getUrlParam('status') === 'add'){
            let curOrg = this.state.curOrg;
            if(curOrg == null || curOrg.length < 1){
                toast({content:this.state.json['10141486-000021'],color:"warning"});/* 国际化处理： 请设置业务单元*/
                return;
            }
            CardData.head[this.props.config.formId].rows[0].values['pk_org'] = {value:curOrg};
        }
        CardData.template = this.props.config.template;

        //校验
        let l_tables = CardData.body['ic_setpart_b'].rows;
        let hasChild = false;
        if(l_tables != null){
            let l_code = CardData.head['ic_setpart'].rows[0].values['cmaterialvid'].value;
            console.log(l_code);
            for(let i = 0; i < l_tables.length; i++){
                if(l_tables[i].status != '3'){
                    hasChild = true;
                }
                if(l_tables[i].values['cmaterialvid'].value === l_code){
                    toast({content:this.state.json['10141486-000022'],color:"warning"});/* 国际化处理： 表头和表体的成套件不能相同！*/
                    console.log(this.state.json['10141486-000022']);/* 国际化处理： 表头和表体的成套件不能相同！*/
                    return;
                }
            }
        }
        console.log(l_tables);
        if(hasChild == false){
            toast({content:this.state.json['10141486-000023'],color:"warning"});/* 国际化处理： 表体不能为空！*/
            return;
        }
        this.props.cardTable.closeModel(this.props.config.tableId,()=>{});//关闭侧栏
		ajax({
			url: url,
			data: CardData,
			success: (res) => {
                // this.props.cardTable.openModel(props.config.tableId,()=>{});//关闭侧栏
				let pk_value = null;
				if (res.success) {
					if (res.data) {
                        if(this.props.config.nodetype === 'group'){
                            res.data.head[this.props.config.formId].rows[0].values["pk_org"].display = "";
                        }
						if (res.data.head && res.data.head[this.props.config.formId]) {
							this.props.form.setAllFormValue({ [this.props.config.formId]: res.data.head[this.props.config.formId] });
							pk_value = res.data.head[this.props.config.formId].rows[0].values[pk_item].value
                        }
						if (res.data.body && res.data.body[this.props.config.tableId]) {
							this.props.cardTable.setTableData(this.props.config.tableId, res.data.body[this.props.config.tableId])
                        }
                        if(this.props.getUrlParam('status') === 'add'){
                            addCache(pk_value,res.data,this.props.config.formId,dataSource);
                            this.props.setUrlParam(pk_value);
                        }else if(this.props.getUrlParam('status') === 'edit'){
                            updateCache(pk_item,pk_value,res.data,this.props.config.formId,dataSource);
                        }
                    }
                    this.id = pk_value;
					// toast({content : this.state.json['10141486-000024'],color : 'success'});/* 国际化处理： 保存成功*/
					this.props.pushTo('card', {
                        pagecode:this.props.config.pageCode,
						status: 'browse',
						id: pk_value
					})
                    toggleShow.call(this,this.props);
                    this.genTableScale();
                    this.setState(this.state);
                    this.props.button.setDisabled({
                        delete: false,
                        print: false,
                        output: false,
                        edit: false
                    });
                    toast({content : this.state.json['10141486-000024'],color : 'success'});/* 国际化处理： 保存成功*/
				}
			}
		})
	  }
    //主组织参照校验
    corpRefValidate = () =>{
        let pk_corp = this.props.config.defaultOrg.pk_org;
        if(pk_corp == null && pk_corp.length < 1){
            return;
        }
        ajax({
            url: corpRefValidateUrl,
            data:{
                pk_corp: pk_corp
            },
            success: (res) =>{console.log('loadUnitInfo');console.log(res);
                if(res.data == "1"){
                    this.state.configs['CorpDefaultTreeRef']={value:{refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name}};
                    this.state.curOrgObj = {refpk: this.props.config.defaultOrg.pk_org,refname: this.props.config.defaultOrg.org_Name};
                    this.state.curOrg = this.props.config.defaultOrg.pk_org;
                    this.setState(this.state);
                    this.props.form.setFormItemsDisabled(this.formId,{'cmaterialvid':false});
                }
            }
        });
    }
	//删除单据
	delConfirm = (props) => {
        if(this.props.getUrlParam('id') == null){
            return;
        }
        // let lastId = getCurrentLastId(dataSource);
        // console.log(lastId);
        // console.log(getNextId(pk_item,dataSource));
        // console.log(getDefData(pk_item,dataSource));
        // return;
		ajax({
			url: deleteUrl,
			data: {deleteinfo:[{
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			}]},
			success: (res) => {
				if(res){
                    let nexId = getNextId(this.id,dataSource);
                    deleteCacheById(pk_item,this.id,dataSource);

                    console.log("nexId="+nexId);
                    if(nexId != null && nexId.length > 0){
                        this.props.pushTo('/card',{
                            pagecode:props.config.pageCode,
                            status: 'browse',
                            id: nexId
                        });
                        //zhaochxs 删除后修改全局id。
                        this.id=nexId;
                        this.getdata(nexId);
                    }else{
                        //this.props.pushTo('/list');
                        this.id=null;
                        this.props.button.setDisabled({
                            delete: true,
                            print: true,
                            output: true,
                            edit: true
                        });
                        this.props.form.EmptyAllFormValue(this.formId);
                        this.props.cardTable.setTableData(this.props.config.tableId,{rows:[]});
                    }
                    toast({content : this.state.json['10141486-000008'],color : 'success'});/* 国际化处理： 删除成功*/
				}
				
			}
		});
	};

	modelSave = (props)=>{
		props.cardTable.closeModel(this.tableId);
		this.saveClick();
    }
    
    //加载计量单位信息
    loadUnitInfo = ()=>{
        ajax({
            url: unitUrl,
            success: (res) =>{console.log('loadUnitInfo');console.log(res);
                this.unitInfo = res.data;
                this.genTableScale();
            }
        });
    }

    //子表编辑后事件
    cardTableAfterEventFn = (props,moduleId,key,value,changedrows,index,record,type,method)=>{
        console.log('cardTableAfterEventFn');
        console.log(moduleId);console.log(key);console.log(value),console.log(index);console.log(method);console.log('end');
        console.log(props);

        let meta = props.meta.getMeta(tableId);
        // let tableItems = meta[tableId].items;console.log(tableItems);
        // for(let i = 0; i < tableItems.length; i++){
        //     if(tableItems[i].attrcode === 'paramvalue'){console.log('修改参照paramvalue');
        //         tableItems[i].itemtype = 'select';
        //         tableItems[i].options = [
        //             {
        //             "display": "未启用",
        //             "value": "1"
        //             }
        //         ];
        //         props.meta.setMeta(meta);
        //     };
        // }

        if(key === 'cmaterialvid'){console.log(this.state.json['10141486-000025']);/* 国际化处理： 子表配件编码编辑后*/
            let meta = props.meta;
            console.log('paramcode chagne');
            console.log(meta);
            let cardTable = props.cardTable;console.log(cardTable);
            // value.values.initname={value:'dddwww'};
            if(value != null && value.values != null){
                cardTable.setValByKeyAndIndex(moduleId,index, 'cmaterialvid', { value: value.refpk,display:value.refcode });//配件编码
                cardTable.setValByKeyAndIndex(moduleId,index, 'cmaterialoid', { value: value.refpk,display:value.refcode });//配件编码
                cardTable.setValByKeyAndIndex(moduleId,index, 'cmaterialvid.name', { value: value.refname,display:value.refname });//名称
                cardTable.setValByKeyAndIndex(moduleId,index, 'pk_partunit', { value: value.values.pk_measdoc.value,display:value.values.measdoc_name.value });//单位对对对

                if(this.unitInfo != null && this.unitInfo[value.values.pk_measdoc.value] != null){
                    let scale = this.unitInfo[value.values.pk_measdoc.value]['bitnumber'];
                    console.log(this.unitInfo[value.values.pk_measdoc.value]);
                    if(scale != null){
                        cardTable.setValByKeyAndIndex(moduleId,index, 'childsnum', { scale: scale });//父含子数
                        cardTable.setValByKeyAndIndex(moduleId,index, 'partpercent', { scale:scale });//单件单价权树
                    }
                }
            }else{
                cardTable.setValByKeyAndIndex(moduleId,index, 'cmaterialvid', { value: null,display:null });//配件编码
                cardTable.setValByKeyAndIndex(moduleId,index, 'cmaterialoid', { value: null,display:null });//配件编码
                cardTable.setValByKeyAndIndex(moduleId,index, 'cmaterialvid.name', { value: null,display:null });//名称
                cardTable.setValByKeyAndIndex(moduleId,index, 'pk_partunit', { value: value.nullvalue,display:null });//单位对对对
            }
        }
	}
    getButtonNames = (codeId) => {
		if (codeId === 'edit'||codeId === 'add'||codeId === 'save'){
			return 'main-button'
		}else {
			return 'secondary - button'
		}
	};

	//获取列表肩部信息
	getTableHead = () => {
		let {button} = this.props;
        let { createButton,createButtonApp } = button;
		let buttons  = this.props.button.getButtons();
		let status = this.props.getUrlParam("status");
        return (
			<div className="shoulder-definition-area">
				<div className='definition-search'>
					{/* {status == 'browse' ?<div><span className="definition-search-title">详细信息 | 总计：</span>
						<span className = 'count'>{this.state.totalcount}</span><span>条</span>
					{ <span>		申请数量 ：</span>
						<span className='count'>{this.state.applycount}</span><span>个</span> }
                        </div>:<span className="definition-search-title"></span>} */}
				</div>
				<div className="definition-icons" style={{padding:0,verticalAlign:'middle'}}>
					{/* {buttons.map( (v) =>{
							if(v.btncode === 'addline'){
								return (createButton(v.btncode, {
									name: v.btnname,
									onButtonClick: this.buttonClick.bind(this),
								}))
							}
                        })}  */}
                        {createButtonApp({
                                        area: 'card_body',//按钮注册中的按钮区域
                                        //buttonLimit: 5, 
                                        onButtonClick: this.buttonClick.bind(this) 
                                        //popContainer: document.querySelector('.header-button-area')
                                    })}
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max','setCol'],
						maxDestAreaId: 'nc-bill-card'
					})}
					{/* {createButton("deleteline", {
						name: '删行',
						onButtonClick: buttonClick.bind(this)
					})} */}
				</div>	
			</div>
        )
    }
    //参照回写方法
    createCfg(id,param){
        // console.log('createCfg');
        // console.log(id);
        // console.log(param);
        console.log(this.state.configs[id]);
        var obj={
            value:this.state.configs[id]?this.state.configs[id].value:[],
            onChange:function (val) {
                console.log('onChange-000-'+val);
                console.log(val);
                if(val == null | val.refpk == null){
                    this.props.form.setFormItemsDisabled(this.formId,{'cmaterialvid':true});
                }else{
                    this.props.form.setFormItemsDisabled(this.formId,{'cmaterialvid':false});
                }
                this.state.curOrg = val.refpk;
                // this.refreshAction(this.props);
                // this.loadTree();//重新加载树
                var temp= Object.assign(this.state.configs[id],{value:val});
                this.setState(Object.assign (this.state.configs,temp));
            }.bind(this)
        }
        this.state.configs[id]=obj;
        var result_param= Object.assign(obj, param)
        return result_param;
    }
    createCardTitle( params = {}) {
	let { BillHeadInfo } = this.props;
	const { createBillHeadInfo } = BillHeadInfo;
	return createBillHeadInfo({
		...params,
		title: this.props.getSearchParam('n')
	});
}
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const {createCardPagination} = cardPagination;
        let buttons = this.props.button.getButtons();
        let { createButtonApp } = button;
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createForm } = form;
        let { createCardTable } = cardTable;
      
		let { createButton } = button;
		let { createModal } = modal;
        let status = this.props.getUrlParam('status');
        
        let createOrgRender = () => {
            let status = this.props.getUrlParam('status');
            return  status === 'add' && this.props.config.nodetype && this.props.config.nodetype === 'org' ? (
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
                                //isShowDisabledData: true,
                                TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
                            };
                        }}))}
                </div>
            ) : '';
        };

		return (
			<div  id='nc-bill-card'>
					<div className="nc-bill-card">
						{/* <NCAffix> */}
                        <div className="nc-bill-top-area">
							<div className='nc-bill-header-area'>
								<div className='header-title-search-area'>
								    <span>
                                        {this.createCardTitle({
                                            backBtnClick: this.buttonClick.bind(this,this.props,'back')
                                        })}
								    </span >
                                </div>
                                {createOrgRender()}
								
								<div className="header-button-area">
                                    {createButtonApp({
										area: 'header-button-area',//按钮注册中的按钮区域
										// buttonLimit: 1, 
										onButtonClick: this.buttonClick.bind(this) 
										//popContainer: document.querySelector('.header-button-area')
									})}
									{/*分页 */}
								    {
                                        this.props.form.getFormStatus(this.formId) !='add' 
                                            && this.props.form.getFormStatus(this.formId) !='edit'
                                            && this.props.form.getFormItemsValue(this.formId,'pk_setpart') != null
                                            && this.props.form.getFormItemsValue(this.formId,'pk_setpart').value != null
                                            && this.props.form.getFormItemsValue(this.formId,'pk_setpart').value.length > 0?
                                            <div className='header-button-cardPagination'>
									            {createCardPagination({	
                                                    handlePageInfoChange: this.pageInfoClick.bind(this),
                                                    //urlPkname:'id',
                                                    dataSource: dataSource,})
                                                }
                                        </div>:''
                                    }
								</div>
                            </div>
						{/* </NCAffix> */}
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								onAfterEvent: this.afterEvent.bind(this)
							})}
						</div>
                        </div>
                            <div className="nc-bill-bottom-area">
                            <div className="nc-bill-table-area">
                            {/* <div className='nc-bill-header-area'>
                                <div className="header-button-area">
                                    {createButtonApp({
                                        area: 'card_body',//按钮注册中的按钮区域
                                        //buttonLimit: 5, 
                                        onButtonClick: this.buttonClick.bind(this) 
                                        //popContainer: document.querySelector('.header-button-area')
                                    })}
                                </div>
                            </div> */}
							{/* {this.getTableHead()} */}
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this),
								modelSave: this.saveClick.bind(this),
                                showIndex:true,
                                onAfterEvent: this.cardTableAfterEventFn.bind(this), 
                                onRowClick: (props,moduleId,record,index,status)=>{
                                    console.log(moduleId);
                                    console.log(record);
                                    console.log(index);
                                    console.log(status);
                                    this.selectedRowid = record.rowid;
                                    this.selectedIndex = index;
                                },
                                dataSource: dataSource
							})}
						</div>
                        </div>
						{createModal('delete', {
							title: this.state.json['10141486-000006'],/* 国际化处理： 注意*/
							content: this.state.json['10141486-000007'],/* 国际化处理： 确认删除？*/
							beSureBtnClick: this.delConfirm.bind(this)
                        })}
                        {createModal('confirmModal', {
                                title: this.state.json['10141486-000006'],/* 国际化处理： 注意*/
                                content: this.state.json['10141486-000027']/* 国际化处理： 确认执行？*/
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

// Card = createPage({
// 	initTemplate: initTemplate
// })(Card);


// ajav({

// 	success: function(temp){
// 		var temp0 = temp;
// 		Card = createPage({
// 			initTemplate: function(){
// 				return temp0;
// 			}
// 		})(Card);
// 	}
// })
export default Card
//ReactDOM.render(<Card />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65