/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, base, toast, excelImportconfig } from 'nc-lightapp-front';
import { bodyButtonClick } from './index';
import { LIST, CARD, button_limit } from '../../cons/constant.js';
import { initList } from '../../../../public/container/page';
import { setDefOrg2ListSrchArea, setDefOrg2AdvanceSrchArea } from 'src/tmpub/pub/util/index';
export default function (props) {
	let app_code = props.getSearchParam('c');
	let excelimportconfig = excelImportconfig(props, "fbm", '36H2', true, "", { "appcode": app_code, "pagecode": CARD.page_id });
	let pagecode = LIST.page_id;
	let scene = this.props.getUrlParam("scene");
	if (scene && (scene === "linksce" || scene === "fip")) {
		pagecode = LIST.page_id_link;
	}
	props.createUIDom(
		{
			pagecode: pagecode,//页面code
			appcode: app_code
		},
		(data) => {
			if (data) {
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('DeleteInner', this.props.MutiInit.getIntl("36180BS") && this.props.MutiInit.getIntl("36180BS").get('36180BS-000008'));/* 国际化处理： 确认要删除吗?*/
					props.button.setButtonDisabled(LIST.disabled_btn, true);
					props.button.setUploadConfig("QuickImport", excelimportconfig);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					//给高级查询区域赋默认业务单元(在setMeta之前使用)
					setDefOrg2AdvanceSrchArea(props, LIST.search_id, data);
					props.meta.setMeta(meta);
					//给列表查询区域赋默认业务单元(在setMeta之后使用)
					setDefOrg2ListSrchArea(props, LIST.search_id, data);
					templateCallback.call(this, meta);
				}
			}
		}
	)
}

function modifierMeta(props, meta) {
	meta[this.tableId].pagination = true;
	if (meta[this.searchId] && meta[this.searchId].items) {
		meta[this.searchId].items.map(item => {
			if (item.attrcode === 'pk_org') { //财务组织过滤
				item.isMultiSelectedEnabled = true; //财务组织多选
				item.queryCondition = () => {
					return {
						funcode: this.props.getSearchParam('c'),//appcode获取
						TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
					};
				};
			} else if (item.attrcode === 'bondvariety') { //发债品种
				item.isMultiSelectedEnabled = true;
				item.queryCondition = () => {
					return { variety_category: "BOND" };
				};
			} // 自定义项过滤
			else if (item.attrcode.indexOf("def") > -1) {
				//自定义档案按照组织或者集团过滤
				item.queryCondition = (p) => {
					let pk_org = this.props.search.getSearchValByField(this.searchId, 'pk_org');
					if (pk_org && pk_org.value && pk_org.value.firstvalue) {
						return {
							pk_org: pk_org.value.firstvalue
						};
					}
				}
			} else if (item.attrcode == 'fbmbilltype') {
				item.queryCondition = () => {
					return {
						GridRefActionExt: 'nccloud.web.fbm.fbm.sign.filter.GatherFbmbilltypeRefModelFilter'
					};
				};
			}else if (item.attrcode === "hidereceiveunit"||item.attrcode === "receiveunit") { 			
				item.queryCondition = () => {
				let pk_org =
					this.props.search.getSearchValByField(this.searchId, "pk_org") &&
					this.props.search.getSearchValByField(this.searchId, "pk_org").value &&
					this.props.search.getSearchValByField(this.searchId, "pk_org").value.firstvalue;

				let pk_group =
					this.props.search.getSearchValByField(this.searchId, "pk_group") &&
					this.props.search.getSearchValByField(this.searchId, "pk_group").value &&
					this.props.search.getSearchValByField(this.searchId, "pk_group").value.firstvalue;
				return {
					pk_org: pk_org,
					pk_group: pk_group
				};
			};
		}
		});
	}

	meta[this.tableId].pagination = true;
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		// item.width = 150;
		if (item.attrcode == this.billNo) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[LIST.primary_id].value,
								//pagecode: LIST.page_id
								pagecode: CARD.page_id
							});
						}}
					>
						{record[this.billNo] && record[this.billNo].value}
					</a>
				);
			};
		}
		return item;
	});


	//添加操作列
	meta[this.tableId].items.push({
		itemtype: 'customer',
		attrcode: 'opr',
		label: this.props.MutiInit.getIntl("36180BS") && this.props.MutiInit.getIntl("36180BS").get('36180BS-000004'),/* 国际化处理： 操作*/
		width: 200,
		fixed: 'right',
		className: "table-opr",
		visible: true,
		render: (text, record, index) => {
      return (
        <div>
          {// 适配云原生 改造适配
          props.button.createErrorButton({
            record: record,
            //showBack: false,  //不显示回退，默认显示
            sucessCallBack: () => {
              // 原有行内按钮逻辑 需要在sucessCallBack中去处理
			let buttonAry = [];
			let busistatus = record.vbillstatus && record.vbillstatus.value;
			// 网银
			let cyberbankflag = record.cyberbankflag && record.cyberbankflag.value;
			// 制证
			let voucher = record.voucher && record.voucher.value;
			let initflag = record.initflag && record.initflag.value;
			// 指令状态
			let elcpaymentstatus = record.elcpaymentstatus && record.elcpaymentstatus.value;
			let disableflag = record.disableflag && record.disableflag.value;
			//  撤回指令状态 recallstatus
			let recallstatus = record.recallstatus && record.recallstatus.value;
			if (!initflag) { // 期初票不可做任何操作
				switch (busistatus) {
					case '-1':	//待提交
						buttonAry = ['CommitInner', 'EditInner', 'DeleteInner'];
						break;
					case '1':	//审批通过
						if (cyberbankflag) {//是网银
							if (elcpaymentstatus === '2') { // 交易失败： 发送指令、作废
								if (disableflag) {
									buttonAry = [ 'CancelDisabledInner'];
								} else {
									buttonAry = ['CommandInner', 'DisabledInner'];
								}
							}
							if (elcpaymentstatus === '3') { // 交易不明： 撤回指令
								if (recallstatus === '3') {  // 撤回不明
								} else {
									buttonAry = ['CancelCommandInner'];
								}
							}
							if (elcpaymentstatus === '1') { // 交易成功： 制证
								if (voucher) {// 已制证
									//收回、取消制证 
									buttonAry = ['CancelVoucherInner'];
								} else {
									//收回、制证 
									buttonAry = ['MakeVoucherInner'];
								}
							}
							if(!elcpaymentstatus){
								buttonAry = ['CommandInner'];
							}
						} else {
							if (voucher) {// 已制证
								//收回、取消制证 
								buttonAry = ['UnCommitInner', 'CancelVoucherInner'];
							} else {
								//收回、制证 
								buttonAry = ['UnCommitInner', 'MakeVoucherInner'];
							}

						}

						break;
					case '3':	//提交
						buttonAry = ['UnCommitInner'];
						break;
					default:
						break;
				}
			}
			return props.button.createOprationButton(buttonAry, {
				area: "list_inner",
				buttonLimit: button_limit,
				onButtonClick: (props, key) => bodyButtonClick.call(this, key, record, index)
			});
            }
          })}
        </div>
      );
    }
  });
  return meta;
}

//模板加载后的回调函数
function templateCallback(meta) {
	initList.call(this);
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/