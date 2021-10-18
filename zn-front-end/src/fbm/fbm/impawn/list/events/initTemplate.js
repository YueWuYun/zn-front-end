/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { excelImportconfig } from 'nc-lightapp-front';
import { setDefOrg2AdvanceSrchArea, setDefOrg2ListSrchArea } from 'src/tmpub/pub/util/index';
import { initList } from '../../../../public/container/page';
import { app_code, button_limit, LIST } from '../../cons/constant.js';
import { bodyButtonClick } from './index';
export default function (props) {
	let pagecode = LIST.page_id;
	let scene = this.props.getUrlParam("scene"); // 凭证,报表联查
	if (scene === "linksce" || scene === "fip" ) {
		pagecode = LIST.page_id_link;
	}
	let excelimportconfig = excelImportconfig(props, "fbm", '36HA',true,"",{"appcode":app_code,"pagecode":LIST.page_id});
	let appcode = props.getSearchParam("c") || props.getUrlParam("c");
	props.createUIDom(
		{
			pagecode: pagecode,//页面code
			appcode: appcode
		},
		(data) => {
			if (data) {
				if (data.button) {
					/* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent('DeleteInner', this.props.MutiInit.getIntl("36180BI") && this.props.MutiInit.getIntl("36180BI").get('36180BI-000005'));/* 国际化处理： 确认要删除吗?*/
					props.button.setButtonDisabled(LIST.disabled_btn, true);
					props.button.setUploadConfig("Import", excelimportconfig);
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
	meta[this.searchId].items.map(item => {
		// 自定义项过滤
		if (item.attrcode.indexOf("def") > -1) {
			//自定义档案按照组织或者集团过滤
			item.queryCondition = (p) => {
				let pk_org = this.props.search.getSearchValByField(this.searchId, 'pk_org');
				if (pk_org && pk_org.value && pk_org.value.firstvalue) {
					return {
						pk_org: pk_org.value.firstvalue
					};
				}
			}
		}
		if (item.attrcode === 'pk_org') { //财务组织过滤
			item.isMultiSelectedEnabled = true; //财务组织多选
			item.queryCondition = () => {
				return {
					funcode: this.props.getSearchParam('c'),//appcode获取
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
		} 
		//借款单位  客商参照需要传pk_org和pk_group
		if (item.attrcode == "debitunit") {
		  item.queryCondition = () => {
			let pk_org = this.props.search.getSearchValByField(this.searchId, 'pk_org');
			let pk_group = this.props.search.getSearchValByField(this.searchId, 'pk_group');
			return {
			  pk_org: pk_org && pk_org.value.firstvalue,
			  pk_group: pk_group && pk_group.value.firstvalue
			};
		  };
		}
	});
	meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
		let pagecode = LIST.page_id;
		let scene = this.props.getUrlParam("scene"); // 凭证,报表联查
		if (scene === "linksce" || scene === "fip" ) {
			pagecode = LIST.page_id_link;
		}
		if (item.attrcode == this.billNo) {
			item.render = (text, record, index) => {
				return (
					<a
						style={{ cursor: 'pointer' }}
						onClick={() => {
							props.pushTo('/card', {
								status: 'browse',
								id: record[this.primaryId].value,
								pagecode: pagecode,
								scene:scene
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
		label: this.props.MutiInit.getIntl("36180BI") && this.props.MutiInit.getIntl("36180BI").get('36180BI-000006'),/* 国际化处理： 操作*/
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
			let buttonAry = [];
			let busistatus = record.vbillstatus && record.vbillstatus.value;
			let onlinebankflag = record.onlinebankflag.value;
			let disableflag = record.disableflag.value;
			//质押指令状态
			let paymentstatus =  record.paymentstatus.value;
			//解押指令状态
			let backimpawnstatus = record.backimpawnstatus.value;
            //质押状态
            let impawnstatus = record.impawnstatus.value;
			switch (busistatus) {
				case '-1':	//待提交
				    buttonAry = [ 'CommitInner','EditInner', 'DeleteInner'];
					break;
				case '3':	//待审批
					buttonAry = ['UnCommitInner'];
					break;
				case '2':	//待审批
					buttonAry = ['UnCommitInner'];
					break;
				case '1':	//审批通过
					if (onlinebankflag) {
                        //网银
                        if (backimpawnstatus == null) {
                            //质押收回指令状态
                            if (paymentstatus == null) {
                                //发送指令状态
                                buttonAry = ["UnCommitInner", "CommandInner"];
                            } else {
                                if (disableflag) {
                                    buttonAry = [
                                        "CancelDisabledInner"
                                    ];
                                } else {
                                    if (paymentstatus == 1) {
                                        //成功显示解除质押
                                        buttonAry = [
                                            "ImpawnBackInstrInner"
                                        ];
                                    } else if (paymentstatus == 2) {
                                        //失败显示发送指令
                                        buttonAry = [
                                            "CommandInner",
                                            "DisabledInner"
                                        ];
                                    } else if (paymentstatus == 3) {
                                        //不明显示质押收回撤回
                                        buttonAry = [
                                            "WithdrawImpawnInner"
                                        ];
                                    }
                                }
                            }
                        } else {
							if (backimpawnstatus == 2) {
                                buttonAry = [
                                    "ImpawnBackInstrInner"
                                ];
                            } else if (backimpawnstatus == 3) {
                                buttonAry = [
                                    "WithdrawImpawnInner"
                                ];
                            }
                        }
                    } else {
                        if (impawnstatus == "hasback") {
                            buttonAry = [
                                "CancelImpawnBackInner"
                            ];
                        } else {
                            buttonAry = [
                                "UnCommitInner",
                                "ImpawnBackInstrInner"
                            ];
                        }
					}
					break;
				default:
					break;
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