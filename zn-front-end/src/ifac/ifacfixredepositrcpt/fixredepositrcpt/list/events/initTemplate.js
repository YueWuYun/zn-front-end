/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { createPage, ajax, base, toast, cardCache} from 'nc-lightapp-front';
import { constant, requesturl, buttonDisable }  from '../../config/config';
import buttonVisible from './buttonVisible';
import { voucherLinkBill } from './voucherLinkBill';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";

let { setDefData, getDefData } = cardCache;
let searchcode = constant.searchcode;
let ltablecode = constant.ltablecode;
let cacheDataSource = constant.cacheDataSource;
import {
    setDefOrg2ListSrchArea,
    setDefOrg2AdvanceSrchArea
} from "src/tmpub/pub/util/index";

export default function(props) {
	props.createUIDom(
		{
			pagecode: constant.lpagecode,
			appcode: props.getUrlParam('c')
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;

					//联查场景标志
					let src = props.getUrlParam('scene');
					if ('fip' == src && props.getUrlParam('resource') != 'card' ) {
						initData.call(this, props);
					}

					// 转存处理联查转存单
					if ('linksce' == src && props.getUrlParam('resource') != 'card' ) {
						queryByPks.call(this, props);
					}

					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);

					// 给列表查询区域赋默认业务单元(在setMeta之后使用)
					setDefOrg2ListSrchArea(props, searchcode, data);
					setDefOrg2AdvanceSrchArea(props, searchcode, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonVisible.call(this, props, null);
				}
			}
		}
	);
}

function initData(props) {
	//主键信息
	let srcid = props.getUrlParam('id');
	//联查场景标志
	let src = props.getUrlParam('scene');
	if ('fip' == src) {//fip代表会计平台
		voucherLinkBill.call(this, this.props, constant.lpagecode, constant.ltablecode);
	} 
}

