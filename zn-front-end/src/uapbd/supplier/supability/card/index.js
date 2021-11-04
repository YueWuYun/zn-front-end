//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, promptBox, getMultiLang, createPageIcon } from 'nc-lightapp-front';
import { print } from 'nc-lightapp-front';
const {PrintOutput} = high
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
import { ESRCH } from 'constants';

const dataSource = 'upabd.supplier.supability.data'
const formId = 'supplyabilityset';                      //表头id
const tableId = 'pk_mategrade';                  //子表id
const pageId = '10140SACLSO_card';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='0001Z010000000002YR3';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/supability/querySupabilityCard.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/supability/insertSupability.do';          //新增保存
const updateUrl = '/nccloud/uapbd/supability/updateSupability.do';        //修改保存
const deleteUrl = '/nccloud/uapbd/supability/deleteSupability.do';      //删除
const printUrl = '/nccloud/uapbd/supability/printSupability.do'
const pk_item = 'pk_supabilityset';               //单据主键--用于卡片查询刷新
const titleCode = 'pk_supplyname';            //单据编码--用于卡片表头显示
const childValues = 'pk_mategrade'

let finishLoad = 0

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
			pks: [],
			backVisible: true,
			json: {}
		}
	}

	initTemplate =(props)=>{
		props.createUIDom(
			{
				pagecode: pageId//页面id
				// appid: appId,//注册按钮的id
				// appcode: '10140SACLSO'
			}, 
			data => {
				if(data){
					if(data.template){
						let meta = data.template;
						let pk_org = data.context.pk_org
						this.modifierMeta(props, meta, pk_org)
						props.meta.setMeta(meta,() => {
							if(finishLoad > 0) {
								let gradesysValue = props.form.getFormItemsValue(formId,"pk_supabclass.gradesys")
								meta[formId].items.find(item => item.attrcode == 'pk_supgradesys').queryCondition = () => {
									return {
										pk_suppliergrade: gradesysValue && gradesysValue.value ? gradesysValue.value : 'null'
									}
								}
	
								meta[tableId].items.find(item => item.attrcode == 'pk_supgadesys').queryCondition = () => {
									return {
										pk_suppliergrade: gradesysValue && gradesysValue.value ? gradesysValue.value : 'null'
									}
								}
							}
							else {
								finishLoad++
							}

							if(data.context){
								if(data.context.pk_org&&data.context.org_Name){
									this.defaultOrg = data.context.pk_org
									this.defaultOrgName = data.context.org_Name
		
									if(props.getUrlParam('status') == 'add') {
										this.props.form.setFormItemsValue(formId, {pk_org: {value: this.defaultOrg,display: this.defaultOrgName}})
										this.afterEvent(this.props,formId,'pk_org',{value: this.defaultOrg})
									}
								}
							}
						});
						// let status = props.getUrlParam('status');
						// if(status && status == 'add'){
						// 	props.cardTable.addRow(tableId);
						// }
					}
					if(data.button){
						let button = data.button;
						props.button.setButtons(button);
						this.toggleShow();
					}
				}   
			}
		)
	}
	
	modifierMeta(props, meta, pk_org) {
		let status = props.getUrlParam('status');
		meta[formId].status = status;
		meta[tableId].status = status;
	
		meta[formId].items.find(item => item.attrcode == 'pk_org').queryCondition = () => {
			return {
				TreeRefActionExt: "nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder"
			}
		}
	
		//重置一下供应商等级参照、物料分类等级参照的多选模式（原参照写成了可多选，但是此处只需要用到单选）
		meta[formId].items.find(item => item.attrcode == 'pk_supgradesys').isMultiSelectedEnabled = false
		meta[tableId].items.find(item => item.attrcode == 'pk_supgadesys').isMultiSelectedEnabled = false
	
		let porCol = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json['10140SACLSO-000000'],/* 国际化处理： 操作*/
			visible: true,
			className:'table-opr',
			width:200,
			fixed:'right',
			render: (text, record, index) => {
				let status = props.cardTable.getStatus(tableId);
				return status === 'browse' ? (
					<span
						onClick={() => {
							props.cardTable.toggleRowView(tableId, record)
			
						}}
						> {this.state.json['10140SACLSO-000013']/* 国际化处理： 展开*/}
					 </span>
				):(<div className="currency-opr-col">
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.openModel(tableId, 'edit', record, index);
								e.stopPropagation();
							}}
						>{this.state.json['10140SACLSO-000014']/* 国际化处理： 更多*/}</span>
						&nbsp;&nbsp;
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.delRowsByIndex(tableId, index);
								e.stopPropagation();
							}}
						>{this.state.json['10140SACLSO-000015']/* 国际化处理： 删除*/}</span>
					</div>
		);
			}
		};
		meta[tableId].items.push(porCol);
	
		return meta;
	}

	componentDidMount() {
		let callback = (json) => {
            this.setState({json}, () => {
				this.initTemplate(this.props)
			})
        }
		getMultiLang({moduleId: '10140SACLSO', domainName: 'uapbd',callback})

		this.toggleShow();
		this.props.cardPagination.setCardPaginationId({id: this.props.getUrlParam('id'),status: 0})
		let status = this.props.getUrlParam('status');
		if(status != "add"){
			let	pk = this.props.getUrlParam('id');
			if(pk && pk != 'undefined'){
				this.getdata(pk);
			}
		}
		else{
			if(finishLoad > 0) {
				let meta = this.props.meta.getMeta()
				meta[formId].items.find(item => item.attrcode == 'pk_supgradesys').queryCondition = () => {
					return {
						pk_suppliergrade: 'null'
					}
				}
	
				meta[tableId].items.find(item => item.attrcode == 'pk_supgadesys').queryCondition = () => {
					return {
						pk_suppliergrade: 'null'
					}
				}
				this.props.meta.setMeta(meta)
			}
			else {
				finishLoad++
			}

			this.setDefaultValue();
		}

		if(status == 'add' || status == 'edit') {
			//点击修改或者新增进入的时候，返回按钮不可见
			this.setState({
				backVisible: false
			})
		}
		
	}

	componentWillUnmount() {
		//清空一下两个回调函数之间的同步变量
		finishLoad = 0
    }
    
    //切换页面状态
    toggleShow(onlyAdd=false){
        let status = this.props.getUrlParam('status')
        let id = this.props.getUrlParam('id')
        //按钮的显示状态
        let visibleButtons = []
        let unVisibleButtons = []
        if(status == 'browse' && id == 'null') {
            visibleButtons = ['Add']
            unVisibleButtons = ['Edit','back','Delete','Refresh','Print','Output', 'Save','Cancel','AddLine','DelLine']
        }
        else if(status == 'edit' || status == 'add'){
            visibleButtons = ['Save','Cancel','AddLine','DelLine']
            unVisibleButtons = ['Edit','Add','back','Delete','Refresh','Print','Output']
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else{
            visibleButtons = ['Add','Edit','Delete','back','Refresh','Print','Output']
            unVisibleButtons = ['Save','Cancel','AddLine','DelLine']
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
        this.props.button.setButtonVisible(visibleButtons, true)
        this.props.button.setButtonVisible(unVisibleButtons, false)
        this.props.form.setFormStatus(formId, status);
        this.props.cardTable.setStatus(tableId, status == 'edit' || status == 'add' ? 'edit' : 'browse');
        this.updateCardTableBtnStatus()

        //添加浏览器窗口关闭监听事件
        if(status != 'add' && status != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }

        this.setState({
            backVisible: status == 'browse'
        })
    };

	setDefaultValue = () =>{
		this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:this.state.json['10140SACLSO-000001']}});/* 国际化处理： 自由态*/

		//变更来源变为手工调整
		this.props.form.setFormItemsValue(this.formId,{modifiedtype: {value: '2', display: this.state.json['10140SACLSO-000002']}})/* 国际化处理： 手工调整*/
	}

	updateButtonStatus() {
		let formStatus = this.props.form.getFormStatus(this.formId)
		if(formStatus === 'browse') {
			this.props.button.setButtonsVisible({
				Save: false,
				Print: true,
				Output: true
			})
		}
		else {
			this.props.button.setButtonsVisible({
				Save: true,
				Print: false,
				Output: false
			})
		}

	}

    buttonClick =(props, id)=>{

        let _this = this;
        switch (id) {
        case 'Add':
            props.form.EmptyAllFormValue(this.formId)
            props.form.setFormStatus(this.formId, 'add')

			//特殊设置一下返回按钮的可见性
			this.setState({
				backVisible: false
			}, () => {
                props.cardTable.setTableData(this.tableId, { rows: [] })
                props.pushTo('/card', {
					pagecode:pageId,
                    status: 'add'
                })
                this.toggleShow()
                //设置一下默认组织带出
                this.props.form.setFormItemsValue(formId, {pk_org: {value: this.defaultOrg,display: this.defaultOrgName}})
                this.afterEvent(this.props,formId,'pk_org',{value: this.defaultOrg})
            })
            break
        case 'Edit':
            props.pushTo('/card', {
				pagecode:pageId,
              	status: 'edit',
              	id: props.getUrlParam('id')
            })
			this.toggleShow()
			//特殊设置一下返回按钮的可见性
			this.setState({
				backVisible: false
			})
            break;
        case 'Delete':
			//this.props.modal.show('delete');
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140SACLSO-000003'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
				content: this.state.json['10140SACLSO-000004'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140SACLSO-000005'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140SACLSO-000006'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.delConfirm.bind(this)   // 确定按钮点击调用函数,非必输
			})
            break
        case 'Back':
            props.pushTo('/list', {
				pagecode:'10140SACLSO_list',
			})
            break
        case 'Save':
            this.saveClick();
			break
		case 'Print':
			this.output('print')
			break;
		case 'Output':
			let pks = [];
			pks.push(this.props.getUrlParam('id'))
			this.setState({
				pks
			},() => {
				this.refs.printOutput.open()
			})
			break;
		case 'Cancel':
			//this.props.modal.show('cancel')
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['10140SACLSO-000007'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
				content: this.state.json['10140SACLSO-000008'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				beSureBtnName: this.state.json['10140SACLSO-000005'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
				cancelBtnName: this.state.json['10140SACLSO-000006'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
				beSureBtnClick: this.onCancelSureEvent.bind(this)   // 确定按钮点击调用函数,非必输
			})
            break
        case 'AddLine':
            props.cardTable.addRow(this.tableId);
			break
		case 'DelLine':
			let selectedRows = props.cardTable.getCheckedRows(this.tableId)
			let selectedIndex = []
			selectedRows.forEach((item) => {
				selectedIndex.push(item.index)
			})
            props.cardTable.delRowsByIndex(this.tableId,selectedIndex)
            this.updateCardTableBtnStatus()
			break;
        case 'Refresh':
            // props.pushTo('/card', {
            //   status:props.getUrlParam('status'),
            //   id:props.getUrlParam('id')
			// })
			this.getdata(this.props.getUrlParam('id'),() => {
				toast({title:this.state.json['10140SACLSO-000009'],color:'success'});/* 国际化处理： 刷新成功！*/
			})
            break
        default:
            break
        }
	}
	
	output(type=''){
		let pks = [];
		pks.push(this.props.getUrlParam('id'))
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if(type!=''){
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode:/*this.props.config.funcode*/'10140SACLSO',     //功能节点编码
                    nodekey:'supplyset-card',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
        }
    }
    
    pageInfoClick=(props, pk)=>{
		this.getDataForCache(pk)
    }

    updateCardTableBtnStatus() {
        let checkedRows = this.props.cardTable.getCheckedRows(this.tableId)
        let status = this.props.getUrlParam('status')
        status = status == 'add' || status == 'edit' ? 'edit' : 'browse'

		if(checkedRows.length > 0 && status == 'edit') {
			this.props.button.setButtonDisabled(['DelLine'], false);
		}
		else {
			this.props.button.setButtonDisabled(['DelLine'], true);
		}
    }

	/**
	 * 备注：record参数和value参数其实是一样的，如果是参照的话，都是后端返回的参照数据
	 */
    afterEvent =(props, moduleId, key,value, oldValue, record)=>{
		if(value == oldValue || value != null && oldValue != null && oldValue.value == value.value)
			return
		if(key == 'pk_supplyname') {
			let setKeys = ['name','mnecode','shortname']
			let setObj = {}
			let tempKey = ''
			setKeys.forEach(item => {
				tempKey = `pk_supplyname.${item}`
				setObj[tempKey] = {
					value: record && record.values && record.values[item] ? record.values[item].value : null,
					display: record && record.values && record.values[item] ? record.values[item].value : null
				}
			})
			this.props.form.setFormItemsValue(this.formId,setObj)
			
			//value.values.pk_supplyname.display = record.refcode										
		}
		else if(key == 'pk_supabclass') {
			let gradesysValue = record.values && record.values.gradesys ? record.values.gradesys : null
			let setObj = {}
			if(gradesysValue && gradesysValue != 'null') {
				setObj = {
					"pk_supabclass.gradesys":{
						value: record.values.gradesys.value,
						display: record.values.gradesysname.value
					}
				}
			}
			else {
				setObj = {
					"pk_supabclass.gradesys":{
						value: null,
						display: null
					}
				}
			}
			setObj.pk_supgradesys = {
				value: null,
				display: null
			}
			setObj['pk_supgradesys.supstatus'] = {
				value: null,
				display: null
			}
			this.props.form.setFormItemsValue(this.formId,setObj)

			//清空子表的所有供应商等级
			let allRows = this.props.cardTable.getAllRows(this.tableId)
			allRows.forEach(row => {

			})
			this.props.cardTable.setTableData(this.tableId,allRows)

			//重置form以及子表的供应商等级参照的过滤条件
			let meta = this.props.meta.getMeta()
			meta[this.formId].items.find(item => item.attrcode == 'pk_supgradesys').queryCondition = () => {
				return {
					pk_suppliergrade: gradesysValue && gradesysValue.value ? gradesysValue.value : 'null'
				}
			}
			meta[this.tableId].items.find(item => item.attrcode == 'pk_supgadesys').queryCondition = () => {
				return {
					pk_suppliergrade: gradesysValue && gradesysValue.value ? gradesysValue.value : 'null'
				}
			}

			this.props.meta.setMeta(meta)
			
		}
		else if(key == 'pk_org') {
			//对供应商编码的参照加一个过滤条件，选择了所属组织之后，供应商编码的参照应当能够带出该组织下的供应商信息
			let meta = this.props.meta.getMeta()
			meta[this.formId].items.find(item => item.attrcode == 'pk_supplyname').queryCondition = () => {
				return {
					pk_org: value.value
				}
			}
			this.props.meta.setMeta(meta)
		}
		else if(key == 'pk_supgradesys') {
			//选择了供应商等级之后，自动带出状态字段
			let supstatusValues = value.values && value.values.supstatus ? value.values.supstatus : null
			let setObj = {}
			if(supstatusValues && supstatusValues.value) {
				setObj['pk_supgradesys.supstatus'] = {
					value: supstatusValues.value,
					display: supstatusValues.value
				}
			}
			else {
				setObj['pk_supgradesys.supstatus'] = {
					value: null,
					display: null
				}
			}
			
			this.props.form.setFormItemsValue(this.formId,setObj)
		}
	}

	//通过单据id查询单据信息
	getdata = (pk,callback) =>{
		let data = {pk};
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				let gradesysValue = null
				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					let title_code = res.data.head[this.formId].rows[0].values[titleCode].display;
					this.setState({title_code});
					gradesysValue = res.data.head[this.formId].rows[0].values['pk_supabclass.gradesys']

					//放入缓存
					updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
					let arr = this.props.cardTable.getAllRows(this.tableId);
					let applycount = 0;
					this.setState({applycount});
					this.setState({totalcount});
				}
				else {
					this.props.cardTable.setTableData(this.tableId, {rows: []})
				}
				this.updateButtonStatus()

				//特殊处理一下供应商等级的参照的过滤问题
				if(finishLoad > 0) {
					let meta = this.props.meta.getMeta()
					meta[formId].items.find(item => item.attrcode == 'pk_supgradesys').queryCondition = () => {
						return {
							pk_suppliergrade: gradesysValue && gradesysValue.value ? gradesysValue.value : 'null'
						}
					}
		
					meta[tableId].items.find(item => item.attrcode == 'pk_supgadesys').queryCondition = () => {
						return {
							pk_suppliergrade: gradesysValue && gradesysValue.value ? gradesysValue.value : 'null'
						}
					}
					this.props.meta.setMeta(meta)
				}
				else {
					finishLoad++
				}

				if(res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg,{
							[formId]: 'form',
							[tableId]: 'cardTable'
						}
					)
				}

				if(callback && typeof callback == 'function') {
					callback.call(this)
				}
			}
		});
	}

	onCardTableAfterEvent(props, moduleId, key,value, changedrows, index, record) {
		if(key == 'pk_material') {
			if(changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
				let setObj = {}
				setObj.value = record.values.pk_material.value
				setObj.display = value.refname
				props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_material.name',setObj)
				record.values.pk_material.display = value.refcode										
			}
		}
		else if(key == 'pk_supgadesys') {
			if(changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
				let setObj = {}
				setObj = {
					value: value.refcode,
					display: value.refcode
				}
				
				props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_supgadesys.supstatus',setObj)									
			}
		}
	}

	//保存单据
	saveClick = () =>{
		//校验一下必输项是否已经全部输入了
		if(!this.props.cardTable.checkTableRequired(this.tableId)) {
			//校验失败
			return
		}
		let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
		delete CardData.head[formId].rows[0].values[childValues]
		// CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
		let url = saveUrl;//新增保存
		if (this.props.getUrlParam('status') === 'edit') {
		  url = updateUrl;//修改保存
		}
		this.props.validateToSave(CardData, () => {
			ajax({
				url: url,
				data: CardData,
				success: (res) => {
					let pk_value = null
					if (res.success) {
						if (res.data) {
							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
								//更正缓存
								if(url == saveUrl) {
									//新增保存
									addCache(pk_value,res.data,this.formId,dataSource);
								}
								else {
									//修改保存
									updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);
								}
							}
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
							}
						}
						toast({title : this.state.json['10140SACLSO-000010'],color : 'success'});/* 国际化处理： 保存成功！*/
						this.props.pushTo('/card', {
							pagecode:pageId,
							status: 'browse',
							id: pk_value
						})
						this.toggleShow()
						//特殊设置一下返回按钮的可见性
						this.setState({
							backVisible: true
						})
					}
				}
			})
		}, {'head': formId, [tableId]: 'cardTable'})
	}

	getDataForCache(pk, callback) {
		if(!pk) {
			this.props.form.EmptyAllFormValue(this.formId)
            this.props.cardTable.setTableData(this.tableId, {rows: []})
            this.props.setUrlParam({id: 'null', status: 'browse'})
			// 修正一下，如果界面上没有数据了的话，就只剩个新增按钮即可
			this.toggleShow(true)
			return
		}
		
		let cardData = getCacheById(pk, dataSource);
		if(cardData) {
			this.props.form.setAllFormValue({ [formId]:cardData.head[formId] });
			if(cardData.body && cardData.body[tableId]) {
				this.props.cardTable.setTableData(tableId, cardData.body[tableId]);
			}
			else {
				this.props.cardTable.setTableData(tableId, {rows: []})
			}
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
		}
		else {
			this.getdata(pk)
			this.props.setUrlParam(pk)//动态修改地址栏中的id的值
		}

		if(callback && typeof callback == 'function') {
			callback.call(this)
		}
	}

	//删除单据
	delConfirm = () => {
		ajax({
			url: deleteUrl,
			data: {
				deleteInfo: [
					{
						id: this.props.getUrlParam('id'),
						ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
					}
				]
			},
			success: (res) => {
				if(res){
					let id = this.props.getUrlParam("id");

					//根据当前id,获取下个id
					/*
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					let nextId = getNextId(id, dataSource);

					//调用删除缓存数据方法
					/*
					* idname: 数据主键的命名
					* id：数据主键的值
					* dataSource: 缓存数据命名空间
					*/
					deleteCacheById(pk_item,id,dataSource);

					this.getDataForCache(nextId,() => {
						//this.props.cardPagination.setCardPaginationId({id: nextId,status: 1})
						toast({color: 'success', title: this.state.json['10140SACLSO-000011']})/* 国际化处理： 删除成功！*/
					})
				}
				
			}
		});
	};
	
	onCancelSureEvent() {
		if (this.props.getUrlParam('status') === 'add') {
			let pk = getCurrentLastId(dataSource);
			if(!pk) {
				this.props.setUrlParam({id: 'null', status: 'browse'})
                this.toggleShow()
                return
			}
			else {
				this.getDataForCache(pk, () => {
					//编辑态取消时，修正一下页面状态
					this.props.pushTo('/card', {
						pagecode:pageId,
						status: 'browse',
						id: this.props.getUrlParam('id')
					})

					this.props.form.setFormStatus(this.formId, 'browse')
					this.props.cardTable.setStatus(this.tableId, 'browse')
					this.updateButtonStatus()
				})
			}
		}
		if ((this.props.getUrlParam('status') === 'edit')) {
			this.props.form.cancel(this.formId);
			this.props.editTable.cancelEdit(this.tableId);
			this.props.pushTo('/card', {
				pagecode:pageId,
				status: 'browse',
				id: this.props.getUrlParam('id')
			})
		}
		this.toggleShow()
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: true
		})
	}

	modelSave = (props)=>{
		props.cardTable.closeModel(this.tableId);
		this.saveClick();
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
		let { createButtonApp } = button;
		let buttons  = this.props.button.getButtons();
		let status = this.props.getUrlParam("status");
        return (
			<div className="shoulder-definition-area">
				<div className='definition-search'>
					{status == 'browse' ?<div><span className="definition-search-title">{this.state.json['10140SACLSO-000016']} | {this.state.json['10140SACLSO-000017']/* 国际化处理： 详细信息,总计*/}：</span>
						<span className = 'count'>{this.state.totalcount}</span><span>{this.state.json['10140SACLSO-000018']/* 国际化处理： 条*/}</span>
					<span>		{this.state.json['10140SACLSO-000019']/* 国际化处理： 申请数量*/} ：</span>
						<span className='count'>{this.state.applycount}</span><span>{this.state.json['10140SACLSO-000020']/* 国际化处理： 个*/}</span></div>:<span className="definition-search-title"></span>}
				</div>
				<div className="definition-icons" style={{padding: "0px"}}>
					{createButtonApp({
						area: 'body-action',//按钮注册中的按钮区域
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
	render() {
		let { cardTable, form, button, modal, cardPagination } = this.props;
		const {createCardPagination} = cardPagination;
		let buttons = this.props.button.getButtons();
		buttons = buttons.sort((a,b)=>{
			return b.btnorder - a.btnorder;
		});
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		return (
				<div className="nc-bill-card">
					<div className="nc-bill-top-area">
						<NCAffix>
							<div className='nc-bill-header-area'>
							<	NCBackBtn className='title-search-detail' style={{display: this.state.backVisible ? 'inline' : 'none'}}
											onClick={ this.buttonClick.bind(this,this.props,'Back') }></NCBackBtn>
								<div className='header-title-search-area'>
                                    {createPageIcon()}
									<h2 className='title-search-detail'>{this.state.json['10140SACLSO-000021']/* 国际化处理： 供应商供货能力分类设置*/}{status=='browse'?`：${this.state.title_code}`:''}</h2>
								</div>
								{/*分页 */}
								{/* {status=='browse'?<div className='header-button-cardPagination'>
									{createCardPagination({	handlePageInfoChange: pageInfoClick.bind(this)})}
									</div>:''} */}
								<div className="header-button-area">
									{createButtonApp({
										area: 'header-action',//按钮注册中的按钮区域
										//buttonLimit: 5, 
										onButtonClick: this.buttonClick.bind(this) 
										//popContainer: document.querySelector('.header-button-area')
									})}
									{createCardPagination({
										handlePageInfoChange: this.pageInfoClick.bind(this),
										dataSource: dataSource
									})}
								</div>
						</div>
						</NCAffix>
						<div className="nc-bill-form-area">
							{createForm(this.formId, {
								onAfterEvent: this.afterEvent.bind(this)
							})}
						</div>
					</div>
					<div className="nc-bill-bottom-area">
						<div className="nc-bill-table-area">
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this),
								modelSave: this.modelSave.bind(this),
								onAfterEvent: this.onCardTableAfterEvent.bind(this),
								showIndex:true,
                                showCheck: true,
                                onSelected: this.updateCardTableBtnStatus.bind(this),
							    onSelectedAll: this.updateCardTableBtnStatus.bind(this)
							})}
						</div>
					</div>
					{createModal('delete', {
						title: this.state.json['10140SACLSO-000003'],/* 国际化处理： 注意*/
						content: this.state.json['10140SACLSO-000004'],/* 国际化处理： 确认删除？*/
						beSureBtnClick: this.delConfirm
					})}

					{createModal('cancel', {
						title: this.state.json['10140SACLSO-000007'],/* 国际化处理： 确认取消*/
						content: this.state.json['10140SACLSO-000008'],/* 国际化处理： 是否确认要取消？*/
						beSureBtnClick: this.onCancelSureEvent.bind(this)
					})}

					<PrintOutput
						ref='printOutput'
						url={printUrl}
						data={{
							funcode: '10140SACLSO',
							oids: this.state.pks,
							nodekey:'supplyset-card',
							outputType: 'output'
						}}
					/>
				</div>
			
		);
	}
}

Card = createPage({
	billinfo:{
        billtype: 'card', 
        pagecode: pageId, 
        headcode: formId,
        bodycode: tableId
    },
	initTemplate: []
})(Card);

//ReactDOM.render(<Card />, document.querySelector('#app'));

export default Card

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65