//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,print,high,promptBox,getBusinessInfo,getMultiLang,cardCache,createPageIcon } from 'nc-lightapp-front';
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;
const {PrintOutput} = high
const {setDefData, getDefData,addCache,updateCache,deleteCacheById,getNextId,getCurrentLastId } = cardCache;
import './index.less';

//业务单元参照
import CorpDefaultTreeRef from  '../../../../uapbd/refer/org/CorpDefaultTreeRef'

const dataSource = "supligergrade-list";
const key_list = "key_list";
const key_search = "key_search";
const formId = 'supplier_grade_sys';                      //表头id
const tableId = 'supgrade';            //子表id
const pageId = '10140SGRADEG_bsgrade_card';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='0001Z010000000001L2L';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/suppliergradesys/pagequery.do';   //卡片查询url
const enablestateUrl = '/nccloud/uapbd/suppliergradesys/disenable.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/suppliergradesys/save.do';             //新增保存
const updateUrl = '/nccloud/uapbd/suppliergradesys/save.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/suppliergradesys/del.do';         //删除
const codeRuleUrl = '/nccloud/uapbd/suppliergradesys/coderule.do';         //删除'
const pk_item = 'pk_suppliergrade';               //单据主键--用于卡片查询刷新
const titleCode = 'name';            //单据编码--用于卡片表头显示
const printUrl = '/nccloud/uapbd/suppliergradesys/print.do';  //分页查询url

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.searchId = searchId;
        this.tableId = tableId;
        this.pk = null;
		this.state = {
			pk_org : '',
			title_code : '',
			totalcount : 0,
            applycount : 0,
            configs: {},
            curOrg: null,
            curOrgObj: null,
            json: {}
        };
        this.pk_groupObj = null;
        this.codeRule = null;
        this.btnmethod = '';
        this.initTemplate(props);
	}
	componentDidMount() {
        //this.toggleShow(this.props);
        // toggleShow(this.props);
        console.log('componentDidMount');
        let status = this.props.getUrlParam('status');
        console.log(status);
        if(status == 'add' || status == 'edit'){
            setTimeout(()=>{this.props.form.setFormItemsDisabled(this.formId,{'enablestate': true});},100);
        }
        let	pk = this.props.getUrlParam('id');
        if(pk != null && pk.length > 0){
            this.pk = pk;
        }
		if(status != "add"){
			if(pk && pk != 'undefined'){
				this.getdata(pk);
			}
		}
		else{
            this.setDefaultValue();
            this.setFormGroupValue();
            this.getCodeRule();
            setTimeout(()=>{this.props.form.setFormItemsDisabled(this.formId,{'enablestate': true});},100);
            // if(this.props.config.nodetype === 'org'){
            //     this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:this.state.curOrgObj.refpk,display:this.state.curOrgObj.refname}});
            // }else{
            //     this.setFormGroupValue();
            // }
		}
		
    }
    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10140SGRADEG',domainName: 'uapbd',callback});
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

    //切换页面状态
    toggleShow(props){console.log('toggleShow');
        let status = props.getUrlParam('status');
        let flag = status === 'browse' ? false : true;
        //按钮的显示状态
        if(status == 'add'){
            props.button.setButtonVisible(['edit','add','back','delete','refresh','print','output'],false);
            props.button.setButtonVisible(['save','saveAdd','cancel','addline'],true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else if(status == 'edit'){
            props.button.setButtonVisible(['edit','add','back','delete','refresh','print','output','saveAdd'],false);
            props.button.setButtonVisible(['save','cancel','addline'],true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else{
            props.button.setButtonVisible(['save','saveAdd','addline','cancel'],false);
            props.button.setButtonVisible(['add','edit','delete','back','refresh','print','output'],true);
            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
        let pk_suppliergrade = this.props.form.getFormItemsValue(this.formId, 'pk_suppliergrade');
        console.log(status);console.log(pk_suppliergrade);
        if(status != 'add' && status != 'edit'){
            if(pk_suppliergrade == null || pk_suppliergrade.value == null || pk_suppliergrade.value.length < 1){
                this.props.button.setDisabled({
                    print: true,
                    output: true,
                    delete: true,
                    edit: true,
                });
                props.button.setButtonVisible(['save','saveAdd','addline','cancel','edit','delete','back','refresh','print','output'],false);
                props.button.setButtonVisible(['add'],true);
            }else{
                this.props.button.setDisabled({
                    print: false,
                    output: false,
                    delete: false,
                    edit: false,
                });
            }
        }
        props.form.setFormStatus(formId, status);
        props.cardTable.setStatus(tableId, status);
        this.changeEnablestate();
        this.setState(this.state);
    }

    initTemplate =(props)=>{
        props.createUIDom(
            {
                pagecode: props.config.pageCode,//页面id
                // appcode: config.appcode,
                // appid: config.appid//注册按钮的id
            }, 
            (data)=>{
                console.log("data");
                console.log(data);
                if(data){
                    if(data.template){
                        let meta = data.template;
                        meta = this.modifierMeta(props, meta);
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
                        if(status == 'add'){
                            props.button.setButtonVisible(['edit','add','back','delete','refresh','print','output'],false);
                            props.button.setButtonVisible(['save','saveAdd','cancel','addline'],true);
                            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                        }else if(status == 'edit'){
                            props.button.setButtonVisible(['edit','add','back','delete','refresh','print','output','saveAdd'],false);
                            props.button.setButtonVisible(['save','cancel','addline'],true);
                            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                        }else{
                            props.button.setButtonVisible(['save','saveAdd','cancel','addline'],false);
                            props.button.setButtonVisible(['add','edit','delete','back','refresh'],true);
                            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
                        }
                        props.form.setFormStatus(props.config.formId, status);
                        props.cardTable.setStatus(props.config.tableId, status);
                        this.changeEnablestate();
                    }
                }   
            }
        )
    }
    
    modifierMeta = (props, meta) =>{
        let status = props.getUrlParam('status');
        meta[props.config.formId].status = status;
        meta[props.config.tableId].status = status;
        console.log('modifierMeta');
        // 修改参照refcode
        let formItems = meta[props.config.formId].items;console.log(formItems);
        for(let i = 0; i < formItems.length; i++){
            if(formItems[i].attrcode === 'pk_org'){//所属组织
                
                // formItems[i].refcode = '../../../../uapbd/refer/org/AssignedOrgTreeRef/index';
                formItems[i].refcode = '../../../../uapbd/refer/org/BusinessUnitWithGlobleAndCurrGropTreeRef/index';//物料多版本
            }
        }
    
        meta[props.config.tableId].items.push({
            attrcode: 'opr',
            label: this.state.json['10140SGRADEG-000002'],/* 国际化处理： 操作*/
            visible: true,
            itemtype: 'customer',
            className:'table-opr',
            width:200,
            fixed:'right',
            render: (text, record, index) => {
                let status = props.cardTable.getStatus(props.config.tableId);
                console.log(this.state.json);
                return status === 'browse' ? (
                    <span
                        onClick={() => {
                            props.cardTable.toggleRowView(props.config.tableId, record)
            
                        }}
                        > {this.state.json['10140SGRADEG-000036']/* 国际化处理： 展开*/}
                     </span>
                ):(<div className="currency-opr-col">
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.openModel(props.config.tableId, 'edit', record, index);
                                e.stopPropagation();
                            }}
                        >{this.state.json['10140SGRADEG-000037']/* 国际化处理： 更多*/}</span>
                        &nbsp;&nbsp;
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.delRowsByIndex(props.config.tableId, index);
                                e.stopPropagation();
                            }}
                        >{this.state.json['10140SGRADEG-000044']/* 国际化处理： 删除*/}</span>
                    </div>
                );
            }
        });
        // meta[props.config.tableId].items.push(porCol);
    
        return meta;
    }

    //编码规则
    getCodeRule(){
        ajax({
            url:codeRuleUrl,
            success:(res)=>{
                if(res.success){
                    this.codeRule = res.data;
                    try{console.log('getCodeRule');console.log(res);
                        this.codeRule = res.data;
                        // let meta = this.props.meta.getMeta();console.log(meta);
                        this.props.form.setFormItemsValue(this.formId,{code:{value:this.codeRule.newCode}});
                        setTimeout(()=>{this.props.form.setFormItemsDisabled(this.formId,{'code': !this.codeRule.isCodeEdit});},1000);
                        // this.props.form.setFormItemsDisabled(this.formId,{'code':true});
                    }catch(e){
                        console.error(e);
                    }
                }
            }
        });
    }
	setDefaultValue = () =>{
        console.log('setDefaultValue2');
        try{
            this.props.form.setFormItemsValue(this.formId,{'enablestate':{value:true}});
            this.changeEnablestate();
        }catch(e){
            console.error(e);
        }
        console.log('setDefaultValue3');
	}

    buttonClick =(props, id)=>{console.log('buttonClick');console.log(props);console.log(id);

        let _this = this;
        switch (id) {
            case 'print':
                let	pk = this.props.getUrlParam('id');
                if(pk == null || pk == 'undefined'){
                    return;
                }
                let pks = [];
                pks.push(pk);
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
                pk = this.props.getUrlParam('id');
                if(pk == null || pk == 'undefined'){
                    return;
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
                        funcode:'10140SGRADEG',//功能节点编码，即模板编码
                        nodekey:'osgrade',//模板节点标识
                        oids:pks,//单据pk
                        outputType:'output'
                    }
                );
                break;
          case 'add':
            props.form.EmptyAllFormValue(this.formId);
            props.cardTable.setTableData(this.tableId, { rows: [] });
            props.pushTo('/card', {
              status: 'add',
              pagecode:'10140SGRADEG_bsgrade_card',
              id: this.pk
            })
            setTimeout(()=>{
                this.props.form.setFormItemsDisabled(this.formId,{'enablestate': true});
                this.changeEnablestate();
            },100);
            this.toggleShow(props);
            // if(this.props.config.nodetype === 'org'){
            //     this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:this.state.curOrgObj.refpk,display:this.state.curOrgObj.refname}});
            // }else{
            //     this.setFormGroupValue();
            // }
            this.setDefaultValue();
            this.setFormGroupValue();
            this.getCodeRule();
            this.setState(this.state);
            break
          case 'edit':
            props.pushTo('/card', {
              status: 'edit',
              pagecode:'10140SGRADEG_bsgrade_card',
              id: this.pk
            })
            setTimeout(()=>{
                this.props.form.setFormItemsDisabled(this.formId,{'enablestate': true});
                this.changeEnablestate();
            },100);
            this.toggleShow(props);
            this.setState({});
            break;
          case 'delete':
            // this.props.modal.show('delete');
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: this.state.json['10140SGRADEG-000007'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认删除*/
                content: this.state.json['10140SGRADEG-000000'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
                // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                beSureBtnClick: this.delConfirm.bind(this),
                // cancelBtnClick: () => {
                //     console.log('cancelBtnClick');
                //     this.props.modal.close('cancelConfirmModal');
                // }
            })
            break
          case 'back':
            props.pushTo('/list', {
                pagecode:'10141486_list',
            })
            break
          case 'save':
            // this.saveClick();
            this.execValidateFormular(()=>{
                // let pk_suppliergrade = this.props.form.getFormItemsValue(this.formId, 'pk_suppliergrade');
                // if(pk_suppliergrade == null || pk_suppliergrade.value == null || pk_suppliergrade.value.length < 1){
                //     dsfsfsd
                // }
                this.saveClick();
            });
            break;
        case 'saveAdd':
            // this.btnmethod = 'saveAdd';
            // this.saveClick();
            this.execValidateFormular(()=>{this.btnmethod = 'saveAdd';this.saveClick();});
            break;
        case 'cancel':
            promptBox({
                color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: this.state.json['10140SGRADEG-000023'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
                content: this.state.json['10140SGRADEG-000024'],             // 提示内容,非必输/* 国际化处理： 确认取消操作？*/
                // noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                // noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                // beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
                // cancelBtnName: "取消"           // 取消按钮名称, 默认为"取消",非必输
                beSureBtnClick: () => {
                    this.props.form.EmptyAllFormValue(this.formId);
                    this.props.form.cancel(this.formId);
                    this.props.cardTable.setStatus('browse');
                    this.props.cardTable.setTableData(this.tableId, {rows:[]});
                    this.setState(this.state);
                    console.log(this.pk);
                    if(this.pk == null || this.pk.length < 1){
                        this.pk = getCurrentLastId(dataSource);
                        console.log(this.pk);
                    }
                    props.pushTo('/card', {
                        pagecode:'10140SGRADEG_bsgrade_card',
                        status: 'browse',
                        id: this.pk
                    });
                    if(this.pk != null && this.pk.length > 0){
                        this.getdata(this.pk);
                    }
                    this.toggleShow(props);
                    this.setState(this.state);
                    return;
                    if (props.getUrlParam('status') === 'add') {
      
                        if(this.pk != null && this.pk.length > 0 && this.pk != 'undefined'){
                          
                          props.form.cancel(this.formId);
                          props.editTable.cancelEdit(this.tableId);
                          props.pushTo('/card', {
                            pagecode:'10140SGRADEG_bsgrade_card',
                            status: 'browse',
                            id: this.pk
                          });
                          setTimeout(()=>{this.props.form.setFormItemsDisabled(this.formId,{'enablestate': false});},100);
                          this.toggleShow(props);
                        }
                        else{
                          props.pushTo('/list', {
                            pagecode:'10141486_list',
                            status: 'browse'
                          })
                        }
                      }
                      if ((props.getUrlParam('status') === 'edit')) {
                        props.form.cancel(this.formId);
                        props.editTable.cancelEdit(this.tableId);
                        props.pushTo('/card', {
                            pagecode:'10140SGRADEG_bsgrade_card',
                            status: 'browse',
                            id: props.getUrlParam('id')
                        })
                      }
                      this.toggleShow(props);
                      this.setState(this.state);
                }
                // cancelBtnClick: () => {
                //     console.log('cancelBtnClick');
                //     this.props.modal.close('cancelConfirmModal');
                // }
            })
            // props.modal.show('confirmModal',{
            //     color:"warning",
            //     title:'提示',
            //     content:'确认取消操作？',
            //     beSureBtnClick:()=>{
            //         if (props.getUrlParam('status') === 'add') {
      
            //             if(this.pk != null && this.pk.length > 0 && this.pk != 'undefined'){
                          
            //               props.form.cancel(this.formId);
            //               props.editTable.cancelEdit(this.tableId);
            //               props.pushTo('/card', {
            //               status: 'browse',
            //               id: this.pk
            //               })
            //               toggleShow(props);
            //             }
            //             else{
            //               props.pushTo('/list', {
            //                 status: 'browse'
            //               })
            //             }
            //           }
            //           if ((props.getUrlParam('status') === 'edit')) {
            //             props.form.cancel(this.formId);
            //             props.editTable.cancelEdit(this.tableId);
            //             props.pushTo('/card', {
            //               status: 'browse',
            //               id: props.getUrlParam('id')
            //             })
            //           }
            //           toggleShow(props);
            //     }
            // });
            break
          case 'addline':
            props.cardTable.addRow(this.tableId);
            break
          case 'refresh':
            props.pushTo('/card', {
                pagecode:'10140SGRADEG_bsgrade_card',
                status:props.getUrlParam('status'),
                id:props.getUrlParam('id')
            });
            this.getdata(props.getUrlParam('id'),'refresh');
            //toast({content:'刷新成功',color:'success'});
            break
          default:
            break
        }
    }
    
    pageInfoClick=(props, pk)=>{
        this.getdata(pk);return;
        let data = {
            "pk": pk,
            "pageid": props.config.pageCode
        };
        ajax({
            url: queryCardUrl,
            data: data,
            success: (res) =>{console.log('pageInfoClick');console.log(res);
                if (res.data.head) {
                    props.form.setAllFormValue({ [formId]: res.data.head[formId] });
                    props.setUrlParam(pk)//动态修改地址栏中的id的值
                }
                if (res.data.body) {
                    props.editTable.setTableData(tableId, res.data.body[tableId]);
                }
            }
        });
    }

    setFormGroupValue(){
        console.log('setFormGroupValue');console.log(this.pk_groupObj);
        // if(this.pk_groupObj == null){
        //     ajax({
        //         url: '/nccloud/uapbd/supplierapply/queryGroupAction.do',
        //         success: function(res) {
        //             console.log(res);
        //             this.pk_groupObj = {value:res.data.value,display:res.data.display};
        //             this.props.form.setFormItemsValue(this.formId,{'pk_org':res.data});
        //         }.bind(this)
        //     });
        // }else{
        //     this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:this.pk_groupObj.value,display:this.pk_groupObj.display}});
        // }
        let businessInfo = getBusinessInfo();
        console.log(businessInfo);
        if(businessInfo != null){
            this.props.form.setFormItemsValue(this.formId,{'pk_org':{value:businessInfo.groupId,display:businessInfo.groupName}});
        }
    }

    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{
        let meta = props.meta.getMeta(tableId);
        let formItems = meta[props.config.formId].items;
        let form = props.form.getAllFormValue(props.config.formId);
        console.log('form afterEvent');
        console.log(i);console.log(s);console.log(g);console.log(this.pk);console.log('end');
        if(key == 'enablestate'){
            if(this.pk == null || this.pk.length < 1 || this.pk == 'undefined'){
                return;
            }
            let requestParam = {
                enablestate:value.value?'2':'1',
                pk:this.pk
            };
            promptBox({
                color:"warning",
                title:this.state.json['10140SGRADEG-000015'],/* 国际化处理： 提示*/
                content:value.value?this.state.json['10140SGRADEG-000025']:this.state.json['10140SGRADEG-000026'],/* 国际化处理： 您确定要启用所选数据吗？,您确定要停用所选数据吗？*/
                cancelBtnClick:()=>{console.log('cancelBtnClick');
                    props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:!value.value}});
                    this.changeEnablestate();
                },
                closeModalEve:()=>{console.log('closeModalEve');
                    props.form.setFormItemsValue(this.props.config.formId,{'enablestate':{value:!value.value}});
                    this.changeEnablestate();
                },
                beSureBtnClick:()=>{
                    ajax({
                        url:enablestateUrl,
                        data:requestParam,
                        success:(result)=>{
                            toast({title:value.value?this.state.json['10140SGRADEG-000013']:this.state.json['10140SGRADEG-000014'],color:"success"});/* 国际化处理： 启用成功！,停用成功！*/
                        }
                    });
                }
            });
        }
        // form.rows[0].values['cmaterialoid'] = {display: i.refcode, value: i.refpk};
        // form.rows[0].values['cmaterialvid'] = {display: i.refcode, value: i.refpk};
        // form.rows[0].values['cmaterialvid.name'] = {display: i.refname, value: i.refname};
        // form.rows[0].values['pk_unit'] = {display: i.values.measdoc_name.value, value: i.values.pk_measdoc.value};
        
    }

	//通过单据id查询单据信息
	getdata = (pk,flag) =>{
        if(pk == null || pk == undefined || pk.length < 1 || pk == 'undefined'){
            return;
        }
		let data = {pk};
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data && res.data.head) {
                    console.log("headdata");
                    console.log(res.data);
                    console.log(this);
					this.props.form.setAllFormValue({ [this.props.config.formId]: res.data.head[this.props.config.formId] });
                    let title_code = res.data.head[this.props.config.formId].rows[0].values[titleCode].value;
                    this.setState({title_code});
                    
                    let l_enablestate = false;
                    if(res.data.head[this.props.config.formId].rows[0].values.enablestate.value == '2'){//已启用
                        l_enablestate = true;
                    }else{//未启用、已停用
                        l_enablestate = false;
                    }
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:l_enablestate}});
				}
                if (res.data && res.data.body) {console.log("res.data.body");console.log(res);
                    this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
					let arr = this.props.cardTable.getAllRows(this.props.config.tableId);
					let applycount = 0;
					// arr.map((item)=>{
					// 	applycount += parseInt(item.values.pk_project.value);
					// })
					this.setState({applycount});
					this.setState({totalcount});
                }
                if(flag == 'refresh'){
                    toast({title:this.state.json['10140SGRADEG-000012'],color:'success'});/* 国际化处理： 刷新成功！*/
                }
                this.toggleShow(this.props);
			}
		});
	}

    //修改enablestate
    changeEnablestate = ()=>{
        setTimeout(()=>{
            let formStatus = this.props.form.getFormStatus(this.props.config.formId);
            let formData = this.props.form.getAllFormValue(this.props.config.formId);//获得表单信息
            if(formStatus == 'add' || formStatus == 'edit'){//编辑态转数字
                if(formData.rows[0].values.enablestate.value == true || formData.rows[0].values.enablestate.value == '2'){
                    // formData.rows[0].values.enablestate.value = '2';
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:'2'}});
                }else{
                    // formData.rows[0].values.enablestate.value = '3';
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:'3'}});
                }
            }else{//浏览态转boolean
                if(formData.rows[0].values.enablestate.value == '2' || formData.rows[0].values.enablestate.value == true){
                    formData.rows[0].values.enablestate.value = true;
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:true}});
                }else{
                    formData.rows[0].values.enablestate.value = false;
                    this.props.form.setFormItemsValue(this.props.config.formId,{enablestate:{value:false}});
                }
            }
            console.log(formData.rows[0].values.enablestate.value);
        },100);
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
		this.props.cardTable.filterEmptyRows(this.tableId,['supstatus'],'include');
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
                toast({content:this.state.json['10140SGRADEG-000027'],color:"warning"});/* 国际化处理： 请设置业务单元*/
                return;
            }
            CardData.head[this.props.config.formId].rows[0].values['pk_org'] = {value:curOrg};
        }
        //启用状态
        let l_enablestate = false;
        if(CardData.head[this.props.config.formId].rows[0].values['enablestate'].value == true){//已启用
            CardData.head[this.props.config.formId].rows[0].values['enablestate'] = {value:'2'};
        }else{//未启用、已停用
            CardData.head[this.props.config.formId].rows[0].values['enablestate'] = {value:'3'};
        }

        //校验
        let checkMsg = '';
        let formValue = CardData.head[this.props.config.formId].rows[0].values;
        if(formValue['code'].value == null || formValue['code'].value.length < 1){
            checkMsg += this.state.json['10140SGRADEG-000028'];/* 国际化处理： ，[等级体系编码]*/
        }
        if(formValue['name'].value == null || formValue['name'].value.length < 1){
            checkMsg += this.state.json['10140SGRADEG-000029'];/* 国际化处理： ，[等级体系名称]*/
        }
        if(checkMsg.length > 0){
            checkMsg = checkMsg.substr(1);
            toast({content:this.state.json['10140SGRADEG-000030']+checkMsg,color:"warning"});/* 国际化处理： 下列字段值不能为空：<br>*/
            return;
        }
        let bodyRows = CardData.body[this.props.config.tableId].rows;
        if(bodyRows == null || bodyRows.length < 1){
            toast({content:this.state.json['10140SGRADEG-000031']+checkMsg,color:"warning"});/* 国际化处理： 表体必须设置一行且只能设置一行作为默认等级*/
            return;
        }

		ajax({
			url: url,
			data: CardData,
			success: (res) => {
				let pk_value = null
				if (res.success) {
					if (res.data) {
						if (res.data.head && res.data.head[this.props.config.formId]) {
							this.props.form.setAllFormValue({ [this.props.config.formId]: res.data.head[this.props.config.formId] });
							pk_value = res.data.head[this.props.config.formId].rows[0].values[pk_item].value
						}
						if (res.data.body && res.data.body[this.props.config.tableId]) {
							this.props.cardTable.setTableData(this.props.config.tableId, res.data.body[this.props.config.tableId])
						}
                    }
                    this.pk = pk_value;
                    this.state.totalcount = res.data.body[this.props.config.tableId].rows.length;
                    let title_code = res.data.head[this.props.config.formId].rows[0].values[titleCode].value;
					this.setState({title_code});
					this.props.pushTo('/card', {
                        pagecode:'10140SGRADEG_bsgrade_card',
						status: 'browse',
						id: pk_value
                    });
                    setTimeout(()=>{this.props.form.setFormItemsDisabled(this.formId,{'enablestate': false});},100);
                    //this.toggleShow(this.props);
                    if(this.btnmethod == 'saveAdd'){
                        this.buttonClick(this.props,'add');
                        this.btnmethod = '';
                        addCache(pk_value,res.data,this.formId,dataSource);
                    }
                    if(this.btnmethod == 'add'){
                        addCache(pk_value,res.data,this.formId,dataSource);
                    }
                    this.setState(this.state);
                    toast({title : this.state.json['10140SGRADEG-000032'],color : 'success'});/* 国际化处理： 保存成功！*/
                    this.toggleShow(this.props);
				}
			}
		})
	  }

	//删除单据
	delConfirm = (props) => {
		ajax({
			url: deleteUrl,
			data: {deleteinfo:[{
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
			}]},
			success: (res) => {
				if(res){
                    toast({color:"success",title:this.state.json['10140SGRADEG-000001']});/* 国际化处理： 删除成功！*/
                    // setTimeout(()=>{this.props.pushTo('/list');},1000);
                    
                    let nexId = getNextId(pk_item,dataSource);
                    deleteCacheById(pk_item,this.pk,dataSource);

                    console.log("nexId="+nexId);
                    if(nexId != null && nexId.length > 0){
                        this.props.pushTo('/card',{
                            pagecode:'10140SGRADEG_bsgrade_card',
                            status: 'browse',
                            id: nexId
                        });
                        //zhaochxs 删除后修改全局id。
                        this.pk=nexId;
                        this.getdata(nexId);
                    }else{
                        //this.props.pushTo('/list');
                        this.pk=null;
                        this.props.button.setDisabled({
                            delete: true,
                            print: true,
                            output: true,
                            edit: true
                        });
                        this.props.form.EmptyAllFormValue(this.formId);
                        this.props.cardTable.setTableData(this.tableId,{rows:[]});
                        this.toggleShow(this.props);
                        this.setState(this.state);
                    }
				}
				
			}
		});
	};

	modelSave = (props)=>{
		props.cardTable.closeModel(this.tableId);
		this.saveClick();
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

        if(key === 'cmaterialvid'){console.log(this.state.json['10140SGRADEG-000033']);/* 国际化处理： 子表配件编码编辑后*/
            let meta = props.meta;
            console.log('paramcode chagne');
            console.log(meta);
            let cardTable = props.cardTable;console.log(cardTable);
            // value.values.initname={value:'dddwww'};
            cardTable.setColValue(moduleId, 'cmaterialvid', { value: value.refcode,display:value.refcode });//配件编码
            cardTable.setColValue(moduleId, 'cmaterialoid', { value: value.refcode,display:value.refcode });//配件编码
            cardTable.setColValue(moduleId, 'cmaterialvid.name', { value: value.refname,display:value.refname });//名称
            cardTable.setColValue(moduleId, 'pk_partunit', { value: value.values.pk_measdoc.value,display:value.values.measdoc_name.value });//单位对对对
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
		let status = this.props.form.getFormStatus(this.formId);
        return (
			<div className="shoulder-definition-area">
				<div className='definition-search'>
					{(status != 'add' && status != 'edit') ?<div><span className="definition-search-title">{this.state.json['10140SGRADEG-000038']+ ' | '+ this.state.json['10140SGRADEG-000039']/* 国际化处理： 详细信息,总计*/}：{this.state.totalcount}{this.state.json['10140SGRADEG-000042']/* 国际化处理： 条*/}</span>

					{/* <span>		申请数量 ：</span>
						<span className='count'>{this.state.applycount}</span><span>this.state.json['10140SGRADEG-000041']</span> *//* 国际化处理： 个*/}
                        </div>:<span className="definition-search-title"></span>}
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
					{/* {createButton("addline", {
						name: '增行',
						onButtonClick: this.buttonClick.bind(this)
                    })} */}
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
        var obj={
            value:this.state.configs[id]?this.state.configs[id].value:[],
            onChange:function (val) {
                console.log('onChange--'+val);
                console.log(val);
                this.state.curOrg = val.refpk;
                this.state.curOrgObj = val;
                // this.refreshAction(this.props);
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
                                isShowDisabledData: true,
                            };
                        }}))}
                </div>
            ) : '';
        };

		return (
			<div  id='nc-bill-card'>
					<div className="nc-bill-card">
                        <div className="nc-bill-top-area">
						<NCAffix>
							<div className='nc-bill-header-area'>
								<div className='header-title-search-area'>
                                    <NCBackBtn className='title-search-detail' style={{ display:(this.props.form.getFormStatus(this.formId)=='add' || this.props.form.getFormStatus(this.formId)=='edit')?'none':'',marginRight:'6px',marginTop: '8px' }}
                                           onClick={ this.buttonClick.bind(this,this.props,'back') }></NCBackBtn>
                                    {createPageIcon()}
                                    <h2 className='title-search-detail' style={{fontWeight:'bold'}}>
                                        {this.state.json[this.props.config.nodeName]}
                                        {/* {status=='browse'?`：${this.state.title_code}`:''} */}
                                    </h2>
								</div>
                                {createOrgRender()}
								{/*分页 */}
								{/* {status=='browse'?<div className='header-button-cardPagination'>
									{createCardPagination({	handlePageInfoChange: pageInfoClick.bind(this)})}
									</div>:''} */}
								<div className="header-button-area">
                                    {createButtonApp({
										area: 'header-button-area',//按钮注册中的按钮区域
										buttonLimit: 1, 
										onButtonClick: this.buttonClick.bind(this) 
										//popContainer: document.querySelector('.header-button-area')
									})}
                                    { this.props.form.getFormStatus(this.formId) !='add' 
                                        && this.props.form.getFormStatus(this.formId) !='edit'
                                        && this.props.form.getFormItemsValue(this.formId, 'pk_suppliergrade') != null
                                        && this.props.form.getFormItemsValue(this.formId, 'pk_suppliergrade').value != null
                                        && this.props.form.getFormItemsValue(this.formId, 'pk_suppliergrade').value.length > 0?
                                        createCardPagination({ 
                                            handlePageInfoChange: this.pageInfoClick.bind(this),
                                            // urlPkname:'id',
                                            dataSource: dataSource,
									}):''}
								</div>
		                    </div>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
                                onAfterEvent: this.afterEvent.bind(this),
                                cancelPSwitch:true
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
								modelSave: this.modelSave.bind(this),
                                showIndex:true,
                                isAddRow: true,//失去焦点自动增行
                                onAfterEvent: this.cardTableAfterEventFn.bind(this), 
							})}
						</div>
                        </div>
						{createModal('delete', {
							title: this.state.json['10140SGRADEG-000018'],/* 国际化处理： 注意*/
							content: this.state.json['10140SGRADEG-000000'],/* 国际化处理： 确认删除？*/
							beSureBtnClick: this.delConfirm.bind(this)
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