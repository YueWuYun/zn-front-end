/*Hm9gUKDDwtNjV7Mk8onAzuIpekICGqrRt+I5pBEVpxd7RzyXn9gK3qS5OtoMjmFR*/
import {
	ajax,
	toast,
	print,
	cardCache,
	promptBox,
	output
} from 'nc-lightapp-front';
// import { imageScan, imageView } from'../../../../../sscrp/public/common/components/imageMng.js';
import {
	constant,
	requesturl
} from '../../config/config.js';
import {
	commondata,
	SHOWMODEL_BULU
} from '../../../../public/utils/constant';
import {
	saveBtn,
	savesubmitBtn
} from '../btnClicks/btnClick';
const {
	updateCache
} = cardCache;

export default function (props, id) {

	const formcode1 = constant.formcode1;

	const cpagecode = constant.cpagecode;

	const cardpath = constant.cardpath;
	// 联查src
	const linksrc = constant.linksrc;

	// 单据类型
	const billtype = constant.billtype;
	// 打印
	const printfuncode = constant.printfuncode;

	const printnodekey = constant.printnodekey;

	const printtemplateid = constant.printtemplateid;
	const appcode = constant.appcode;

	// 联查结算常量
	const settleappcode = commondata.settleappcode;
	const settlepagecode = commondata.settlepagecode;
	const settlecardurl = commondata.settlecardurl;

	const status = props.getUrlParam('status');

	const billid = this.billpk;
	// const iweb = constant.iweb;
	// 提交、收回、结算、取消结算公共请求参数
	let requestdata = {
		pageCode: cpagecode,
		pk: this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value,
		ts: this.props.form.getFormItemsValue(this.formId, 'ts').value
	};

	// 组装验证公式请求数据
	function savevalidateData() {
		let billdata = props.form.getAllFormValue(formcode1);
		let validateData = {
			pageid: cpagecode,
			model: {
				areacode: constant.formcode1,
				rows: billdata.rows,
				areaType: 'form'
			}
		}
		return validateData;
	}

	switch (id) {

		//修改、编辑
		case 'editBtn':
			let editid = props.getUrlParam('id');
			if (editid) {
				editid = this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value;
			}
			let querydata = {pk: editid};
			ajax({
				url: requesturl.editpermission,
				data: querydata,
				success:  (res) => {
					if (res.success) {
						props.pushTo(cardpath, {
							pagecode: constant.cpagecode,
							status: 'edit',
							id: editid
						});
						this.toggleShow();
						this.renderHtmlByStatus();
					}
				}
			});
			
			break;

			//删除
		case 'deleteBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070CPI-000005'], // 弹框表头信息/* 国际化处理： 确认删除*/
				content: this.state.json['36070CPI-000006'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认删除数据吗?*/
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

			// 保存
		case 'saveBtn':
			let flag = props.form.isCheckNow(this.formId);
			if (flag) {
				let savedata = savevalidateData();
				let saveobj = {};
				saveobj[formcode1] = 'form';
				props.validateToSave(savedata, saveBtn.bind(this, props), saveobj, '');
			}
			break;

			//保存提交
		case 'savesubmitBtn':
			let subflag = props.form.isCheckNow(this.formId);
			let savesubmitdata = savevalidateData();
			if (subflag) {
				let saveobj = {};
				saveobj[formcode1] = 'form';
				props.validateToSave(savesubmitdata, savesubmitBtn.bind(this, props), saveobj, '');
			}
			break;

			//提交
		case 'submitBtn':
			ajax({
				url: requesturl.commitcard,
				data: requestdata,
				success: (res) => {
					let {data,success} = res;
					if (success) {
						if(data){
							let {appointmap} = data;
							if (appointmap) {
								if (appointmap.workflow &&
									(appointmap.workflow == 'approveflow' || appointmap.workflow == 'workflow')) {
									this.setState({
										compositedata: appointmap,
										compositedisplay: true,
									});
								}
							}else{
								let form = data.form;
								toast({
									color: 'success',
									content: this.state.json['36070CPI-000001'] /* 国际化处理： 提交成功*/
								});
								let id = form[formcode1].rows[0].values[billid].value
								if (status === 'edit') {
									updateCache(billid, id, form, formcode1, this.cacheDataSource, form[formcode1].rows[0].values);
								}
								this.buttonAfter(form);
							}
						}
					}
				}
			});
			break;

			//收回
		case 'unsubmitBtn':
			ajax({
				url: requesturl.uncommitcard,
				data: requestdata,
				success: (res) => {
					if (res.success) {
						toast({
							color: 'success',
							content: this.state.json['36070CPI-000002'] /* 国际化处理： 收回成功*/
						});
						let id = res.data[formcode1].rows[0].values[billid].value
						if (status === 'edit') {
							updateCache(billid, id, res.data, formcode1, this.cacheDataSource, res.data[formcode1].rows[0].values);
						}
						this.buttonAfter(res.data);
					}
				}
			});
			break;

			// 取消
		case 'cancelBtn':
			promptBox({
				color: 'warning',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
				title: this.state.json['36070CPI-000009'], // 弹框表头信息/* 国际化处理： 确认取消*/
				content: this.state.json['36070CPI-000010'], //this.modalContent(), //弹框内容，可以是字符串或dom/* 国际化处理： 确认是否取消?*/
				// noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
				// noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
				// beSureBtnName: "确定",          // 确定按钮名称, 默认为"确定",非必输
				// cancelBtnName: "取消",         // 取消按钮名称, 默认为"取消",非必输
				// hasCloseBtn:false,             //显示“X”按钮，默认不显示，不显示是false，显示是true
				beSureBtnClick: this.cancelModalBeSure.bind(this),   // 确定按钮点击调用函数,非必输
				cancelBtnClick: this.cancelModalCancel.bind(this),  // 取消按钮点击调用函数,非必输
				// closeBtnClick:functionClose, //关闭按钮点击调用函数，非必输
				// closeByClickBackDrop:false,//点击遮罩关闭提示框，默认是false点击不关闭,点击关闭是true
			})
			break;

			// 返回
		case 'backBtn':
			props.pushTo(constant.listpath,{pagecode: constant.lpagecode});
			break;

			// 联查本方账户余额余额
		case 'bankaccbalanceBtn':
			let bankaccbalanceArr = [];
			
			//处理选择数据
			let pk_bankaccount = props.form.getFormItemsValue(this.formId, 'pk_account').value;
			let pkorgb = props.form.getFormItemsValue(this.formId, 'pk_org').value;
			//修改请求联查方式
			let bank_data = {
				pk_org: pkorgb, //财务组织id
				pk_account: pk_bankaccount //银行账户id，没有可不写，和现金账户二选一
				// pk_cashaccount: null //现金账户id，没有可不写
			}
			bankaccbalanceArr.push(bank_data); 

			this.setState({
				showOriginalData: bankaccbalanceArr,
				showOriginal: true,
			});
			break;

			// 联查结算单
		case 'linksettlementBtn':
			
			let linksettleArr = [];
			let pk_settlement;
			
			if (props.form.getFormItemsValue(this.formId, 'pk_settlement').value) {
				pk_settlement = props.form.getFormItemsValue(this.formId, 'pk_settlement').value;
				linksettleArr.push(pk_settlement); // 单据id
			}

			props.openTo(settlecardurl, {
				status: 'browse',
				appcode: settleappcode,
				pagecode: settlepagecode,
				// name: this.state.json['36070CPI-000003'),/* 国际化处理： 联查结算单*/
				id: pk_settlement,
				src: linksrc
			});

			break;

			// 打印
		case 'printBtn': //打印
			print(
				'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
				requesturl.print, {
					// billtype: billtype, //单据类型
					// funcode: printfuncode, //功能节点编码，即模板编码
					appcode: appcode, //appcode
					nodekey: printnodekey, //模板节点标识
					// printTemplateID: printtemplateid, //模板id
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value]
				}
			);
			break;

			// 输出
		case 'outputBtn':
			// this.setState({
			// 		outputData: {
			// 			funcode: printfuncode, //功能节点编码，即模板编码
			// 			nodekey: printnodekey, //模板节点标识
			// 			printTemplateID: printtemplateid, //模板id
			// 			oids: [this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value],
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
					oids: [this.props.form.getFormItemsValue(this.formId, 'pk_settlechange').value],
					outputType: 'output'
				}
			});
			break;

			// 附件
		case 'enclosureBtn':
			let pk_settlechangee = props.form.getFormItemsValue(this.formId, 'pk_settlechange').value;
			let vbillno = props.form.getFormItemsValue(this.formId, 'vbillno').value;
			this.setState({
				billId: pk_settlechangee, //单据id
				billno: vbillno, // 单据编号
				showUploader: !this.state.showUploader,
				target: null
			})
			break;

			// 刷新
		case 'refreshBtn':
			let pk_settlechange = props.form.getFormItemsValue(this.formId, 'pk_settlechange').value;
			let data = {
				pk: pk_settlechange,
				pageCode: this.pageId
			};
			ajax({
				url: requesturl.querycard,
				data: data,
				success: (res) => {
					if (res) {
						if (res.data) {
							this.buttonAfter(res.data);
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

			// 网银补录
			case 'preparenetBtn':
				this.setState({
					modelType: SHOWMODEL_BULU
				});
				ajax({
					url: requesturl.netbankquery,
					data: requestdata,
					success: (res) => {
						let { success, data } = res;
						if (success) {
							if(data){
								this.setState({                
									onLineData: data || [],
									SHOWMODEL_BULU
								},() => {
									this.setState({
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