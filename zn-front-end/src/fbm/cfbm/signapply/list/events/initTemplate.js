/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, base, toast,excelImportconfig} from 'nc-lightapp-front';
import { bodyButtonClick } from './index';
import { CARD,LIST, app_code, button_limit } from '../../cons/constant.js';
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
					props.button.setPopContent('DeleteInner', this.props.MutiInit.getIntl("36370IFBA") && this.props.MutiInit.getIntl("36370IFBA").get('36370IFBA-000003'));/* 国际化处理： 确认要删除吗?*/
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
		if (item.attrcode === 'pk_org') { //财务组织过滤
			item.isMultiSelectedEnabled = true; //财务组织多选
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode === 'pk_acceptorg') { //申请单财务组织
			item.queryCondition = () => {
				let pk_org = this.props.search.getSearchValByField('search', 'pk_org');
				return {
					pk_org: pk_org.value && pk_org.value.firstvalue, // 资金组织
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.fbm.cfbm.signapply.filter.FundOrgsRefModelFilter'
				};
			};
		}
		//收款人
		if (item.attrcode === 'pk_receiveunit') {
			item.queryCondition = () => {
				let pk_org = this.props.search.getSearchValByField(this.searchId, 'pk_org');
				//let pk_group = this.props.search.getSearchValByField(this.searchId, 'pk_group');
				if (pk_org && pk_org.value && pk_org.value.firstvalue) {
					return {
						pk_org: pk_org.value.firstvalue,
						//pk_group: pk_group.value
					};
				}else{
					
				}
			};
		}
	});
	meta[this.tableId].pagination = true;
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
								pagecode: CARD.page_id
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
		label: this.props.MutiInit.getIntl("36370IFBA") && this.props.MutiInit.getIntl("36370IFBA").get('36370IFBA-000004'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [];
			let vbillstatus = record.vbillstatus && record.vbillstatus.value;
			let busistatus = record.busistatus && record.busistatus.value;
			let paymentstatus = record.paymentstatus && record.paymentstatus.value;
			switch (vbillstatus) {
				case '-1':	//待提交
				    buttonAry = ['CommitInner','EditInner', 'DeleteInner'];
					break;
				case '2':	//审批中
					buttonAry = ['UnCommitInner'];
					break;
				case '3':	//审批中
					buttonAry = ['UnCommitInner'];
					break;
				case '1':	//审批通过
					buttonAry = [];
					// 审批通过未委托办理可以收回
                    if ( busistatus == '1'){
						buttonAry.push('UnCommitInner');
                    }
					 // 审批通过 + 指令状态为成功或者空 + 非已办理= 委托办理
					if( busistatus == '1'){
						buttonAry.push('CommissionInner');
					}
					// 审批通过 + 已办理 = 取消委托办理
					if(busistatus == '3'){
						buttonAry.push('CommissionCancelInner');
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
	return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
	initList.call(this);
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/