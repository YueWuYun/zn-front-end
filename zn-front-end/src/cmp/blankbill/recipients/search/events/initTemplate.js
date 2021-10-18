/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
import {
	module_id,
	base_url,
	button_limit,
	card_page_id,
	card_from_id,
	card_table_id,
	page_url,
	list_page_url,
	card_page_url
} from '../../cons/constant.js';
import {cardCache} from "nc-lightapp-front";
let {setDefData, getDefData } = cardCache;

let { NCPopconfirm, NCIcon } = base;
import tableButtonClick from './tableButtonClick';

let searchId = 'search_D5';
let tableId = 'table_D5';
let pageId = '36070PBR_L04';
export default function(props) {
	// ajax({

	// 	url: '/nccloud/platform/templet/querypage.do',
	// 	data: {
	// 		pagecode: '36070PBR_D5_list'
	// 	},
	// 	success: function(res) {
	// 		let meta = res.data;
	// 		meta = modifierMeta(props, meta);
	// 		props.meta.setMeta(meta);
	// 	}
	// });

	let _this = this;
	props.createUIDom(
		{
			pagecode: pageId, //页面id
			appcode: '36070PBR',
			appid: '0001Z61000000001PJBL' //注册按钮的id
		},
		//function (data){
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;

					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('delline', this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000016'));/* 国际化处理： 确认要删除该信息吗？*/
				}
			}
		}
	);
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.visible = true;
		item.col = '3';
		return item;
	});
	// props.renderItem(
	// 	'search', // 区域类型form/table/search
	// 	searchId, // 模板中的区域id
	// 	'pk_org' // 字段的attrcode
	// 	// getRefer('cont', {
	// 	// 	// refcode以及其他参数
	// 	// 	isMultiSelectedEnabled: false
	// 	// 	//...item
	// 	// })
	// );
	//meta[tableId].showindex = true;
	//修改列渲染样式
	meta[searchId].items.map((ele) => {
		ele.visible = true;
	});
	//财务组织:全加载
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	//财务组织用户过滤
	meta[searchId].items.map((item) => {
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					//funcode: '36070PBR',
					//TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});

	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == 'bill_no') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ textDecoration: 'underline', cursor: 'pointer' }}
						onClick={() => {
							 this.setStateCache();
							props.pushTo("/card",{status:"browse",id:record.pk_paybill.value,
							pagecode: record.trade_type.value,bill_status:record.bill_status.value});
							// props.linkTo(card_page_url, {
							// 	status: 'browse',
							// 	id: record.pk_paybill.value,
							// 	pagecode: record.trade_type.value
							// 	//bill_status:record.bill_status.value
							// });
						}}
					>
						{record && record.bill_no && record.bill_no.value}
					</a>
				);
			};
		} else if (item.attrcode == 'bill_date') {
			item.render = (text, record, index) => {
				return <span>{record && record.bill_date && seperateDate(record.bill_date.value)}</span>;
			};
		}
		return item;
	});
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070PBR") && this.props.MutiInit.getIntl("36070PBR").get('36070PBR-000018'), //intl.get('20521030-0005'),/* 国际化处理： 操作*/
		width: 200,
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = [];
			//保存--自由态
			if (record.bill_status && record.bill_status.value == -10) {
				 if(record.is_cf&& record.is_cf.value=='Y'){
					buttonAry = ['comline','editline']; 
				  }else{
					buttonAry = [ 'comline', 'editline', 'delline' ];
				  }
				
			}
			//暂存
			if (record.bill_status && record.bill_status.value == -99) {
				  if(record.is_cf&& record.is_cf.value==true){
					buttonAry = []; 
				  }else{		  
				buttonAry = [ 'editline' ];
				  }
			}
			//待审批
			if (record.bill_status && record.bill_status.value == -1) {
				buttonAry = [ 'uncomline' ];
			}
			//签字
			if (record.bill_status && record.bill_status.value == 8) {
				buttonAry = [ 'makebillline' ];
			}
			//签字
			if (record.bill_status && record.bill_status.value == 1) {
				buttonAry = [ 'uncomline' ];
			}

			return props.button.createOprationButton(buttonAry, {
				area: 'list_inner',
				buttonLimit: 4,
				onButtonClick: (props, key) => tableButtonClick.call(this, props, key, text, record, index)
			});
		}
	});
	return meta;
}
function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/