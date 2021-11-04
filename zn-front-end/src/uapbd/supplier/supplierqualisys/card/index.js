//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast,getMultiLang,createPageIcon } from 'nc-lightapp-front';
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;
// import './index.less';

//业务单元参照
import CorpDefaultTreeRef from  '../../../../uapbd/refer/org/CorpDefaultTreeRef'

const formId = 'supqualidoc';                      //表头id
const tableId = 'supqualilevel';            //子表id
const pageId = '10140SAQSG_qualidoc_listcard';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='0001Z010000000001NMZ';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/supplierqualisys/query.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/supplierqualisys/save.do';             //新增保存
const updateUrl = '/nccloud/uapbd/supplierqualisys/save.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/supplierqualisys/del.do';         //删除
const pk_item = 'pk_suppliergrade';               //单据主键--用于卡片查询刷新
const titleCode = 'name';            //单据编码--用于卡片表头显示

//切换页面状态
function toggleShow(props){console.log('toggleShow');
    let status = props.getUrlParam('status');
    let flag = status === 'browse' ? false : true;
    //按钮的显示状态
    if(status == 'edit' || status == 'add'){
        props.button.setButtonVisible(['edit','add','back','delete','refresh'],false);
        props.button.setButtonVisible(['save','cancel','addline'],true);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
    }else{
        props.button.setButtonVisible(['save','addline','cancel'],false);
        props.button.setButtonVisible(['add','edit','delete','back','refresh'],true);
        props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
    }
    props.form.setFormStatus(formId, status);
    props.cardTable.setStatus(tableId, status);
}

class Card extends Component {
	constructor(props) {
		super(props);
		this.formId = formId;
		this.searchId = searchId;
        this.tableId = tableId;
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
        //this.toggleShow(this.props);
        // toggleShow(this.props);
        console.log('componentDidMount');
		let status = this.props.getUrlParam('status');
		if(status != "add"){
			let	pk = this.props.getUrlParam('id');
			if(pk && pk != 'undefined'){
				this.getdata(pk);
			}
		}
		else{
			this.setDefaultValue();
		}
		
    }

