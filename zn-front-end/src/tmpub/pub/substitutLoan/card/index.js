/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/



import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base ,toast ,getMultiLang} from 'nc-lightapp-front';
import axios from 'axios';
import { buttonClick, initTemplate, afterEvent, beforeEvent} from './events';
const { NCModal, NCScrollElement,NCFormControl,NCDropdown, NCMenu,NCCheckbox} = base;





class SubstitutLoanCard extends Component {
	constructor(props) {
		super(props);
		this.formId = 'head';
		this.moduleId = '36010SUBLOAN'; //模块id
		this.tableId = 'body';
		this.pageId = '36010SUBLOAN_C01';

		this.state = { 
			currentLocale: 'zh-CN',
			showSubCardData:[],
			keyWord:null,
			checked:{
				billno:true,
				contractno:false,
				contractname:false,
				FinancingVarieties:false,
				finorg:false,
				loanmny:false,
                enddate:false
			},
			json:{}
		};

		//initTemplate.call(this, props);
		this.close = this.close.bind(this);
      // this.open = this.open.bind(this);

	}


	close() {
		this.setState({ showmodal: false });
	}

	open() {
			this.setState({ showmodal: true });
	}

	componentWillMount() {
		let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
			// 将多语资源存储到页面级缓存中
			//saveMultiLangRes(this.props,json);
			if (status) {
				initTemplate.call(this, this.props, json, inlt) // 如模板内也有多语处理，平台推荐模板加载操作放于此处， 在取到json多语资源后用传参的方式传入intemplate模板函数中
				this.setState({json, inlt})       // 保存json和inlt到页面state中并刷新页面
			} else {
				//console.log(this.state.json['36070BBM-000018'])   // 未请求到多语资源的后续操作
			}
		}
		// getMultiLang({ 
		// 	moduleId: {
		// 		[ 'tmpub']:['3601'],
		// 		['cmp']: [APPCODE, '36070']
		// 	}, 
		// callback });
	}
	componentDidMount () {  
		// 对数据每次都是去后台查，不做两次查询一样不去后台查询的控制
		// 因为有些业务会在本页面做操作后再次联查余额，控制了就会导致余额不变，不满足业务
		// 需要每次都重新加载
		// this.props.table.setAllTableData(TABLE_BBM_ZF01, {rows:[]});
		this.setState(
			{
				showSubCardData:this.props.showSubCardData
			}, () => {
				//this.initData();
			}
		);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.showmodal && nextProps.showmodal!== this.props.showmodal) { // 
			//initTemplate.call(this, this.props);
			let need = true;
			this.setState(
				{
					showSubCardData:nextProps.showSubCardData
				}, () => {
				
					this.initData();
				}
			);

			this.initData();
		}

	}
	initData = () => {
        //给表头的字段设置
		this.props.form.setFormItemsValue('head', { 'availablemny': { value: this.props.availablemny} });
		let search=this.props.searchData;
		let queryData = {
			pk_org: search&&search.pk_org,
			srcEvent:search&&search.sreEvent,
			matching:false 
		};
		ajax({
			url: '/nccloud/tmpub/pub/substitutLoan.do',
			data: queryData,
			success: (res) => {
				let {success,data} = res;
				if (success) {
					if (data) {
						this.props.editTable.setTableData(this.tableId, data[this.tableId]);
						//默认选中
						let checkedData = this.props.editTable.getAllData('body').rows;
						let IndexChecked=this.props.IndexChecked;
						let checked=[];
					   if(checkedData&&checkedData.length>0){
						  
						for(let i=0;i<checkedData.length;i++){
							   let  bill_no=checkedData[i].values.financebillno;
							   if(IndexChecked&&bill_no){
                                   let val=bill_no.value
								   if (  val in  IndexChecked){
									this.props.editTable.setValByKeyAndRowId('body',checkedData[i].rowid,'submny',{value: IndexChecked[val]});
									checked.push(i);
							   }
						   }

					  }
					}
					//获取数据计算金额
					let checkData = this.props.editTable.getAllRows('body');
					let subTatalMny=parseInt(0);
					for (let item of checkData) {
						if (item.values.submny&&item.values.submny.value) {
						   subTatalMny+=parseInt(item.values.submny.value);
						}
					}
					this.props.form.setFormItemsValue('head', { 'subtotalmny': { value: subTatalMny } });
					let availablemny=this.props.form.getFormItemsValue('head', 'availablemny').value;
					let unsubmny=parseInt(availablemny)-subTatalMny;
					this.props.form.setFormItemsValue('head', { 'unsubtotalmny': { value:unsubmny } });
					   
				
					this.props.editTable.selectTableRows('body', checked, true);

						this.props.editTable.setStatus('body', 'edit');
						this.props.form.setFormStatus('head', 'edid');
					} else {
						this.props.editTable.setTableData(this.tableId, {
							rows: []
						});
					}
				}else {
					this.props.editTable.setTableData(this.tableId, {
						rows: []
					});
				}
			}
		});
	};

	initMatching = (value) => {
		let test=this.state.checked;
        //给表头的字段设置
		this.props.form.setFormItemsValue('head', { 'availablemny': { value: this.props.availablemny} });
		let search=this.props.searchData;
		let queryData = {
			pk_org: search&&search.pk_org,
			srcEvent:search&&search.sreEvent,
			matching:true ,
			matchData:this.state.checked,
			keyWord:value
		};
		ajax({
			url: '/nccloud/tmpub/pub/substitutLoan.do',
			data: queryData,
			success: (res) => {
				let {success,data} = res;
				if (success) {
					if (data) {
						this.props.editTable.setTableData(this.tableId, data[this.tableId]);
						//默认选中
						let checkedData = this.props.editTable.getAllData('body').rows;
						let IndexChecked=this.props.IndexChecked;
						let checked=[];
					   if(checkedData&&checkedData.length>0){
						  
						for(let i=0;i<checkedData.length;i++){
							   let  bill_no=checkedData[i].values.financebillno;
							   if(IndexChecked&&bill_no){
                                   let val=bill_no.value
								   if (  val in  IndexChecked){
									this.props.editTable.setValByKeyAndRowId('body',checkedData[i].rowid,'submny',{value: IndexChecked[val]});
									checked.push(i);
							   }
						   }

					  }
					}
					//获取数据计算金额
					let checkData = this.props.editTable.getAllRows('body');
					let subTatalMny=parseInt(0);
					for (let item of checkData) {
						if (item.values.submny&&item.values.submny.value) {
						   subTatalMny+=parseInt(item.values.submny.value);
						}
					}
					this.props.form.setFormItemsValue('head', { 'subtotalmny': { value: subTatalMny } });
					let availablemny=this.props.form.getFormItemsValue('head', 'availablemny').value;
					let unsubmny=parseInt(availablemny)-subTatalMny;
					this.props.form.setFormItemsValue('head', { 'unsubtotalmny': { value:unsubmny } });
					   
				
					this.props.editTable.selectTableRows('body', checked, true);

						this.props.editTable.setStatus('body', 'edit');
						this.props.form.setFormStatus('head', 'edid');
					} else {
						this.props.editTable.setTableData(this.tableId, {
							rows: []
						});
					}
				}else {
					this.props.editTable.setTableData(this.tableId, {
						rows: []
					});
				}
			}
		});
	};

	//保存单据
	saveBill = () => {
		let checkData = this.props.editTable.getAllRows('body');
		let  recordIndexs = [];
	   
		 for (let item of checkData) {
		 	if (item.values.submny&&item.values.submny.value) {
				recordIndexs.push(item);
		 	}
		 }
		 
		if(recordIndexs.length>=0){
			this.close();
			this.props.onSureClick(recordIndexs);
		}else{
			this.close();
		}
	};
			
	getData = (searchData) => {
		
		
	};
  
	close = () => {
		this.setState({
			showSubCardData:[]
		},()=>{
			this.props.onCloseClick();
		})
	}
	


	onSearchChange = (text) => {

	  this.setState(
		{keyWord:text}

	  )
	  if (text) {
		// 有值搜索
		this.interval = new Date().getTime();
		let s = setTimeout(() => {
			// 停止输入0.5s后执行
			if (new Date().getTime() - this.interval >= 500) {
				if (this.state.keyWord) {
					this.initMatching(text);
				
				}
			}
			clearTimeout(s);
		}, 500);
      
	}
}


	onMatchSearch = () => {

		if(this.state.keyWord){

			this.initMatching(this.state.keyWord);
		}
	}
	
	handleBlur = (value, e) => {
	  if(value){
		this.initMatching(value);


	  }
	};

	
	changeCheck = (code,value) => {
		
		this.setState({
		 checked: {
		    ...this.state.checked,
		    [code]: value
	   }	
		},()=>{
		
		})
			  
	}
	 DataListConfig=()=> {
		
		return[
		 	{code:'billno',name:'放款编号',value:'',position:'first'},
         	{code:'contractno',name:'融资合同编号',value:'',position:'first'},
			{code:'contractname',name:'合同名称',value:'',position:'first'},
			{code:'FinancingVarieties',name:'融资品种',value:'',position:'first'},
			{code:'finorg',name:'融资机构',value:'',position:'first'},
			{code:'loanmny',name:'放款金额',value:'',position:'first'},
			{code:'enddate',name:'结束日期',value:'',position:'first'},
	
		]	
		// return list.filter(item => item.show);
	}
	
	
	dropDownMenu = () => {
		return (<NCMenu>
			{this.DataListConfig.call(this).map((item) => {
			return (<NCMenu.Item   
				fieldid="Output"
				key={item.code} 
			>  
			<NCCheckbox 
			   defaultChecked={this.state.checked[item.code]}
			   onChange={(value)=>{this.changeCheck(item.code,value)}}
			   checked={this.state.checked[item.code]}
			   >{item.name}</NCCheckbox>
			</NCMenu.Item>)
			})}
		</NCMenu>);


	}
	  /**
     * 获取当前选中行的item对象。
     * @param {*} value 
     */
    // onSelect({key,item}){ 
	// 	//console.log(`${key} selected`); //获取key
	// 	let currentObject = item.props.data; //获取选中对象的数据
	// 	//console.log(currentObject); 
	//   }
	render() {
		
		const { cardTable, form, cardPagination, button,editTable } = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const buttons = this.props.button.getButtons();
		const { createForm } = form;
		const { createCardTable } = cardTable;
		const { createEditTable } = editTable;
		
		
		const { createButton,createButtonApp } = button;


		return (
			<div>
				<NCModal fieldid="zuofei_title"
					show={this.props.showmodal} 
					style={{width: '80%',height:'100%' }}
					size='lg'
					onHide = {
						this.close
					}
					>
			
					<NCModal.Header closeButton>
                    	<NCModal.Title>{'置换信息'}</NCModal.Title>
                	</NCModal.Header>

					<NCModal.Body size = "sm">
					<div className="refer-search-table-input"  	style={{width: '18%',position:"relative"}}>
					<NCFormControl className="search-input grid-input-for-tab-sequence u-form-control md"  
					   type="search" 
					   value={this.state.keyWord}
					   onChange={this.onSearchChange}
					   onSearch={this.handleBlur}
					   onblur={this.onMatchSearch}/>   

                 <NCDropdown
						trigger={['click']}
						overlay={this.dropDownMenu.call(this)}
						animation="slide-up"
						placement="bottomLeft"
						overlayClassName="dropdown-component-list"
						>
						<span style={{position:"absolute",top:"4px",right:"20px"}} className="search-setting iconfont icon-shezhi" > </span>
						</NCDropdown>
							 
			    </div>
				
					<div className="nc-bill-card">
							<div className="nc-bill-form-area">
								{createForm(this.formId, {
									expandArr: [ this.formId],
									//onBeforeEvent: beforeEvent.bind(this),
									onAfterEvent: afterEvent.bind(this)
								})}
							</div>
					
							<div className="nc-bill-table-area">
								{createEditTable(this.tableId, {
									// tableHead: this.getTableHead.bind(this, buttons, this.tableId),
									// modelSave: ()=>{
									// 	this.saveBill();
									// 	this.props.cardTable.closeModel(TABLE_BBM_ZF01);
									// },
									onAfterEvent: afterEvent.bind(this),
									onBeforeEvent: beforeEvent.bind(this),
									showCheck: true,
									showIndex: true,
									hideSwitch:true,
									onSelected: (props, moduleId,record, index) => {
										let test=this.props.editTable.getStatus('body');	
										props.editTable.setEditableRowKeyByIndex('body', index, 'submny', true)
										 }
									// onSelectedAll: this.buttonUsability.bind(this),
									// modelAddRowBefore:()=> {},
									// modelAddRow: (props, moduleId, index) => {	
									// 		index = Number(index) + Number(1);
									// 		addline(props, BBR_CONST.DataArr, index);	
									//  }
								})}
							</div>
				</div>
					</NCModal.Body>
					<NCModal.Footer>
							{createButtonApp({
								area: 'card_head',
								buttonLimit: 3,
								onButtonClick: buttonClick.bind(this)
							})}
            </NCModal.Footer>
				</NCModal>
			</div>
		);
	}
}

export default createPage({
	// mutiLangCode: '360701OB'
	// initTemplate: initTemplate
})(SubstitutLoanCard);


/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/