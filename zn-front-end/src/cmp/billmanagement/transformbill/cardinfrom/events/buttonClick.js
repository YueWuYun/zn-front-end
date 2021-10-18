/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	ajax,
	toast,
	promptBox
} from 'nc-lightapp-front';
import {
	constant,
	requesturl
} from '../../config/config';

import Sign from '../../../../../tmpub/pub/util/ca';

export default async function (props, id) {

	const formcode1 = constant.formcode1;

	const cardpath = constant.cardpath;
	// 单据类型
	const billtype = constant.billtype;

	let that = this;

	// 对数据进行签名加密
	async function signdata(signdata) {
		let ressigndata = await Sign({
			isSign: true,
			isKey: false,
			data: signdata,
			encryptVOClassName: constant.encryptVOClassName,
			head: 'form'
		});
		if (ressigndata.isStop) {
			return;
		}
		return ressigndata.data;
	}

	switch (id) {

		// 修改
		case 'editBtn':
			props.pushTo(cardpath, {
				pagecode: constant.cpagecode,
				status: 'edit',
				id: props.getUrlParam('id')
			});
			this.renderHtmlByStatus();
			break;

			// 保存
		case 'saveBtn':
			let savedata = props.createFormAfterEventData(this.pageId, this.formId);
			let flag = props.form.isCheckNow(this.formId);
			// ca签名
			savedata = await signdata(savedata);
			if (savedata) {
				savedata.form.userjson = savedata.userjson;
				if (flag) {
					ajax({
						url: requesturl.save,
						data: savedata,
						success: (res) => {
							if (res.success) {
								toast({
									color: 'success',
									content: this.state.json['36070TBR-000000'] /* 国际化处理： 保存成功*/
								});
								let id = res.data[formcode1].rows[0].values.pk_transformbill.value
								this.pageTransition(id, 'browse');
							}
						}
					});
				}
			}

			break;

			// 取消
		case 'cancelBtn':
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070TBR-000019'], // 弹框表头信息/* 国际化处理： 确认取消*/
				content: this.state.json['36070TBR-000020'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认是否取消?*/
				beSureBtnClick: this.cancelModalBeSure.bind(this), // 确定按钮点击调用函数,非必输
				// cancelBtnClick: this.cancelModalCancel.bind(this), // 取消按钮点击调用函数,非必输
			})
			break;

		case 'quitinfromBtn':
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070TBR-000079'], // 弹框表头信息/* 国际化处理： 确认取消*/
				content: this.state.json['36070TBR-000080'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认是否取消?*/
				beSureBtnClick: this.quitinfromBeSure.bind(this), // 确定按钮点击调用函数,非必输
				// cancelBtnClick: this.quitinfromCancel.bind(this), // 取消按钮点击调用函数,非必输
			})

			break;

		default:
			break;
	}
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/