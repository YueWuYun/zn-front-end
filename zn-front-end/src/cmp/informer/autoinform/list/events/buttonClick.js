/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	toast,
	getBusinessInfo,
	promptBox,
	ajax
} from 'nc-lightapp-front';
import {
	constant,
	requesturl
} from '../../config/config';
import {
	commondata
} from '../../../../public/utils/constant';

import { submit } from '../btnclick/btnclick';
import {ITEM_INFO,URL_INFO} from '../../cons/constant';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";


const businessInfo = getBusinessInfo();
export default function buttonClick(props, id) {


	// 公共选择数据
	function searchdata() {
		let selectdata = props.table.getCheckedRows(constant.ltablecode);
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36070AGR-000026'] /* 国际化处理： 请选择数据*/
			});
			return;
		}
		return selectdata;
	};

	// 公共设置请求数据(启用、停用)
	function getrequestdata() {
		let selectdata = searchdata();
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		let pkvalue;
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_autoinform.value;
			let ts = val.data.values.ts.value;
			pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = val.index;
			pkvalue = pk;
		});

		//自定义请求数据
		let data = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr,
			pk: pkvalue
		};
		return data;
	}

	switch (id) {
		// 新增
		case 'addBtn':
			props.table.selectAllRows(this.tableId,false);
			props.pushTo(constant.cardpath, {
				status: 'add',
				addsrc: 'list',
				addid: this.state.addid
			});
			break;

			// 修改
		case 'modifyBtn':
			edit.call(this,props);
			break;
			//删除，
		case 'deleteBtn':
			let selectdata = props.table.getCheckedRows(constant.ltablecode);
			//数据校验
			if (selectdata.length == 0) {
				toast({
					color: 'warning',
					content: this.state.json['36070AGR-000026'] /* 国际化处理： 请选择数据*/
				});
				return;
			}
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070AGR-000008'], // 弹框表头信息/* 国际化处理： 删除*/ // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
				content: this.state.json['36070AGR-000009'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要删除吗?*/ // 提示内容,非必输
				// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
				// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.delConfirm.bind(this),   // 确定按钮点击调用函数,非必输
				// cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			})

			break;

			//启用
		case 'startBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070AGR-000054'], // 弹框表头信息/* 国际化处理： 启用*/ // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
				content: this.state.json['36070AGR-000055'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要启用所选数据吗？?*/ // 提示内容,非必输
				beSureBtnClick: this.startConfirm.bind(this),   // 确定按钮点击调用函数,非必输				
			})			
			//this.startConfirm();	
			break;
	
	
			//停用
		case 'stopBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070AGR-000059'], // 弹框表头信息/* 国际化处理： 停用*/ // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
				content: this.state.json['36070AGR-000060'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确定要停用所选数据吗？?*/ // 提示内容,非必输	
				beSureBtnClick: this.stopConfirm,   // 确定按钮点击调用函数,非必输
			})
			break;
	

			//刷新
		case 'refreshBtn':
			this.refreshHtml();
			break;


		// //启用
		// case 'startBtn':
		// 	let resdata = getrequestdata();
		// 	console.log('resdata:', resdata)
		// 	ajax({
		// 		url: requesturl.enable,
		// 		data: resdata,
		// 		success: (res) => {
		// 			let { success } = res;
		// 			if (success) {
		// 				if (res.data) {
		// 					toast({
		// 						color: 'success',
		// 						content: this.state.json['36070AGR-000053']/* 国际化处理： 启用成功*/
		// 					});
		// 					let pk = res.data['form_autoinform_head'].rows[0].values.pk_autoinform.value;
		// 					let updatedataArr = [{
		// 						index: resdata.indexmap[pk],
		// 						data: {
		// 							values: res.data['form_autoinform_head'].rows[0].values
		// 						} //自定义封装数据
		// 					}];
		// 					props.table.updateDataByIndexs(constant.ltablecode, updatedataArr);
		// 				}
		// 			}
		// 		}
		// 	});
		// 	break;
			//提交
		case 'submitBtn':
		businessInfo
			submit.call(this, props, getrequestdata());
			this.emptychoicebox();
			break;
	
	}
}

const edit = function (props){
	let copyData = props.table.getCheckedRows(constant.ltablecode);
	//数据校验
	if (copyData.length == 0) {
		toast({
			color: 'warning',
			content: this.state.json['36070AGR-000026'] /* 国际化处理： 请选择数据*/
		});
		return;
	}
	if (copyData.length != 1) {
		toast({
			color: 'warning',
			content: this.state.json['36070AGR-000027'] /* 国际化处理： 只能选择一条数据!*/
		});
		return;
	}

	let id ,ts;
	copyData.forEach((val) => {
		id = val.data.values.pk_autoinform.value;
		ts = val.data.values.ts.value;
	});
	go2CardCheck({
		props,url:URL_INFO.LIST.LIST2CARD_CHECK,pk:id,ts:ts,fieldPK:ITEM_INFO.PK,actionCode:null,permissionCode:null,checkSaga:false,checkTS:true,go2CardFunc:()=>{
			props.table.selectAllRows(this.tableId,false);
			props.pushTo(constant.cardpath, {
				status: 'edit',
				id: id
			});
		}
	});	
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/