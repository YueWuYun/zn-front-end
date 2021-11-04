//Qocn/nd3z5wTHiy4erZts7dFBSEX5mAdkmRkEDSEb0Wg0rRW+u3j246lJYfO6yK1
 import {tableId, dataSource,pagecode} from '../constants';
 import { ajax,cardCache,toast,promptBox } from 'nc-lightapp-front';
 let { setDefData, getDefData } = cardCache;
 //刷新按钮
 export const refreshFun = function(that,props,flag) {
	 queryData(that,props,flag);
	 that.clickRow=0;
}

 //新增按钮
 export const addFun = function(that,props) {
	// that.setState({
	// 	tabActiveKey:'ActMatchDom'
	// })
	// props.button.setMainButton('resa_Add',false) 
	props.editTable.setStatus(tableId, 'edit');
	toggleShow(that,props);
	//获取数据条数
	let rownum=props.editTable.getNumberOfRows(tableId);
	props.editTable.addRow(tableId,rownum,true);	
 }

 //修改按钮
 export const editFun = function(that,props) {
	props.editTable.setStatus(tableId, 'edit');
	toggleShow(that,props);
  }

  //保存按钮
  export const saveFun = function(that,props) {
	//表进行判空过滤
	that.props.editTable.filterEmptyRows(tableId,['numberindex']);
	let changedData = props.editTable.getChangedRows(tableId);
	let alldata= props.editTable.getAllRows(tableId);
	let result=props.editTable.checkRequired(tableId, alldata);
	if(result==false || changedData===undefined || changedData===null){
		return;
	}

	let dataIndex=[];
	for(let i=0;i<changedData.length;i++){
		dataIndex.push(changedData[i].values.numberindex.value);
	}

	let data = {
		pageid:pagecode,
		model: {
				areaType: 'table',
				pageinfo: null,
				rows: changedData
		},
	};
	ajax({
		url: '/nccloud/uapbd/controlarea/ControlareaSaveAction.do',
		data: data,
		success: (res) => {
			//由于返回的vo没有修改人修改时间等  所以做一次查询
			if (res.success){
				props.editTable.setStatus(tableId,'browse')
				toast({ color: 'success', content: that.state.json['38200CA-000016']});/* 国际化处理： 保存成功!*/
				var visiblerows = props.editTable.getVisibleRows(tableId);
				setDefData(tableId, dataSource, visiblerows);
				refreshFun(that,props,null);
				toggleShow(that,props);
			}
		}
	})
  }

//行删除
export const deleteLineFun = function(that,props,record,index) {

	let  status=props.editTable.getStatus(tableId);
	if(status == 'edit' || status  == 'add'){
		props.editTable.deleteTableRowsByIndex(tableId, index);
		judgeLastData(props,tableId);
	}else{
		let dataArr= [{
			status: '3',
			values: {
				ts: {
					display: that.state.json['38200CA-000007'],/* 国际化处理： 时间戳*/
					value:record.values.ts.value,
				},
				pk_controlarea: {
					value:record.values.pk_controlarea.value,
					display: that.state.json['38200CA-000008'],/* 国际化处理： 主键*/
				}
			}
		}];

		let data = {
			pageid:pagecode,
			model: {
				areaType: 'table',
				pageinfo: null,
				rows: dataArr
			}
		};
		ajax({
			url: '/nccloud/uapbd/controlarea/ControlareaSaveAction.do',
			data: data,
			success: (res) => {
				let {success,data} =res;
				if (success) {
					refreshFun(that,props,null);
					toast({ color: 'success', content: that.state.json['38200CA-000013'] });/* 国际化处理： 删除成功！*/
					var visiblerows1 = props.editTable.getVisibleRows(tableId);
					setDefData(tableId, dataSource, visiblerows1);
					toggleShow(that,props);
				}
			}
		});

	}
}

//取消按钮
export const cancelFun = function(that,props) {
	promptBox({
		'color': 'warning',  
		'title': that.state.json['38200CA-000014'],/* 国际化处理： 提示*/
		'content': that.state.json['38200CA-000015'],/* 国际化处理： 是否取消？*/
		beSureBtnClick:()=>{
			// props.button.setMainButton('resa_Add',true) 
			// props.editTable.setStatus(tableId,'browse',refreshFun(that,props,null));
			props.editTable.setStatus(tableId,'browse');
			// var visiblerows4=getDefData(tableId, dataSource);
			// if(!visiblerows4){
			// 	props.editTable.setTableData(tableId, { rows: [] });
			// }else{
			// 	props.editTable.setTableData(tableId, { rows: visiblerows4 });
			// }
			refreshFun(that,props);
			toggleShow(that,props);
		}
	});
}

/**
 * 查询价格影响因数定义数据,并更新表格数据
 */
