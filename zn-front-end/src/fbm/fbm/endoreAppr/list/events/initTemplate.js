/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
/**
 * 背书办理列表初始化模板事件
 * @author：gaokung
 */
import { excelImportconfig } from 'nc-lightapp-front';
import { LIST, printData, CARD, BILLTYPE, LIST_BODY_BTN } from '../../cons/constant';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util';
import { listBodyBtnClick } from './listBodyBtnClick';
import buttonDisabledRule from './buttonDisabledRule';
import { isEmptyObject, isEmptyStr } from '../../utils/commonUtil';
const initTemplate = function() {
	let props = this.props;
	let appcode = props.getSearchParam('c') || props.getUrlParam('c');
	let excelimportconfig = excelImportconfig(props, 'fbm', BILLTYPE, true, '', {
		appcode: appcode,
		pagecode: CARD.pageCode
	});
	console.info('appcode:'+appcode);
	props.createUIDom(
		{
			pagecode: LIST.pageCode,
			appcode: appcode //注册按钮的id
		},
		(data) => {
			let { template, button } = data;
			if (!template[LIST.tableCode]) {
				return;
			}
			if (button) {
				props.button.setButtons(button);
				// 导入
				props.button.setUploadConfig('Import', excelimportconfig);
				// 按钮可使用规则
				buttonDisabledRule.call(this);
			}
			if (template) {
				//列表查询区域加载默认业务单元
				setDefOrg2ListSrchArea(props, LIST.searchCode, data);
				//高级查询区域加载默认业务单元
				setDefOrg2AdvanceSrchArea(props, LIST.searchCode, data);
				template = modifierMeta.call(this, props, template);
				props.meta.setMeta(template);
				let meta = props.meta.getMeta();
				let oid = meta.search.oid;
				this.setState({ oid: oid });
			}
		}
	);
};
export default initTemplate;

function modifierMeta(props, meta) {
	meta[LIST.tableCode].items = meta[LIST.tableCode].items.map((item, key) => {
		if (item.attrcode === 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							if (props.getUrlParam('scene') === 'linksce' || props.getUrlParam('scene') === 'fip') {
								props.pushTo('/card', {
									status: 'browse',
									id: record.pk_endore && record.pk_endore.value,
									pagecode: CARD.pageCode_link,
									scene: 'linksce'
								});
							} else {
								props.pushTo('/card', {
									status: 'browse',
									id: record.pk_endore && record.pk_endore.value,
									pagecode: CARD.pageCode
								});
							}
						}}
					>
						{record.vbillno && record.vbillno.value}
					</a>
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[LIST.tableCode].items.push({
		label: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000027'),/* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: 200,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonArry = [];
			let vbillstatus = record.vbillstatus && record.vbillstatus.value;
			// 判断显示制证与取消制证的标识
			let voucher = record.voucher && record.voucher.value;
			// 判断显示发送指令与撤回指令的标识
			// 是否勾选网银
			let onlinebankflag = record.onlinebankflag && record.onlinebankflag.value;
			// 支付指令状态
			let paymentstatus = record.paymentstatus && record.paymentstatus.value;
			// 撤回指令状态
			let ecdswithdrawstatus = record.ecdswithdrawstatus && record.ecdswithdrawstatus.value;
			// 判断显示作废与取消作废的标识
			let disableflag = record.disableflag && record.disableflag.value;
			switch (vbillstatus) {
				case '-1': //自由态
					buttonArry = [ LIST_BODY_BTN.delete, LIST_BODY_BTN.edit, LIST_BODY_BTN.commit ];
					break;
				case '0': //审批未通过
					buttonArry = [ LIST_BODY_BTN.commit ];
					break;
				case '1': //审批通过
					if (onlinebankflag) {
						// 网银
						if ('1' === paymentstatus) {
							// 支付指令成功
							if (voucher) {
								// 已制证
								buttonArry = [ LIST_BODY_BTN.voucherCancel ];
							} else {
								// 未制证
								buttonArry = [ LIST_BODY_BTN.voucherMake ];
							}
						} else if ('2' === paymentstatus) {
							// 支付指令失败
							if (disableflag) {
								// 已作废
								buttonArry = [ LIST_BODY_BTN.nullifyCancel ];
							} else {
								// 未作废
								buttonArry = [ LIST_BODY_BTN.nullify ];
							}
						} else if ('3' === paymentstatus) {
							// 支付指令交易不明
							buttonArry = [ LIST_BODY_BTN.commandCancel ];
							// 撤回指令为空或失败可以再次发送指令
							if (
								isEmptyObject(ecdswithdrawstatus) ||
								isEmptyStr(ecdswithdrawstatus) ||
								'2' == ecdswithdrawstatus
							) {
							buttonArry = [ LIST_BODY_BTN.commandCancel ];
								buttonArry.push(LIST_BODY_BTN.commandSend);
							}
						} else {
							// 支付指令为空，没发过指令
							buttonArry = [ LIST_BODY_BTN.uncommit, LIST_BODY_BTN.commandSend ];
						}
					} else {
						// 非网银
						if (voucher) {
							// 已制证
							buttonArry = [ LIST_BODY_BTN.voucherCancel ];
						} else {
							//未制证
							buttonArry = [ LIST_BODY_BTN.uncommit, LIST_BODY_BTN.voucherMake ];
						}
					}
					break;
				case '2': //审批进行中
					break;
				case '3': //提交
					buttonArry = [ LIST_BODY_BTN.uncommit ];
					break;
			}
			return props.button.createOprationButton(buttonArry, {
				area: LIST.bodyCode,
				buttonLimit: 3,
				onButtonClick: (props, key) => listBodyBtnClick.call(this, key, record, index)
			});
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/