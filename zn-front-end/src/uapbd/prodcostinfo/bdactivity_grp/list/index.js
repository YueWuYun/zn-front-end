//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, ajax, base,pageTo ,toast,getMultiLang,promptBox, print,output} from 'nc-lightapp-front';
import { buttonClick, initTemplate,buttonVisible,bodyBeforeEvent,bodyAfterEvent,tableButtonClick} from './events';
import {tableId,multiLangCode,module,nodeType,billtype,funcode,nodekey,pageId} from './constants';
const { NCCheckbox,NCDiv } = base;

class SingleTable extends Component {
	constructor(props) {
		super(props);
		this.tableId = tableId;
		this.nodeType =nodeType;
		this.pageId =  props.getSearchParam("p");
		this.Info = {
			allButtonsKey :[],//保存所有的按钮
			targetKeys:'',//材料价格来源穿梭框右边的值
			dataSource:[],//材料价格来源穿梭框左边的值
			index : null,//当前选中行号
		}
		this.state={
			transfershowModal:false,//穿梭框是否显示
			checked:false,//是否显示失效
			disabled:false,//控制参照是否可以编辑
			json:{}
		}
	}
	componentDidMount() {
		let callback = (json) => {
			this.setState({json:json},() => {
				initTemplate.call(this, this.props,this.getTableData);
			});
		}
		getMultiLang({moduleId:[multiLangCode],domainName :module,currentLocale:'simpchn',callback});
	}

	//请求列表数据
	getTableData = (btnName) => {
		ajax({
			url: '/nccloud/uapbd/bdactivity/querytabledata.do',
			data: {
				appcode: this.props.getSearchParam("c"),
				isLegal: this.state.checked,
				nodeType : this.nodeType
			},
			success: (res) => {
				if(btnName == 'Refresh'){
					toast({ color: 'success', content: this.state.json['10140ACTG-000003'] });/* 国际化处理： 刷新成功*/
				}
				if (res.data) {
					this.props.editTable.setTableData(this.tableId, res.data[this.tableId]);
				}else{
					this.props.editTable.setTableData(this.tableId, {rows: []});
				}
				this.toggleShow();
			}
		});

	};

