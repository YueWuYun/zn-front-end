/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { buttonVisible } from './buttonVisible';
import { bodyButtonClick } from './bodyButtonClick';
import { pageCodeList, searchId, tableId, app_code,pageCodeCard,rowcode,headcode } from '../../cons/constant.js';//xuechh 云原生适配
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea,go2CardCheck } from '../../../../../tmpub/pub/util/index.js';
import { requesturl } from '../../cons/requesturl.js';
export default function (props) {
	let that = this;

	props.createUIDom(
		{
			pagecode: pageCodeList,//页面id 
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(that, props, meta);
					props.meta.setMeta(meta);
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, searchId, data);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props, searchId, data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					let multiLang = props.MutiInit.getIntl(app_code);
					props.button.setPopContent('delete_inner',multiLang.get('36140FDSR-000013'));/* 国际化处理： 确认要删除该信息吗？*/
				}
			}
			buttonVisible.call(this, props);

		}
	)
}
function modifierMeta(that, props, meta) {
	let scene = props.getUrlParam("scene");//20200328
	if(scene== 'link' || scene== 'linksce' || scene== 'fip'){
		meta[tableId].pagination = false;
	}else{
		meta[tableId].pagination = true;
	}
	let multiLang = props.MutiInit.getIntl(app_code);
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.isShowDisabledData = true;
		//资金组织参照过滤
		if (item.attrcode == 'pk_org') { 
			item.queryCondition = () => {
				return {
					funcode: '36140FDSR',
                    TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				}
			}
		}
		return item;
	});
		meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				return (
					
						<a
							style={{  cursor: 'pointer' }}
							onClick={() => {
								//that.addQueryCache();
								go2CardCheck({
									url: requesturl.check2card,
									pk: record.pk_deposit.value,
									ts: record.ts.value,
									checkTS: record.ts.value ? true : false,
									fieldPK: 'pk_deposit',
									go2CardFunc: () =>{
										props.pushTo('/card', {
											status: 'browse',
											id: record.pk_deposit.value,
											scene:scene,//20200402
											pagecode: pageCodeCard
										})
									}
								})
							}}
						>
							{record && record.vbillcode && record.vbillcode.value}
						</a>
					
				);
			};
		}
		
		return item;
	});
	//添加操作列
	if (scene != 'fip' && scene != 'linksce' && scene != 'link') {//20200328
	meta[tableId].items.push({
		attrcode: 'opr',
		label: multiLang && multiLang.get('36140FDSR-000025'),
		// label: '操作',
		itemtype: 'customer',
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
			let isnet = true;
			let buttonAry = [];
			if (record.billstate && record.billstate.value == '0') {
				buttonAry = ['delete_inner', 'edit_inner', 'tally_inner'];
			} else if (record.billstate && record.billstate.value == '1') {
				buttonAry = ['untally_inner'];
			}
			//xuechh-云原生适配
			return (props.button.createErrorButton({
				record,
				showBack: false,
				sucessCallBack: () => {
					return props.button.createOprationButton(buttonAry,
						{
							area: rowcode,//区域编码
							buttonLimit: 3,//按钮显示个数
							onButtonClick: (props, key) => { bodyButtonClick.call(that, props, key, text, record, index); }
						});
				}
			}));
			//return props.button.createOprationButton(buttonAry, {
			//	area: "list_inner",
			//	buttonLimit: 3,
			//	onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
			//});
		}
	});
	}
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/