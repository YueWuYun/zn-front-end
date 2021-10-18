/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import { createPage,ajax,base,toast,cacheTools,print,promptBox,output } from 'nc-lightapp-front';
import { constant, requesturl } from '../../config/config';
import { SHOWMODEL_BULU,SHOWMODEL_LIULAN,SHOWMODEL_ZHIFU,commondata, } from '../../../../public/utils/constant';
import { BatchToast } from '../../../../public/CMPMessage';
import refresh from './refresh.js';
import { imageScan, imageView } from 'sscrp/rppub/components/image';
import { linkVoucherApp } from '../../../../../tmpub/pub/util/LinkUtil'; //凭证
import { exportFile } from '../../../../pub/utils/CMPButtonUtil';//导出EXCEL
import Sign from '../../../../../tmpub/pub/util/ca';
import { submit,unsubmit,settle,unsettle,entrust,unentrust,redhandle } from '../btnclick/btnclick';
import { CMPEableSscivm } from '../../../../pub/utils/CMPIVPara';//税务参数查询
//加载小应用基础部件
import appBase from "../../base/index"
const { cons } = appBase;
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";
export default async function buttonClick(props, id) {
	let that = this;
	const linksrc = constant.linksrc;
	const billtype = constant.billtype;
	const appcode = constant.appcode;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const iweb = commondata.iweb;
	function searchdata() {
		let selectdata = props.table.getCheckedRows(constant.ltablecode);
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36070TBR-000034'] /* 国际化处理： 请选择数据*/
			});
			return;
		}
		return selectdata;
	};
	// 公共请求数据
	function getrequestdata() {
		let selectdata = searchdata();
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_transformbill.value;
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
	// 输入密钥
	async function ca_iskey() {
		let ressigndata = await Sign({
			isSign: false,
			isKey: true,
			data: null,
			encryptVOClassName: null
			// head: 'form'
		});
		if (ressigndata.isStop) {
			return;
		}
	}
	function updateData(props, updata, operation) {
		let {status,totalNum,successNum,failNum,failMsg,listmap} = updata;
		BatchToast.call(this, operation, status, totalNum, successNum, failNum, failMsg, null);
		//加载更新缓存数据
		if (listmap != null && listmap.length > 0) {
			listmap.forEach((val) => {
				let updatedataArr = [{
					index: val.index,
					data: {
						values: val.rows.values
					} //自定义封装数据
				}];
				props.table.updateDataByIndexs(ltablecode, updatedataArr);
			});
		}
	}
	switch (id) {
		case 'addBtn':
			// props.table.selectAllRows(this.tableId, false);
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
					content: this.state.json['36070TBR-000034'] /* 国际化处理： 请选择数据*/
				});
				return;
			}
			promptBox({
				color: 'warning', // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070TBR-000013'], // 弹框表头信息/* 国际化处理： 确认删除*/
				content: this.state.json['36070TBR-000014'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
				// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
				// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.delConfirm.bind(this), // 确定按钮点击调用函数,非必输
				// cancelBtnClick: functionCancel,  // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			})
			break;
			//复制
		case 'copyBtn':
			copyBill.call(this,props);			
			break;
			//提交
		case 'submitBtn':
			submit.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			//提交取消-收回
		case 'unsubmitBtn':
			unsubmit.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			//结算
		case 'settleBtn':
			settle.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			//结算取消
		case 'unsettleBtn':
			unsettle.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			//委托办理
		case 'entrustBtn':
			// ca签名
			let ressigndata = await Sign({
				isSign: false,
				isKey: true,
				data: null,
				encryptVOClassName: null
				// head: 'form'
			});
			if (ressigndata.isStop) {
				return;
			}
			entrust.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			//取消委托
		case 'unentrustBtn':
			unentrust.call(this, props, getrequestdata());
			// 清空选择框的值
			this.emptychoicebox();
			break;
			// 网上付款
		case 'onlinepaymentBtn':
			this.setState({
				modelType: SHOWMODEL_ZHIFU
			});
			ajax({
				url: requesturl.onlinepayquery,
				data: getrequestdata(),
				success: (res) => {
					let {
						success,
						data
					} = res;
					if (success) {
						if (data) {
							if (data.eabnksvos.length != 0) {
								that.setState({
									onLineData: data.eabnksvos || [],
									SHOWMODEL_ZHIFU
								}, () => {
									that.setState({
										showBuLu: true
									})
								});
							}else {
								updateData.call(this, props, data, commondata.NETPAY);
							}
						}
					}
				}
			});
			break;
			// 加载网银补录需要的信息
		case 'cyberbankeditBtn':
			this.setState({
				modelType: SHOWMODEL_BULU
			});
			let cyberbankeditdata = searchdata();
			if (cyberbankeditdata.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			ajax({
				url: requesturl.netbankedit,
				data: getrequestdata(),
				success: (res) => {
					let {
						success,
						data
					} = res;
					if (success) {
						if (data) {
							that.setState({
								onLineData: data || [],
								SHOWMODEL_BULU
							}, () => {
								that.setState({
									showBuLu: true
								})
							});
						}
					}
				}
			});
			break;
			//更新网银支付状态
		case 'updatecyberbankBtn':
			ajax({
				url: requesturl.updatenetbank,
				data: getrequestdata(),
				success: (res) => {
					let {
						data,success
					} = res;

					if (success) {
						if (data) {
							updateData.call(this, props, res.data, commondata.UPDATENETBANKE);
						}
					}
				}
			});
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
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let imgrebillpk
			var billInfoMap = {};
			//处理选择数据
			imgreviewData.forEach((val) => {
				if (val.data.values.pk_transformbill && val.data.values.pk_transformbill.value != null) {
					imgrebillpk = val.data.values.pk_transformbill.value;
				}
				billInfoMap.pk_billid = imgrebillpk;
				billInfoMap.pk_billtype = val.data.values.pk_billtypecode.value;
				billInfoMap.pk_tradetype = val.data.values.pk_billtypecode.value;
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
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let imgscanbillpk;
			var billInfoMap = {};
			//处理选择数据
			imgscanData.forEach((val) => {
				if (val.data.values.pk_transformbill && val.data.values.pk_transformbill.value != null) {
					imgscanbillpk = val.data.values.pk_transformbill.value;
				}
				billInfoMap.pk_billid = imgscanbillpk;
				billInfoMap.pk_billtype = val.data.values.pk_billtypecode.value;
				billInfoMap.pk_tradetype = val.data.values.pk_billtypecode.value;
				billInfoMap.pk_org = val.data.values.pk_org.value;
				billInfoMap.BillType = val.data.values.pk_billtypecode.value;
				billInfoMap.BillDate = val.data.values.creationtime.value;
				billInfoMap.Busi_Serial_No = val.data.values.pk_transformbill.value; //.pk_mtapp_bill.value;
				// billInfoMap.pk_billtype = val.data.values.pk_billtypeid.value; //pk_billtype.value;
				billInfoMap.OrgNo = val.data.values.pk_org.value; //pk_org.value;
				billInfoMap.BillCode = val.data.values.vbillno.value; //vbillno.value;
				billInfoMap.OrgName = val.data.values.pk_org.display; //pk_org.display;
				billInfoMap.Cash = val.data.values.amount.value; //orig_amount.value;
			});
			imageScan(billInfoMap, iweb);
			break;
			// 联查单据
		case 'querybillBtn':
			let querybillData = searchdata();
			if (querybillData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let pk_transformbill,pk_srcbilltypecode;
			//处理选择数据
			querybillData.forEach((val) => {
				if (val.data.values.pk_transformbill && val.data.values.pk_transformbill.value != null) {
					pk_transformbill = val.data.values.pk_transformbill.value;
					pk_srcbilltypecode = val.data.values.pk_srcbilltypecode.value;
				}
			});
			if(pk_srcbilltypecode && pk_srcbilltypecode == '36S3'){
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000084'] /* 国际化处理： 到账通知不支持单据追溯!*/
				});
				return;
			}
			this.setState({
				billId: pk_transformbill, //单据id
				billtrackshow: !this.state.billtrackshow
			})
			break;
			// 联查划入账户余额
		case 'inaccbalanceBtn':
			let inaccbalanceData = searchdata();
			if (inaccbalanceData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let inaccbalanceArr = [];
			//处理选择数据
			inaccbalanceData.forEach((val) => {
				let pk_orgi, transforminaccount
				if (val.data.values.transforminaccount && val.data.values.transforminaccount.value != null) {
					transforminaccount = val.data.values.transforminaccount.value;
				}
				if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
					pk_orgi = val.data.values.pk_org.value;
				}
				let inaccbalancedata = {
					pk_org: pk_orgi, //财务组织id
					pk_account: transforminaccount, //银行账户id，没有可不写，和现金账户二选一
					pk_cashaccount: null //现金账户id，没有可不写
				}
				inaccbalanceArr.push(inaccbalancedata);
			});
			this.setState({
				showOriginalData: inaccbalanceArr,
				showOriginal: true,
			});
			break;
			// 联查划出账户余额
		case 'outaccbalanceBtn':
			let outaccbalanceData = searchdata();
			if (outaccbalanceData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let outaccbalanceArr = [];
			//处理选择数据
			outaccbalanceData.forEach((val) => {
				let pk_orgo, transformoutaccount
				if (val.data.values.transformoutaccount && val.data.values.transformoutaccount.value != null) {
					transformoutaccount = val.data.values.transformoutaccount.value;
				}
				if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
					pk_orgo = val.data.values.pk_org.value;
				}
				let outaccbalancedata = {
					pk_org: pk_orgo, //财务组织id
					pk_account: transformoutaccount, //银行账户id，没有可不写，和现金账户二选一
					pk_cashaccount: null //现金账户id，没有可不写
				}
				outaccbalanceArr.push(outaccbalancedata);
			});
			this.setState({
				showOriginalData: outaccbalanceArr,
				showOriginal: true,
			});
			break;
			// 联查凭证
		case 'voucherBtn':
			let voucherData = searchdata();
			if (voucherData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let pk_transformbillv,vbillnov,pk_groupv,pk_orgv
			//处理选择数据
			voucherData.forEach((val) => {
				pk_transformbillv = val.data.values.pk_transformbill.value;
				vbillnov = val.data.values.vbillno.value;
				pk_groupv = val.data.values.pk_group.value;
				pk_orgv = val.data.values.pk_org.value;
				
			});
			linkVoucherApp(this.props,pk_transformbillv,pk_groupv,pk_orgv,billtype,vbillnov,);
			break;
			// 联查支付确认单
		case 'payconfirmBtn':
			let payconfirmData = searchdata();
			if (payconfirmData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let payconfirm_pk_tfb;
			payconfirmData.forEach((val) => {
				if (val.data.values.pk_transformbill && val.data.values.pk_transformbill.value != null) {
					payconfirm_pk_tfb = val.data.values.pk_transformbill.value;
				}
			});
			props.openTo(commondata.confirmpay_path, {
				appcode: commondata.confirmpay_appcode,
				pagecode: commondata.confirmpay_pagecode,
				yurrefs: payconfirm_pk_tfb,
				id: payconfirm_pk_tfb,
				type: commondata.link,
			});
			break;
			// 联查审批意见
		case 'approveopinionBtn':
			let linkapproveData = searchdata();
			if (linkapproveData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			let pk_transformbilla
			//处理选择数据
			linkapproveData.forEach((val) => {
				if (val.data.values.pk_transformbill && val.data.values.pk_transformbill.value != null) {
					pk_transformbilla = val.data.values.pk_transformbill.value;
				}
			});
			this.setState({
				billId: pk_transformbilla, //单据id
				approveshow: !this.state.approveshow
			})
			break;
			// 联查网银信息
		case 'netbankinfoBtn':
			let netbankinfodata = searchdata();
			if (netbankinfodata.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}
			this.setState({
				modelType: SHOWMODEL_LIULAN
			});
			ajax({
				url: requesturl.netbankquery,
				data: getrequestdata(),
				success: (res) => {
					let {
						success,
						data
					} = res;
					if (success) {
						that.setState({
							onLineData: data || [],
							SHOWMODEL_LIULAN
						}, () => {
							that.setState({
								showBuLu: true
							})
						});
					}
				}
			});
			break;
			// 打印
		case 'printBtn':
			let printData = props.table.getCheckedRows(this.tableId);
			let pks = [];
			printData.forEach((item) => {
				pks.push(item.data.values.pk_transformbill.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //
					nodekey: printnodekey, //模板节点标识
					oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;
			// 输出
		case 'outputBtn':
			let outputData = props.table.getCheckedRows(this.tableId);
			let pkso = [];
			outputData.forEach((item) => {
				pkso.push(item.data.values.pk_transformbill.value);
			});
			output({
				url: requesturl.print,
				data: {
					nodekey: printnodekey,
					appcode: appcode,
					oids: pkso,
					outputType: 'output'
				}
			});
			break;
			// 附件
		case 'enclosureBtn':
			let enclosureData = searchdata();
			let pk_transformbille, vbillno
			//处理选择数据
			enclosureData.forEach((val) => {
				if (val.data.values.vbillno && val.data.values.vbillno.value != null) {
					vbillno = val.data.values.vbillno.value;
				}
				if (val.data.values.pk_transformbill && val.data.values.pk_transformbill.value != null) {
					pk_transformbille = val.data.values.pk_transformbill.value;
				}
			});
			this.setState({
				billId: pk_transformbille, //单据id
				billno: vbillno, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;
			//红冲
		case 'redhandleBtn':
			redhandle.call(this, props, getrequestdata());
			break;
			//刷新
		case 'refreshBtn':
			//刷新列表信息
			refresh.call(this, props);
			break;
			//导出
		case 'exportFile': 
			exportFile.call(this,props,constant.ctablecode,'pk_transformbill');
		break;
	}
}


const copyBill = function (props) {	
	let copyData = props.table.getCheckedRows(constant.ltablecode);
	//数据校验
	if (copyData.length == 0) {
		toast({
			color: 'warning',
			content: this.state.json['36070TBR-000034'] /* 国际化处理： 请选择数据*/
		});
		return;
	}
	let id ,ts;
	copyData.forEach((val) => {
		id = val.data.values.pk_transformbill.value;
		ts = val.data.values.ts.value;
	});
	go2CardCheck({
		props,url:cons.url.list.LIST2CARD_CHECK,pk:id,ts:ts,fieldPK:cons.field.pk,actionCode:null,permissionCode:null,checkSaga:false,checkTS:true,go2CardFunc:()=>{			
			if (copyData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070TBR-000035'] /* 国际化处理： 只能选择一条数据!*/
				});
				return;
			}			
			// props.table.selectAllRows(this.tableId, false);
			props.pushTo(constant.cardpath, {
				pagecode: constant.cpagecode,
				status: 'copy',
				id: id
			});	
		}
	});	
	
	
}
/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/