function queryByPks(props) {
    let data = {
        pks: props.getUrlParam('id'),
        pageCode: constant.lpagecode
    };
    ajax({
        url: requesturl.querybypks,
        data: data,
        success: (res) => {
            let { success, data } = res;
				if (success) {
					if (data) {
						props.table.setAllTableData(constant.ltablecode, data[constant.ltablecode]);
						let message = this.state.json['36340RFDR-000046'] + data[constant.ltablecode].rows.length + this.state.json['36340RFDR-000049'];
						toast({
							content: message,/* 国际化处理： 查询成功！*/
							color: 'success'
						})
					} else {
						toast({
							color: 'warning',
							content: this.state.json['36340RFDR-000047']//{/* 国际化处理： 未查询出符合条件的数据！*/}
						});
						props.table.setAllTableData(constant.ltablecode, {rows: []});
					}
					props.button.setButtonDisabled(buttonDisable.querydisable, true);
				}
        }
    });
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {

	// meta[ltablecode].pagination = true;
	if(props.getUrlParam("scene") == 'fip' || props.getUrlParam("scene") == 'linksce'){
		meta[ltablecode].pagination = false;
	} else {
		meta[ltablecode].pagination = true;
	}

	// 资金组织参照跨集团
	meta[searchcode].items.find((e) => e.attrcode == 'pk_fundorg').isShowUnit = true;

	meta[constant.ltablecode].items = meta[constant.ltablecode].items.map((item, key) => {
		//点击某一列跳转到browse状态
		if (item.attrcode == 'vbillcode') {
			let scene = this.props.getUrlParam("scene");
			item.render = (text, record, index) => {
                if(record && record.vbillcode && record.vbillcode.value){
                    return (
						<a
							style={{ cursor: "pointer" }}
							onClick={() => {
								go2CardCheck({
									props,
									url: requesturl.gotocardcheck,
									pk: record[constant.pkname].value,
									ts: record["ts"].value,
									checkTS: false,
									fieldPK: constant.pkname,
									go2CardFunc: () => {
										props.pushTo("/card", {
											status: "browse",
											id: record.pk_fixredepositrcpt.value,
											pagecode: constant.lpagecode,
											scene: scene,
											islisttocard: "islisttocard"
										});
									}
								})
							}}
						>
						{record && record.vbillcode && record.vbillcode.value}
						</a>
                    );
                }else{
                    return (
						<a
							style={{ cursor: "pointer" }}
							onClick={() => {
								go2CardCheck({
									props,
									url: requesturl.gotocardcheck,
									pk: record[constant.pkname].value,
									ts: record["ts"].value,
									checkTS: false,
									fieldPK: constant.pkname,
									go2CardFunc: () => {
										props.pushTo("/card", {
											status: "browse",
											id: record.pk_fixredepositrcpt.value,
											pagecode: constant.lpagecode,
											scene: scene,
											islisttocard: "islisttocard"
										});
									}
								})
							}}
						>
						{'------'}
						</a>
                    );
                }               
            };
		} else if (item.attrcode == 'dbilldate') {
			item.render = (text, record, index) => {
				return <span>{record.dbilldate && seperateDate(record.dbilldate.value)}</span>;
			};
		} else if (item.attrcode == 'doperatedate') {// 制单日期
			item.render = (text, record, index) => {
				return <span>{record.doperatedate && seperateDate(record.doperatedate.value)}</span>;
			};
		}
		return item;
	});
	//参展过滤
	meta[searchcode].items.map((item) => {

		item.isShowDisabledData = true;

		// 财务组织：根据用户权限过滤
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					pk_fundpayorg: (props.search.getSearchValByField(constant.searchcode, 'pk_fundorg') || {}).value.firstvalue, 
					TreeRefActionExt: 'nccloud.web.ifac.filter.FundFinanceOrgRelationFilter'
				};
			};
		}

		// 资金组织：
		if (item.attrcode == 'pk_fundorg') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					pk_finorg: (props.search.getSearchValByField(constant.searchcode, 'pk_org') || {}).value.firstvalue, 
					TreeRefActionExt: 'nccloud.web.ifac.filter.FinanceFundOrgRelationFilter'
				};
			};
		}

		//定期利率参照过滤
		if (item.attrcode == 'pk_depostrate') {
			//item.isTreelazyLoad = false;
			item.queryCondition = () => {
				return {
					ratetype:"FRATE",
					//pk_org: (props.search.getSearchValByField(ist.searchCode, 'pk_org') || {}).value.firstvalue,
					GridRefActionExt: 'nccloud.web.ifac.regularvarietyset.filter.RegularsetDepositrateFilter'
				}					   
			}
		}

		// 定期账户过滤
		if (item.attrcode == 'pk_depositacc') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					isSelect:'Y',
                    noConditionOrg:'Y',
					pk_org: (props.search.getSearchValByField(constant.searchcode, 'pk_org') || {}).value.firstvalue, 
					pk_fundorg: (props.search.getSearchValByField(constant.searchcode, 'pk_fundorg') || {}).value.firstvalue, 
					pk_currtype: (props.search.getSearchValByField(constant.searchcode, 'pk_currtype') || {}).value.firstvalue, 
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkDepositaccFilter'
				}					   
			}
		}

		// 结算账户过滤
		if (item.attrcode == 'pk_settleacc') {
			item.queryCondition = () => {
				return {
					funcode: constant.appcode,
					isSelect:'Y',
                    noConditionOrg:'Y',
					pk_org: (props.search.getSearchValByField(constant.searchcode, 'pk_org') || {}).value.firstvalue, 
					pk_fundorg: (props.search.getSearchValByField(constant.searchcode, 'pk_fundorg') || {}).value.firstvalue, 
					pk_currtype: (props.search.getSearchValByField(constant.searchcode, 'pk_currtype') || {}).value.firstvalue, 
					GridRefActionExt: 'nccloud.web.ifac.fixeddatewithdrawapply.filter.NCCPkSettleaccFilter'
				}					   
			}
		}

	});


	// 添加操作列,实际没有操作列，为了适配云原生。
	if(props.getUrlParam('scene') != 'linksce' && props.getUrlParam('scene') != 'fip'){
		meta[constant.ltablecode].items.push({
			attrcode: 'opr',
			// label: this.state.json['36140RFD-000066'],/* 国际化处理： 操作*/
			width: 0,
			fixed: 'right',
			className:"table-opr",
			itemtype: 'customer',
			visible: true,
			render: (text, record, index) => {
				let buttonAry = [];
				if(record.billstate && record.billstate.value == '1'){// 已记账
					buttonAry = ['untallytablebtn'];
				}else if(record.billstate && record.billstate.value == '0'){// 未记账
					buttonAry = ['edittablebtn','tallytablebtn'];
				}
				
				return props.button.createErrorButton(buttonAry, {
					area: "list_inner",
					buttonLimit: 3,
					onButtonClick: (props, key) => bodyButtonClick.call(this, props, key, text, record, index)
				});
			}
		});
	}

	//设置参照可以多选和是否清楚记录
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;	//财务组织:全加载

	meta[searchcode].items.find((e) => e.attrcode === 'pk_fundorg').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_fundorg').showHistory = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_fundorg').isTreelazyLoad = false;	//财务组织:全加载
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/