/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
let { NCPopconfirm } = base;
import { buttonVisible } from './buttonVisible';
import {RowDetailButton} from '../../../../../tmpub/pub/util/RowDetailButton'; 
import { PAYBILL_CONST } from '../../cons/constant.js';
import tableButtonClick from './tableButtonClick';
import { RefFilter, FormRefFilter } from '../../util/TableRefFilter';
import { CMPIVPara } from '../../../../pub/utils/CMPIVPara';//税务参数查询
import { saveMultiLangRes,loadMultiLang } from '../../../../../tmpub/pub/util';
let formId = PAYBILL_CONST.card_from_id;
let tableId =PAYBILL_CONST.card_table_id;

let pageId = PAYBILL_CONST.card_page_id;
let childformId = 'childform1';
export default function(props) {
	let that = this;

	if (props.getUrlParam('pagecode')) {
		pageId = props.getUrlParam('pagecode');
	}
	props.createUIDom(
		{
			pagecode: pageId, //页面id
			// appcode: '36070PBR',
			// appid: '0001Z61000000001PJBL' //注册按钮的id
		},
		function(data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(that, props);
					});
				
				}
				if (data.template) {
					let meta = data.template;
					 modifierMeta(that, props, meta);
					 props.meta.setMeta(meta, () => {
						//给票据设置默认值
						if (props.getUrlParam('status') == 'add') {	
							let pk_org =props.form.getFormItemsValue('head', 'pk_org');
							if (!pk_org || !pk_org.value) {
								props.resMetaAfterPkorgEdit();
								props.initMetaByPkorg();
								//props.form.setFormItemsDisabled('head', { pk_org: false }); //财务组织、
							}
						} 
					});
					if(data.context&&data.context.paramMap){
						let { transtype, pk_transtype,transtype_name } = data.context.paramMap;
						if(transtype&&pk_transtype){
							that.setState({
								showTradeBtn:false
							});
						}	
					}
					that.initData.call(that);
					//票据参数 加载按钮
					//begin tm tangleic 20203026 参数判断不需要限定界面状态，新增等编辑态也需要判断 控制按钮
					// if (props.getUrlParam('status') == 'browse'){
						if(CMPIVPara()){
							that.setState({
								showElec: true
							});
						}
					// }
					//end tm tangleic
				};
			}
		}
	);
}

function modifierMeta(that, props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;

	//form 去除缓存 历史记录
	meta[formId].items.find((e) => e.attrcode === 'mon_account').showHistory = false;
	meta[formId].items.find((e) => e.attrcode === 'pk_supplier').showHistory = false;
	//table去除缓存 历史记录
	meta[tableId].items.find((e) => e.attrcode === 'mon_account').showHistory = false;
	meta[tableId].items.find((e) => e.attrcode === 'pk_account').showHistory = false;
	meta[tableId].items.find((e) => e.attrcode === 'pk_supplier').showHistory = false;
	meta[tableId].items.find((e) => e.attrcode === 'pk_oppaccount').showHistory = false;
	//table参照过滤
	// meta[tableId].items.map((item) => {
	// 	RefFilter.call(this, props, item);
	// });
	meta[childformId].items.find((e) => e.attrcode === 'mon_account').showHistory = false;
	meta[childformId].items.find((e) => e.attrcode === 'pk_account').showHistory = false;
	meta[childformId].items.find((e) => e.attrcode === 'pk_supplier').showHistory = false;
	meta[childformId].items.find((e) => e.attrcode === 'pk_oppaccount').showHistory = false;
	//侧拉form 参照过滤
	meta[childformId].items.map((item) => {
		RefFilter.call(this, props, item);
	});

	
	let porCol = {
		attrcode: 'opr',
		//label: multiLang && multiLang.get('20521030-0005'),
		label:loadMultiLang(props, '36070PBR-000018'),
		
		visible: true,
		itemtype: 'customer',
		width: '210px',
		fixed: 'right',
		render: (text, record, index) => {
			let  status= props.cardTable.getStatus(tableId);
			let buttonAry =
				props.getUrlParam('status') === 'browse'
					? ['']
					: that.state.pasteflag ? [ 'CopyAtLine' ] : [ 'openedit', 'copybody', 'insertline', 'deleteline' ];
					return status === 'browse' ? <span class="row-edit-option row-btn-Open"
					 onClick={()=>{
						if(record.values['pk_account'].display==" ")  {
							record.values['pk_account'] = {
							   display: record.values['pk_account'].value
							};
						};
						props.cardTable.toggleRowView(PAYBILL_CONST.card_table_id, record);
					 }}>
					{record.expandRowStatus ? loadMultiLang(props, '36070PBR-000116'):loadMultiLang(props, '36070PBR-000115')
				 } 
					</span>
					// <RowDetailButton
					// 	record={record}
					// 	bodyAreaCode={tableId}
					// 	props={props}
					// />
					: (<div className="currency-opr-col">{
						props.button.createOprationButton(buttonAry, {
							area: "card_body_inner",
							buttonLimit:3,
							onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
						})
					}</div>
					);

			// return props.button.createOprationButton(buttonAry, {
			// 	area: 'card_body_inner',
			// 	buttonLimit: 3,
			// 	onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
			// });
		}
	};
	meta[tableId].items.push(porCol);

	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/