export const queryData=(that,props,flag)=>{
	let data = {
		pagecode:pagecode, //页面id
		queryInfo:null
	};
	ajax({
		url: '/nccloud/uapbd/controlarea/ControlareaQueryAction.do',
		data: data,
		success: function(res) {
			let { success, data } = res;
			if (data) {
				that.props.editTable.setTableData(tableId, res.data[tableId]);
			} else {
				that.props.editTable.setTableData(tableId,{ rows: [] });
			}
			var visiblerows5 = 	that.props.editTable.getVisibleRows(tableId);
			setDefData(tableId, dataSource, visiblerows5);
			if(flag=='Refresh'){
				toast({ title: that.state.json['38200CA-000003'], color: 'success' });/* 国际化处理： 刷新成功*/
			}
		}
	});
}

 //更改按钮状态
 export const toggleShow = function(that,props) {
	let  status=props.editTable.getStatus(tableId);
	if(status=='add'||status=='edit'){
		props.button.setButtonVisible(['resa_Save','resa_Cancel'], true);
		props.button.setButtonVisible(['resa_Edit','Refresh','resa_link'], false);
		that.props.button.setPopContent('resa_Delete_inner',null) /* 国际化处理： 确认要删除该信息吗？*/
		// props.button.setMainButton('resa_Add',false) ;
		// props.button.setMainButton('resa_Save',true) 
	}else{
		props.button.setButtonVisible(['resa_Save','resa_Cancel'], false);
		props.button.setButtonVisible(['resa_Edit','Refresh','resa_link'], true);
		that.props.button.setPopContent('resa_Delete_inner',that.state.json['38200CA-000000']) /* 国际化处理： 确认要删除该信息吗？*/
		// props.button.setMainButton('resa_Add',true) ;
		// props.button.setMainButton('resa_Save',false) 
	}	

	//获取数据
	let rownum=props.editTable.getNumberOfRows(tableId);
	let flag=false
	if(rownum == 0){
		flag=true
	}
	props.button.setButtonDisabled({
		resa_Edit:flag,
		resa_RelLiabilityCenter:flag,
		resa_RelFinanceOrg:flag,
		resa_RelFactory:flag,
		resa_RelProjectOrg:flag,
		resa_RelLiabilityBook:flag,
	});
}

//当删除到最后一行的时候  修改按钮不可编辑
function judgeLastData(props,tableId){
	let remaindatas=props.editTable.getVisibleRows(tableId)
	if (remaindatas.length>0) {
		props.button.setButtonDisabled({edit: false });
	}else{
		props.button.setButtonDisabled({edit: true });
	}
}
//打开弹出框
export function relRelMenue(){
	this.setState({
		modalOne: true
	})
}

//验证当前行数据是否有权限设置账簿类型
export function checkSelectData(){
	let flag=true;
	const pk_controlarea=this.props.editTable.getValByKeyAndIndex(tableId,this.clickRow,'pk_controlarea').value;
	const pk_setofbook=this.props.editTable.getValByKeyAndIndex(tableId,this.clickRow,'pk_setofbook').value;
	let data={
		pk_controlarea:pk_controlarea,
		pk_setofbook:pk_setofbook
	}
	ajax({
		url: '/nccloud/uapbd/controlarea/IsSetofBookModidyAction.do',
		data: data,
		async:false,
		success: function(res) {
			let {success,data}=res;
			if(success && data){
				flag=true;
			}else{
				flag=false;
			}
		}
	});
	return flag;
}

//更新账簿类型
export function updateSetOfBook(){
	let that=this;
	const pk_controlarea=this.props.editTable.getValByKeyAndIndex(tableId,this.clickRow,'pk_controlarea').value;
	const pk_setofbook=this.props.editTable.getValByKeyAndIndex(tableId,this.clickRow,'pk_setofbook').value;
	if(this.selectRefer && this.selectRefer.refpk == pk_setofbook)return;

	let data={
		pk_setofbook:this.selectRefer?this.selectRefer.refpk:null,
		pk_controlarea:pk_controlarea
	}
	ajax({
		url: '/nccloud/uapbd/controlarea/UpdateSetOfBookSaveAction.do',
		data: data,
		async:false,
		success: function(res) {
			let {success,data}=res;
			if(success && data){
				// that.props.editTable.setValByKeyAndIndex(tableId,that.clickRow,'pk_setofbook',{value:that.selectRefer.refpk,display:that.selectRefer.refname});
				queryData.call(that,that,that.props)
			}
		}
	});
}

/**
 * 验证数据能否编辑
 * @param {*} that 
 * @param {*} props 
 * @param {*} data 
 */
export function beforeEditCheckData(that,props,data){
	let flag=true;
	ajax({
		url: '/nccloud/uapbd/controlarea/BeforeEditAction.do',
		data: data,
		async:false,
		success: function(res) {
			let {success,data}=res;
			if(success ){
				flag=data;
			}
		}
	});
	return flag;
}
//Qocn/nd3z5wTHiy4erZts7dFBSEX5mAdkmRkEDSEb0Wg0rRW+u3j246lJYfO6yK1