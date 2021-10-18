/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	ajax,
	base,
	toast,
	print,
	promptBox,
	output
} from 'nc-lightapp-front';
import {
	constant,
	requesturl
} from '../../config/config';

import {
	saveBtn,
	saveaddBtn,
	savesubmitBtn
} from '../btnClicks/btnClick';
import {
	checkinput
} from '../checkinput/checkinput';

export default function (props, id) {

	const formcode1 = constant.formcode1;
	const cpagecode = constant.cpagecode;
	const cardpath = constant.cardpath;
	const appcode = constant.appcode;
	// 联查src
	//const linksrc = constant.linksrc;
	// 单据类型
	//const billtype = constant.billtype;

	// 组装验证公式请求数据
	function savevalidateData(areacode) {
		let billdata = props.form.getAllFormValue(formcode1);
		let validateData = {
			pageid: cpagecode,
			model: {
				areacode: areacode,
				rows: billdata.rows,
				areaType: 'form'
			}
		}
		return validateData;
	}

	switch (id) {

		//新增
		case 'addBtn':
			let addid = props.getUrlParam('id');
			props.pushTo(cardpath, {
				status: 'add',
				addid: addid
			});
			this.renderHtmlByStatus();
			break;

		//修改
		case 'modifyBtn':
			let editid = props.getUrlParam('id');
			if (!editid) {
				editid = this.props.form.getFormItemsValue(this.formId, 'pk_autoinform').value;
			}
			let status = 'edit';
			props.pushTo(cardpath, {
				status: status,
				id: editid
			});
			this.renderHtmlByStatus();
			break;


		//删除
		case 'deleteBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070AGR-000008'], // 弹框表头信息/* 国际化处理： 删除*/
				content: this.state.json['36070AGR-000009'], //弹框内容，可以是字符串或dom/* 国际化处理： 确定要删除吗?*/
				beSureBtnClick: this.delConfirm.bind(this),   // 确定按钮点击调用函数,非必输
			})
			break;


		//启用
		case 'startBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070AGR-000054'], // 弹框表头信息/* 国际化处理： 启用*/
				content: this.state.json['36070AGR-000055'], //弹框内容，可以是字符串或dom/* 国际化处理： 确定要启用所选数据吗？?*/					
				beSureBtnClick: this.startConfirm,   // 确定按钮点击调用函数,非必输					
			})

			//this.startConfirm();

			break;

		//停用
		case 'stopBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070AGR-000059'], // 弹框表头信息/* 国际化处理： 启用*/
				content: this.state.json['36070AGR-000060'], //弹框内容，可以是字符串或dom/* 国际化处理： 确定要启用所选数据吗？?*/					
				beSureBtnClick: this.stopConfirm,   // 确定按钮点击调用函数,非必输					
			})
			break;


		// 保存
		case 'saveBtn':
			let flag = props.form.isCheckNow(constant.formcode1);
			if (flag) {
				let savedata2 = savevalidateData(constant.formcode1);
				let saveobj = {};
				saveobj[formcode1] = 'form';
				props.validateToSave(savedata2, saveBtn.bind(this, props), saveobj, '');
			}
			break;

		//保存新增
		case 'saveaddBtn':
			let flag2 = props.form.isCheckNow(this.formId);
			if (flag2) {
				if (checkinput.call(this, props)) {
					let saveadddata = savevalidateData();
					let saveobj = {};
					saveobj[formcode1] = 'form';
					props.validateToSave(saveadddata, saveaddBtn.bind(this, props), saveobj, '');
				}
			}
			break;

		// 刷新
		case 'refreshBtn':
			let autoinform = props.form.getFormItemsValue(this.formId, 'pk_autoinform').value;
			let data = {
				pk: autoinform,
				pageCode: this.pageId
			};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.buttonAfter(res.data);
							toast({
								color: 'success',
								content: this.state.json['36070AGR-000058']/* 国际化处理： 刷新成功*/
							});
						}
					} else {
						this.props.form.setAllFormValue({
							[this.formId]: {
								rows: []
							}
						});
					}
				}
			});
			break;


		// 取消
		case 'cancelBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070AGR-000014'], // 弹框表头信息/* 国际化处理： 确认取消*/
				content: this.state.json['36070AGR-000015'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认是否取消?*/
				noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定", // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消", // 取消按钮名称, 默认为"取消",非必输
				hasCloseBtn: false, //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.cancelModalBeSure.bind(this), // 确定按钮点击调用函数,非必输
				cancelBtnClick: this.cancelModalCancel.bind(this), // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			})
			break;


		// 返回
		case 'backBtn':
			props.pushTo(constant.listpath);
			break;


		default:
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/