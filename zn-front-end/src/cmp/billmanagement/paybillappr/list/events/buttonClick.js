/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage, ajax, base, toast, cacheTools } from 'nc-lightapp-front';
const { NCMessage } = base;
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url
} from '../../cons/constant.js';
import refresh from './refresh.js';
export default function buttonClick(props, id) {
	switch (id) {
		case 'save': //新增
			props.linkTo('../card/index.html', {
				status: 'add'
			});
			break;
		//删除，可以支持批量
		case 'delete':
			const selectedData = props.table.getCheckedRows(this.tableId);
			if (selectedData.length == 0) {
				//  Message.create({content: '选择数据', color: 'success', position: 'bottom'});
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000035') });/* 国际化处理： 请选择数据*/
				// NCMessage.create({ content: '请选择数据', color: 'warning', position: 'top' });
				return;
			}
			let indexArr = [];
			let dataArr = [];
			let tsArr = [];
			let delObj = {
				status: '3',
				values: {
					ts: {
						display: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000036')/* 国际化处理： 时间戳*/
					},
					pk_cashdraw: {
						display: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000037')/* 国际化处理： 主键*/
					}
				}
			};
			//处理选择数据
			selectedData.forEach((val) => {
				delObj.rowId = val.data.rowId;
				delObj.values.ts.value = val.data.values.ts.value; //ts时间戳
				dataArr.push(val.data.values.pk_paybill.value);
				tsArr.push(val.data.values.ts.value);
				indexArr.push(val.index);
			});
			//自定义请求数据
			let data = {
				pks: dataArr,
				tss: tsArr
			};
			ajax({
				url: '/nccloud/cmp/billmanagement/delete.do',
				data: data,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000017') });/* 国际化处理： 删除成功*/
						refresh(props);
					}
				}
			});
			break;
		//复制
		case 'copy':
			let copyData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (copyData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000038') });/* 国际化处理： 请选择1条数据*/
				// NCMessage.create({ content: '请选择1条数据', color: 'warning', position: 'top' });
				return;
			}
			let copyid = 0;
			copyData.forEach((val) => {
				copyid = val.data.values.pk_paybill.value;
			});
			props.linkTo('../../paybill/card/index.html', {
				status: 'copy',
				id: copyid
			});
			break;
		//提交
		case 'commit':
			let checkdData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (checkdData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000039') });/* 国际化处理： 请选择要提交的数据*/
				return;
			}

			let commitDataArr = [];
			//处理选择数据
			checkdData.forEach((val) => {
				commitDataArr.push(val.data.values.pk_paybill.value);
			});
			let commitData = {
				pks: commitDataArr,
				pageid: '36070PBR_D5_list'
			};
			ajax({
				url: '/nccloud/cmp/paybills/commit.do',
				data: commitData,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000005') });/* 国际化处理： 提交成功*/
						refresh(props);
					}
				}
			});
			break;
		//收回
		case 'uncommit':
			let unCheckdData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (unCheckdData.length == 0) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000039') });/* 国际化处理： 请选择要提交的数据*/
				return;
			}

			let unComDataArr = [];
			//处理选择数据
			unCheckdData.forEach((val) => {
				unComDataArr.push(val.data.values.pk_paybill.value);
			});
			let unComData = {
				pks: unComDataArr,
				pageid: '36070PBR_D5_list'
			};
			ajax({
				url: '/nccloud/cmp/paybills/uncommit.do',
				data: unComData,
				success: function(res) {
					let { success, data } = res;
					if (success) {
						toast({ color: 'success', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000006') });/* 国际化处理： 收回成功*/
						refresh(props);
					}
				}
			});
			break;

		//
		case 'tradetype': //交易类型
			break;

		//红冲
		case 'reverse':
			let reverseData = props.table.getCheckedRows(this.tableId);
			//数据校验
			if (reverseData.length != 1) {
				toast({ color: 'warning', content: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000040') });/* 国际化处理： 红冲操作只支持单挑记录操作*/
				return;
			}
			let reverse_pk;
			reverseData.forEach((val) => {
				reverse_pk = val.data.values.pk_paybill.value;
			});
			let reqData = { pk: reverse_pk, pageid: this.pageId };
			ajax({
				url: '/nccloud/cmp/paybills/reverse.do',
				data: reqData,
				success: (res) => {
					if (res.data) {
						if (res.data.head) {
							props.linkTo('../card/index.html', {
								status: 'browse',
								id: res.data.head['head'].rows[0].values.pk_paybill.value
							});
						}
					}
				}
			});
			break;
		//协同单据联查
		case 'billlinkquery':
			let requestData = props.table.getCheckedRows(this.tableId);
			if (requestData.length == 0) return;

			let dataArray = [];
			requestData.forEach((val) => {
				if (val.data.values.pk_paybill.value != null) {
					dataArray.push(val.data.values.pk_paybill.value);
				}
				if (val.data.values.pk_upbill != null && val.data.values.pk_upbill.value != null) {
					dataArray.push(val.data.values.pk_upbill.value);
				}
			});
			console.log(dataArray);
			cacheTools.set('paybillsData', dataArray);
			window.parent.openNew(
				{ code: '36070RBM', name: this.props.MutiInit.getIntl("36070PBRAPPR") && this.props.MutiInit.getIntl("36070PBRAPPR").get('36070PBRAPPR-000041'), pk_appregister: '0001Z6100000000264K0' },/* 国际化处理： 收款结算管理*/
				'current',
				'status=browse&src=paybills'
			);

			break;

		//影像查看
		case 'BaseImageShow': //导入导出
			break;
		//影像扫描
		case 'BaseImageScan': //打印
			break;
		//关联结算Associate
		case 'Associate ': //打印
			break;
		//关联结算Associate
		case 'unassociate ': //打印
			break;

		case 'printbtn': //打印
			let printData = {
				webfile: 'online',
				billtype: 'F5', //交易类型，来源于工作桌面传参
				funcode: '36070PBR', //打印模板的pub_print_template中的funcode，来源于工作桌面传参
				nodekey: 'D5', //打印模板的pub_print_template中的nodekey，来源于工作桌面传参
				oid: '1001Z61000000000B6Z5',
				module: 'cmp', //当前领域，来源于工作桌面传参
				name: 'nccloud.pubitf.cmp.billmanagement.PaybillsPrintDataSource', //当前单据的打印数据源，来源于工作桌面传参
				filename: 'e90a3d0b-f50a-40f3-b0b1-52c1e5065f90.pdf' //固定，平台代码问题，正常不需要传
			};

			this.props.downLoad({ data: printData, url: '/nccloud/cmp/paybills/paybillsprint.do' }); //打印请求的action
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/