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
import { setDefOrg2AdvanceSrchArea } from '../../../../../tmpub/pub/util/index';
import { setDefOrg2ListSrchArea } from '../../../../../tmpub/pub/util/index';
import  {go2Card}  from '../../util/goToCard.js';

let { NCPopconfirm, NCIcon ,NCTooltip} = base;
import tableButtonClick from './tableButtonClick';

let searchId = 'search_D5';
let tableId = 'table_D5';
let pageId = '36070PBR_L04';
import appBase from "../../base";
const { cons, api } = appBase;

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
			pagecode: pageId //页面id
			//: '0001Z61000000003ONIZ' //注册按钮的id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					setDefOrg2AdvanceSrchArea(props,searchId,data);
					props.meta.setMeta(meta, () => {
						props.search.setSearchValByField(searchId, 'source_flag', { value: '9', display: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000045') }); //普通查询区赋值/* 国际化处理： 协同单据*/
						props.search.setSearchValByField(searchId, 'source_flag', { value: '9', display: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000045') }); //普通查询区赋值/* 国际化处理： 协同单据*/
						props.advancedSearch.setSearchValByField(searchId, 'source_flag', {
							value: '9',
							display: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000045')/* 国际化处理： 协同单据*/
						}); //给高级查询区赋默认值
					});
					setDefOrg2ListSrchArea(props,searchId,data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					this.buttonUsability.call(this);
					props.button.setPopContent('delline', this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000046'));/* 国际化处理： 确认要删除该信息吗？*/
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		//item.visible = true;
		//item.col = '3';
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
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org' ) {
			item.queryCondition = () => {
				return {
					funcode: '36070PBR',
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
	});

	//付款银行账号
	meta[searchId].items.map((item) => {
		if (item.attrcode == 'items.pk_oppaccount') {
			item.queryCondition = () => {
				let pk_org=props.search.getSearchValByField(searchId,'pk_org').value.firstvalue;
				let currtype=props.search.getSearchValByField(searchId,'items.pk_currtype').value.firstvalue;
				return {
					pk_orgs: pk_org,
					pk_currtype: currtype,
					refnodename: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000010'),/* 国际化处理： 使用权参照*/
					noConditionOrg:'Y',
					GridRefActionExt: 'nccloud.web.cmp.ref.CMPBatchOrgBankaccSubDefaultGridRefSqlBuilder' //自定义参照过滤条件
				};
			};
		}
	});

	meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		if (item.attrcode == 'bill_no') {
			item.render = (text, record, index) => {
				return (
				//	<NCTooltip placement="top" overlay={record.bill_no ? record.bill_no.value : ''}>
					<a
						style={{  cursor: 'pointer' }}
						onClick={() => {
							this.setStateCache();
							//弹异常提示
							//cardCache.setDefData(cons.comm.iserrtoast, cons.comm.dataSource, true);
							go2Card(props,{ status:"browse",id: record.pk_paybill.value,bill_status:record.bill_status.value} ,{} );
						}}
					>
						{record && record.bill_no && record.bill_no.value}
					</a>
				//	</NCTooltip>
				);
			};
		} else if (item.attrcode == 'bill_date') {
			item.render = (text, record, index) => {
				return <span>{record && record.bill_date && seperateDate(record.bill_date.value)}</span>;
			};
		}
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070PBRCOMP") && this.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000011'), //intl.get('20521030-0005'),/* 国际化处理： 操作*/
		width: 200,
		visible: true,
		itemtype: 'customer',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = [];
			//保存--自由态
			if (record.bill_status && record.bill_status.value == -10) {
				buttonAry = [ 'unconfirm' ];
			}
			//暂存
			if (record.bill_status && record.bill_status.value == -99) {
				buttonAry = [ 'editline' ];
			}
			//待审批
			if (record.bill_status && record.bill_status.value == -1) {
				buttonAry = [ 'uncomline' ];
			}
			//签字
			if (record.bill_status && record.bill_status.value == 8) {
				buttonAry = [ 'makebillline' ];
			}
			//未确认
			if (record.bill_status && record.bill_status.value == 9) {
				buttonAry = [ 'confirm', 'delline' ];
			}		

			//begin tm zhanghe 20191120 支持分布式事务异常交互
				// return props.button.createOprationButton(buttonAry, {
				// 	area: 'list_inner',
				// 	buttonLimit: 4,
				// 	onButtonClick: (props, key) => tableButtonClick.call(this,props, key, text, record, index)
				// });
				return (props.button.createErrorButton({
                    record,
                    showBack: false,
                    sucessCallBack: () => {
						return props.button.createOprationButton(buttonAry, {
							area: 'list_inner',
							buttonLimit: 4,
							onButtonClick: (props, key) => tableButtonClick.call(this,props, key, text, record, index)
						});
                    }
				}));
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