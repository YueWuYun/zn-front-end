/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import tableButtonClick from './tableButtonClick';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from "../../../../../tmpub/pub/util/index";

let { NCPopconfirm, NCIcon } = base;

import { 
	app_id, module_id, base_url, button_limit, oid, appcode,
	list_page_id,list_search_id, list_table_id,
	card_page_id,card_from_id,card_fromtail_id
} from '../../cons/constant.js';

export default function (props) {
	let that = this;
	props.createUIDom(
		{
			//页面id
			pagecode: list_page_id,
			//注册按钮的id
			// appid: app_id,
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					//高级查询区域加载默认业务单元
					setDefOrg2AdvanceSrchArea(props, list_search_id, data);
					meta = modifierMeta(props, meta, that)
					props.meta.setMeta(meta);
					//列表查询区域加载默认业务单元
					setDefOrg2ListSrchArea(props, list_search_id, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					/* 国际化处理： 确认是否删除？*/
					props.button.setPopContent('delete', props.MutiInit.getIntl("36010IACC") && props.MutiInit.getIntl("36010IACC").get('36010IACC--000022'));
				}
				// if (data.context) {
				// 	let context = data.context;
				// 	// 设置查询区某个字段的值
				// 	props.search.setSearchValByField(list_search_id, 'pk_org',
				// 	{
				// 		value: context.pk_org,
				// 		display: context.org_Name
				// 	});
				// }
			}
		}
	)
}

//刷新列表信息
function refreshHtml(props) {
	//分页
	let refreshpageInfo = props.table.getTablePageInfo(list_table_id);
	//查询condition	
	let refreshsearchVal = props.search.getAllSearchData(list_search_id);
	let queryInfo = props.search.getQueryInfo(list_search_id, false);
    let oid= queryInfo.oid;
	
	let data = {
		querycondition: refreshsearchVal,
        conditions: refreshsearchVal && refreshsearchVal.conditions,
        pageInfo: refreshpageInfo,
        pagecode: list_page_id,
        //查询区编码
        queryAreaCode: list_search_id,
        //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改《根据功能节点区分》
        oid: oid,  
        querytype: 'tree',
	};
	ajax({
		url: '/nccloud/tmpub/tmbd/accidquery.do',
		data: data,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					props.table.setAllTableData(list_table_id, data[list_table_id]);
				} else {
					props.table.setAllTableData(list_table_id, { rows: [] });
				}	
			}
		}
	});		
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta, that) {
	// meta[list_search_id].items = meta[list_search_id].items.map((item, key) => {
	// 	item.visible = true;
	// 	item.col = '3';
	// 	return item;
	// })

	// 查询条件多选
	// 资金组织
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	// 开户单位
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_ownerorg').isMultiSelectedEnabled = true;
	// 账户
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_accid').isMultiSelectedEnabled = true;
	// 币种
	meta[list_search_id].items.find((e) => e.attrcode === 'pk_currtype').isMultiSelectedEnabled = true;

	meta[list_table_id].items = meta[list_table_id].items.map((item, key) => {
		
		//点击某一列跳转到browse状态
		if (item.attrcode === 'accidcode') {
			item.render = (text, record, index) => {				
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo("/card", {
								status: 'browse',
								id: record.pk_accid.value,
								pagecode: card_page_id,
							});
						}}
					>
						{record && record.accidcode && record.accidcode.value}
					</a>
				);
			};
		}
		return item;
	});
	let multiLang = props.MutiInit.getIntl(module_id);
	//添加操作列
	let material_event = {
        label: that.props.MutiInit.getIntl("36010IACC") && that.props.MutiInit.getIntl("36010IACC").get('36010IACC--000038'),/* 国际化处理： 操作*/
		itemtype: 'customer',
        attrcode: 'opr',
        width: 250,
        visible: true,
        fixed: 'right',
        render: (text, record, index) => {
			// billstatus 确认标识 N=未确认，Y=已确认，C=变更待确认，  
			// enablestate 停用标志 1=未启用，2=已启用，3=已停用，
			// frozenflag 账户状态   0=正常，1=冻结，2=部分冻结，3=销户，
			// acctype  账户类型  0=活期，1=协定，2=定期，3=通知，4=贷款，7=票据， 
			let buttonAry = [];
			if(record && record.billstatus){
				// 修改 删除 确认
				if(record.billstatus.value === 'N'){
					buttonAry.push('edit');
					buttonAry.push('delete');
					buttonAry.push('confirm');
				}
				if(record.billstatus.value === 'Y'){
					// 取消确认
					buttonAry.push('cancelconfirm');
					if(record.acctype && 
						(record.acctype.value == 4 || record.acctype.value == 7)){
						if(record.enablestate && record.enablestate.value == 2){
							// 停用
							buttonAry.push('disable');
						}else{
							// 启用
							buttonAry.push('enable');
						}
					}
				}
				// 变更
				if(record.billstatus.value === 'Y' || record.billstatus.value === 'C'){
					buttonAry.push('change');
				}
				// 账户类型 4=贷款，7=票据
				if(record.acctype && record.acctype.value != 4 && record.acctype.value != 7){
					// 账户状态   1=冻结，3=销户，
					if(record.frozenflag && record.frozenflag.value != 3){
						if(record.billstatus.value != 'N'){
							// 解冻
							buttonAry.push('defrozen');
							// 冻结
							if(record.frozenflag.value != 1){
								buttonAry.push('frozen');
							}
						}
						// 销户
						if(record.billstatus.value === 'Y'){
							if(record.frozenflag.value != 1 && record.frozenflag.value != 3){
								buttonAry.push('destroy');
							}
						}
					}
				}
			}       
            return props.button.createOprationButton(buttonAry, {
                area: "accid_table_btn",
                buttonLimit: 3,
                onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
            });
        }
    };
    meta[list_table_id].items.push(material_event);

	//参照过滤
	meta[list_search_id].items.map((item) => {
		item.isShowDisabledData = true;
		// 选择开户单位，通过开户单位进行过滤
		if (item.attrcode === 'pk_accid') {
			item.queryCondition = () => {
				let pk_ownerorgsearchVal = props.search.getSearchValByField(list_search_id, 'pk_ownerorg');
				let pkorgVal ='';
				if(pk_ownerorgsearchVal){
					// 取search区域的值
					pkorgVal = pk_ownerorgsearchVal.value.firstvalue;
				}
				//随便添加的billtype，查询区参照不过滤账户类型
				return { pk_ownerorg: pkorgVal, billtype: '3601'};
			}
		}
		// 资金组织用户过滤
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: props.getSearchParam('c'),
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
				};
			};
		}
		if (item.attrcode == 'pk_ownerorg' ) {
			item.isShowUnit = true;
		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakbCMu6f0sBuWPo0bHXm/6A30+lD1yHlipP2IPXs6cy+K*/