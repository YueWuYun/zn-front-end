//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX
import { ajax, toast,cacheTools } from 'nc-lightapp-front';
let treeTableId = 'resaprofitcenter';
export default function (props) {
	let callback = (json, status, inlt) => { // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
		if (status) {
			props.createUIDom(
				{
					pagecode: '10100PFC_listView',//页面id
				},
				function (data) {
					if (data) {
						if (data.button) {
							let button = data.button;
							props.button.setButtons(button);
						}
						if (data.template) {
							debugger
							let meta = data.template;
							modifierMeta(props, meta, json);
							props.meta.setMeta(meta);
							let hasSearched = cacheTools.get("hasSearched");
							let searchVal =cacheTools.get("searchParams");
							if(hasSearched&&hasSearched==1){
								let qdata = {
									pageid: "10100PFC_listView",
									filter: searchVal
								};
								debugger
								ajax({
									url:"/nccloud/uapbd/profitcenter/querylistdata.do",
									method:"post",
									data:qdata,
									success:function(res){
										if(res.success){
											if(res.data){//返回全新的数据 刷新界面
												//后台返回的是表格的数据  需要构造成树状表的数据
												let datas =  props.treeTableManyCol.createNewData(res.data.grid.resaprofitcenter.rows);
												//根据树状表的数据构造树表
												props.treeTableManyCol.initTreeTableData('resaprofitcenter',datas,'refpk');
											}else{
												props.treeTableManyCol.emptyAllData('resaprofitcenter');
											}
							
										}	
									}
								});

							}else{
                                //清空数据
								props.treeTableManyCol.emptyAllData(treeTableId);

							}

						}
					}
				}
			);
		} else {
			console.log('未加载到多语资源')   // 未请求到多语资源的后续操作
		}
	}
	props.MultiInit.getMultiLang({ moduleId: "resa-profitcenter", domainName: 'uapbd', callback })
}

function modifierMeta(props, meta, json) {
	//树表添加操作列
	let event = {
		attrcode: 'opr',
		label: json['10100RESA-000018'],/* 国际化处理： 操作*/
		itemtype: 'customer', //自定义按钮列必须设置 itemtype: 'customer'
		width: 200,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let tableBtnAry = ['Editline', 'Delline'];
			return (
				props.button.createOprationButton(
					tableBtnAry,
					{
						area: "list_inner",
						buttonLimit: 3,
						onButtonClick: (props, id) => tableButtonClick(props, record.key, id, record)
					}
				)
			)
		}
	};
	meta[treeTableId].items.push(event);
	return meta;
}

function tableButtonClick(props, key, id, record) {
	debugger
	switch (id) {
		case 'Editline'://修改
			    props.pushTo('/card', {
				status: 'edit',
				pk_profitcenter: key,
				id:key,
				pagecode: '10100PFC_profitcenter',
			});
			break;
		case 'Delline'://删除
			ajax({
				url: '/nccloud/uapbd/profitcenter/delprofitcenter.do',
				data: { pk_profitcenter: key, ts: record.values.ts.value},
				success: (res) => {
					if (res.success) {
						toast({ color: 'success', title: this.state.json['10100BOSB-000017'] });/* 国际化处理： 删除成功！*/
						props.treeTableManyCol.delRowByPk('resaprofitcenter', record);
					}
				}
			});
			break;
		default:
			break;

	}

}
//pmFWCFu5nhKkBzYmrkBakbkX4wRw2WXUC8GpteVcynma5Q+e7oLMhX8cQgHQ3bwX