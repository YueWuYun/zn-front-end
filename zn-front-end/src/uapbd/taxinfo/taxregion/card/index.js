//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, high, cardCache, promptBox, createPageIcon, getMultiLang } from 'nc-lightapp-front';
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn } = base;
const {PrintOutput} = high
import { print } from 'nc-lightapp-front';
const { addCache, getCacheById, updateCache, getCurrentLastId, getNextId, deleteCacheById } = cardCache;
const { NCDiv } = base;
const dataSource = 'upabd.taxinfo.taxregion.data'
const formId = 'taxregion';                      //表头id
const tableId = 'taxregionb';                  //子表id
const pageId = '10140TAXRE_card';            //pagecode
const searchId = 'search';                  //查询区id
const appId ='0001Z01000000000190Z';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/taxregion/queryTaxregionCard.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/taxregion/saveTaxregion.do';             //新增保存
const updateUrl = '/nccloud/uapbd/taxregion/updateTaxregion.do';         //修改保存
const deleteUrl = '/nccloud/uapbd/taxregion/delTaxregion.do';         //删除
const changeEnableStatus = '/nccloud/uapbd/taxregion/changeEnableTaxregion.do'; 
const pk_item = 'pk_taxregion';               //单据主键--用于卡片查询刷新
const titleCode = 'code';            //单据编码--用于卡片表头显示
const childValues = 'pk_taxregions'
const printUrl = '/nccloud/uapbd/taxregion/printTaxregion.do'