	//保存数据
	save = () =>{
		
		let status = this.props.editTable.getStatus(this.tableId);
		let newRows = [];
		if(status == 'browse'){//如果是浏览态就是走删除的逻辑
			let checkRows = this.props.editTable.getCheckedRows(this.tableId);
			let newCheckRows = JSON.parse(JSON.stringify(checkRows));
			let delIndex =[];
			newCheckRows.forEach(item => {//需要删除的行
				delIndex.push(item.index)
			});
			let allRows = this.props.editTable.getAllRows(this.tableId);
			let newallRows = JSON.parse(JSON.stringify(allRows));
			newallRows.forEach((item,index) => {
				if (delIndex.indexOf(index)!=-1) {
					item.status ='3' //上面拷贝一份，防止修改了原来界面的数据
				}
				newRows.push(item);
			});	
		}else{//保存的逻辑
			let allRows = this.props.editTable.getAllRows(this.tableId);
			//过滤空白行
			allRows.forEach(item => {
				//编码存在的话，不为新增的，就可以走保存的逻辑
				if (item.values.vactivitycode.value || item.status !='2') {
					newRows.push(item);
				}
			});
			//必输项检验
			if(!this.props.editTable.checkRequired(this.tableId, newRows)){
				return;
			}
		}
		let newBodyData = {
            model : {
                rows:newRows
            },
            pageid : this.pageId
		}
		let callback = () => {
		ajax({
			url: '/nccloud/uapbd/bdactivity/save.do',
			// data: newBodyData,
			data: {
				grid: newBodyData,
			},
			success: (res) => {
				if (res.success) {
					if(status == 'browse'){
						toast({ color: 'success', content: this.state.json['10140ACTG-000013']});/* 国际化处理： 删除成功*/
					}else{
						toast({ color: 'success', content: this.state.json['10140ACTG-000014']});/* 国际化处理： 保存成功*/
					}
					//保存成功重新查询一遍数据
					this.props.editTable.setStatus(this.tableId,'browse');
					this.getTableData();
				}
			}
		});
	}
		    //保存前数据校验
		this.props.validateToSave(newBodyData, callback, { table1: 'editTable' }, 'grid');

	}


	
//启用
enableFun =(flag,pk,index1) =>  {
	let checkedObj=[];
	let that=this;
	if(flag=='batch'){//批量
		let checkedData = that.props.editTable.getCheckedRows(that.tableId);
		if(!checkedData || checkedData.length==0){
			toast({ content: `${that.state.json['10140ACTG-000017']}`, color: 'warning' });/* 国际化处理： 没有选择需要启用的数据，请重新选择！*/
			return;
		}
			checkedData.forEach((val) => {
				checkedObj.push({
					pk_bill: val.data.values['cactivityid'].value,
					ts: val.data.values.ts.value,
					index: val.index,
					pageId: that.props.getSearchParam('p')
				});
			});

			promptBox({
				color: 'warning',
				title: that.state.json['10140ACTG-000020'],
				content: that.state.json['10140ACTG-000019'],/* 国际化处理： 您确定要启用所选数据吗？*/
				beSureBtnClick: function() {
				ajax({
					url: '/nccloud/uapbd/bdactivity/enablestate.do',
					data: checkedObj,
					success: function(res) {
						let { success, data } = res;
						//提示操作结果
						if (data.message) {
							toast({
								duration: 'infinity',
								color: data.PopupWindowStyle,
								content: data.message,
							})
						}
						//更改数据
							if (data&&data.grid) {
								let grid = data.grid;
								let updateValue = [];
								for (let key in grid) {
									updateValue.push({ index: key, data: { values: grid[key].values } })
								}
									that.props.editTable.updateDataByIndexs(that.tableId, updateValue);
									// toast({ title: that.state.json['10140ACTG-000029'], color: 'success' });/* 国际化处理： 启用成功*/
						}
						// 页面新数据放入缓存中
					}
				});
			   }
			})
	}else if(flag=='single'){//行操作
			// checkedData.forEach((val) => {
				checkedObj.push({
					pk_bill: pk,
					// ts: val.data.values.ts.value,
					index: index1,
					pageId: that.props.getSearchParam('p')
				});
			// });
		ajax({
			url: '/nccloud/uapbd/bdactivity/enablestate.do',
			data: checkedObj,
			success: function(res) {
				let { success, data } = res;
					if (data&&data.grid) {
						let grid = data.grid;
						let updateValue = [];
						for (let key in grid) {
							updateValue.push({ index: key, data: { values: grid[key].values } })
						}
						that.props.editTable.updateDataByIndexs(that.tableId, updateValue);
							toast({ title: that.state.json['10140ACTG-000022'], color: 'success' });/* 国际化处理： 启用成功*/
				}
				// 页面新数据放入缓存中
			}
		});
	}


	return;
}
//禁用
disableFun =(flag,pk,index1) =>  {
	let checkedObj=[];
	let  that =this;
	if(flag=='batch'){//批量
		let checkedData = that.props.editTable.getCheckedRows(that.tableId);
		if(!checkedData || checkedData.length==0){
			toast({ content: `${that.state.json['10140ACTG-000027']}`, color: 'warning' });/* 国际化处理： 没有选择需要停用的数据，请重新选择！*/
			return;
		}
			checkedData.forEach((val) => {
				checkedObj.push({
					pk_bill: val.data.values['cactivityid'].value,
					ts: val.data.values.ts.value,
					index: val.index,
					pageId: that.props.getSearchParam('p')
				});
			});
		promptBox({
			color: 'warning',
			title: that.state.json['10140ACTG-000020'],
			content: that.state.json['10140ACTG-000018'],/* 国际化处理： 您确定要停用所选数据吗？*/
			beSureBtnClick: function() {
			ajax({
				url: '/nccloud/uapbd/bdactivity/disablestate.do',
				data: checkedObj,
				success: function(res) {
					let { success, data } = res;
					//提示操作结果
						if (data.message) {
							toast({
								duration: 'infinity',
								color: data.PopupWindowStyle,
								content: data.message,
							})
						}
					//更改数据
						if (data&&data.grid) {
							let grid = data.grid;
							let updateValue = [];
							for (let key in grid) {
								updateValue.push({ index: key, data: { values: grid[key].values } })
							}
							that.props.editTable.updateDataByIndexs(that.tableId, updateValue);
						}
					// 页面新数据放入缓存中
					}
				});
			}
		})
	}else if(flag=='single'){//行操作
			// checkedData.forEach((val) => {
				checkedObj.push({
					pk_bill: pk,
					// ts: val.data.values.ts.value,
					index: index1,
					pageId: that.props.getSearchParam('p')
				});
			// });
			ajax({
				url: '/nccloud/uapbd/bdactivity/disablestate.do',
				data: checkedObj,
				success: function(res) {
					let { success, data } = res;
						if (data&&data.grid) {
							let grid = data.grid;
							let updateValue = [];
							for (let key in grid) {
								updateValue.push({ index: key, data: { values: grid[key].values } })
							}
							that.props.editTable.updateDataByIndexs(that.tableId, updateValue);
							toast({ title: that.state.json['10140ACTG-000023'], color: 'success' });/* 国际化处理： 禁用成功*/
						}
					// 页面新数据放入缓存中
				}
			});
	}
	return;
}


/**
 * 打印
 */
 onPrint = ()=>{
	let that=this;
	let rows = that.props.editTable.getCheckedRows(that.tableId);
	let index1 = [];
	rows.forEach((ele, index) => {
        let pk = ele.data.values['cactivityid'];
		index1.push(pk.value);
	});
	if (index1.length == 0) {
		toast({ content: `${that.state.json['10140ACTG-000024']}，${that.state.json['10140ACTG-000025']}！`, color: 'warning' });/* 国际化处理： 未选中任何行,不允许操作打印*/
		return;
	}
	print(
		'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
		'/nccloud/uapbd/bdactivity/print.do', //后台服务url
		{
			billtype: billtype, //单据类型
			funcode: funcode, //功能节点编码，即模板编码
			nodekey: nodekey, //模板节点标识
			oids: index1, // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
			// userjson: billtype //单据类型,billtype不是必需字段，后台没有设置接收字段，以userjson代替
		}
	);
};
/**
  * 打印输出
  */
onOutput = ()=>{
	let that=this;
	let rows = that.props.editTable.getCheckedRows(that.tableId);
	let index1 = [];
	rows.forEach((ele, index) => {
		let pk = ele.data.values['cactivityid'];
		index1.push(pk.value);
	});
	if (index1.length == 0) {
		toast({ content: `${that.state.json['10140ACTG-000024']}，${that.state.json['10140ACTG-000026']}！`, color: 'warning' });/* 国际化处理： 未选中任何行,不允许操作打印输出*/
		return;
	} // 在你想要触发的事件里面调用output方法，必须传的参数有data， 选择传的参数有url（要打印调用的后台接口），callback（打印后的回调函数）
	output({
		url: '/nccloud/uapbd/bdactivity/printoutput.do',
		data: {
			outputType: 'output', //输出类型
			funcode: funcode, //功能节点编码，即模板编码
			nodekey: nodekey, //模板节点标识
			oids: index1 // 功能节点的数据主键 
		},
	});
};



