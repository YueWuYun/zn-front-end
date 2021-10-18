/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base,cardCache } from 'nc-lightapp-front';
let { NCTooltip } = base;
import buttonUsability from './buttonUsability';
import { list_page_id, list_search_id, list_table_id, app_code, card_page_id,pk_name } from '../../cons/constant.js';
import bodyButtonClick from './bodyButtonClick';
import {setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea,go2CardCheck} from '../../../../../tmpub/pub/util/index.js';
import { voucherLinkBill } from '../../busbutton/voucherLinkBill';
import appBase from "../../base";
import { requesturl } from '../../cons/requesturl.js';
const { cons, api } = appBase; 

export default function (props) {
	let that = this;
	let appcode = '';
	let appUrl = decodeURIComponent(window.location.href).split('?');
	if (appUrl && appUrl[1]) {
		let appPrams = appUrl[1].split('&');
		if (appPrams && appPrams instanceof Array) {
			appPrams.find((item) => {
				if (item.indexOf('ar') != -1 && item.split('=')) {
					appcode = item.split('=')[1] && item.split('=')[1];
				}
			});
		}
	}
	props.createUIDom(
		{
			pagecode: list_page_id//页面id 
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;

					//联查场景标志
					let src = props.getUrlParam('scene');
					if ('fip' == src ) {
						initData.call(that, props);
					}

					meta = modifierMeta(that, props, meta);
					
					//高级查询区加载默认业务单元
					setDefOrg2AdvanceSrchArea(props,list_search_id,data);
					props.meta.setMeta(meta);
					//列表查询区加载默认业务单元
					setDefOrg2ListSrchArea(props,list_search_id,data);
				}
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					buttonUsability.call(this, props,null);
					
					props.button.setPopContent('DeleteTableBtn',that.state.json['36340CDIR-000024']);/* 国际化处理： 确认要删除该信息吗？*/
				}
				
			}
		}
	)
}

function seperateDate(date){
	if (typeof date !=='string') return ;
	let result = date.split(' ') && date.split(' ')[0];
	return result;


}

function modifierMeta(that, props, meta) {
	let scene = (props.getUrlParam("scene")==='fip'||props.getUrlParam("scene")==='linksce')?'linksce':null;
	let islinkquery=(props.getUrlParam("scene")==='fip'||props.getUrlParam("scene")==='linksce')?true:null;
	if(scene != 'linksce'){
		meta[list_table_id].pagination = true;
	}else{
		meta[list_table_id].pagination = false;
	}
	// meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
	// 	item.visible = true;
	// 	item.col = '3';
	// 	return item;
	// })
	//参照
	//参照//成本中心跨集团参照
    meta[list_search_id].items.find((e) => e.attrcode == 'pk_capitalcenter').isShowUnit = true;
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		
		if (item.attrcode == 'vbillno') {
			if(scene != null){
				item.render = (text, record, index) => {
					return (
						// <NCTooltip placement="top" overlay={record.vbillno ? record.vbillno.value : ''}>
							<a
								style={{  cursor: 'pointer' }}
								onClick={() => {
									go2CardCheck({
										props,
										url: requesturl.list2cardcheckaction,
										pk:record[pk_name].value,
										ts:record["ts"].value,
										fieldPK: pk_name,
										//动作编码（权限检查 空则不检查）
										actionCode:null,
										//权限编码（权限检查 空则不检查）
										permissionCode:null,
										//是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
										checkSaga : false,
										//是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
										checkTS : false,
										go2CardFunc: () => { 
											//弹异常提示
											cardCache.setDefData(cons.comm.iserrtoast, cons.comm.dataSource, true);

											props.pushTo('/card', {
												status: 'browse',
												id: record[pk_name].value,
												pagecode: card_page_id,
												scene,
												islinkquery,
											});
										}
									});
								}}
							>
								{record && record.vbillno && record.vbillno.value}
							</a>
						// </NCTooltip>
					);
				};
			}else{
				item.render = (text, record, index) => {
					return (
						
							<a
								style={{  cursor: 'pointer' }}
								onClick={() => {
									go2CardCheck({
										props,
										url: requesturl.list2cardcheckaction,
										pk:record[pk_name].value,
										ts:record["ts"].value,
										fieldPK: pk_name,
										//动作编码（权限检查 空则不检查）
										actionCode:null,
										//权限编码（权限检查 空则不检查）
										permissionCode:null,
										//是否进行saga检查(默认检查，不涉及云原生改造的单据不用检查)
										checkSaga : false,
										//是否进行ts检查（默认检查，非操作按钮导致的跳转不用检查）
										checkTS : record["ts"].value ? true : false,
										go2CardFunc: () => {
											that.addQueryCache();
											props.pushTo('/card', {
												status: 'browse',
												id: record[pk_name].value,
												pagecode: card_page_id
											});
										}
									});
								}}
							>
								{record && record.vbillno && record.vbillno.value}
							</a>
						
					);
				};
			}
			
		}
		// else if (item.attrcode == 'dbilldate'){
		// 	item.render = (text, record, index) => {
		// 		return (
		// 			<span>
		// 				{record && record.dbilldate && seperateDate(record.dbilldate.value)}
		// 			</span>
		// 		);
		// 	};
		// }
		return item;
	});
	//财务组织用户过滤
	meta[list_search_id].items.map((item) => {
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: app_code,
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		}
	});


	let multiLang = props.MutiInit.getIntl('3634');
	//添加操作列
	if(props.getUrlParam('scene') != 'linksce' && props.getUrlParam('scene') != 'fip'){
		meta[list_table_id].items.push({
			attrcode: 'opr',
			label: that.state.json['36340CDIR-000047'],
			//label: props.MutiInit.getIntl("36340CDIR") && props.MutiInit.getIntl("36340CDIR").get('36340CDIR-000047'),/* 国际化处理： 操作*/
			width: 200,
			fixed: 'right',
			className:"table-opr",
			itemtype: 'customer',
	
			visible: true,
			render: (text, record, index) => {
				let buttonAry = [];
				if(record.tallyflag && record.tallyflag.value == '1'){
					 /* 回单状态：已记账 */
					buttonAry = ['UnTallyTableBtn'];
				}else if(record.tallyflag && record.tallyflag.value == '0'){
					/* 回单状态：已记账 */
					buttonAry = ['EditTableBtn','TallyTableBtn'];
				}
				
				
				//begin tm zhanghe 20191120 支持分布式事务异常交互
				// return props.button.createOprationButton(buttonAry, {
				// 	area: "list_inner",
				// 	buttonLimit: 3,
				// 	onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
				// });
				return (props.button.createErrorButton({
                    record,
                    showBack: false,
                    sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry, {
							area: "list_inner",
							buttonLimit: 3,
							onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
						});
		
                    }
				}));
				//end
			}
		});
	}
	
	return meta;
}


function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this, this.props, list_page_id, list_table_id);
	} 
}
/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/