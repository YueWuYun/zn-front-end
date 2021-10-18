/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { base , cardCache} from 'nc-lightapp-front';
import { constant } from '../../config/config';
import { cache } from '../../../../../tmpub/pub/cons/constant';


let { NCPopconfirm } = base;

const cpagecode = constant.approve_card_pagecode;
const formcode1 = constant.formcode1;
const fromcode2 = constant.formcode2;
const fromcode3 = constant.formcode3;
let cacheDataSource = constant.cacheDataSource;


export default function(props, json, inlt) {
	props.createUIDom(
		{
			pagecode: constant.approve_card_pagecode, //页面id
			appid: constant.appregisterpk //'0001Z61000000001PA3B' //注册按钮的id
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta(props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}

			//begin lidyu 单击进入卡片 异常交互 
			cardCache.setDefData(cache.iserrtoast, cacheDataSource, true);
			//end 
			}
		}
	);
}

function modifierMeta(props, meta) {
	let status = props.getUrlParam('status');
	meta[formcode1].status = status;

	// let multiLang = props.MutiInit.getIntl('2052');
	// let porCol = {
	// 	attrcode: 'opr',
	// 	label: multiLang && multiLang.get('20521030-0005'),
	// 	visible: true,
	// 	width: 200,
	// 	render(text, record, index) {
	// 		let status = props.cardTable.getStatus(formcode1);
	// 		return status === 'browse' ? (
	// 			<span
	// 				onClick={() => {
	// 					props.cardTable.toggleRowView(formcode1, record);
	// 				}}
	// 			>
	// 				{' '}
	// 				{this.state.json['36070WC-000006']}{/* 国际化处理： 切换视图*/}
	// 			</span>
	// 		) : (
	// 			<div className="currency-opr-col">
	// 				<span
	// 					className="currency-opr-del"
	// 					onClick={(e) => {
	// 						props.cardTable.openModel(formcode1, 'edit', record, index);
	// 						e.stopPropagation();
	// 					}}
	// 				>
	// 					<i className="icon iconfont icon-gengduo" />
	// 				</span>
	// 				&nbsp;&nbsp;
	// 				<span
	// 					className="currency-opr-del"
	// 					onClick={(e) => {
	// 						props.cardTable.deleteRowsByIndex(formcode1, index);
	// 						e.stopPropagation();
	// 					}}
	// 				>
	// 					<i className="icon iconfont icon-shanchu" />
	// 				</span>
	// 			</div>
	// 		);
	// 	}
	// };
	// meta[formcode1].items.push(porCol);

	//财务组织:全加载
	meta[formcode1].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;


	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/