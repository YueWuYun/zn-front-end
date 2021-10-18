/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip } = base;
import buttonUsability from './buttonUsability';
import { list_page_id, list_search_id, list_table_id, app_code, card_page_id,pk_name } from '../../cons/constant.js';
import bodyButtonClick from './bodyButtonClick';
import {setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea,go2CardCheck} from '../../../../../tmpub/pub/util/index.js';
import {
	requesturl
} from '../../cons/requesturl.js';
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
					
					props.button.setPopContent('DeleteTableBtn',that.state.json['36140AIAC-000024']);/* 国际化处理： 确认要删除该信息吗？*/
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
	
	//参照//成本中心跨集团参照
    meta[list_search_id].items.find((e) => e.attrcode == 'pk_capitalcenter').isShowUnit = true;
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// meta[list_table_id].pagination = true;
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		
		if (item.attrcode == 'objcode') {
			item.render = (text, record, index) => {
				return (
					
						<a
							style={{  cursor: 'pointer' }}
							onClick={() => {
								go2CardCheck({
									url: requesturl.check2card,
									pk: record.pk_accintobj.value,
									ts: record.ts.value,
									checkTS: record.ts.value ? true : false,
									checkSaga:false,
									fieldPK: 'pk_accintobj',
									go2CardFunc: () =>{
										that.addQueryCache();
										props.pushTo('/card', {
											status: 'browse',
											id: record.pk_accintobj.value,
											pagecode: card_page_id
										});
								   }	
							   })  
								
							}}
						>
							{record && record.objcode && record.objcode.value}
						</a>
					
				);
			};
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
	//资金组织用户过滤
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
		//利率编码过滤
		if (item.attrcode == 'intobjver.pk_ratecode') {
            item.queryCondition = () => {
	            return {
					GridRefActionExt: 'nccloud.web.fac.interestobj.filter.NCCRateFilter'//自定义参照过滤条件
                };
			}
				
			
                
            
        }
	});


	let multiLang = props.MutiInit.getIntl('3634');
	//添加操作列
	meta[list_table_id].items.push({
		attrcode: 'opr',
		label: that.state.json['36140AIAC-000047'],
		//label: props.MutiInit.getIntl("36140AIAC") && props.MutiInit.getIntl("36140AIAC").get('36140AIAC-000047'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className:"table-opr",
		itemtype: 'customer',

		visible: true,
		render: (text, record, index) => {
			let buttonAry = ['EditTableBtn','DeleteTableBtn'];
			
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
			});
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/