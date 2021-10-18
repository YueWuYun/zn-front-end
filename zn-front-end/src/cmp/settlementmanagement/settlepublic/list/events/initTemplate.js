/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/
import tableButtonClick from './tableButtonClick';
import { Templatedata } from "../../config/Templatedata";//配置的id和area信息
import appBase from '../../../base';
const { api } = appBase;
let searchId = Templatedata.list_searchid;
let tableId = Templatedata.list_tableid;
let pageId = Templatedata.list_pageid;
let moudleId = Templatedata.list_moduleid;
let bill_funcode = Templatedata.bill_funcode;
export default function (props) {
	props.createUIDom(
		{
			pagecode: pageId,//页面id
			appid: Templatedata.list_appid//注册按钮的id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta)
					props.meta.setMeta(meta, () => {
						if (this.state.direction) {//查询区赋值查询方向
							this.props.search.setSearchValByField(this.searchId, 'direction', this.state.direction);
							this.props.search.setDisabledByField(this.searchId, 'direction', true);
						}
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
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
	let that = this;
	meta[searchId].items = meta[searchId].items.map((item, key) => {
		item.visible = true;
		item.col = '3';
		//参照的档案中没有显示“显示停用”的字段
		item.isShowDisabledData = true;
		if (item.attrcode == 'pk_org') {
			item.showHistory = false;
			item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					funcode: bill_funcode,
					TreeRefActionExt: 'nccloud.web.cmp.ref.CMPUserPermissionOrgBuilder'
				};
			};
		}
		return item;
	})
	//操作列点击事件
	meta[tableId].items = meta[tableId].items.map((item, key) => {
		// item.width = 150;
		//单据编号
		/*
		if (item.attrcode == 'billcode') {
			item.render = (text, record, index) => {
				return (
					<a
						style={{  cursor: 'pointer' }} // textDecoration: 'underline',
						onClick={() => {
							let billstatus = -1;
							let status = record.settlestatus.value;
							let pk_signer = record.pk_signer.value;
							let aduitstatus = record.aduitstatus.value;
							let pk_executor = record.pk_executor.value;
							if (aduitstatus && aduitstatus == 0 && !pk_signer) {
								//已审批，待签字
								billstatus = 1;
							}
							if (aduitstatus && aduitstatus == 0 && pk_signer && !pk_executor) {
								//已审批已签字，未结算
								billstatus = 2;
							}
							if (aduitstatus && aduitstatus == 0 && pk_signer && pk_executor) {
								//已结算
								billstatus = 3
							}
							if (!aduitstatus || aduitstatus != 0) {
								//未审批,鱼腩
								billstatus = 0;
							}

							props.linkTo('../settlement/card/index.html', {
								status: 'browse',
								id: record.pk_settlement.value,
								//billno: record.bill_status.value
								billno: billstatus
							});
						}}
					>
						{record && record.billcode && record.billcode.value}
					</a>
				);
			};
		}
		else */
		if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return (
					<span>
						{record.dbilldate && seperateDate(record.dbilldate.value)}
					</span>
				);
			};
		}
		//begin tm tangleic 20190730 重复支付数据在组织前增加图标标示
		api.appendIcon({ props, item, field: 'pk_org_v' });
		//end tangleic 
		return item;
	});
	//添加操作列
	meta[tableId].items.push({
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("360704SM") && this.props.MutiInit.getIntl("360704SM").get('360704SM-000016'),/* 国际化处理： 操作*/
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = ['nextBtn'];
			return (
				<div>
					{/* {api.buildWarnIcon(props, { record })} */}
					{props.button.createOprationButton(buttonAry, {
						area: Templatedata.list_inner,
						buttonLimit: 3,
						onButtonClick: (props, key) => tableButtonClick.call(that, props, key, text, record, index)
					})}
				</div>)
		}
	});
	//meta[searchId].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchId].items.find((e) => e.attrcode === 'pk_org').showHistory = false;
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakcDmThTnhtmzEaAZvcUa3D6drQZ1Oah7lR52tc4RI/tG*/