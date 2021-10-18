/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast } from 'nc-lightapp-front';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url
} from '../../cons/constant.js';
import refresh from '../../../paybill/list/events/refresh.js';

export default function(props, id) {
	let that = this;
	let org_val = props.form.getFormItemsValue(this.formId, 'pk_org').value;
	let org_display = props.form.getFormItemsValue(this.formId, 'pk_org').display;
	let CardData = props.createMasterChildData('36070PBR_D5_card', this.formId, this.tableId);
	switch (id) {
		case 'save': //保存按钮
			//  props.linkTo('../paybill/card/index.html',{
			//  status:'add'
			this.saveBill();
			break;
		case 'add': //新增按钮
			props.linkTo('../card/index.html', {
				status: 'add'
			});
			that.componentDidMount();
			break;
		//保存新增
		case 'saveadd':
			let CardData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let flag = props.form.isCheckNow(this.formId);
			if (flag) {
				ajax({
					url: '/nccloud/cmp/paybills/save.do',
					data: CardData,
					success: (res) => {
						let pk_paybill = null;
						if (res.success) {
							if (res.data) {
								toast({ color: 'success', content: '保存成功' });
								props.linkTo('../card/index.html', {
									status: 'add'
								});
								that.componentDidMount();
							}
						}
					}
				});
			}

			break;
		case 'edit':
			props.linkTo('../card/index.html', {
				status: 'edit',
				id: props.getUrlParam('id')
			});
			this.toggleShow();
			break;
		//肩部操作
		case 'addline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: '请先填写财务组织！'
				});
				return;
			}
			this.props.cardTable.addRow(this.tableId);
			let rownum = this.props.cardTable.getNumberOfRows('paybilldetail_table');
			//表头赋值给标题
			let dataArr = [
				'pk_currtype',
				'pk_balatype',
				'note_type',
				'pk_tradetypeid',
				'pk_account',
				'pk_oppaccount',
				'objecttype',
				'local_rate',
				'pk_supplier'
			];
			let dataform = this.props.form.getFormItemsValue('head', dataArr);
			dataArr.forEach((val) => {
				let key = val;
				if (props.form.getFormItemsValue(this.formId, key)) {
					let value = props.form.getFormItemsValue(this.formId, key).value;
					let dly = props.form.getFormItemsValue(this.formId, key).display;
					if (value) {
						props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, key, {
							value: value,
							display: dly
						});
						if (key == 'local_rate') {
							//设置本币汇率的编辑性
							let isEdit = props.form.getFormItemsDisabled(this.formId, key);
							if (!isEdit) {
								props.cardTable.setEditableByIndex(this.tableId, rownum - 1, 'local_rate', true);
							}
						}
						if (key == 'pk_account') {
							props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, key, {
								value: value,
								display: null
							});
							props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'accountname', {
								value: dly
							});
						}
					}
				}
			});

			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_currtype', { value:dataform[0].value, display:dataform[0].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_balatype', { value:dataform[1].value, display:dataform[1].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'note_type', { value:dataform[2].value, display:dataform[2].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_tradetypeid', { value:dataform[3].value, display:dataform[3].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_account', { value:dataform[4].value, display:dataform[4].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_oppaccount', { value:dataform[5].value, display:dataform[5].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'objecttype', { value:dataform[6].value, display:dataform[6].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'local_rate', { value:dataform[7].value, display:dataform[7].display});
			//  this.props.cardTable.setValByKeyAndIndex('paybilldetail_table', rownum-1, 'pk_supplier', { value:dataform[8].value, display:dataform[8].display});
			break;
		case 'copyline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: '请先选择财务组织！'
				});
				return;
			}
			// console.log(props.cardTable.getCheckedRows(this.tableId).index);
			let copyRows = props.cardTable.getCheckedRows(this.tableId);
			let dataArray = [];
			let rowNum;
			if (copyRows && copyRows.length > 0) {
				for (let item of copyRows) {
					dataArray.push(item.data);
					rowNum = item.index;
				}
			}
			if (dataArray.length == 0) {
				toast({ color: 'warning', content: '未选择数据!' });
				return;
			}
			props.cardTable.insertRowsAfterindex(this.tableId, dataArray, rowNum + 1);
			break;
		case 'delline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: '请先填写财务组织！'
				});
				return;
			}
			props.cardTable.delRowsByIndex(this.tableId, props.cardTable.getCheckedRows(this.tableId)[0].index);
			break;
		case 'saveBtn': //保存按钮
			if (props.getUrlParam('copyFlag') === 'copy') {
				this.props.form.setFormItemsValue(this.formId, { crevecontid: null });
				this.props.form.setFormItemsValue(this.formId, { ts: null });
			}
			//过滤表格空行
			//props.editTable.filterEmptyRows(this.tableId);
			// let flag = props.form.isCheckNow(this.formId)
			// if (flag) {
			let requestUrl = '/nccloud/cmp/billmanagement/save.do'; //新增保存
			if (props.getUrlParam('status') === 'edit') {
				requestUrl = '/nccloud/cmp/billmanagement/update.do'; //修改保存
			}
			ajax({
				url: requestUrl,
				data: CardData,
				success: (res) => {
					let pk_paybill = null;
					if (res.success) {
						if (res.data) {
							toast({ color: 'success', content: '保存成功' });
							if (res.data.head && res.data.head[this.formId]) {
								this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
								pk_paybill = res.data.head[this.formId].rows[0].values.pk_paybill.value;
							}
							if (res.data.body && res.data.body[this.tableId]) {
								this.props.editTable.setTableData(this.tableId, res.data.body[this.tableId]);
							}
						}
					}
					props.linkTo('../card/index.html', {
						status: 'browse',
						id: pk_paybill
					});
					this.toggleShow();
				}
			});
			break;
		case 'copy': //复制按钮
			props.linkTo('../card/index.html', {
				status: 'edit',
				id: props.getUrlParam('id'),
				copyFlag: 'copy'
			});
			this.toggleShow();
			break;

		case 'delete':
			this.props.modal.show('delete');
			break;
		case 'approveBtn': // 审批
			let datas = {
				billID: this.props.form.getFormItemsValue(this.formId, 'crevecontid').value,
				vtranTypeCode: this.props.form.getFormItemsValue(this.formId, 'vtrantypecode').value
			};
			ajax({
				url: '/nccloud/cplatform/approve/queryhistory.do',
				data: datas,
				success: (res) => {
					if (res.data) {
						this.setState(
							{
								ApproveDetails: res.data
							},
							() => {
								props.modal.show('approve');
							}
						);
					}
				}
			});
			break;
		case 'cancelApproveBtn': // 取消审批
			this.approve('UNAPPROVE');
			break;

		case 'cancel':
			if (props.getUrlParam('status') === 'edit' || props.getUrlParam('status') === 'add') {
				// 表单返回上一次的值
				props.form.cancel(this.formId);
				// 表格返回上一次的值
				props.cardTable.resetTableData(this.tableId);
				props.linkTo('../card/index.html', {
					status: 'browse',
					id: props.getUrlParam('id')
				});
				this.toggleShow();
			}

			break;
		case 'addSenBtn':
			// if(props.form.checkRequired(this.formId)){
			props.cardTable.addRow(this.tableId);
			// }else{
			//     toast({
			//         'color': 'warning',
			//         'content': '请先填写必输项！'
			//     })
			//     return
			// }
			break;
		case 'addRow':
			props.cardTable.addRow(this.tableId);
			break;
		//保存提交
		case 'savecommit':
			let url = '/nccloud/cmp/paybills/savecommit.do';
			if (props.getUrlParam('status') === 'edit') {
				url = '/nccloud/cmp/paybills/editcommit.do';
			}
			let saveComData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let saveComflag = props.form.isCheckNow(this.formId);
			if (saveComflag) {
				ajax({
					url: url,
					data: saveComData,
					success: (res) => {
						let pk_paybill = null;
						if (res.success) {
							if (res.data) {
								toast({ color: 'success', content: '保存提交成功' });
								let sc_pk_paybill = res.data.head['head'].rows[0].values.pk_recbill.value;
								let sc_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
								props.linkTo('../card/index.html', {
									status: 'browse',
									id: sc_pk_paybill,
									billno: sc_billstatue
								});
								that.componentDidMount();
							}
						}
					}
				});
			}
			break;
		//提交
		case 'commit':
			let commitData = {
				pk: this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				pageid: '36070PBR_D5_card'
			};
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: commitData,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: '提交成功' });
						let com_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						let com_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						props.linkTo('../card/index.html', {
							status: 'browse',
							id: com_pk_paybill,
							billno: com_billstatue
						});
						that.componentDidMount();
					}
				}
			});
			break;
		//收回
		case 'uncommit':
			let unComData = {
				pk: this.props.form.getFormItemsValue('head', 'pk_paybill').value,
				pageid: '36070PBR_D5_card'
			};
			ajax({
				url: '/nccloud/cmp/paybills/uncommit.do',
				data: unComData,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: '收回成功' });
						let uncom_pk_paybill = res.data.head['head'].rows[0].values.pk_paybill.value;
						let uncom_billstatue = res.data.head['head'].rows[0].values.bill_status.value;
						props.linkTo('../card/index.html', {
							status: 'browse',
							id: uncom_pk_paybill,
							billno: uncom_billstatue
						});
						that.componentDidMount();
					}
				}
			});
			break;
		case 'Refresh':
			props.linkTo('../card/index.html', {
				status: 'browse',
				id: this.props.form.getFormItemsValue('head', 'pk_paybill').value
			});
			that.componentDidMount();
			break;
		default:
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/