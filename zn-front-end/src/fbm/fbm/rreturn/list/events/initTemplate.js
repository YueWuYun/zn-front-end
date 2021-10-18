/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, base, toast, excelImportconfig } from 'nc-lightapp-front';
import { bodyButtonClick } from './index';
import { LIST, CARD, app_code, button_limit } from '../../cons/constant.js';
import { initList } from '../../../../public/container/page';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
export default function (props) {
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	let pagecode = LIST.page_id;
	let scene = this.props.getUrlParam("scene");
	let pk_ntbparadimvo = this.props.getUrlParam("pk_ntbparadimvo"); //预算反联查
	if ((scene && scene === "linksce") || pk_ntbparadimvo) {
		pagecode = LIST.page_id_link;
	}
	props.createUIDom(
		{
			pagecode: LIST.page_id,//页面code
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('DeleteInner', "确认要删除吗?");/* 国际化处理： 确认要删除吗?*//* 国际化处理： 确认要删除吗?*/
					props.button.setButtonDisabled(LIST.disabled_btn, true);
					//第一版投融资列表先隐藏肩部提交、收回，后期需要再放开
					// props.button.setButtonVisible({ Commit: false, Uncommit: false });
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					//给高级查询区域赋默认业务单元(在setMeta之前使用)
					setDefOrg2AdvanceSrchArea(props, LIST.search_id, data);
					props.meta.setMeta(meta);
					//给列表查询区域赋默认业务单元(在setMeta之后使用)
					setDefOrg2ListSrchArea(props, LIST.search_id, data);
					templateCallback.call(this, meta);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[this.tableId].pagination = true;
	meta[this.searchId].items.map(item => {
		if (item.attrcode === 'pk_org') { //财务组织过滤
			item.isMultiSelectedEnabled = true; //财务组织多选
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}

		// 自定义项过滤
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = (p) => {
				let pk_org = this.props.search.getSearchValByField(this.searchId, 'pk_org');
				if (pk_org && pk_org.value && pk_org.value.firstvalue) {
					return {
						pk_org: pk_org.value.firstvalue
					};
				}
			}
		}

		//票据类型过滤
		if (item.attrcode === 'glgx.pk_register.fbmbilltype') {
			item.queryCondition = () => {
				return {
					GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
				};
			};
		}
	});
	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == this.billNo) {
			item.render = (text, record, index) => {
				let pagecode = LIST.page_id;
				let scene = this.props.getUrlParam("scene");
				if (scene && scene === "linksce") {
					pagecode = LIST.page_id_link;
				}
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[LIST.primary_id].value,
								pagecode: LIST.page_id
							});
						}}
					>
						{record[this.billNo] && record[this.billNo].value}
					</a>
				);
			};
		}
		return item;
	});


	//添加操作列
	meta[this.tableId].items.push({
		itemtype: 'customer',
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36180BRR") && this.props.MutiInit.getIntl("36180BRR").get('36180BRR-000002'),/* 国际化处理： 操作*//* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			return props.button.createErrorButton({
				record: record,
				//showBack: false, // 是否显示回退按钮         
				sucessCallBack: () => {
					let buttonAry = [];
					let busistatus = record.vbillstatus && record.vbillstatus.value;
					let voucher = record.voucher && record.voucher.value;
					let transform = record.transform && record.transform.value;
					switch (busistatus) {
						case '-1':	//待提交
							buttonAry = ['CommitInner', 'EditInner', 'DeleteInner'];
							break;
						case '3':	//提交
							buttonAry = ['UnCommitInner'];
							break;
						case '2':	//审批进行中
							buttonAry = ['UnCommitInner'];
							break;
						case '1':	//审批通过
							//即没制证也没冲销显示收回按钮
							if (!voucher && !transform) {
								buttonAry = ['UnCommitInner'];
							}
							//根据制证与否显示按钮
							if (voucher) {
								buttonAry.push('CancelVoucherInner');			//如果制证，显示【取消制证】
							} else {
								buttonAry.push('MakeVoucherInner');				//如果没有制证，显示【制证】
							}
							//根据冲销与否显示按钮
							if (transform) {
								buttonAry.push('CancelTransform');
							} else {
								buttonAry.push('Transform');
							}
							break;
						default:
							break;
					}
					return props.button.createOprationButton(buttonAry, {
						area: "list_inner",
						buttonLimit: button_limit,
						onButtonClick: (props, key) => bodyButtonClick.call(this, key, record, index)
					});
				}
			});
		}
	});
	return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
	initList.call(this);
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/