	//新增行
	addLine = (autoFocus) =>{
		let flag = true;
		let tableData = this.props.editTable.getAllRows(this.tableId);
		for(let i =0 ; i<tableData.length ; i++){
			if(tableData[i].status != "3"){
				flag = false;
				break;
			}
		}
		ajax({
			url: '/nccloud/uapbd/bdactivity/addline.do',
			data: {
				flag:flag,
				pageId :this.pageId
			},//获取form表单中的pk_org,集团节点为空,
			success: (res) => {
				let {data} = res;
					if (data) {
						// this.props.editTable.addRow(this.tableId,undefined,autoFocus,data[this.tableId].rows[0].values);
						this.props.editTable.addRow(this.tableId);
						
					}
				}
		});
	}


	//控制按钮
	toggleShow = () => {
		let status = this.props.editTable.getStatus(this.tableId);
		if (!status) {
			status = 'browse';
		}
		let trueBtn = []; //可见的按钮
		let falseBtn = []; //不可见的按钮
		for (let i = 0; i < this.Info.allButtonsKey.length; i++) {
			let flag = buttonVisible.call(this,this.props,status,this.Info.allButtonsKey[i]);
			if (flag) {
				trueBtn.push(this.Info.allButtonsKey[i]);
			} else {
				falseBtn.push(this.Info.allButtonsKey[i]);
			}
		}
		let disabledtrue =[];//不可操作按钮
		let disabledfalse =[];//可操作按钮
		let checkRows = this.props.editTable.getCheckedRows(this.tableId);
		if(checkRows.length == 0){
			disabledtrue.push('Delete');			
		}else{
			disabledfalse.push('Delete');	
		}
		let alldata = this.props.editTable.getAllRows(this.tableId);
		if(!alldata || alldata.length == 0){
			disabledtrue.push('Edit');
		}else{
			disabledfalse.push('Edit');
		}
		if(status == 'browse'){//控制删除提示框
			this.props.button.setPopContent('Delete_inner', this.state.json['10140ACTG-000006']);/* 国际化处理： 确定删除吗？*/
		}else{
			this.props.button.setPopContent('Delete_inner', null);
		}
		this.props.button.setButtonVisible(trueBtn, true);
		this.props.button.setButtonVisible(falseBtn, false);
		this.props.button.setButtonDisabled(disabledtrue, true);
		this.props.button.setButtonDisabled(disabledfalse, false);
		//跟新参照的可编辑性状态
		if(status == 'browse'){//浏览态参照可以修改
			//设置新增按钮颜色
			this.props.button.setMainButton('Add',true);
			if(this.state.disabled!=false){
				this.setState({disabled:false})
			}
		}else{//编辑态参照不可以修改
			this.props.button.setMainButton('Add',false);
			if(this.state.disabled!=true){
				this.setState({disabled:true})
			}
		}
	};
	
