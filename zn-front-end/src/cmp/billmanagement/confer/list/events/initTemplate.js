/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon, NCMessage } = base;
import tableButtonClick from './tableButtonClick';
let tableid = 'table';
let pageId = '360701BCS_L01';

export default function (props) {
	//请求模板数据
	props.createUIDom(
		{
			pagecode: pageId,
			appcode: props.getUrlParam('c')
		},
		function (data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta(props, meta)
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('Ldelete', props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000011'));/* 国际化处理： 确认要删除该信息吗？*/
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	//添加操作列
	meta[tableid].items.push({
		attrcode: 'opr',
		label: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000002'),/* 国际化处理： 操作*/
		width: 160,
		itemtype: 'customer',
		className: "table-opr",
		fixed: 'right',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = ['Ledit', 'Ldelete']
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index)
			});
			// return (
			// 	<div className="currency-opr-col">
			// 		<span
			// 			className="row-edit-option"
			// 			onClick={() => {
			// 				props.pushTo("/card", {
			// 					status: 'edit',
			// 					from: 'list',
			// 					id: record.pk_bconfer.value
			// 				});
			// 			}}
			// 		>
			// 			{props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000003')}
			// 		</span>
			// 		<NCPopconfirm
			// 			trigger="click"
			// 			placement="top"
			// 			content={props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000004')}
			// 			onClose={() => {
			// 				let delObj = {
			// 					rowId: index,
			// 					status: '3',
			// 					values: {
			// 						ts: {
			// 							display: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000005'),/* 国际化处理： 时间戳*/
			// 							value: record.ts.value
			// 						},
			// 						pk_bconfer: {
			// 							display: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000006'),/* 国际化处理： 主键*/
			// 							value: record.pk_bconfer.value
			// 						}
			// 					}
			// 				};
			// 				let indexArr = [];
			// 				let deleteArr = [];
			// 				indexArr.push(index);
			// 				let deldata = {
			// 					ts: record.ts.value,
			// 					pk: record.pk_bconfer.value
			// 				};
			// 				deleteArr.push(deldata);
			// 				let data = { deldata: deleteArr }
			// 				ajax({
			// 					url: '/nccloud/cmp/billmanagement/conferdelete.do',
			// 					data,
			// 					success: function (res) {
			// 						let { success, data } = res;
			// 						if (success) {
			// 							props.table.deleteTableRowsByIndex(tableid, indexArr)
			// 							toast({ content: props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000007'), color: 'success', position: 'bottom' });/* 国际化处理： 删除成功*/
			// 						}
			// 					}
			// 				});
			// 			}}
			// 		>
			// 			<span>&nbsp;&nbsp;{props.MutiInit.getIntl("360701BCS") && props.MutiInit.getIntl("360701BCS").get('360701BCS-000008')}</span>
			// 		</NCPopconfirm>
			// 	</div>
			// );
		}
	});
	return meta;
}


/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/