//全局变量，为了设置行政区划参照的范围
let gCurrCountry = null

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
			backVisible: true,
			json: {}
		}
	}

	initTemplate =(props)=>{
		props.createUIDom(
			{
				pagecode: pageId//页面id
				// appid: appId,//注册按钮的id
				// appcode: '10140TAXRE'
			}, 
			data => {
				if(data){
					if(data.template){
						let meta = data.template;
						this.modifierMeta(props, meta)
						props.meta.setMeta(meta);
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
	
	modifierMeta(props, meta) {
		let status = props.getUrlParam('status');
		meta[formId].status = status;
		meta[tableId].status = status;
		console.log(this)
	
		//纠正一下子表行政区划参照的参照范围，因为getdata执行的时候可能initTemplet还没有准备好数据
		meta[tableId].items.map((item) => {
			if (item.attrcode == 'pk_region') {
				item.queryCondition = () => {
					return { pk_country: gCurrCountry.value }; // 根据pk_org过滤
				};
			}
		});
		if(!!meta['taxregionb_childform1']){
			meta['taxregionb_childform1'].items.find(item => item.attrcode == 'pk_region').queryCondition = () => {
				return {
					pk_country: gCurrCountry.value
				}
			}
		}
		if(!!meta['taxregionb_childform2']){
			meta['taxregionb_childform2'].items.find(item => item.attrcode == 'pk_region').queryCondition = () => {
				return {
					pk_country: gCurrCountry.value
				}
			}
		}
		let porCol = {
			itemtype: 'customer',
			attrcode: 'opr',
			label: this.state.json ? this.state.json['10140TAXRE-000000'] : '10140TAXRE-000000',/* 国际化处理： 操作*/
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
						> {this.state.json ? this.state.json['10140TAXRE-000023'] : '10140TAXRE-000023'/* 国际化处理： 展开*/}
					 </span>
				):(<div className="currency-opr-col">
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.openModel(tableId, 'edit', record, index);
								e.stopPropagation();
							}}
						>{this.state.json ? this.state.json['10140TAXRE-000024'] : '10140TAXRE-000024'/* 国际化处理： 更多*/}</span>
						&nbsp;&nbsp;
						<span
							className="currency-opr-del"
							onClick={(e) => {
								props.cardTable.delRowsByIndex(tableId, index);
								e.stopPropagation();
							}}
						>{this.state.json ? this.state.json['10140TAXRE-000025']  : '10140TAXRE-000025'/* 国际化处理： 删除*/}</span>
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
        this.props.MultiInit.getMultiLang({moduleId: '10140TAXRE', domainName: 'uapbd',callback})

		this.toggleShow();
		this.updateCardTableBtnStatus()
		
		let status = this.props.getUrlParam('status');
		if(status != "add"){
			//this.props.cardPagination.setCardPaginationId({id: this.props.getUrlParam('id'),status: 0})
			let	pk = this.props.getUrlParam('id');
			if(pk && pk != 'undefined'){
				this.getdata(pk);
			}
		}
		else{
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
		gCurrCountry = null
    }
    
    //切换页面状态
    toggleShow(enableState = 2){
        let status = this.props.getUrlParam('status');
        let id = this.props.getUrlParam('id')
        //按钮的显示状态
        let visibleButtons = []
        let unvisibleButtons = []
        if(status == 'browse' && id == 'null') {
            visibleButtons = ['Add']
            unvisibleButtons = ['SaveAdd', 'Edit', 'back','Delete','Refresh','Enable','Disable','Print','Output', 'Save','Cancel','AddLine','DelLine']
        }
        else if(status == 'edit' || status == 'add'){
            unvisibleButtons = ['Edit','Add','back','Delete','Refresh','Enable','Disable','Print','Output']
            visibleButtons = ['Save','Cancel','AddLine','DelLine']
            if(status == 'add') {
                visibleButtons.push('SaveAdd')
            }
            else {
                unvisibleButtons.push('SaveAdd')
            }
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
        }else{
            unvisibleButtons = ['Save','Cancel','AddLine','DelLine','SaveAdd']
            visibleButtons = ['Add','Edit','Delete','back','Refresh','Print','Output']
            if(enableState == 2) {
                visibleButtons.push('Disable')
                unvisibleButtons.push('Enable')
            }
            else {
                visibleButtons.push('Enable')
                unvisibleButtons.push('Disable')
            }
            this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
        }
        this.props.form.setFormStatus(formId, status);
        this.props.cardTable.setStatus(tableId, status == 'edit' || status == 'add' ? 'edit' : 'browse');
        this.props.button.setButtonVisible(unvisibleButtons,false);
        this.props.button.setButtonVisible(visibleButtons,true);
        this.updateCardTableBtnStatus()

        //添加浏览器窗口关闭监听事件
        if(status != 'add' && status != "edit"){
            window.onbeforeunload = null;
        }else{
            window.onbeforeunload = () => {//编辑态关闭页签或浏览器的提示
                return '';
            };
        }
    };

	setDefaultValue = () =>{
		this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:this.state.json['10140TAXRE-000001']}});/* 国际化处理： 自由态*/
		this.props.form.setFormItemsValue(this.formId,{'enablestate':{value:'2',display:this.state.json['10140TAXRE-000002']}});/* 国际化处理： 已启用*/
		this.props.form.setFormItemsValue(this.formId,{'dataoriginflag':{value:'0',display:this.state.json['10140TAXRE-000003']}});/* 国际化处理： 本级产生*/
		
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
						pagecode:'10140TAXRE_card',
                        status: 'add'
                    })
                    this.setDefaultValue()
                    this.toggleShow();
                })
				break
			case 'Edit':
				props.pushTo('/card', {
					status: 'edit',
					pagecode:'10140TAXRE_card',
					id: props.getUrlParam('id')
				})
				this.toggleShow();

				//设置一下修改时根据国家地区设置行政区划参照的参照范围
                let currCountry = this.props.form.getFormItemsValue(this.formId,'pk_country')
                currCountry = currCountry || gCurrCountry
				let meta = props.meta.getMeta()
				meta[tableId].items.map((item) => {
					if (item.attrcode == 'pk_region') {
						item.queryCondition = () => {
							return { pk_country: currCountry.value }; // 根据pk_org过滤
						};
					}
				});
				meta['taxregionb_childform1'].items.find(item => item.attrcode == 'pk_region').queryCondition = () => {
					return {
						pk_country: currCountry.value
					}
				}
				
				meta['taxregionb_childform2'].items.find(item => item.attrcode == 'pk_region').queryCondition = () => {
					return {
						pk_country: currCountry.value
					}
				}
				//特殊设置一下返回按钮的可见性
				this.setState({
					backVisible: false
				})
				break;
			case 'Delete':
				//this.props.modal.show('delete');
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140TAXRE-000004'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 注意*/
					content: this.state.json['10140TAXRE-000005'],             // 提示内容,非必输/* 国际化处理： 确认删除？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.delConfirm.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break
			case 'Back':
				props.pushTo('/list', {
					pagecode:'10140TAXRE_list'
				})
				break
			case 'Save':
				this.saveClick();
				break
			case 'Cancel':
				//this.props.modal.show('cancel')
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140TAXRE-000008'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认取消*/
					content: this.state.json['10140TAXRE-000009'],             // 提示内容,非必输/* 国际化处理： 是否确认要取消？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.cancelSureEvent.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break
			case 'AddLine':
				//增行前的校验操作：form当中的必输项不能为空
				let warningMessage = [this.state.json['10140TAXRE-000010'],this.state.json['10140TAXRE-000011'],this.state.json['10140TAXRE-000012']]/* 国际化处理： 国家不能为空,征税地区编码不能为空,征税地区名称不能为空*/
				let neccesaryValues = this.props.form.getFormItemsValue(this.formId,['pk_country','code','name'])
				let canAdd = true
				neccesaryValues.forEach((value,index) => {
					if(value.value == null || value.value == '') {
						if(canAdd) {
							toast({color: 'warning',content: warningMessage[index]})
						}
						canAdd = false
					}
				})
				if(canAdd) {
					props.cardTable.addRow(this.tableId);
					this.toggleShow()
				}
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
				// 	status:props.getUrlParam('status'),
				// 	id:props.getUrlParam('id')
				// })
				this.getdata(this.props.getUrlParam('id'),() => {
					toast({title:this.state.json['10140TAXRE-000013'],color:'success'});/* 国际化处理： 刷新成功！*/
				})
				break
			case 'Print':
				this.output('print')
				break
			case 'Output':
				let pks = [];
				pks.push(this.props.getUrlParam('id'))
				this.setState({
					pks: pks
				},() => {
					this.refs.printOutput.open()
				})
				break
			case 'Enable':
				//this.props.modal.show('enable')
				this.enableClick = true
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140TAXRE-000014'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认启用*/
					content: this.state.json['10140TAXRE-000015'],             // 提示内容,非必输/* 国际化处理： 是否确认要启用？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.changeEnableClick.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break
			case 'Disable':
				//this.props.modal.show('disable')
				this.enableClick = false
				promptBox({
					color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
					title: this.state.json['10140TAXRE-000016'],                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 确认停用*/
					content: this.state.json['10140TAXRE-000017'],             // 提示内容,非必输/* 国际化处理： 是否确认要停用？*/
					noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
					noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
					beSureBtnName: this.state.json['10140TAXRE-000006'],          // 确定按钮名称, 默认为"确定",非必输/* 国际化处理： 确定*/
					cancelBtnName: this.state.json['10140TAXRE-000007'],           // 取消按钮名称, 默认为"取消",非必输/* 国际化处理： 取消*/
					beSureBtnClick: this.changeEnableClick.bind(this)   // 确定按钮点击调用函数,非必输
				})
				break
			case 'SaveAdd':
				this.saveClick(true)
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
                    funcode:/*this.props.config.funcode*/'10140TAXRE',     //功能节点编码
                    nodekey:'card',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
        }
    }

	cancelSureEvent() {
		if (this.props.getUrlParam('status') === 'add') {
			let pk = getCurrentLastId(dataSource);
			this.getDataForCache(pk, () => {
				//编辑态取消时，修正一下页面状态
				this.props.pushTo('/card', {
					status: 'browse',
					pagecode:'10140TAXRE_card',
					id: this.props.getUrlParam('id')
				})

				this.props.form.setFormStatus(this.formId, 'browse')
				this.props.cardTable.setStatus(this.tableId, 'browse')
			})
		}
		if ((this.props.getUrlParam('status') === 'edit')) {
			this.props.form.cancel(this.formId);
			this.props.cardTable.resetTableData(this.tableId);
			this.props.pushTo('/card', {
				status: 'browse',
				pagecode:'10140TAXRE_card',
				id: this.props.getUrlParam('id')
			})
			let enableState = this.props.form.getFormItemsValue(this.formId,'enablestate')
			this.toggleShow(enableState.value)
		}
		//特殊设置一下返回按钮的可见性
		this.setState({
			backVisible: true
		})
	}
    
    pageInfoClick=(props, pk)=>{
		this.getDataForCache(pk)
    }


    afterEvent(props, moduleId, key, value, oldValue) {
		if(key != 'pk_country' || value.value == oldValue.value) {
			return
		}

		//修正一下行政区划的参照的过滤
		let meta = props.meta.getMeta()
		meta[tableId].items.map((item) => {
			if (item.attrcode == 'pk_region') {
				item.queryCondition = () => {
					return { pk_country: value.value }; // 根据pk_org过滤
				};
			}
		});
		meta['taxregionb_childform1'].items.find(item => item.attrcode == 'pk_region').queryCondition = () => {
			return {
				pk_country: value.value
			}
		}
		
		meta['taxregionb_childform2'].items.find(item => item.attrcode == 'pk_region').queryCondition = () => {
			return {
				pk_country: value.value
			}
		}
		
	}

	//通过单据id查询单据信息
	getdata = (pk,callback) =>{
		let data = {pk};
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
					this.setState({title_code});
					let enableState = res.data.head[this.formId].rows[0].values.enablestate.value	
					if(enableState == 2) {
						this.props.button.setButtonVisible(['Disable'],true)
						this.props.button.setButtonVisible(['Enable'],false)
					}
					else if(enableState == 3) {
						this.props.button.setButtonVisible(['Disable'],false)
						this.props.button.setButtonVisible(['Enable'],true)
					}

					this.toggleShow(enableState)

					//设置一下修改时根据国家地区设置行政区划参照的参照范围
					let currCountry = res.data.head[this.formId].rows[0].values.pk_country
					let meta = this.props.meta.getMeta()
					if(meta && meta[tableId]) {
						console.log("modifierMeta in getData")
						meta[tableId].items.map((item) => {
							if (item.attrcode == 'pk_region') {
								item.queryCondition = () => {
									return { pk_country: currCountry.value }; // 根据pk_org过滤
								};
							}
						});
						meta['taxregionb_childform1'].items.find(item => item.attrcode == 'pk_region').queryCondition = () => {
							return {
								pk_country: currCountry.value
							}
						}
						
						meta['taxregionb_childform2'].items.find(item => item.attrcode == 'pk_region').queryCondition = () => {
							return {
								pk_country: currCountry.value
							}
						}
						this.props.meta.setMeta(meta)
					}
					else {
						gCurrCountry = currCountry
					}

					//放入缓存
					updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
					let arr = this.props.cardTable.getAllRows(this.tableId);
					let applycount = 0;
					// arr.map((item)=>{
					// 	applycount += parseInt(item.values.pk_project.value);
					// })
					this.setState({applycount});
					this.setState({totalcount});
				}
				else {
					this.props.cardTable.setTableData(this.tableId, {rows: []})
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
		console.log(changedrows)
		console.log(record)
		if(changedrows[0].newvalue.value != changedrows[0].oldvalue.value) {
			let setObj = {}
			setObj.value = record.values.pk_region.value
			setObj.display = value.refname
			props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_region.name',setObj)
			record.values.pk_region.display = value.refcode										
		}
	}

	//保存单据
	saveClick = (saveAdd = false) =>{
        //加个判定，这会导致必输项如果没有输入的话会标红
		if(!this.props.form.isCheckNow(this.formId)) {
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
						if (res.data && !saveAdd) {
							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
								let enableState = res.data.head[this.formId].rows[0].values.enablestate.value	
								if(enableState == 2) {
									this.props.button.setButtonVisible(['Disable'],true)
									this.props.button.setButtonVisible(['Enable'],false)
								}
								else if(enableState == 3) {
									this.props.button.setButtonVisible(['Disable'],false)
									this.props.button.setButtonVisible(['Enable'],true)
								}
							}
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
							}
						}
						else {
							pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
						}
						if(!saveAdd) {
							this.props.pushTo('/card', {
								status: 'browse',
								pagecode:'10140TAXRE_card',
								id: pk_value
							})
							this.toggleShow()
							//特殊设置一下返回按钮的可见性
							this.setState({
								backVisible: true
							})
						}
						else {
                            this.props.form.EmptyAllFormValue(this.formId)
                            this.props.form.setFormStatus(this.formId, 'add')
                            this.setState(this.state, () => {
                                this.setDefaultValue()
                            })  
						}

						//更正缓存
						if(url == saveUrl) {
							//新增保存
							addCache(pk_value,res.data,this.formId,dataSource);
						}
						else {
							//修改保存
							updateCache(pk_item,res.data.head[formId].rows[0].values[pk_item].value,res.data,formId,dataSource);
						}
						toast({content : this.state.json['10140TAXRE-000018'],color : 'success'});/* 国际化处理： 保存成功*/
					}
				}
			})
		},{'head': formId, [tableId]: 'cardTable'})
	}

	getDataForCache(pk, callback) {
		if(!pk) {
            this.props.setUrlParam({id: 'null', status: 'browse'})
            this.toggleShow()
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

		//将更新按钮状态的调用延后到callback之后，否则新增取消的时候显示的还是编辑态的按钮
		if(cardData) {
			let enableState = cardData.head[formId].rows[0].values.enablestate.value
			this.toggleShow(enableState)
		}
	}

	//删除单据
	delConfirm = () => {
		ajax({
			url: deleteUrl,
			data: {
				id: this.props.getUrlParam('id'),
				ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
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
						toast({color:"success",title: this.state.json['10140TAXRE-000019']});/* 国际化处理： 删除成功！*/
					})
				}
				
			}
		});
	};

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

	changeEnableClick() {
		ajax({
			url: changeEnableStatus,
			data: {
				id: this.props.getUrlParam('id')
			},
			success: res => {
				this.getdata(this.props.getUrlParam('id'), () => {
					if(this.enableClick) {
						toast({color: "success",title: this.state.json['10140TAXRE-000020']})/* 国际化处理： 启用成功！*/
					}
					else {
						toast({color: "success",title: this.state.json['10140TAXRE-000021']})/* 国际化处理： 停用成功！*/
					}
				});
			}
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
					{status == 'browse' ?<div><span className="definition-search-title">{this.state.json ? this.state.json['10140TAXRE-000026'] : '10140TAXRE-000026'} | {this.state.json ? this.state.json['10140TAXRE-000027'] : '10140TAXRE-000027'/* 国际化处理： 详细信息,总计*/}：</span>
						<span className = 'count'>{this.state.totalcount}</span><span>{this.state.json ? this.state.json['10140TAXRE-000028'] : '10140TAXRE-000028'/* 国际化处理： 条*/}</span></div>:<span className="definition-search-title"></span>}
				</div>
				<div className="definition-icons" style={{padding: "0px"}}>
					{createButtonApp({
						area: 'body-action',//按钮注册中的按钮区域
						onButtonClick: this.buttonClick.bind(this)
					})}
					{this.props.cardTable.createBrowseIcons(this.tableId, {
						iconArr: ['close', 'open', 'max','setCol'],
						maxDestAreaId: 'nc-bill-card'
					})}
				</div>	
			</div>
        )
    }
	render() {
		let { cardTable, form, button, modal, cardPagination ,BillHeadInfo} = this.props;
		const {createBillHeadInfo} = BillHeadInfo;
		const {createCardPagination} = cardPagination;
		let { createForm } = form;
		let { createCardTable } = cardTable;
		let { createButtonApp } = button;
		let { createModal } = modal;
		let status = this.props.getUrlParam('status');
		return (
			<div className="nc-bill-card">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv  areaCode={NCDiv.config.HEADER} className='nc-bill-header-area'>
							<div className='header-title-search-area'>
								{createBillHeadInfo({
										title:(this.state.json ? this.state.json['10140TAXRE-000029'] : '10140TAXRE-000029'+ status=='browse'?`：${this.state.title_code}`:''),
										backBtnClick: () => {this.props.pushTo('/list', {
											pagecode:'10140TAXRE_list'
										})}
									}
								)}
							</div>
							<div className="header-button-area">
								{createButtonApp({
									area: 'header-action',//按钮注册中的按钮区域
									onButtonClick: this.buttonClick.bind(this) 
								})}
								{createCardPagination({
									handlePageInfoChange: this.pageInfoClick.bind(this),
									dataSource: dataSource
								})}
							</div>
						</NCDiv>
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
					title: this.state.json ? this.state.json['10140TAXRE-000004'] : '10140TAXRE-000004',/* 国际化处理： 注意*/
					content: this.state.json ? this.state.json['10140TAXRE-000005'] : '10140TAXRE-000005',/* 国际化处理： 确认删除？*/
					beSureBtnClick: this.delConfirm.bind(this)
				})}

				{createModal('cancel',{
					title: this.state.json ? this.state.json['10140TAXRE-000008'] : '10140TAXRE-000008',/* 国际化处理： 确认取消*/
					content: this.state.json ? this.state.json['10140TAXRE-000009'] : '10140TAXRE-000009',/* 国际化处理： 是否确认要取消？*/
					beSureBtnClick: this.cancelSureEvent.bind(this)
				})}

				{createModal('enable',{
					title: this.state.json ? this.state.json['10140TAXRE-000014'] : '10140TAXRE-000014',/* 国际化处理： 确认启用*/
					content: this.state.json ? this.state.json['10140TAXRE-000015'] : '10140TAXRE-000015',/* 国际化处理： 是否确认要启用？*/
					beSureBtnClick: this.changeEnableClick.bind(this)
				})}

				{createModal('disable',{
					title: this.state.json ? this.state.json['10140TAXRE-000016'] : '10140TAXRE-000016',/* 国际化处理： 确认停用*/
					content: this.state.json ? this.state.json['10140TAXRE-000017'] : '10140TAXRE-000017',/* 国际化处理： 是否确认要停用？*/
					beSureBtnClick: this.changeEnableClick.bind(this)
				})}

				<PrintOutput
					ref='printOutput'
					url={printUrl}
					data={{
						funcode: '10140TAXRE',
						nodekey:'card',
						oids: this.state.pks,
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

export default Card

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65