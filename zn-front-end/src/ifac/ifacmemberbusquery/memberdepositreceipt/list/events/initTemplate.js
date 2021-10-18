/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { base } from 'nc-lightapp-front';
let { NCTooltip } = base;
import buttonUsability from './buttonUsability';
import { list_page_id, list_search_id, list_table_id, app_code, card_page_id,pk_name } from '../../cons/constant.js';
import bodyButtonClick from './bodyButtonClick';
import {
	requesturl
} from '../../cons/requesturl.js';
import {setDefOrg2AdvanceSrchArea,setDefOrg2ListSrchArea,go2CardCheck} from '../../../../../tmpub/pub/util/index.js';
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

	meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[list_table_id].pagination = true;
	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		
		if (item.attrcode == 'depositcode') {
			let scene = props.getUrlParam('scene');
			if(scene != null){
				item.render = (text, record, index) => {
					return (
						
							<a
								style={{  cursor: 'pointer' }}
								onClick={() => {
									go2CardCheck({
										url: requesturl.check2card,
										pk:  record[pk_name].value,
										ts: record.ts.value,
										checkTS: false,
										checkSaga:false,
										fieldPK: pk_name,
										go2CardFunc: () =>{
											props.pushTo('/card', {
												status: 'browse',
												id: record[pk_name].value,
												pagecode: card_page_id,
												scene: scene
											});
									   }	
								   })  
									
								}}
							>
								{record && record.depositcode && record.depositcode.value}
							</a>
						
					);
				};
			}else{
				item.render = (text, record, index) => {
					return (
						
							<a
								style={{  cursor: 'pointer' }}
								onClick={() => {
									go2CardCheck({
										url: requesturl.check2card,
										pk:  record[pk_name].value,
										ts: record.ts.value,
										checkTS: false,
										checkSaga:false,
										fieldPK: pk_name,
										go2CardFunc: () =>{
											that.addQueryCache();
											props.pushTo('/card', {
												status: 'browse',
												id: record[pk_name].value,
												pagecode: card_page_id
											});
									   }	
								   })  

								}}
							>
								{record && record.depositcode && record.depositcode.value}
							</a>
						
					);
				};
			}
			
		}
		
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
		//定期账户过滤过滤
//         if (item.attrcode == 'pk_depositacc') {
//             item.queryCondition = () => {
//                 let pk_org = props.form.getFormItemsValue(list_search_id, 'pk_org').value.firstvalue;
// 				let pk_currtype = props.form.getFormItemsValue(list_search_id, 'pk_currtype').value.firstvalue;
//                 if(pk_org === null || pk_currtype === null){
// 					return {
//                 	};
// 				}else{
// 					return {
// 						pk_org: pk_org,
// 						pk_currtype:pk_currtype,
// 						GridRefActionExt: 'nccloud.web.ifac.depositreceipt.filter.NCCDepositAccountFilter'//自定义参照过滤条件
// 	                };
// 				}
//                 
//             };
//         }
		if (item.attrcode == 'pk_depositacc') { // 定期账户
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(list_search_id, 'pk_org') || {}).value.firstvalue;
				let pk_currtype = (props.search.getSearchValByField(list_search_id, 'pk_currtype') || {}).value.firstvalue;
				return {
					pk_org: pk_org,
					pk_currtype: pk_currtype,
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'N',
					refnodename: '使用权参照',
					billtype: '3603',
					GridRefActionExt: 'nccloud.web.ifac.fixdepositapplly.filter.NCCFixdepositApplyObjFilter' //自定义增加的过滤条件	
				}
			}
		}
		//结算账户过滤过滤
		if (item.attrcode == 'pk_settleacc') { // 结算账户
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(list_search_id, 'pk_org') || {}).value.firstvalue;
				let pk_currtype = (props.search.getSearchValByField(list_search_id, 'pk_currtype') || {}).value.firstvalue;
				return {
					pk_org: pk_org,
					pk_currtype: pk_currtype,
					isDisableDataShow: false,//默认只加载启用的账户
					noConditionOrg: 'Y',
					refnodename: '使用权参照',
					billtype: '3603',
					GridRefActionExt: 'nccloud.web.ifac.fixdepositapplly.filter.NCCFixdepositApplySettleaccjFilter' //自定义增加的过滤条件	
				}
			}
		}   
      
		//活期利率编码过滤
		if (item.attrcode == 'pk_aiacrate') {
            item.queryCondition = () => {
	            return {
					GridRefActionExt: 'nccloud.web.ifac.depositreceipt.filter.NCCRateFilter'//自定义参照过滤条件
                };
			}
        }
		//定期利率编码过滤
		if (item.attrcode == 'pk_depostrate') {
            item.queryCondition = () => {
	            return {
					GridRefActionExt: 'nccloud.web.ifac.depositreceipt.filter.NCCRateFilter'//自定义参照过滤条件
                };
			}
        }


	});


	let multiLang = props.MutiInit.getIntl('3634');
	// //添加操作列
	// if(props.getUrlParam('scene') != 'linksce' && props.getUrlParam('scene') != 'fip'){
	// 	meta[list_table_id].items.push({
	// 		attrcode: 'opr',
	// 		label: that.state.json['36341FDLQ-000047'],
	// 		//label: props.MutiInit.getIntl("36341FDLQ") && props.MutiInit.getIntl("36341FDLQ").get('36341FDLQ-000047'),/* 国际化处理： 操作*/
	// 		width: 200,
	// 		fixed: 'right',
	// 		className:"table-opr",
	// 		itemtype: 'customer',
	
	// 		visible: true,
	// 		render: (text, record, index) => {
	// 			let buttonAry = [];
	// 			if(record.billstate && record.billstate.value == '2'){
	// 				 /* 回单状态：已冻结 */
	// 				buttonAry = ['defrozenTableBtn'];
	// 			}else if(record.billstate && record.billstate.value == '1'){
	// 				/* 回单状态：在执行 */
	// 				buttonAry = ['frozenTableBtn'];
	// 			}
				
	// 			return props.button.createOprationButton(buttonAry, {
	// 				area: "list_inner",
	// 				buttonLimit: 3,
	// 				onButtonClick: (props, key) => bodyButtonClick.call(that, props, key, text, record, index)
	// 			});
	// 		}
	// 	});
	// }
	
	return meta;
}


/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/