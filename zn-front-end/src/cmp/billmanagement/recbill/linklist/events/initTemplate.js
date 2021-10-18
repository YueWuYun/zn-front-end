/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import { createPage, ajax, base, toast } from 'nc-lightapp-front';
let { NCPopconfirm, NCIcon } = base;
import tableButtonClick  from './tableButtonClick';
import {Templatedata} from "../../config/Templatedata";//配置的id和area信息
let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.link_list_pageid;
let moudleId = Templatedata.list_moduleid;
let appId = Templatedata.link_list_appid;
export default function (props) {
	let self = this;
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appid: appId//注册按钮的id
		},
		function (data) {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(self,props, meta)
					props.meta.setMeta(meta);
				}
				
			}
		}
	)
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		// item.visible = true;
		// item.col = '3';
		return item;
	})
	//操作列点击事件
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;
		//单据编号
		if (item.attrcode == 'bill_no') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ textDecoration: 'underline', cursor: 'pointer' }}
						onClick={() => {
							props.linkTo('/cmp/billmanagement/recbill/listcard/index.html', {
								status: 'browse',
								id: record.pk_recbill.value,
								billno: record.bill_status.value,
								pagecode:pageId
							});
						}}
					>
						{record && record.bill_no && record.bill_no.value}
					</a>
				);
			};
		}
		else if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return (
					<span>
						{record.dbilldate && seperateDate(record.dbilldate.value)}
					</span>
				);
			};
		}
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000018'),/* 国际化处理： 操作*/
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {

			let buttonAry =[];

			if(record && record.bill_status && record.bill_status.value == '-10' ){
				/* 单据状态：已保存  */
				buttonAry=["submittableBtn","edittableBtn", "deletetableBtn"];
			}else if(record && record.bill_status && record.bill_status.value == '-99'){
				/* 单据状态：暂存 */
				buttonAry=["edittableBtn"];
			}else if(record.bill_status && record.bill_status.value == '8' ){
				/* 单据状态：签字 */
				buttonAry=["makebilltableBtn"];
			}else if(record.bill_status && record.bill_status.value == '-1' ){
				/* 单据状态：待审批 */
				buttonAry=["unsubmittableBtn"];
			}

			return props.button.createOprationButton(buttonAry, {
				area: Templatedata.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick(props, key, text, record, index)
			});


		}
	});
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/