/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast,cacheTools ,print} from 'nc-lightapp-front';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url
} from '../../cons/constant.js';
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';


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
								toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000000') });/* 国际化处理： 保存成功*/
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
					content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000001')/* 国际化处理： 请先填写财务组织！*/
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
					content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000002')/* 国际化处理： 请先选择财务组织！*/
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
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000003') });/* 国际化处理： 未选择数据!*/
				return;
			}
			props.cardTable.insertRowsAfterindex(this.tableId, dataArray, rowNum + 1);
			break;
		case 'delline':
			if (!org_val && !org_display) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000001')/* 国际化处理： 请先填写财务组织！*/
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
							toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000000') });/* 国际化处理： 保存成功*/
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
								toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000004') });/* 国际化处理： 保存提交成功*/
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
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000005') });/* 国际化处理： 提交成功*/
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
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000006') });/* 国际化处理： 收回成功*/
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
			//联查审批意见
		case 'linkaprv':

		//let pk_billtype='36S2';
		let pk_linkPaybill = this.props.form.getFormItemsValue('head', 'pk_paybill').value; //单据pk
		let pk_linktradetype =this.props.form.getFormItemsValue('head', 'trade_type').value;
		this.setState(
			{
				billid: pk_linkPaybill, //单据pk
				billtype: pk_linktradetype
			},
			() => {
				this.setState({
					showAppr: true
				});
			}
		);
		break;
		case 'linkquerybill':
			//if(this.State.showUploader==='true'){}

			this.setState({
				show: true
			});
			break;
				//协同单据联查
		case 'billlinkquery':
		let link_dataArray = [];
		let link_paybill, link_upbill;
		if (props.form.getFormItemsValue(card_from_id, 'pk_paybill').value) {
			link_paybill = props.form.getFormItemsValue(card_from_id, 'pk_paybill').value;
			link_dataArray.push(link_paybill); //上后主键
		}
		if (props.form.getFormItemsValue(card_from_id, 'pk_upbill').value) {
			link_upbill = props.form.getFormItemsValue(card_from_id, 'pk_upbill').value;
			link_dataArray.push(link_paybill); //上后主键
		}

		if (link_dataArray.lenth == 0) {
			toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000007') });/* 国际化处理： 操作失败，无数据!*/
			return;
		}
		console.log(link_dataArray);
		cacheTools.set('paybillsData', link_dataArray);
		let linkOption = {
			code: '36070RBM',
			name: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000008'),/* 国际化处理： 收款结算联查*/
			pk_appregister: '0001Z61000000003KR2P'
		};
		let params = {
			status: 'browse',
			src: 'paybills'
		};

		props.openTo('/cmp/billmanagement/recbill/linkcard/index.html', {
			appcode: '36070RBM',
			pagecode: '36070RBMLINK_C01',
			status: 'browse',
			src: 'paybills'
		});

		//window.parent.openNew(linkOption, '', params);
		break;
		case 'BillLQueryVoucher':
			let voucherArr = [];
			let voucher = {
				pk_billtype: props.form.getFormItemsValue('head', 'bill_type').value,
				pk_group: props.form.getFormItemsValue('head', 'pk_group').value,
				pk_org: props.form.getFormItemsValue('head', 'pk_org').value,
				relationID: props.form.getFormItemsValue('head', 'pk_paybill').value
			};
			voucherArr.push(voucher);

			cacheTools.set('0001Z61000000001PJBL_LinkVouchar', voucherArr);

			props.openTo('/fip/fip/generate/list/index.html', {
				appcode: '10170410',
				pagecode: '10170410_1017041001',
				status: 'browse',
				src: '0001Z61000000001PJBL_LinkVouchar'
			});
			// window.parent.openNew(
			// 	{
			// 		code: '10170410',
			// 		name: '联查凭证',
			// 		pk_appregister: '0001Z31000000002QMYF'
			// 	},
			// 	null,
			// 	'&status=browse&src=0001Z61000000001PJBL_LinkVouchar'
			// );
			break;
			case 'printbtn':
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				'/nccloud/cmp/paybills/paybillsprint.do',
				{
					//billtype: 'D5', //单据类型
					//funcode: '36070PBM', //功能节点编码，即模板编码
					nodekey: 'NCCLOUD', //模板节点标识
					//printTemplateID: '1001Z610000000004R6L', //模板id
					appcode: '36070PBR',
					oids: [ this.props.form.getFormItemsValue('head', 'pk_paybill').value ]
				}
			);
			break;
		case 'output':
			let pkos = [];
			pkos.push(this.props.form.getFormItemsValue('head', 'pk_paybill').value);
			this.setState(
				{
					outputData: {
						funcode: '36070PBM', //功能节点编码，即模板编码
						nodekey: 'NCCLOUD', //模板节点标识

						printTemplateID: '1001Z610000000004R6L', //模板id
						outputType: 'output',
						oids: pkos
					}
				},
				() => {
					this.refs.printOutput.open();
				}
			);
			break;

		case 'file':
			//if(this.State.showUploader==='true'){}

			this.setState({
				showUploader: !this.state.showUploader,
				target: null
			});
			break;

				//收回
		case 'linkplanbudget':
		let linkPlanData = {
			pk: this.props.form.getFormItemsValue('head', 'pk_paybill').value,
			pageid: '36070PBR_D5_card'
		};
		ajax({
			url: '/nccloud/cmp/paybills/linkplan.do',
			data: linkPlanData,
			success: (res) => {
				if (res.data) {
					if (res.data.hint) {
						toast({ color: 'warning', content: res.data.hint });
					} else {
						this.setState(
							{
								sourceData: res.data
							},
							() => {
								this.setState({
									shoWIns: true
								});
							}
						);
					}
				}
			}
		});
		break;
			//影像查看
			case 'BaseImageShow':

           if(CMPEableSscivm.call(this)){
	            return ;
	         };
			let showData = props.createMasterChildData(this.pageId, this.formId, this.tableId);

			let openShowbillid = props.getUrlParam('id'); //单据pk(billid)
			let billShowInfoMap = {};
			billShowInfoMap['pk_billid'] = openShowbillid;
			billShowInfoMap['pk_billtype'] = showData.head.head.rows[0].values.bill_type.value;
			billShowInfoMap['pk_tradetype'] = showData.head.head.rows[0].values.trade_type.value;
			billShowInfoMap['pk_org'] = showData.head.head.rows[0].values.pk_org.value;
			imageView(billShowInfoMap, 'iweb');
			break;
		//影像扫描
		case 'BaseImageScan': //
		
            if(CMPEableSscivm.call(this)){
	            return ;
	         };
			let ScanData = props.createMasterChildData(this.pageId, this.formId, this.tableId);
			let openbillid = props.getUrlParam('id'); //单据pk(billid)
			let billInfoMap = {};
			billInfoMap['pk_billid'] = openbillid;

			billInfoMap['pk_billtype'] = ScanData.head.head.rows[0].values.bill_type.value;
			billInfoMap['pk_tradetype'] = ScanData.head.head.rows[0].values.trade_type.value;
			billInfoMap['pk_org'] = ScanData.head.head.rows[0].values.pk_org.value;
			billInfoMap['BillType'] = ScanData.head.head.rows[0].values.trade_type.value;
			billInfoMap['BillDate'] = ScanData.head.head.rows[0].values.creationtime.value;
			billInfoMap['Busi_Serial_No'] = ScanData.head.head.rows[0].values.pk_paybill.value;
			billInfoMap['OrgNo'] = ScanData.head.head.rows[0].values.pk_org.value;
			billInfoMap['BillCode'] = ScanData.head.head.rows[0].values.bill_no.value;
			billInfoMap['OrgName'] = ScanData.head.head.rows[0].values.pk_org.value;
			billInfoMap['Cash'] = ScanData.head.head.rows[0].values.primal_money.value;

			imageScan(billInfoMap, 'iweb');
			break;


		default:
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/