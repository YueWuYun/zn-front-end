//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
//主子表卡片
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base, toast, print, high,promptBox,getMultiLang} from 'nc-lightapp-front';
const {PrintOutput}=high;
const { NCAffix,NCPopconfirm,NCFormControl,NCBackBtn,NCDiv } = base;
import './index.less';

const funcode = '10140CBAE';
const formId = 'pk_bankaccbas';                      //表头id
const tableId = 'bankaccsub';                  //子表id
const pageId = '10140CBAE_card';            //pagecode
const pageIdList = '10140CBAE_list';  
const searchId = '10140CBAEQRY';                  //查询区id
const appId ='0001Z010000000002EF0';        //按钮注册id
const queryCardUrl = '/nccloud/uapbd/custaccen/custenqueryCard.do';   //卡片查询url
const saveUrl = '/nccloud/uapbd/taxregion/saveTaxregion.do';             //新增保存
const updateUrl = '/nccloud/uapbd/taxregion/updateTaxregion.do';         //修改保存
const enableUrl = '/nccloud/uapbd/custaccen/custaccenable.do' //启用
const printUrl = '/nccloud/uapbd/custaccen/custenlistprint.do' //打印
const pk_item = 'pk_bankaccbas';               //单据主键--用于卡片查询刷新
const titleCode = 'accname';            //单据编码--用于卡片表头显示
const childValues = 'pk_taxregions'

