/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
/**
 * 背书办理列表初始化模板事件
 * @author：gaokung
 */
import { excelImportconfig } from 'nc-lightapp-front';
import { LIST, printData, CARD, BILLTYPE, LIST_BODY_BTN, LIST_BTN } from '../../cons/constant';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util';
import { listBodyBtnClick } from './listBodyBtnClick';
import { buttonDisabledRule } from './buttonDisabledRule';
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
				props.button.setPopContent(LIST_BODY_BTN.delete,this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000027') );/* 国际化处理： 确定要删除吗?*/
				// 导入
				props.button.setUploadConfig(LIST_BTN.import, excelimportconfig);
				// 按钮可使用规则
				buttonDisabledRule.call(this);
			}
			if (template) {
				template = modifierMeta.call(this, props, template);
				//高级查询区域加载默认业务单元
				setDefOrg2AdvanceSrchArea(props, LIST.searchCode, data);
				props.meta.setMeta(template);
				//列表查询区域加载默认业务单元
				setDefOrg2ListSrchArea(props, LIST.searchCode, data);
			}
		}
	);
};
export default initTemplate;

function modifierMeta(props, meta) {
	let appcode = this.props.getUrlParam("c")||this.props.getSearchParam("c");
	meta[LIST.searchCode].items.map(item => {
		if (item.attrcode === 'pk_org') { //财务组织过滤
			item.isMultiSelectedEnabled = true; //财务组织多选
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode == 'endorsee' ) {//被背书单位
			item.queryCondition = () => {
				let pk_org = this.props.search.getSearchValByField(LIST.searchCode,'pk_org');
				if (pk_org && pk_org.value && pk_org.value.firstvalue) {
					return {
						pk_org:pk_org.value.firstvalue
					};
				} else {
					return {
					};
				}
			};
		}
		if (item.attrcode.indexOf("def")>-1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = (p) => {
				let pk_org = this.props.search.getSearchValByField(LIST.searchCode,'pk_org');
				if (pk_org && pk_org.value && pk_org.value.firstvalue) {
					return {
						pk_org: pk_org.value.firstvalue
					};
				} else {
					return {
					};
				}
			}
		}
	});
	meta[LIST.tableCode].items = meta[LIST.tableCode].items.map((item, key) => {
		if (item.attrcode === 'vbillno') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							if (props.getUrlParam('scene') === 'linksce' || props.getUrlParam('scene') === 'fip' || this.props.getUrlParam('pk_ntbparadimvo')) {
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
		label: this.props.MutiInit.getIntl("36180ET") && this.props.MutiInit.getIntl("36180ET").get('36180ET-000028'),/* 国际化处理： 操作*/
		itemtype: 'customer',
		attrcode: 'opr',
		width: 200,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
	         return (
	           <div>
	             {// 适配云原生 改造适配
	             props.button.createErrorButton({
	               record: record,
	               //showBack: false,  //不显示回退，默认显示
	            sucessCallBack: () => {
			let buttonArry = [];
			// 制单类型
			let syscode =  record.syscode && record.syscode.value;
			if (syscode!= 'INPUT') {
				return props.button.createOprationButton(buttonArry, {
					area: LIST.bodyCode,
					buttonLimit: 3,
					onButtonClick: (props, key) => listBodyBtnClick.call(this, key, record, index)
				});
			}
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
					buttonArry = [ LIST_BODY_BTN.commit, LIST_BODY_BTN.edit, LIST_BODY_BTN.delete ];
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
							// 撤回指令为空或失败可以再次发送撤回指令
							if (
								isEmptyObject(ecdswithdrawstatus) ||
								isEmptyStr(ecdswithdrawstatus) ||
								'2' == ecdswithdrawstatus
							) {
								buttonArry = [ LIST_BODY_BTN.commandCancel ];
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
          })}
        </div>
      );
    }
  });
  return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/