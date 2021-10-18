/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { bodyButtonClick } from './bodyButtonClick';
import { list, card, appCode, btnLimit, baseReqUrl, javaUrl } from '../../cons/constant.js';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea, go2CardCheck } from 'src/tmpub/pub/util/index';
import { COMMON_BTN,BTN_AREA } from '../../../../public/cons/constant';
const { EDIT_INNER_BTN, DELETE_INNER_BTN, SUBMIT_INNER_BTN, UNSUBMIT_INNER_BTN, ENTRUST_INNER_BTN, UNENTRUST_INNER_BTN} = COMMON_BTN;

export default function (props) {
	props.createUIDom(
		{
			pagecode: this.pageId,//页面code
			appcode: appCode
		},
		(data) => {//console.log(data, 'data')
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta)
					setDefOrg2AdvanceSrchArea(props, this.searchId, data);
					props.meta.setMeta(meta);
					setDefOrg2ListSrchArea(props, this.searchId, data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent(DELETE_INNER_BTN, this.state.json['36362IDA-000004']);/* 国际化处理： 确定要删除吗？*/
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//设置参照可以多选和是否清楚记录
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	//财务组织:全加载
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	// 财务组织：根据用户权限过滤
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_org').queryCondition = {
		funcode: props.getSearchParam('c'),//appcode获取
		TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
	};
	// 贷款单位
	meta[this.searchId].items.find((e) => e.attrcode === 'pk_creditorg').queryCondition = () => {
		return {
			funcode: props.getSearchParam("c"), //appcode获取
			pk_creditorg: props.search.getSearchValByField(this.searchId,"pk_org").value.firstvalue,
			TreeRefActionExt:"nccloud.web.tmpub.filter.CreditOrgFinanceRelationFilter,nccloud.web.icdmc.icdmc.financepay.filter.PkOrgFilterForNCC" 
		};
	};
	//参展过滤
	meta[this.searchId].items.map((item) => {
		//参展过滤
		item.isShowDisabledData = true; // “显示停用”的字段
	});
	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == 'applycode') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ color: '#007ace', cursor: 'pointer',overflow:'hidden','text-overflow':'ellipsis' }}
						onClick={() => {
							go2CardCheck({
								props,
								url: `${baseReqUrl}${javaUrl.gotocardcheck}.do`,
								pk: record[this.primaryId].value,
								ts: record["ts"].value,
								checkTS: false,
								checkSaga: false,
								fieldPK: this.primaryId,
								go2CardFunc: () => {
									props.pushTo("/card", {
										status: "browse",
										id: record[this.primaryId].value,
										pagecode: card.pageCode
									});
								}
							})
						}}
					>
						{record && record.applycode && record.applycode.value}
					</a>
				);
			};
		}
		return item;
	});
	
	//添加操作列
	meta[this.tableId].items.push({
		attrcode: 'opr',
		label: this.state.json['36362IDA-000019'],/* 国际化处理： 操作*/
		width: 250,
		fixed: 'right',
		className: "table-opr",
		itemtype:'customer',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [];
            let vbillstatus = record.vbillstatus && record.vbillstatus.value;
            let busistatus = record.busistatus && record.busistatus.value;
            switch (busistatus) {
                case "-1": //待提交
                    buttonAry = [ SUBMIT_INNER_BTN, EDIT_INNER_BTN, DELETE_INNER_BTN,   ];
                    break;
                case "2": //已委托
                    buttonAry = [UNENTRUST_INNER_BTN];
                    break;
                case "3": //待审批
                    buttonAry = [ UNSUBMIT_INNER_BTN ];
                    break;
                case "1": //待委托
                    buttonAry = [ UNSUBMIT_INNER_BTN, ENTRUST_INNER_BTN];
                    break;
                default:
                    break;
            }
			
			return props.button.createOprationButton(buttonAry, {
				area: list.bodyCode,
				buttonLimit: btnLimit,
				onButtonClick: (props, key) => bodyButtonClick.call(this, key, record, index)
			});
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/