let initTemplate =(props)=>{
	props.createUIDom(
		{
			pagecode: pageId//页面id
			// appid: appId//注册按钮的id
		}, 
		function (data){
			if(data){
				if(data.template){
					let meta = data.template;
					modifierMeta(props, meta)
					props.meta.setMeta(meta);
					// let status = props.getUrlParam('status');
					// if(status && status == 'add'){
					// 	props.cardTable.addRow(tableId);
					// }
				}
				if(data.button){
					let button = data.button;
					props.button.setButtons(button);
					
					props.button.setMainButton('Enable', true);
					// props.button.setMainButton({Enable:true, Disable:false});
					toggleShow(props);
				}
			}   
		}
	)
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	
	let porCol = {
		itemtype: 'customer',
		attrcode: 'opr',
		label: props.MutiInit.getIntl("10140CBAE")&&props.MutiInit.getIntl("10140CBAE").get('10140CBAE-000000'),/* 国际化处理： 操作*/
		visible: true,
		className:'table-opr',
		width:200,
		fixed:'right',
		render(text, record, index) {
			let status = props.cardTable.getStatus(tableId);
			return status === 'browse' ? (
				<span
    				onClick={() => {
                        props.cardTable.toggleRowView(tableId, record)
        
                    }}
                > {props.MutiInit.getIntl("10140CBAE")&&props.MutiInit.getIntl("10140CBAE").get('10140CBAE-000012')/* 国际化处理： 展开*/}
             	</span>
			):(<div className="currency-opr-col">
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.openModel(tableId, 'edit', record, index);
							e.stopPropagation();
						}}
					>{props.MutiInit.getIntl("10140CBAE")&&props.MutiInit.getIntl("10140CBAE").get('10140CBAE-000013')/* 国际化处理： 更多*/}</span>
					&nbsp;&nbsp;
					<span
						className="currency-opr-del"
						onClick={(e) => {
							props.cardTable.delRowsByIndex(tableId, index);
							e.stopPropagation();
						}}
					>{props.MutiInit.getIntl("10140CBAE")&&props.MutiInit.getIntl("10140CBAE").get('10140CBAE-000014')/* 国际化处理： 删除*/}</span>
				</div>
	);
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

 //切换页面状态
function toggleShow(props){
	let status = props.getUrlParam('status');
	let flag = status === 'browse' ? false : true;
	//按钮的显示状态
	if(status == 'edit' || status == 'add'){
		props.button.setButtonVisible(['Edit','Add','Back','Delete','Refresh'],false);
		props.button.setButtonVisible(['Save','Cancel','AddLine','DelLine'],true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	}else{
		props.button.setButtonVisible(['Save','Cancel','AddLine','DelLine'],false);
		props.button.setButtonVisible(['Add','Edit','Delete','Back','Refresh'],true);
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
	}
	props.form.setFormStatus(formId, status);
	props.cardTable.setStatus(tableId, status == 'edit' || status == 'add' ? 'edit' : 'browse');
};

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
			json:{}
		}
	}
	componentDidMount() {
		// toggleShow(this.props);
		this.props.cardPagination.setCardPaginationId({id: this.props.getUrlParam('id'),status: 0})

		let status = this.props.getUrlParam('status');
		if(status != "add"){
			let pks = this.props.getUrlParam('id')
			let params = pks.split('_');

			// let params = [];
			// params.push(this.props.getUrlParam('pk_custbank'))
			// params.push(this.props.getUrlParam('pk_bankaccbas'))
			// params.push(this.props.getUrlParam('pk_cust'))
			let isEmpty = false
			// params.forEach(item => {
			// 	if(!item)
			// 		isEmpty = true
			// })

			if(!isEmpty){
				this.getdata(...params);
			}
		}
		else{
			this.setDefaultValue();
		}
		
	}

	componentWillMount() {
    	let callback = (json) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
       		this.setState({json})       // 保存json和inlt到页面state中并刷新页面
		}
    	getMultiLang({moduleId: '10140CBAE',domainName: 'uapbd',callback})
    }
	setDefaultValue = () =>{
		this.props.form.setFormItemsValue(this.formId,{'bill_status':{value:'0',display:this.state.json['10140CBAE-000001']}});/* 国际化处理： 自由态*/
	}

    buttonClick =(props, id)=>{

        let _this = this;
        switch (id) {
          case 'Enable':
			// this.props.modal.show('enable');
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title:this.state.json['10140CBAE-000002'],/* 国际化处理： 确认启用*/
				content:this.state.json['10140CBAE-000003'],/* 国际化处理： 是否确认要启用？*/
				beSureBtnClick:()=>{this.enableSureEventClick()}
				})
			break
		  case 'Disable':
			  // props.modal.show('disable');
			  promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title:this.state.json['10140CBAE-000004'],/* 国际化处理： 确认停用*/
				content:this.state.json['10140CBAE-000005'],/* 国际化处理： 是否确认要停用？*/
				beSureBtnClick:()=>{this.disableSureEventClick()}
				})
			break;
          case 'Back':
			// props.linkTo('../list/index.html', {})
			props.pushTo('/list', {
				pagecode: pageIdList,
			})
            // props.linkTo('/uapbd/customer/custbanken/list/index.html', {
			// 	status: 'browse'
			// })
            break;
		  case 'Refresh':
			props.pushTo('/card', {
				pagecode: pageId,
				status:props.getUrlParam('status'),
				id:props.getUrlParam('id')
			})
            // props.linkTo('/uapbd/customer/custbanken/card/index.html', {
            //   status:props.getUrlParam('status'),
            //   id:props.getUrlParam('id')
            // })
            toast({title:this.state.json['10140CBAE-000006'],color:'success'});/* 国际化处理： 刷新成功！*/
			break;
			
		case 'Print':
			this.output('print')
			break;
		case 'Output':
			this.output('output');
			break;
          default:
            break
        }
    }
    enableSureEventClick() {
		let formData = this.props.form.getAllFormValue(this.formId);
		let finalData = {
			isEnable: true,
			list: []
		}
		let dataObj = {
			pk_bankaccbas: formData.rows[0].values.pk_bankaccbas.value,
			pk_custbank: formData.rows[0].values.pk_custbank.value,
			pk_cust: formData.rows[0].values.pk_cust.value
		}
		finalData.list.push(dataObj)
		ajax({
			url: enableUrl,
			data: finalData,
			success: res => {
				this.getdata(dataObj.pk_custbank,dataObj.pk_bankaccbas,dataObj.pk_cust,()=>{
                    toast({ color: 'success', title: this.state.json['10140CBAE-000007'] });/* 国际化处理： 启用成功！*/
                })
			}

		})
	}
	
	disableSureEventClick() {
		let formData = this.props.form.getAllFormValue(this.formId);
		let finalData = {
			isEnable: false,
			list: []
		}
		let dataObj = {
			pk_bankaccbas: formData.rows[0].values.pk_bankaccbas.value,
			pk_custbank: formData.rows[0].values.pk_custbank.value,
			pk_cust: formData.rows[0].values.pk_cust.value
		}
		finalData.list.push(dataObj)
		ajax({
			url: enableUrl,
			data: finalData,
			success: res => {
				this.getdata(dataObj.pk_custbank,dataObj.pk_bankaccbas,dataObj.pk_cust,()=>{
                    toast({ color: 'success', title: this.state.json['10140CBAE-000008'] });/* 国际化处理： 停用成功！*/
                })
			}

		})
	}
	output(type=''){
		// let allData = this.props.table.getAllTableData(tableId);
		// let pks = [];

		let formData = this.props.form.getAllFormValue(this.formId);
		// pk_bankaccbas: formData.rows[0].values.pk_bankaccbas.value,
		// 	pk_custbank: formData.rows[0].values.pk_custbank.value,
		// 	pk_cust: formData.rows[0].values.pk_cust.value

        // pks.push(this.props.getUrlParam('pk_custbank'))
		// pks.push(this.props.getUrlParam('pk_bankaccbas'))
		// pks.push(this.props.getUrlParam('pk_cust'))
		let pks = this.props.getUrlParam('id').split('_')

        // pks.push(formData.rows[0].values.pk_custbank.value);
		// pks.push(formData.rows[0].values.pk_bankaccbas.value);
		// pks.push(formData.rows[0].values.pk_cust.value);
        //原NC两个节点使用同一个打印模板，轻量端暂时也不做区分，传同一个编码
        if(type === "print"){
            //打印
            print(
                'pdf',
                printUrl,
                {
                    funcode: funcode,     //功能节点编码
                    nodekey: 'custcard',     //模板节点标识
                    oids:pks,
                    outputType:type
                }
            )
		}
		//输出
		if(type === "output"){
		this.setState({
			pks: pks
			},this.refs.printOutput.open());	
		}		

    }
	
    pageInfoClick=(props, pk)=>{

		let params = pk.split('_')
        this.getdata(...params,() => {
			props.setUrlParam(pk)

        // let data = {
        //     "pk": pk,
        //     "pageid": pageId
        // };
        // ajax({
        //     url: queryCardUrl,
        //     data: data,
        //     success: (res) =>{
        //         if (res.data.head) {
                    
        //             props.form.setAllFormValue({ [formId]: res.data.head[formId] });
        //             props.setUrlParam(pk)//动态修改地址栏中的id的值
        //         }
        //         if (res.data.body) {
        //             props.editTable.setTableData(tableId, res.data.body[tableId]);
        //         }
        //     }
        });
    }


    afterEvent =(props, moduleId, key,value, changedrows, i, s, g)=>{}

	//通过单据id查询单据信息
	getdata = (pk_custbank,pk_bankaccbas,pk_cust,callback = null) =>{
	// getdata = (pk_custbank,pk_bankaccbas,pk_cust) =>{
		let data = {pk_custbank,pk_bankaccbas,pk_cust};
		ajax({
			url: queryCardUrl,
			data,
			success: (res) => {
				if (res.data.head) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					let title_code = res.data.head[this.formId].rows[0].values[titleCode].value;
					this.setState({title_code});
				}
				if (res.data.body) {
					let isDefault = res.data.body[this.tableId].rows[0].values.isdefault
					if(isDefault && isDefault.value == 'Y') {
						res.data.body[this.tableId].rows[0].values.isdefault.value = true
						res.data.body[this.tableId].rows[0].values.isdefault.display = false
					}
					else if(isDefault) {
						res.data.body[this.tableId].rows[0].values.isdefault.value = false
						res.data.body[this.tableId].rows[0].values.isdefault.display = false
					}
					else {
						res.data.body[this.tableId].rows[0].values.isdefault = {
							value: false,
							display: false
						}
					}
					// setTimeout(() => {
						this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
						let totalcount = this.props.cardTable.getNumberOfRows(this.tableId);
					// }, 0);
					// let arr = this.props.cardTable.getAllRows(this.tableId);
					let applycount = 0;
					// arr.map((item)=>{
					// 	applycount += parseInt(item.values.pk_project.value);
					// })
					this.setState({applycount});
					this.setState({totalcount});

					//更新按钮状态
					let enableState = res.data.head[this.formId].rows[0].values.enablestate.value
					// let buttonStatus = {}
					// if(enableState == 2) {
					// 	buttonStatus.Enable = true
					// 	buttonStatus.Disable = false
					// }
					// else {
					// 	buttonStatus.Enable = false
					// 	buttonStatus.Disable = true
					// }
					// this.props.button.setButtonDisabled(buttonStatus)
					if(enableState == 2) {
						// this.props.button.setButtonVisible(['Enable'],false)
						// this.props.button.setButtonVisible(['Disable'],true)
						this.props.button.setButtonDisabled({
							Enable: true,
							Disable: false
						})
					} else {
						// this.props.button.setButtonVisible(['Enable'],true)
						// this.props.button.setButtonVisible(['Disable'],false)
						this.props.button.setButtonDisabled({
							Enable: false,
							Disable: true
						})
					}
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
			setObj.display = record.values.pk_region.display
			props.cardTable.setValByKeyAndIndex(this.tableId,index,'pk_region.name',setObj)
			record.values.pk_region.display = value.refcode										
		}
	}

	//保存单据
	// saveClick = () =>{
	// 	this.props.editTable.filterEmptyRows(tableId);
	// 	let CardData = this.props.createMasterChildData(pageId, this.formId, this.tableId);
	// 	delete CardData.head[formId].rows[0].values[childValues]
	// 	// CardData.head.head.rows[0].values.bill_code = _this.state.bill_code;
	// 	let url = saveUrl;//新增保存
	// 	if (this.props.getUrlParam('status') === 'edit') {
	// 	  url = updateUrl;//修改保存
	// 	}
	// 	ajax({
	// 		url: url,
	// 		data: CardData,
	// 		success: (res) => {
	// 			let pk_value = null
	// 			if (res.success) {
	// 				if (res.data) {
	// 					if (res.data.head && res.data.head[this.formId]) {
	// 						this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
	// 						pk_value = res.data.head[this.formId].rows[0].values[pk_item].value
	// 					}
	// 					if (res.data.body && res.data.body[this.tableId]) {
	// 						this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId])
	// 					}
	// 				}
	// 				toast({content : "保存成功",color : 'success'});
	// 				this.props.linkTo('../card/index.html', {
	// 					status: 'browse',
	// 					id: pk_value
	// 				})
	// 				toggleShow(this.props)
	// 			}
	// 		}
	// 	})
	//   }

	//删除单据
	delConfirm = () => {
		ajax({
			url: deleteUrl,
			data: {
				deleteinfo: [
					{
						id: this.props.getUrlParam('id'),
						ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
					}
				]
			},
			success: (res) => {
				if(res){
					this.props.pushTo('/list',{
						pagecode: pageIdList
					});
					// this.props.linkTo('../list/index.html');
				}
				
			}
		});
	};

	// modelSave = (props)=>{
	// 	props.cardTable.closeModel(this.tableId);
	// 	this.saveClick();
	// }

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
					{/* {status == 'browse' ?<div><span className="definition-search-title">详细信息 | 总计：</span>
						<span className = 'count'>{this.state.totalcount}</span><span>条</span>
					<span>		申请数量 ：</span>
						<span className='count'>{this.state.applycount}</span><span>this.state.json['10140CBAE-000019']</span></div>:<span className="definition-search-title">ddd</span>} *//* 国际化处理： 个*/}
				</div>
				<div className="definition-icons">
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
	render() {
		let { cardTable, form, button, modal, cardPagination,BillHeadInfo} = this.props;
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
		const {createBillHeadInfo} = BillHeadInfo; //新加 返回图标和按钮
		return (
			<div  id='nc-bill-card'>
					<div className="nc-bill-card">
						<div className="nc-bill-top-area nc-bill-top-area-new-node">
						<NCAffix>
								<NCDiv  areaCode={NCDiv.config.HEADER}>
							<div className='nc-bill-header-area'>
									<div className='header-title-search-area' >
										{createBillHeadInfo(
											{
												title:this.state.json['10140CBAE-000020'] ,
												initShowBackBtn:this.state.backVisible,
												backBtnClick:this.buttonClick.bind(this,this.props,'Back')
											}
										)}
									{/* {this.state.backVisible?<NCBackBtn className='title-search-detail' onClick={ this.buttonClick.bind(this,this.props,'Back') }></NCBackBtn>:''} */}
										{/* <NCBackBtn className='title-search-detail' style={{display: this.state.backVisible ? 'inline' : 'none'}}
												onClick={ this.buttonClick.bind(this,this.props,'Back') }></NCBackBtn> */}
										{/* <h2 style={{marginLeft: -20}} className='title-search-detail' fieldid ={this.state.json['10140CBAE-000020']+'_title'}>{this.state.json['10140CBAE-000020']}{status=='browse'?`：${this.state.title_code}`:''}</h2> */}
									</div>
									<span className="bill-info-code" style={{fontSize: '16px',
                            			marginLeft: '8px',
                            			lineHeight: '32px',
                            			verticalAlign: 'baseline'}}>{(status=='browse' && this.state.title_code) ?`: ${this.state.title_code}`:""}</span>
									{/*分页 */}
									{/* {status=='browse'?<div className='header-button-cardPagination'>
										{createCardPagination({	handlePageInfoChange: pageInfoClick.bind(this)})}
										</div>:''} */}
									<div className="header-button-area">
										{createButtonApp({
											area: 'card_head',//按钮注册中的按钮区域
											//buttonLimit: 5, 
											onButtonClick: this.buttonClick.bind(this) 
											//popContainer: document.querySelector('.header-button-area')
										})}
										{createCardPagination({
											handlePageInfoChange: this.pageInfoClick.bind(this)
										})}
									</div>
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
							{this.getTableHead()}
							{createCardTable(this.tableId, {
								tableHead: this.getTableHead.bind(this),
								// modelSave: this.modelSave.bind(this),
								onAfterEvent: this.onCardTableAfterEvent.bind(this),
								showIndex:true,
								showCheck: true
							})}
						</div>
						</div>
						{/* {createModal('delete', {
							title: "注意",
							content: '确认删除？',
							beSureBtnClick: this.delConfirm
						})} */}

						{/* {createModal('enable',{
							title: '确认启用',
							content: '是否确认要启用？',
							beSureBtnClick: this.enableSureEventClick.bind(this)
						})}

						{createModal('disable',{
							title: '确认停用',
							content: '是否确认要停用？',
							beSureBtnClick: this.disableSureEventClick.bind(this)
						})} */}

						<PrintOutput
							ref = 'printOutput'
							url = {printUrl}
							data = {{
								funcode: funcode,      //功能节点编码，即模板编码
								nodekey: 'custcard',     //模板节点标识
								oids: this.state.pks,    //或['1001A41000000000A9LR','1001A410000000009JDD']  单据pk  oids含有多个元素时为批量打印,
								outputType: "output"
							}}
							//callback={this.onSubmit}
						>
						</PrintOutput>
					</div>
			</div>
			
		);
	}
}

Card = createPage({
	initTemplate: initTemplate,
    mutiLangCode: '10140CBAE'
})(Card);


// ReactDOM.render(<Card />, document.querySelector('#app'));
export default Card


//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65