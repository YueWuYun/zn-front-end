/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
/**
 * 背书办理卡片界面 模版初始化
 * @author：gaokung
 */
import { CARD, CARD_BTN } from '../../cons/constant.js';
import { afterEvent } from './index';

export default function() {
	let props = this.props;
	let appcode = props.getSearchParam('c') || props.getUrlParam('c');
	// 保存打印输出信息
	// this.setState({
	// 	printOutputInfo: {
	// 		//打印输出使用
	// 		funcode: appcode, //功能节点编码，即模板编码
	// 		nodekey: 'NCC36180ET'//模板节点标识
	// 	}
	// });
	props.createUIDom(
		{
			pagecode: CARD.pageCode, // 页面编码
			appcode: appcode // 应用编码
		},
		(data) => {
			let { button, template, context } = data;
			if (button) {
				props.button.setButtons(button);
				// 先设置所有按钮不可见
				let allBtn = [];
				for (let value in CARD_BTN) {
					allBtn.push(CARD_BTN[value]);
				}
				props.button.setButtonVisible(allBtn, false);
			}
			if (template) {
				let meta = modifierMeta.call(this, template, props);
				props.meta.setMeta(meta);
				let status = props.getUrlParam('status');
				if (status === 'browse') {
					// props.cardTable.setStatus(card_table_id, 'browse');
					let metaFromData = meta[CARD.formHeadCode];
					metaFromData.items.forEach((val) => {
						if(val.attrcode === 'pk_org'){
							val.visible = false;	
							val.disabled = true;
							return;
						}
						else if(val.attrcode === 'pk_org_v'){
							val.visible = true;
							val.disabled = true;
							return;
						}
					});
				} else {
					// props.cardTable.setStatus(card_table_id, 'edit');
					meta[CARD.formHeadCode].items.forEach((val) => {
						if(val.attrcode === 'pk_org'){
							val.visible = true;
							val.disabled = false;
							return;
						}
						else if(val.attrcode === 'pk_org_v'){
							val.visible = false;
							val.disabled = false;
							return;
						}
					});
				}
			}
			if (data.context) {
				let context = data.context;
				// 保存默认的财务组织
				this.setState({
					curr_pk_org: context.pk_org,
					curr_orgname: context.org_Name,
					curr_pk_org_v: context.pk_org_v,
					curr_orgname_v: context.org_v_Name
				});
			}
			// this.setState({
			// 	isInitTemplate:true
			// })
			/**
			 * 有时componentDidMount会在本回调函数执行之前调用，
			 * 所以不能在componentDidMount处理画面显示，
			 * 必须等此函数结束，即模板配置加载完成后再处理画面显示
			 */
			this.setUIDisplay();
		}
	);
}
function modifierMeta(meta, props) {
	//参照过滤事件、全部抽象成请求，只是这是平台封装的
	let appcode = this.props.getUrlParam("c")||this.props.getSearchParam("c");
	meta[CARD.formHeadCode].items.map((item) => {
		//财务组织用户过滤
		if (item.attrcode == 'pk_org' ) {
			// item.showHistory = false;
			item.queryCondition = () => {
				return {
					funcode: appcode,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode === 'pk_register') {
			return (item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(CARD.formHeadCode, 'pk_org').value;
				let busdate = props.form.getFormItemsValue(CARD.formHeadCode, 'busdate').value;
				return {
					pk_org: pk_org,
					busdate: busdate,
					GridRefActionExt: 'nccloud.web.fbm.fbm.endore.filter.EndoreRegisterFilter4NCC'
				};
			});
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/