	onRowClick =(props, moduleId ,record, index,e)=>{
		//this.Info.record = record;
		this.toggleShow();
	}
	//点击是否失效
	changeCheck =() =>{
		this.state.checked = !this.state.checked 
		this.getTableData();
	}


	
	render() {
		let { table, button, search ,cardTable} = this.props;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		let { createEditTable } = this.props.editTable;
		let { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				<NCDiv areaCode={NCDiv.config.HEADER}>
				<div className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createBillHeadInfo({
							title: this.state.json['10140ACTG-000000'],//国际化处理： 成本类型-集团
							initShowBackBtn: false
							})}
						{this.state.disabled ? null ://参照可编辑的时候才可以看到该框
							<div className="title-search-detail" style={{lineHeight:'30px'}}>
								<NCCheckbox
									checked={this.state.checked}
									onChange={this.changeCheck}>
									{this.state.json['10140ACTG-000004']}</NCCheckbox>
							</div>
						}

					</div>
					<div className="header-button-area">
						{createButtonApp({
							area: 'list_head_area',
							buttonLimit: 3,
							onButtonClick: buttonClick.bind(this),
							popContainer: document.querySelector('.header-button-area')
						})}
					</div>
				</div>
				</NCDiv>
				<div className="nc-bill-table-area">
					{createEditTable(tableId, {
						onSelected: this.onRowClick.bind(this),
						onSelectedAll: this.onRowClick.bind(this),
						onBeforeEvent: bodyBeforeEvent.bind(this),
						onAfterEvent: bodyAfterEvent.bind(this),
						showCheck: true,
						showIndex: true,
						adaptionHeight:true,
					})}
				</div>



			</div>
		);
	}
}

SingleTable = createPage({
	billinfo:{
        billtype: 'grid',
        pagecode: pageId,
        bodycode: tableId
    }
})(SingleTable);

ReactDOM.render(<SingleTable />, document.querySelector('#app'));

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65