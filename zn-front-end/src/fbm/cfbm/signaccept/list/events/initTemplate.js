/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, base, toast, excelImportconfig } from 'nc-lightapp-front';
import { bodyButtonClick } from './index';
import { CARD, LIST, app_code, button_limit } from '../../cons/constant.js';
import { initList } from '../../../../public/container/page';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
export default function (props) {

	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
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
					props.button.setPopContent('DeleteInner', this.props.MutiInit.getIntl("36370IFBAD") && this.props.MutiInit.getIntl("36370IFBAD").get('36370IFBAD-000003'));/* 国际化处理： 确认要删除吗?*/
					props.button.setButtonDisabled(LIST.disabled_btn, true);
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
	meta[this.searchId].items.map(item => {
		if (item.attrcode === 'pk_org') { //资金组织
			item.isMultiSelectedEnabled = true;
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}

		if (item.attrcode === 'pk_applyorg') { //申请单财务组织
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
	});
	meta[this.tableId].pagination = true;
	//列表栏中的单据编号，点击进入到卡片页
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == this.billNo) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[this.primaryId].value,
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
		label: this.props.MutiInit.getIntl("36370IFBAD") && this.props.MutiInit.getIntl("36370IFBAD").get('36370IFBAD-000004'),//显示名称/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',//存放位置
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [];
			let vbillstatus = record.vbillstatus && record.vbillstatus.value;
			let dealsign = record.dealsign && record.dealsign.value;
			let isacceptednow = record.isacceptednow && record.isacceptednow.value;
			let busistatus = record.busistatus && record.busistatus.value;
			let signflag = record.signflag && record.signflag.value;

			switch (vbillstatus) {
				case '-1':	//待提交
					if (dealsign) {
						buttonAry = ['CommitInner', 'UnAcceptInner'];
					} else {
						buttonAry = ['AcceptInner', 'ReturnInner'];
					}
					break;
				case '2':	//审批进行中
				case '3':	//提交
					buttonAry = ['UnCommitInner'];
					break;
				case '1':	//已审批
					//判断是否本级办理
					if (isacceptednow) {
						//本级办理，接下来操作是票据签发
						if (!signflag) {
							buttonAry = ['UnCommitInner', 'SignLinkInner'];
						}
					} else {     //非本级受理，接下来操作是委托办理，本单据不能票据签发
						switch (busistatus) {
							case '3': //已委托办理态
								buttonAry = ['CommissionCancelInner'];
								break;
							case '6': //退回态
								buttonAry = ['ReturnInner'];
								break;
							default:   //未委托办理态
								buttonAry = ['UnCommitInner', 'CommissionInner'];
								break;
						}
					}
					break;
				default:
					buttonAry = [];
					break;
			}

			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: button_limit,
				onButtonClick: (props, key) => bodyButtonClick.call(this, key, record, index)
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