/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base, ajax } from 'nc-lightapp-front';
import { buttonVisible } from './buttonVisible';
import {cardCache} from "nc-lightapp-front";
import tableButtonClick from './tableButtonClick';
import {RowDetailButton} from '../../../../../tmpub/pub/util/RowDetailButton'; 
let {setDefData, getDefData } = cardCache;
import { RefFilter, FormRefFilter } from '../../util/TableRefFilter';
let formId = 'head';
let tableId = 'paybilldetail_table';
let pageId = '36070PBR_C04';
let childformId = 'childform1';
export default function(props) {
	let that = this;
	props.createUIDom(
		{
			pagecode: pageId, //页面id
			//appcode: '36070PBR',
			appid: '0001Z61000000003ONIZ' //注册按钮的id
		},
		function(data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					//props.button.setButtons(button);
					props.button.setButtons(button, () => {
						 buttonVisible.call(that,props);
					});
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta(that,props, meta);
					props.meta.setMeta(meta, () => {
						if (props.getUrlParam('status') == 'add') {
							props.initMetaByPkorg();
						} else {
							props.meta.setMeta(meta);
						}
					});
				}
				
				//修改页面状态
				//togglePageShow(props);
			}
		}
	);
}

function modifierMeta(that,props, meta) {
	let status = props.getUrlParam('status');
	meta[formId].status = status;
	meta[tableId].status = status;
	
	//form 去除缓存 历史记录
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = false;
	//财务组织:全加载
	meta[formId].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;
	meta[formId].items.find((e) => e.attrcode === 'pk_org').showHistory = false;
	meta[formId].items.find((e) => e.attrcode === 'mon_account').showHistory = false;
	meta[formId].items.find((e) => e.attrcode === 'pk_supplier').showHistory = false;
	//form参照过滤
	meta[formId].items.map((item) => {
		 FormRefFilter.call(this, props, item);
	});

	//table去除缓存 历史记录
	meta[tableId].items.find((e) => e.attrcode === 'mon_account').showHistory = false;
	meta[tableId].items.find((e) => e.attrcode === 'pk_account').showHistory = false;
	meta[tableId].items.find((e) => e.attrcode === 'pk_supplier').showHistory = false;
	meta[tableId].items.find((e) => e.attrcode === 'pk_oppaccount').showHistory = false;
	//table参照过滤
	meta[tableId].items.map((item) => {
		RefFilter.call(this, props, item);
	});
	meta[childformId].items.find((e) => e.attrcode === 'mon_account').showHistory = false;
	meta[childformId].items.find((e) => e.attrcode === 'pk_account').showHistory = false;
	meta[childformId].items.find((e) => e.attrcode === 'pk_supplier').showHistory = false;
	meta[childformId].items.find((e) => e.attrcode === 'pk_oppaccount').showHistory = false;
	//侧拉form 参照过滤
	meta[childformId].items.map((item) => {
		RefFilter.call(this, props, item);
	});


	let multiLang = props.MutiInit.getIntl('2052');
	let porCol = {
		attrcode: 'opr',
		//label: multiLang && multiLang.get('20521030-0005'),
		label: that.props.MutiInit.getIntl("36070PBRCOMP") && that.props.MutiInit.getIntl("36070PBRCOMP").get('36070PBRCOMP-000011'),/* 国际化处理： 操作*/
		visible: true,
		itemtype: 'customer',
		width: '210px',
		fixed: 'right',
		render: (text, record, index) => {
			let  status= props.cardTable.getStatus(tableId);
			let buttonAry =
				props.getUrlParam('status') === 'browse'
				? (record.expandRowStatus ? ["closebrowse"] : ["openbrowse"])
					: that.state.pasteflag ? [ 'CopyAtLine' ] : [ 'openedit', 'copybody', 'insertline', 'deleteline' ];
			return props.button.createOprationButton(buttonAry, {
				area: 'card_body_inner',
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(that,props, key, text, record, index)
			});
		}
	};
	meta[tableId].items.push(porCol);
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/