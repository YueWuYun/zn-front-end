/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {ajax,base,toast,cacheTools,high,print,promptBox,output} from 'nc-lightapp-front';
import { commondata } from '../../../../public/utils/constant';
import { constant, requesturl } from '../../config/config';
import refresh from './refresh.js';
import { imageScan, imageView } from 'sscrp/rppub/components/image'; // 影像扫描和查看
import { submit, unsubmit, settle, unsettle } from '../btnclick/btnclick';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { exportFile } from '../../../../pub/utils/CMPButtonUtil';//导出EXCEL
//引入公共api
import { listMultiOperator, listSingleOperator } from '../../../../pub/utils/CMPButtonUtil';
//引入常量定义
import { URL_INFO, LIST_PAGE_INFO, SHOW_MODE,  ITEM_INFO ,CARD_PAGE_INFO,APP_INFO} from '../../cons/constant';
import { go2CardCheck } from "../../../../../tmpub/pub/util";
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';
// const { NCMessage } = base;
// const { NCUploader } = high;

export default function buttonClick(props, id) {

	const linksrc = constant.linksrc;
	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const appcode = constant.appcode;
	let that = this;
	const iweb = commondata.iweb;
	function searchdata() {
		let selectdata = props.table.getCheckedRows(constant.ltablecode);
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: props.MutiInit.getIntl("36070WC") && props.MutiInit.getIntl("36070WC").get('36070WC-000027') /* 国际化处理： 请选择数据*/
			});
			return;
		}
		return selectdata;
	};
	function getrequestdata() {
		let selectdata = searchdata();
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_cashdraw.value;
			let ts = val.data.values.ts.value;
			pksArr.push(pk); //主键数组
			pktsmap[pk] = ts;
			indexmap[pk] = val.index;
		});
		//自定义请求数据
		let data = {
			pageCode: constant.lpagecode,
			pktsmap: pktsmap,
			indexmap: indexmap,
			pks: pksArr
		};
		return data;
	}
	switch (id) {
		case 'addBtn':
			props.table.selectAllRows(this.tableId,false);
			props.pushTo(constant.cardpath, {
				pagecode: constant.cpagecode,
				status: 'add',
				addid: this.state.addid
			});
			break;
			//删除，可以支持批量
		case 'deleteBtn':
			let selectdata = props.table.getCheckedRows(constant.ltablecode);
			//数据校验
			if (selectdata.length == 0) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000027') /* 国际化处理： 请选择数据*/
				});
				return;
			}
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				// title: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000009'), // 弹框表头信息/* 国际化处理： 确认删除*/
				// content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000010'), //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
				title: this.state.json['36070WC-000009'], // 弹框表头信息/* 国际化处理： 删除*/ // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
				content: this.state.json['36070WC-000010'],
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
			//复制
		case 'copyBtn':
			let selectdata1 = props.table.getCheckedRows(constant.ltablecode);
			if (selectdata1.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000028') /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let copyid;
			let ts ;
			selectdata1.forEach((val) => {
				copyid = val.data.values.pk_cashdraw.value;
				ts = val.data.values.ts.value
			});
			//tm begin lidyu 并发交互跳转卡片检查 20200311
			go2CardCheck({
				props,
				url: requesturl.gotocardcheck,
				pk: copyid,
				ts: ts,
				checkTS: ts ? true : false,
				fieldPK: constant.pkname,
				actionCode : null ,
				permissionCode: null ,
				go2CardFunc: () => {
					props.pushTo(constant.cardpath, {
						pagecode: constant.cpagecode,
						status: 'copy',
						id: copyid
					});
				}
				//tm end lidyu 并发交互跳转卡片检查 20200311
			})

			break;
			//提交
		case 'submitBtn':
			submit.call(this, props, getrequestdata());
			// 清空选择框
			this.emptychoicebox();
			break;
			// 收回
		case 'unsubmitBtn':
			unsubmit.call(this, props, getrequestdata());
			// 清空选择框
			this.emptychoicebox();
			break;
			// 委托付款
		case 'transfer':
			listMultiOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, ITEM_INFO.PK, URL_INFO.COMMON.COMMIT, this.state.json['36070WC-000049'], APP_INFO.DATA_SOURCE);/* 国际化处理： 委托付款*/
			break;
			// 取消委托付款
		case 'canceltransfer':
			listMultiOperator(props, LIST_PAGE_INFO.PAGE_CODE, LIST_PAGE_INFO.TABLE_CODE, ITEM_INFO.PK, URL_INFO.COMMON.UNCOMMIT, this.state.json['36070WC-000050'] , APP_INFO.DATA_SOURCE);/* 国际化处理： 取消委托*/
			break;
			//结算
		case 'settleBtn':
			settle.call(this, props, getrequestdata());
			// 清空选择框
			this.emptychoicebox();
			break;
			//取消结算
		case 'unsettleBtn':
			unsettle.call(this, props, getrequestdata());
			// 清空选择框
			this.emptychoicebox();
			break;
			//影像查看
		case 'imgreviewBtn':
			if(CMPEableSscivm.call(this)){
				return ;
			};
			let imgreviewData = searchdata();
			if (imgreviewData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000028') /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			var billInfoMap = {};
			//处理选择数据
			imgreviewData.forEach((val) => {
				billInfoMap.pk_billid = val.data.values.pk_cashdraw.value;
				billInfoMap.pk_billtype = val.data.values.billtypecode.value;
				billInfoMap.pk_tradetype = val.data.values.billtypecode.value;
				billInfoMap.pk_org = val.data.values.pk_org.value;
			});
			imageView(billInfoMap, iweb);
			break;
			//影像扫描
		case 'imgscanBtn':
			if(CMPEableSscivm.call(this)){
				return ;
			};
			let imgscanData = searchdata();
			if (imgscanData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000028') /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			var billInfoMap = {};
			//处理选择数据
			imgscanData.forEach((val) => {
				billInfoMap.pk_billid = val.data.values.pk_cashdraw.value;
				billInfoMap.pk_billtype = val.data.values.billtypecode.value;
				billInfoMap.pk_tradetype = val.data.values.billtypecode.value;
				billInfoMap.pk_org = val.data.values.pk_org.value;
				billInfoMap.BillType = val.data.values.billtypecode.value;
				billInfoMap.BillDate = val.data.values.creationtime.value;
				billInfoMap.Busi_Serial_No = val.data.values.pk_cashdraw.value; //.pk_mtapp_bill.value;
				// billInfoMap.pk_billtype = val.data.values.pk_billtype.value; //pk_billtype.value;
				billInfoMap.OrgNo = val.data.values.pk_org.value; //pk_org.value;
				billInfoMap.BillCode = val.data.values.billno.value; //vbillno.value;
				billInfoMap.OrgName = val.data.values.pk_org.display; //pk_org.display;
				billInfoMap.Cash = val.data.values.money.value; //orig_amount.value;
			});
			imageScan(billInfoMap, iweb);
			break;
			//刷新
		case 'refreshBtn':
			// this.refreshHtml(props);
			refresh.call(this, props);
			break;
			// 联查现金账户余额
		case 'cashbalanceBtn':
			let cashbalanceData = searchdata();
			if (cashbalanceData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000028') /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let cashbalanceArr = [];
			//处理选择数据
			cashbalanceData.forEach((val) => {
				let pk_org, pk_cashaccount
				if (val.data.values.pk_cashaccount && val.data.values.pk_cashaccount.value != null) {
					pk_cashaccount = val.data.values.pk_cashaccount.value;
				}
				if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
					pk_org = val.data.values.pk_org.value;
				}
				let cashbalancedata = {
					pk_org: pk_org, //财务组织id
					pk_account: null, //银行账户id，没有可不写，和现金账户二选一
					pk_cashaccount: pk_cashaccount //现金账户id，没有可不写
				}
				cashbalanceArr.push(cashbalancedata);
			});
			this.setState({
				showOriginalData: cashbalanceArr,
				showOriginal: true,
			});
			break;
			// 联查银行账户余额
		case 'bankaccbalanceBtn':
			let bankaccbalanceDatas = searchdata();
			if (bankaccbalanceDatas.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000028') /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let bankaccbalanceArr = [];
			//处理选择数据
			bankaccbalanceDatas.forEach((val) => {
				let pk_org, pk_bankaccount
				if (val.data.values.pk_bankaccount && val.data.values.pk_bankaccount.value != null) {
					pk_bankaccount = val.data.values.pk_bankaccount.value;
				}
				if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
					pk_org = val.data.values.pk_org.value;
				}
				let bankaccbalancedata = {
					pk_org: pk_org, //财务组织id
					pk_account: pk_bankaccount, //银行账户id，没有可不写，和现金账户二选一
					// pk_cashaccount: pk_bankaccount //现金账户id，没有可不写
				}
				bankaccbalanceArr.push(bankaccbalancedata);
			});
			this.setState({
				showOriginalData: bankaccbalanceArr,
				showOriginal: true,
			});
			break;
			// 联查凭证
		case 'voucherBtn':
			let voucherData = searchdata();
			if (voucherData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000028') /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let pk_cashdrawv,billnov,pk_groupv,pk_orgv
			//处理选择数据
			voucherData.forEach((val) => {
				pk_cashdrawv = val.data.values.pk_cashdraw.value;
				billnov = val.data.values.billno.value;
				pk_groupv = val.data.values.pk_group.value;
				pk_orgv = val.data.values.pk_org.value;
			});
			linkVoucherApp(this.props,pk_cashdrawv,pk_groupv,pk_orgv,billtype,billnov,);
			break;
			// 联查审批意见
		case 'approveopinionBtn':
			let linkapproveData = searchdata();
			if (linkapproveData.length != 1) {
				toast({
					color: 'warning',
					content: this.props.MutiInit.getIntl("36070WC") && this.props.MutiInit.getIntl("36070WC").get('36070WC-000028') /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let cashdrawpk
			//处理选择数据
			linkapproveData.forEach((val) => {

				if (val.data.values.pk_cashdraw && val.data.values.pk_cashdraw.value != null) {
					cashdrawpk = val.data.values.pk_cashdraw.value;
				}
			});
			this.setState({
				billId: cashdrawpk, //单据id
				approveshow: !this.state.approveshow
			})
			break;
			// 打印
		case 'printBtn':
			let printData = searchdata();
			let pks = [];
			printData.forEach((item) => {
				pks.push(item.data.values.pk_cashdraw.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: constant.billtype, //单据类型
					// funcode: constant.printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: constant.printnodekey, //模板节点标识
					// printTemplateID: constant.printtemplateid, //模板id
					oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
			// 输出
		case 'outputBtn':
			let outputData = searchdata();
			let opks = [];
			outputData.forEach((item) => {
				opks.push(item.data.values.pk_cashdraw.value);
			});
			output({
				url: requesturl.print,
				data: {
					nodekey: printnodekey,
					appcode: appcode,
					oids: opks,
					outputType: 'output'
				}
			});
			break;
			// 导出
		case 'exportFile': //导出
			exportFile.call(this,props,constant.ltablecode,'pk_cashdraw');
			break;
			// 附件
		case 'enclosureBtn':
			let enclosureData = searchdata();
			let pk_cashdraw, billno
			//处理选择数据
			enclosureData.forEach((val) => {
				if (val.data.values.billno && val.data.values.billno.value != null) {
					billno = val.data.values.billno.value;
				}
				if (val.data.values.pk_cashdraw && val.data.values.pk_cashdraw.value != null) {
					pk_cashdraw = val.data.values.pk_cashdraw.value;
				}
			});
			this.setState({
				billId: pk_cashdraw, //单据id
				billno: billno, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;
		default:
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/