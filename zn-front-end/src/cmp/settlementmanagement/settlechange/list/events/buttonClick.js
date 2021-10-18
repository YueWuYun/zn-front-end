/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	ajax,
	base,
	toast,
	high,
	print,
	promptBox,
	output
} from 'nc-lightapp-front';
import {
	constant,
	requesturl
} from '../../config/config.js';
// import { imageScan, imageView } from'../../../../../sscrp/public/common/components/imageMng.js';
import {
	SHOWMODEL_BULU,
	commondata
} from '../../../../public/utils/constant';
import { BatchToast } from '../../../../public/CMPMessage';
import refresh from './refresh.js';
export default function buttonClick(props, id) {

	const cardpath = constant.cardpath;
	const linksrc = constant.linksrc;

	const settleappcode = commondata.settleappcode;
	const settlepagecode = commondata.settlepagecode;
	const settlecardurl = commondata.settlecardurl;

	const billtype = constant.billtype;
	const printfuncode = constant.printfuncode;
	const printnodekey = constant.printnodekey;
	const printtemplateid = constant.printtemplateid;
	const appcode = constant.appcode;
	let that =  this;

	function searchdata() {
		let selectdata = props.table.getCheckedRows(constant.ltablecode);
		//数据校验
		if (selectdata.length == 0) {
			toast({
				color: 'warning',
				content: this.state.json['36070CPI-000016']/* 国际化处理： 请选择数据*/
			});
			return;
		}
		return selectdata;
	};
	// 公共设置请求数据(删除、提交、收回、结算、取消结算)
	function getrequestdata() {
		let selectdata = searchdata();
		let pksArr = [];
		let pktsmap = {};
		let indexmap = {};
		//处理选择数据
		selectdata.forEach((val) => {
			let pk = val.data.values.pk_settlechange.value;
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

	// 更新列数据
	function updateData(updata,operation){
		let { status, totalNum, successNum, failNum, failMsg, listmap } = updata;
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
				props.table.updateDataByIndexs(that.tableId, updatedataArr);
			});
		}
	}

	switch (id) {
		//修改
		case 'editBtn':
			const editData = searchdata();
			let editId = 0;
			editData.forEach((val) => {
				editId = val.data.values.pk_settlechange.value; //主键
			});
			props.table.selectAllRows(this.tableId,false);
			props.pushTo(cardpath, {
				pagecode: constant.cpagecode,
				status: 'edit',
				id: editId
			});
			break;

			//删除，可以支持批量
		case 'deleteBtn':

			let selectdata = props.table.getCheckedRows(constant.ltablecode);
			//数据校验
			if (selectdata.length == 0) {
				toast({
					color: 'warning',
					content: this.state.json['36070CPI-000016']/* 国际化处理： 请选择数据*/
				});
				return;
			}
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070CPI-000005'], // 弹框表头信息/* 国际化处理： 确认删除*/
				content: this.state.json['36070CPI-000020'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除所选数据吗?*/
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
			//提交
		case 'submitBtn':
			ajax({
				url: requesturl.commit,
				data: getrequestdata(),
				success: (res) => {
					let { success,data } = res;
					if (success) {
						if(data){

							let { appointmap } = data;
							if (appointmap) {
								if (appointmap.workflow &&
									(appointmap.workflow == 'approveflow' || appointmap.workflow == 'workflow')) {
									this.setState({
										compositedata: appointmap,
										compositedisplay: true,
									});
								}
							} else {
								updateData.call(this, res.data,commondata.COMMIT);
							}
						}
					}
				}
			});
			break;

			//提交取消-收回
		case 'unsubmitBtn':
			ajax({
				url: requesturl.uncommit,
				data: getrequestdata(),
				success: (res) => {
					let { success } = res;
					if (success) {
						if(res.data){
							updateData.call(this, res.data,commondata.UNCOMMIT);
						}
					}
				}
			});
			break;

			//刷新
		case 'refreshBtn':
			// let refreshsearchVal = props.search.getAllSearchData(constant.searchcode); //查询condition
			// let refreshpageInfo = props.table.getTablePageInfo(constant.ltablecode); //分页
			// refreshpageInfo.pageIndex = 0;
			// this.querydata(refreshsearchVal,refreshpageInfo);
			refresh.call(this, props);
			break;

			// 联查本方银行账户余额
		case 'bankaccbalanceBtn':
			let bankaccbalanceData = searchdata();
			let bankaccbalanceArr = [];
			//处理选择数据
			bankaccbalanceData.forEach((val) => {
				let pk_bankaccount, pk_org
				if (val.data.values.pk_account && val.data.values.pk_account.value != null) {
					pk_bankaccount = val.data.values.pk_account.value;
				}
				if (val.data.values.pk_org && val.data.values.pk_org.value != null) {
					pk_org = val.data.values.pk_org.value;
				}
				//修改请求联查方式
				let query_data = {
					pk_org: pk_org, //财务组织id
					pk_account: pk_bankaccount //银行账户id，没有可不写，和现金账户二选一
					// pk_cashaccount: null //现金账户id，没有可不写
				}
				bankaccbalanceArr.push(query_data); //现金账户
			});

			this.setState({
				showOriginalData: bankaccbalanceArr,
				showOriginal: true,
			});
			break;

			// 联查结算单
		case 'linksettlementBtn':
			let linksettleData = searchdata();
			let linksettleArr = [];
			let pk_settlement;
			//处理选择数据
			linksettleData.forEach((val) => {
				if (val.data.values.pk_settlechange && val.data.values.pk_settlement.value != null) {
					pk_settlement = val.data.values.pk_settlement .value;
					linksettleArr.push(pk_settlement); //银行账号
				}
			});
			props.openTo(settlecardurl, {
				status: 'browse',
				appcode: settleappcode,
				pagecode: settlepagecode,
				// name: this.state.json['36070CPI-000003'),/* 国际化处理： 联查结算单*/
				id: pk_settlement,
				src: linksrc
			});

			break;

			// 附件
		case 'enclosureBtn':

			let enclosureData = searchdata();
			let pk_settlechange, billno
			//处理选择数据
			enclosureData.forEach((val) => {

				if (val.data.values.billno && val.data.values.billno.value != null) {
					billno = val.data.values.billno.value;
				}

				if (val.data.values.pk_settlechange && val.data.values.pk_settlechange.value != null) {
					pk_settlechange = val.data.values.pk_settlechange.value;
				}
			});
			this.setState({
				billId: pk_settlechange, //单据id
				billno: billno, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;

			// 打印
		case 'printBtn': //打印
			let printData = searchdata();
			let pks = [];
			printData.forEach((item) => {
				pks.push(item.data.values.pk_settlechange.value);
			});
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: printnodekey, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
				}
			);
			break;

			// 输出
		case 'outputBtn':
			let outputData = searchdata();
			let opks = [];
			outputData.forEach((item) => {
				opks.push(item.data.values.pk_settlechange.value);
			});
			// this.setState({
			// 		outputData: {
			// 			funcode: printfuncode, //功能节点编码，即模板编码
			// 			nodekey: printnodekey, //模板节点标识
			// 			printTemplateID: printtemplateid, //模板id
			// 			oids: opks,
			// 			outputType: 'output'
			// 		} //打印输出使
			// 	},
			// 	() => {
			// 		this.refs.printOutput.open();
			// 	}
			// );
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

			// 加载网银补录需要的信息
		case 'preparenetBtn':
			this.setState({
				modelType: SHOWMODEL_BULU
			});
			let preparenetData = searchdata();
			if (preparenetData.length != 1) {
				toast({
					color: 'warning',
					content: this.state.json['36070CPI-000019']/* 国际化处理： 请选择一条数据*/
				});
				return;
			}
			ajax({
				url: requesturl.netbankquery,
				data: getrequestdata(),
				success: (res) => {
					let { success, data } = res;
					if (success) {
						if(data){
							that.setState({                
								onLineData: data || [],
								SHOWMODEL_BULU
							},() => {
								that.setState({
									showBuLu: true
								})
							});
						}
					}
				}
			});        
			break;

		default:
			break;
	}
}

/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/