    componentWillMount(){
        let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
            console.log(json);
            this.setState({json})       // 保存json和inlt到页面state中并刷新页面
        }
        getMultiLang({moduleId: '10140SAQSG',domainName: 'uapbd',callback});
    }
    
    initTemplate = (props)=>{
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
                        this.modifierMeta(props, meta)
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
                            props.button.setButtonVisible(['edit','add','back','delete','refresh'],false);
                            props.button.setButtonVisible(['save','cancel','addline'],true);
                            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                        }else{
                            props.button.setButtonVisible(['save','cancel','addline'],false);
                            props.button.setButtonVisible(['add','edit','delete','back','refresh'],true);
                            props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
                        }
                        props.form.setFormStatus(props.config.formId, status);
                        props.cardTable.setStatus(props.config.tableId, status);
                    }
                }   
            }
        )
    }
    
    modifierMeta = (props, meta) => {
        let status = props.getUrlParam('status');
        meta[props.config.formId].status = status;
        meta[props.config.tableId].status = status;
        console.log('modifierMeta23232');
        // 修改参照refcode
        let formItems = meta[props.config.formId].items;console.log(formItems);
        for(let i = 0; i < formItems.length; i++){
            if(formItems[i].attrcode === 'pk_qualitype'){//资质分类
                // formItems[i].refcode = '../../../../uapbd/refer/org/AssignedOrgTreeRef/index';
                formItems[i].refcode = '../../../../uapbd/refer/pub/SupplierQualiTypeTreeRef/index.js';//物料多版本
            }
        }
    
        let tableItems = meta[props.config.tableId].items;console.log(tableItems);
        for(let i = 0; i < tableItems.length; i++){
            if(tableItems[i].attrcode === 'cmaterialvid'){console.log(this.state.json['10140SAQSG-000000']);/* 国际化处理： 配件编码*/
                tableItems[i].refcode = '../../../../uapbd/refer/pub/MaterialMultiVersionGridRef/index.js';
                //参数组织过滤
                // tableItems[i].queryCondition = () => {
                //     let pk_org = props.form.getFormItemsValue(formId,'pk_org').value;
                //     console.log('modifierMeta pkorg = '+pk_org);
                //     return {pk_org : pk_org};
                // };
            }
        }
    
        let porCol = {
            attrcode: 'opr',
            label: this.state.json['10140SAQSG-000001'],/* 国际化处理： 操作*/
            visible: true,
            itemtype: 'customer',
            className:'table-opr',
            width:200,
            fixed:'right',
            render: (text, record, index) => {
                let status = props.cardTable.getStatus(props.config.tableId);
                return status === 'browse' ? (
                    // <span
                    // 	onClick={() => {
                    //         props.cardTable.toggleRowView(config.tableId, record)
            
                    //     }}
                    //     > 展开
                     // </span>
                     <span></span>
                ):(<div className="currency-opr-col">
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.openModel(props.config.tableId, 'edit', record, index);
                                e.stopPropagation();
                            }}
                        >{this.state.json['10140SAQSG-000044']/* 国际化处理： 更多*/}</span>
                        &nbsp;&nbsp;
                        <span
                            className="currency-opr-del"
                            onClick={(e) => {
                                props.cardTable.delRowsByIndex(props.config.tableId, index);
                                e.stopPropagation();
                            }}
                        >{this.state.json['10140SAQSG-000038']/* 国际化处理： 删除*/}</span>
                    </div>
                );
            }
        };
        meta[props.config.tableId].items.push(porCol);
    
        return meta;
    }

	setDefaultValue = () =>{
		this.props.form.setFormItemsValue(this.formId,{'enablestate':{value:'2',display:this.state.json['10140SAQSG-000067']}});/* 国际化处理： 自由态*/
	}

    buttonClick =(props, id)=>{console.log('buttonClick');console.log(props);console.log(id);

        let _this = this;
        switch (id) {
          case 'add':
            props.form.EmptyAllFormValue(this.formId)
            props.cardTable.setTableData(this.tableId, { rows: [] })
            props.pushTo('/card', {
                pagecode:props.config.pageCodeList,
                status: 'add'
            })
            toggleShow(props);
            break
          case 'edit':
            props.pushTo('/card', {
                pagecode:props.config.pageCode,
                status: 'edit',
                id: props.getUrlParam('id')
            })
            toggleShow(props);
            break;
          case 'delete':
            this.props.modal.show('delete');
            break
          case 'back':
            props.pushTo('/list', {
                pagecode:props.config.pageCodeList,
            })
            break
          case 'save':
            this.saveClick();
            break
          case 'cancel':
            if (props.getUrlParam('status') === 'add') {
      
              if(props.CacheTools.get("preid")){
                
                props.form.cancel(this.formId);
                props.cardTable.resetTableData(this.tableId);
                props.cardTable.setStatus(this.tableId, 'browse');
                props.pushTo('/card', {
                    pagecode:props.config.pageCode,
                    status: 'browse',
                    id: props.CacheTools.get("preid")
                })
                this.toggleShow(props);
              }
              else{
                props.pushTo('/list', {
                    pagecode:props.config.pageCodeList,
                    status: 'browse'
                })
              }
            }
            if ((props.getUrlParam('status') === 'edit')) {
              props.form.cancel(this.formId);
              props.cardTable.resetTableData(this.tableId);
              props.cardTable.setStatus(this.tableId, 'browse');
              props.pushTo('/card', {
                pagecode:props.config.pageCode,
                status: 'browse',
                id: props.getUrlParam('id')
              })
            }
            toggleShow(props);
            break
          case 'addline':
            props.cardTable.addRow(this.tableId);
            break
          case 'refresh':
            props.pushTo('/card', {
                pagecode:props.config.pageCode,
                status:props.getUrlParam('status'),
                id:props.getUrlParam('id')
            })
            this.getdata(props.getUrlParam('id'));
            break
          default:
            break
        }
    }
    
    pageInfoClick=(props, pk)=>{
        
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

    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{
        let meta = props.meta.getMeta(tableId);
        let formItems = meta[props.config.formId].items;
        let form = props.form.getAllFormValue(props.config.formId);
        console.log('form afterEvent');
        console.log(i);console.log(s);console.log(g);console.log('end');
        form.rows[0].values['cmaterialoid'] = {display: i.refcode, value: i.refpk};
        form.rows[0].values['cmaterialvid'] = {display: i.refcode, value: i.refpk};
        form.rows[0].values['cmaterialvid.name'] = {display: i.refname, value: i.refname};
        form.rows[0].values['pk_unit'] = {display: i.values.measdoc_name.value, value: i.values.pk_measdoc.value};
        
    }

	//通过单据id查询单据信息
	getdata = (pk) =>{
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
					let title_code = res.data.head[this.props.config.formId].rows[0].values[titleCode].value;
					this.setState({title_code});
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.props.config.tableId, res.data.body[this.props.config.tableId]);
					let totalcount = this.props.cardTable.getNumberOfRows(this.props.config.tableId);
					let arr = this.props.cardTable.getAllRows(this.props.config.tableId);
					let applycount = 0;
					// arr.map((item)=>{
					// 	applycount += parseInt(item.values.pk_project.value);
					// })
					this.setState({applycount});
					this.setState({totalcount});
                }
                console.log('1452');
			}
		});
	}

	//保存单据
	saveClick = () =>{
		this.props.editTable.filterEmptyRows(tableId);
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
                toast({content:this.state.json['10140SAQSG-000068'],color:"warning"});/* 国际化处理： 请设置业务单元*/
                return;
            }
            CardData.head[this.props.config.formId].rows[0].values['pk_org'] = {value:curOrg};
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
                    toast({title : '保存成功',color : 'success'});/* 国际化处理： 保存成功,保存成功*/
                    let title_code = res.data.head[this.props.config.formId].rows[0].values[titleCode].value;
					this.setState({title_code});
					this.props.pushTo('./card', {
                        pagecode:props.config.pageCode,
						status: 'browse',
						id: pk_value
					})
					toggleShow(this.props);
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
					this.props.pushTo('./list',{
                        pagecode:props.config.pageCodeList,
                    });
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

        if(key === 'cmaterialvid'){console.log(this.state.json['10140SAQSG-000069']);/* 国际化处理： 子表配件编码编辑后*/
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
		let { createButton } = button;
		let buttons  = this.props.button.getButtons();
		let status = this.props.getUrlParam("status");
        return (
			<div className="shoulder-definition-area">
				<div className='definition-search'>
					{status == 'browse' ?<div><span className="definition-search-title">{this.state.json['10140SAQSG-000045'] | this.state.json['10140SAQSG-000046']/* 国际化处理： 详细信息,总计*/}：</span>
						<span className = 'count'>{this.state.totalcount}</span><span>{this.state.json['10140SAQSG-000047']/* 国际化处理： 条*/}</span>
					{/* <span>		申请数量 ：</span>
						<span className='count'>{this.state.applycount}</span><span>this.state.json['10140SAQSG-000049']</span>/* 国际化处理： 个*/}
                        </div>:<span className="definition-search-title"></span>}
				</div>
				<div className="definition-icons">
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
						<NCAffix>
							<div className='nc-bill-header-area'>
								<div className='header-title-search-area'>
                                <NCBackBtn className='title-search-detail' style={{marginRight:'6px',marginTop: '8px'}}
                                           onClick={ this.buttonClick.bind(this,this.props,'back') }></NCBackBtn>
                                    {createPageIcon()}
									<h2 className='title-search-detail'>{this.state.json[this.props.config.nodeName]}{/*status=='browse'?`：${this.state.title_code}`:''*/}</h2>
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
									{/* {createCardPagination({
										handlePageInfoChange: this.pageInfoClick.bind(this)
									})} */}
								</div>
			                </div>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								onAfterEvent: this.afterEvent.bind(this)
							})}
						</div>
                        <div style={{height:'8px'}}></div>
						<div className="nc-bill-table-area">
							{/* {this.getTableHead()} */}
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this),
								modelSave: this.modelSave.bind(this),
                                showIndex:true,
                                onAfterEvent: this.cardTableAfterEventFn.bind(this), 
							})}
						</div>
						{createModal('delete', {
							title: this.state.json['10140SAQSG-000042'],/* 国际化处理： 注意*/
							content: this.state.json['10140SAQSG-000022'],/* 国际化处理： 确认删除？*/
							beSureBtnClick: this.delConfirm.bind(this)
						})}
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