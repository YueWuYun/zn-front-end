/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { ajax, base, toast, print, output, cacheTools } from 'nc-lightapp-front';
import * as CONSTANTS from '../../const/constants';
import { linkApp } from '../../../../../tmpub/pub/util/LinkUtil';
let { NCMessage } = base;
import { elecSignListPrint } from "../../../../../tmpub/pub/util/index";
let { tableId, appcode, nodekey, formal_nodekey, supply_nodekey, Print_URL, linkkbilltype, Elecsign_Print_URL, vbillno, pkname } = CONSTANTS;
export default function (props, id, text, record, index) {
	let that = this;
	let ptintpks = [];
	switch (id) {
		// 打印
		case 'print':
			let printdata = props.table.getCheckedRows(tableId);
			let pks = [];
			if (printdata.length == 0) {
				toast({
					content: this.props.MutiInit.getIntl("36300REC") && this.props.MutiInit.getIntl("36300REC").get('36300REC-000008'),
					color: 'warning'
				});
				return;
			} else {
				printdata.forEach((vale) => {
					pks.push(vale.data.values.pk_cashgather_receipt_h.value);
				});
			}
			print(
				'pdf',  //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				Print_URL,
				{
					appcode: appcode,
					nodekey: nodekey,//模板节点标识
					oids: pks
				}
			);
			break;
		/**
		 * 刷新
		 */
		case 'refresh':
			that.refresh();
			break;
		// 输出
		case 'printout':
			if (checkIsSelectedData.call(this, props)) return;
			let outputBtnData = props.table.getCheckedRows(tableId);
			let oids = [];
			outputBtnData.forEach((item) => {
				oids.push(item.data.values.pk_cashgather_receipt_h.value);
			});
			output({
				url: Print_URL,
				data: {
					nodekey: nodekey,
					appcode: appcode,
					oids,
					outputType: 'output'
				}
			});
			break;
		// 联查
		case 'link':
			// let linkQueryData = props.table.getCheckedRows(tableId);
			// if (linkQueryData.length == 0) {
			// 	toast({
			// 		content: this.props.MutiInit.getIntl("36300REC") && this.props.MutiInit.getIntl("36300REC").get('36300REC-000008'),
			// 		color: 'warning'
			// 	});
			// 	return;
			// }
			// if (linkQueryData.length > 1) {
			// 	toast({
			// 		content: this.props.MutiInit.getIntl("36300REC") && this.props.MutiInit.getIntl("36300REC").get('36300REC-000009'),
			// 		color: 'warning'
			// 	});
			// 	return;
			// }
			// let pk_srcbill = "";
			// linkQueryData.forEach((vale) => {
			// 	pk_srcbill = vale.data.values.pk_sourcebillid.value;
			// });
			// let sbExtParam = {
			// 	status: 'browse',
			// 	LinkBillType: linkkbilltype,
			// 	id: pk_srcbill
			// };
			// linkApp(props, linkkbilltype, sbExtParam);
			// break;
			if(record && record.pk_sourcebillid && record.pk_sourcebillid.value){
				let pk_srcbill = record.pk_sourcebillid.value;
				let sbExtParam = {
					status: 'browse',
					LinkBillType: linkkbilltype,
					id: pk_srcbill
				};
				linkApp(props, linkkbilltype, sbExtParam);
			}
			break;
		//正式打印
		case 'formalprint':
			if (checkIsSelectedData.call(this, props)) return;
			elecSignListPrint(props, {
				url: Elecsign_Print_URL,
				offical: true,               //是否正式打印
				appCode: appcode,
				nodeKey: formal_nodekey,         //正式打印
				tableCode: tableId,   //列表id
				field_id: pkname,
				field_billno: vbillno,
				getOrgFunc: (selectData) => {
					let pk_org_r = selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org_r'] && selectData.data.values['pk_org_r'].value;
					if (pk_org_r) {
						return pk_org_r;
					}
					else {
						return selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org'] && selectData.data.values['pk_org'].value;
					}
				}
			})
			break;
		//补充打印
		case 'supplyprint':
			if (checkIsSelectedData.call(this, props)) return;
			elecSignListPrint(props, {
				url: Elecsign_Print_URL,
				offical: false,               //是否正式打印
				appCode: appcode,
				nodeKey: supply_nodekey,         //正式打印
				tableCode: tableId,   //列表id
				field_id: pkname,
				field_billno: vbillno,
				getOrgFunc: (selectData) => {
					let pk_org_r = selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org_r'] && selectData.data.values['pk_org_r'].value;
					if (pk_org_r) {
						return pk_org_r;
					}
					else {
						return selectData && selectData.data && selectData.data.values && selectData.data.values['pk_org'] && selectData.data.values['pk_org'].value;
					}
				}
			})
			break;
	}

}

// 选择数据校验
function checkIsSelectedData(props) {
	let selectedData = props.table.getCheckedRows(tableId);
	if (selectedData.length == 0) {
		toast({
			content: this.props.MutiInit.getIntl("36300REC") && this.props.MutiInit.getIntl("36300REC").get('36300REC-000008'),
			color: 'warning'
		});
		return true;
	}
	return false;
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/