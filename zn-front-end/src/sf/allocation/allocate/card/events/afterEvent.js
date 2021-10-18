/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/
import { ajax, toast,promptBox} from 'nc-lightapp-front';
import { module_id, base_url, card_page_id, card_from_id, card_table_id, card_table_formId } from '../../cons/constant.js';
import { setHeadItemProp,setBodyItemProp} from '../../../../pub/utils/SFAfterEditUtil.js';
import { InsertLine} from '../../../../pub/utils/SFButtonUtil';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
import {buildLightBodyAfterEditData } from "../../../../../tmpub/pub/util/index"

export default function afterEvent(props, moduleId, key,value, changedrows, i, s, g) {
	console.log(props, moduleId, key,value, changedrows, i, s, g)
	let status =props.getUrlParam("status");
	let eventData, newvalue, extParam,oldvalue,data;
	
	if (key === 'pk_org') {
		//获取页面数据
		let eventdata = props.createHeadAfterEventData('36320FA_C01', card_from_id, [card_table_id], card_from_id, key, value);
		//获取编辑的值
		extParam = { 'uiState': status };
		newvalue = eventdata.newvalue?eventdata.newvalue.value:'';
		oldvalue = eventdata.oldvalue?eventdata.oldvalue.value:'';
		// olddisplay=eventdata.oldvalue?eventdata.oldvalue.display:'';
		if(newvalue!=oldvalue){//值未发生改变，直接跳出
			if(oldvalue) {
				// if(!newvalue) {
				// 	this.setState({olddisplay:eventdata.oldvalue.display});
				// }
				this.setState({
					oldorg:oldvalue,
					oldorgdisplay:eventdata.oldvalue.display
				})
				// props.modal.show('changeorg');
				promptBox({
					color: "warning",
					title: loadMultiLang(this.props,'36320FA-000061'),/* 国际化处理： 修改*/
					content: loadMultiLang(this.props,'36320FA-000062'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
					//点击确定按钮事件
					beSureBtnClick: this.changeOrgConfirm.bind(this, data),
					//取消按钮事件回调
					cancelBtnClick: this.cancelBtnClick.bind(this)
				});
				
			}else {
				if(newvalue != undefined){
					console.log(eventdata);
					this.setState({oldorgdisplay:eventdata.newvalue.display});
					props.form.setFormItemsValue(card_from_id,
						{
							'pk_org':{
								value: eventdata.newvalue.value,
								display:eventdata.newvalue.display
							}
						}
					);
					eventdata = props.createHeadAfterEventData('36320FA_C01', card_from_id, [card_table_id], card_from_id, key, value);
					ajax({
						url: '/nccloud/sf/allocation/event.do',
						data:{ 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(eventdata),extParam },
						async:false,
						success: (res) => {
							if(res.success) {
								let { success, data } = res;
								let { card,extParam, headItemProps, bodyItemProps } = data;
								let { head, body } = card;
								let t = { [card_from_id] : head[card_from_id]};
								props.form.setAllFormValue(t);
								
								props.cardTable.updateDataByIndexs(card_table_id, { rows: [] });
								props.form.setFormItemsDisabled(card_from_id,{'memo':false,'busitype':false,'pk_currtype':false,'isreversebustype':false});
								
								let meta= this.props.meta.getMeta();
								meta[card_table_id].items.find((e) => e.attrcode == 'pk_org_r').isShowUnit =true;
								//增行操作
								let busitype=props.form.getFormItemsValue(card_from_id,'busitype').value;
								let pk_org=props.form.getFormItemsValue(card_from_id,'pk_org').value;
								let pk_group=props.form.getFormItemsValue(card_from_id,'pk_group').value;
								let index=0;
								let rows=props.cardTable.getCheckedRows(card_table_id);
								if(rows.length>0) {
									index=rows[rows.length-1].index;
								}else {
									index=props.cardTable.getNumberOfRows(card_table_id)-1;
								}
								InsertLine(props,card_table_id,index);
								//增行的时候给行号赋值
								props.cardTable.setValByKeyAndIndex(card_table_id,0, 'rowno', { value: 10, display:'' });

								index=props.cardTable.getNumberOfRows(card_table_id)-1;
								props.cardTable.setValByKeyAndIndex(card_table_id,index+1,'pk_org',{value:pk_org,display:''});
								props.cardTable.setValByKeyAndIndex(card_table_id,index+1,'pk_group',{value:pk_group,display:''});
								
								if(busitype!=2) {
									props.cardTable.setEditableByIndex(card_table_id,
									[index],'pk_accid_r',false);

								}
								//新增行可点击
								props.button.setButtonDisabled(['addline'], false);
								afterEvent(props,card_from_id,'busitype',busitype);
							}
						},
						error: (res) => {
							// props.form.setFormItemsValue(card_from_id,{'pk_org':{'value':oldvalue,'display':olddisplay}});
							// toast({ color: 'warning', content: res.Error });
							// console.error(res);
							props.form.EmptyAllFormValue(card_from_id);
							props.cardTable.updateDataByIndexs(card_table_id, { rows: [] });
							props.form.setFormItemsDisabled(card_from_id,{'memo':true,'busitype':true,'pk_currtype':true,'isreversebustype':true});
							toast({ color: 'warning', content: res.message });
						}
					});
				}else {
					props.form.EmptyAllFormValue(card_from_id);
					props.cardTable.updateDataByIndexs(card_table_id, { rows: [] });
					props.form.setFormItemsDisabled(card_from_id,{'memo':true,'busitype':true,'pk_currtype':true,'isreversebustype':true});
				}
				
			}
			
		}
		
	}
	//下拨银行账户
	if(key==='pk_bankacc_p') {
		// let eventdata =props.createBodyAfterEventData(card_page_id, card_from_id, [card_table_id], card_table_id,key,changedrows);
		let eventdata = buildLightBodyAfterEditData(props,card_page_id,card_from_id,card_table_id,key,changedrows)
		//获取编辑的值
		newvalue = changedrows[0].newvalue?changedrows[0].newvalue.value:'';
		oldvalue = changedrows[0].oldvalue?changedrows[0].oldvalue.value:'';
		if(newvalue!=oldvalue){//值未发生改变，直接跳出
			
			if(props.cardTable.getValByKeyAndIndex(card_table_id, i, 'pk_bankacc_p').value != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'lightBody', 'eventType': 'card', 'eventData': JSON.stringify(eventdata) },
					async:false,
					success: (res) => {
						if(res.success) {
							let { success, data } = res;
							let { grid, extParam, headItemProps, bodyItems } = data;
							// let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, grid[card_table_id]);
							setBodyItemProp(props, card_table_id, bodyItems, grid);
							if(data.extParam && data.extParam.warning) {
								props.cardTable.setValByKeyAndIndex(card_table_id,i,'pk_bankacc_p',{'value':null,'display':null});
								toast({ color: 'warning', content: res.data.extParam.warning });
							}
							
						}
					}
				});
			}
		}
		
	}
	if(key=='pk_bankacc_r') {
		// data =props.createBodyAfterEventData(card_page_id,card_from_id,[card_table_id],card_table_id,key,changedrows);
		let data = buildLightBodyAfterEditData(props,card_page_id,card_from_id,card_table_id,key,changedrows)
		//获取编辑的值
		newvalue = changedrows[0].newvalue?changedrows[0].newvalue.value:'';
		oldvalue = changedrows[0].oldvalue?changedrows[0].oldvalue.value:'';
		//平台的编辑后事件联动的字段oldvalue的值没有改变，导致再次选择和上次相同的值的时候不会走自己的编辑后事件了
		// if(newvalue!=oldvalue){//值未发生改变，直接跳出
			if(props.cardTable.getValByKeyAndIndex(card_table_id,i,'pk_bankacc_p').value != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'lightBody', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					async:false,
					success: (res) => {
						if(res.success) {
							let { success, data } = res;
							let { grid, extParam, headItemProps, bodyItem} = data;
							// let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, grid[card_table_id]);
							// setBodyItemProp(props, card_table_id, bodyItem,grid);
							if(data.extParam.warning) {
								props.cardTable.setValByKeyAndIndex(card_table_id,i,'pk_bankacc_r',{'value':null,'display':null});
								props.cardTable.setValByKeyAndIndex(card_table_id,i,'bankaccname_r',{'value':null,'display':null});
								toast({ color: 'warning', content: res.data.extParam.warning });
							}
						}
					}
				});
			}
		// }
		
	}
	if(key=='isnetpay') {
		// data =props.createBodyAfterEventData(card_page_id,card_from_id,[card_table_id],card_table_id,key,changedrows);
		let data = buildLightBodyAfterEditData(props,card_page_id,card_from_id,card_table_id,key,changedrows)
		//获取编辑的值
		newvalue = data.newvalue?data.newvalue.value:'';
		oldvalue = data.oldvalue?data.oldvalue.value:'';
		if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			if(props.cardTable.getValByKeyAndIndex('table_allocate_01',i,'isnetpay').value != undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'lightBody', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					async:false,
					success: (res) => {
						if(res.success) {
							let { success, data } = res;
							let { grid, extParam, headItemProps, bodyItem } = data;
							// let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, grid[card_table_id]);
							//设置pk_accid（收款单位内部账户）编辑性
							// setBodyItemProp(props, card_table_id, bodyItem, grid);
							let isnetpay=props.cardTable.getValByKeyAndIndex('table_allocate_01',i,'isnetpay').value;
							if(isnetpay) {
								props.cardTable.setEditableByIndex(card_table_id, i, 'paytype', true);
								props.cardTable.setEditableByIndex(card_table_id, i, 'issamebank', true);
								props.cardTable.setEditableByIndex(card_table_id, i, 'issamecity', true);
							}else {
								props.cardTable.setEditableByIndex(card_table_id, i, 'paytype', false);
								props.cardTable.setEditableByIndex(card_table_id, i, 'issamebank', false);
								props.cardTable.setEditableByIndex(card_table_id, i, 'issamecity', false);
							}

							//新增行可点击
							props.button.setButtonDisabled(['addline'], false);
						}
					}
				});
			
			}
		}
		
		
	}
	//交易类型
	if(key=='busitype') {
		debugger;
		data =props.createHeadAfterEventData(card_page_id,card_from_id,[card_table_id],card_from_id,key,changedrows);
		//获取编辑的值
		extParam = { 'uiState': status };
		newvalue = data.newvalue?data.newvalue.value:'';
		oldvalue = data.oldvalue?data.oldvalue.value:'';
		// if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			let busitype=value;
			if(!busitype) {
				busitype=props.form.getFormItemsValue(card_from_id,'busitype').value
			}
			if( busitype!= undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(data),extParam },
					async:false,
					success: (res) => {
						debugger;
						if(res.success&&res.data) {
							let { success, data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
							if(bodyItemProps) {
								setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);
							}
							//判断交易类型是中心下拨吗，不是的话收款单位参照改为财务组织-资金管控
							if(busitype!='2') {
								let meta = props.meta.getMeta();
								meta[card_table_id].items.find((e) => e.attrcode == 'pk_org_r').refCode ='../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';
								meta[card_table_formId].items.find((e) => e.attrcode == 'pk_org_r').refCode ='../../../../../uapbd/refer/org/FundManaSystemMemberByFinancePKTreeRef';
							}
							//制空收款单位
							let indexs=props.cardTable.getNumberOfRows(card_table_id);
							for(let i=0;i<indexs;i++) {
								props.cardTable.setValByKeyAndIndex(card_table_id,i,'pk_org_r',{value:null,display:null});
								props.cardTable.setValByKeyAndIndex(card_table_id,i,'pk_accid_r',{value:null,display:null});
							}
						}
						
					},
					error: (res) => {
						debugger;
						props.form.setFormItemsValue(card_from_id,{'busitype':{'value':null,'display':null}});
						toast({ color: 'warning', content: res.message });
						return;
					}
					
				});
			}
		// }
		
	}

	//币种
	if(key=='pk_currtype') {
		data =props.createHeadAfterEventData(card_page_id,card_from_id,[card_table_id],card_from_id,key,changedrows);
		//获取编辑的值
		extParam = { 'uiState': status ,'pk':props.getUrlParam('id')};
		if(props.form.getFormItemsValue(card_from_id,'pk_currtype').value != undefined){
			ajax({
				url: '/nccloud/sf/allocation/event.do',
				data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(data),extParam },
				async:false,
				success: (res) => {
					if(res.success&&res.data) {
						let { success, data } = res;
						let { card, extParam, headItemProps, bodyItemProps } = data;
						let { head, bodys } = card;
						if(!g) {
							props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
							props.cardTable.setTableData(card_table_id, bodys[card_table_id]);
						}
						let rows=props.cardTable.getNumberOfRows(card_table_id);
						for(let index=0;index<rows;index++) {
							if(!g) {
								//清除表体某些字段的值
								props.cardTable.setValByKeyAndIndex(card_table_id,index,'pk_bankacc_p',{value:'',display:''});
								props.cardTable.setValByKeyAndIndex(card_table_id,index,'bankname_p',{value:'',display:''});
								props.cardTable.setValByKeyAndIndex(card_table_id,index,'pk_bankacc_r',{value:'',display:''});
								props.cardTable.setValByKeyAndIndex(card_table_id,index,'bankaccname_r',{value:'',display:''});
								props.cardTable.setValByKeyAndIndex(card_table_id,index,'pk_accid_r',{value:'',display:''});
							}
							let tableItemProps = bodyItemProps[card_table_id];
							if (tableItemProps == undefined) {
								return;
							}
							let flag='';
							for (let i = 0; i < tableItemProps.length; i++) {
								if (tableItemProps[i].editable === 'true') {
									flag = false;
								} else {
									flag = true;
								}
								// 设定每行的可编辑行 setEditableByRowId,目前方法不好使 等待平台张横修复  xuhrc 2018-7-30
								props.cardTable.setEditableByIndex(card_table_id,
									index,
									tableItemProps[i].itemName,
									flag);
							}
						}
						
					}
				
				},
				error: (res) => {
					props.form.setFormItemsValue(card_from_id,{'pk_currtype':{'value':null,'display':null}});
					// toast({ color: 'warning', content: res.Error });
					// console.error(res);
					toast({ color: 'warning', content: res.message });
				}
				
			});
		}
		
		
	}
	//收款单位
	if(key=='pk_org_r') {
		let data =props.createBodyAfterEventData(card_page_id,card_from_id,[card_table_id],card_table_id,key,changedrows);
		// let data = buildLightBodyAfterEditData(props,card_page_id,card_from_id,card_table_id,key,changedrows)

		//获取编辑的值
		newvalue = data.newvalue?data.newvalue.value:'';
		oldvalue = data.oldvalue?data.oldvalue.value:'';
		if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			let busitype=props.form.getFormItemsValue(card_from_id,'busitype');
			debugger;
			if(!busitype||!busitype.value) {
				toast({
					'color': 'warning',
					'content': loadMultiLang(this.props,'36320FA-000000')/* 国际化处理： 交易类型为空*/
				  });
				return;
			}else {
				if(props.cardTable.getValByKeyAndIndex('table_allocate_01',i,'pk_org_r').value != undefined){
					ajax({
						url: '/nccloud/sf/allocation/event.do',
						data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(data) },
						async:false,
						success: (res) => {
							if(res.success) {
								let { success, data } = res;
								let { card, extParam, headItemProps, bodyItemProps } = data;
								let { head, bodys } = card;
								// props.cardTable.setTableData(card_table_id,bodys[card_table_id]);
								props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							}
						}
					});
				}
			}
			
		}
		
	}
	//冲销业务
	if(key=='isreversebustype') {
		data =props.createHeadAfterEventData(card_page_id,card_from_id,[card_table_id],card_from_id,key,changedrows);
		//获取编辑的值
		newvalue = data.newvalue?data.newvalue.value:'';
		oldvalue = data.oldvalue?data.oldvalue.value:'';
		if(newvalue==oldvalue){//值未发生改变，直接跳出
			console.log(data);
			let isreversebustype=data.newvalue.value;
			if( isreversebustype!= undefined){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'head', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					async:false,
					success: (res) => {
						if(res.success) {
							let{data}=res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head,bodys } = card;
							props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
							props.cardTable.setTableData(card_table_id, bodys[card_table_id]);
							//设置pk_accid（收款单位内部账户）编辑性
							setBodyItemProp(props, card_table_id, bodyItemProps, bodys[0]);
							//新增行可点击
							props.button.setButtonDisabled(['addline'], false);
						}
					}
				});
			}
		}
		
	}

	if(key=='amount') {
		let data=props.createBodyAfterEventData(card_page_id,card_from_id,[card_table_id],card_table_id,key,changedrows);
		// let data = buildLightBodyAfterEditData(props,card_page_id,card_from_id,card_table_id,key,changedrows)
		//获取编辑的值
		newvalue = changedrows[0].newvalue?changedrows[0].newvalue.value:'';
		oldvalue = changedrows[0].oldvalue?changedrows[0].oldvalue.value:'';
		if(newvalue!=oldvalue){//值未发生改变，直接跳出
			
			let amount=props.cardTable.getValByKeyAndIndex('table_allocate_01',i,'amount').value;
			let isreversebustype=props.form.getFormItemsValue('form_allocate_01','isreversebustype').value;
			if(amount&&isreversebustype) {
				if(amount>0) {
					toast({
						'color': 'warning',
						'content': loadMultiLang(this.props,'36320FA-000001')/* 国际化处理： 冲销业务只能输入负数*/
					  });
					return;
				}
			}else {
				if(amount<0) {
					toast({
						'color': 'warning',
						'content': loadMultiLang(this.props,'36320FA-000002')/* 国际化处理： 金额必须大于0*/
					  });
					return;
				}
			}
			if(amount){
				ajax({
					url: '/nccloud/sf/allocation/event.do',
					data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(data) },
					async:false,
					success: (res) => {
						if(res.success) {
							let { success, data } = res;
							let { card, extParam, headItemProps, bodyItemProps } = data;
							let { head, bodys } = card;
							props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
							let tableItemProps = bodyItemProps[card_table_id];
							if (tableItemProps == undefined) {
								return;
							}
							let flag='';
							for (let j = 0; j < tableItemProps.length; j++) {
								if (tableItemProps[j].editable === 'true') {
									flag = false;
								} else {
									flag = true;
								}
								// 设定每行的可编辑行 setEditableByRowId,目前方法不好使 等待平台张横修复  xuhrc 2018-7-30
								props.cardTable.setEditableByIndex(card_table_id,
									i,
									tableItemProps[j].itemName,
									flag);
							}
						}
					}
				});
			}
		}
	}
	//本币汇率
	if (key === 'olcrate') {
		// let data = buildLightBodyAfterEditData(props,card_page_id,card_from_id,card_table_id,key,changedrows)
		let data = props.createBodyAfterEventData(card_page_id,card_from_id,[card_table_id],card_table_id,key,changedrows);
		let olcrate=props.cardTable.getValByKeyAndIndex('table_allocate_01',i,'olcrate').value;
		if(olcrate){
			ajax({
				url: '/nccloud/sf/allocation/event.do',
				data: { 'eventPosition': 'body', 'eventType': 'card', 'eventData': JSON.stringify(data) },
				async:false,
				success: (res) => {
					if(res.success) {
						let { success, data } = res;
						let { card, extParam, headItemProps, bodyItemProps } = data;
						let { head, bodys } = card;
						//更新表单数据
						// props.form.setAllFormValue({ [card_from_id]: head[card_from_id] });
						//更新表体数据				
						// props.cardTable.setTableData(card_table_id, bodys[card_table_id]);

						props.cardTable.updateDataByRowId(card_table_id, bodys[card_table_id]);
						
						setBodyItemProp(props, card_table_id, bodyItemProps, bodys);
						// begin zhangjp tm 精简单行更新
						// props.cardTable.updateDataByRowId(card_table_id,grid[card_table_id])
						//end
						//设置表头字段属性
						// setHeadItemProp(props, card_from_id, headProp);
						
					}
				}
			});
		}
	}

	if (key === 'cmaterialvid') {
		let materialsNew = value;
		console.log(materialsNew)
		if(materialsNew && materialsNew.length>1){
			props.cardTable.setValByKeyAndIndex(moduleId,i,key,{value:materialsNew[0].refpk,display:materialsNew[0].refname});
			for(let i=1;i<materialsNew.length;i++){
				props.cardTable.addRow(moduleId);
				let ll = props.cardTable.getNumberOfRows(moduleId);
				props.cardTable.setValByKeyAndIndex(moduleId, ll-1,key,{value:materialsNew[i].refpk,display:materialsNew[i].refname});
			}
		}
	}
	//表体编辑后事件
    if(key == 'fconfirmpoint'){
		let data = buildLightBodyAfterEditData(props,card_page_id,card_from_id,card_table_id,key,changedrows)	
	}
}

/*OWmq6Ugo6jPE4W7xoi1UXuJPaACCzBOL2WpAibaKrtAqnyarvwfXI5HqhDrIQ9qG*/