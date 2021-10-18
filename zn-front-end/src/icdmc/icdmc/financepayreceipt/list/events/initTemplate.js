/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, toast, base } from "nc-lightapp-front";
import { list, gotocardcheck, btnLimit, card ,linkdataSource, islink,pkName} from "../../cons/constant.js";
import {
    setDefOrg2ListSrchArea,
    setDefOrg2AdvanceSrchArea,go2CardCheck
} from "src/tmpub/pub/util/index";
import { bodyButtonClick } from "../../../public/listBodyBtnClick";
import { linkVoucher } from "../../../public/cardEvent";
//引入缓存
import { deleteCacheDataForList, setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
let { NCPopconfirm, NCIcon, NCTooltip } = base;
export default function(props) {
    props.createUIDom(
        {
            pagecode: list.pageCode, //页面code
            appcode: props.getUrlParam('c')
        },
        data => {
            if (data) {
                if (data.template) {
                    let meta = data.template;
                    meta = modifierMeta.call(this,props, meta);
                    let src = props.getUrlParam("scene");
                    if ("fip" == src) {
                        //将联查标志加入缓存
                        setDefData(this.linkdataSource,this.islink, true);
                    }
                    // 给高级查询区域赋默认业务单元(在setMeta之前使用)
                   setDefOrg2AdvanceSrchArea(props, list.searchCode, data);
                    props.meta.setMeta(meta);
                    // 给列表查询区域赋默认业务单元(在setMeta之后使用)
                    if(!getDefData(linkdataSource, islink)){
                        setDefOrg2ListSrchArea(props, list.searchCode, data);
                    }
                    linkVoucher.call(this, props, "financepayreceipt");
                }
                if (data.button) {
                    /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setButtonDisabled(list.disabled_btn, true);
                    if(getDefData(linkdataSource, islink)){
                        //被联查时 列表只显示附件、联查、打印
                        props.button.setButtonVisible(['Bookkeeping', 'UnBookkeeping',
                                                      ,'elecsignformalPrint','elecsigninformalPrint','refresh_n'], false);
                    }
                }
            }
        }
    );
}

function modifierMeta(props, meta) {
    meta[this.searchId].items.find(
        e => e.attrcode === "pk_org"
    ).isMultiSelectedEnabled = true;
    meta[this.tableId].pagination = true;
    meta[this.searchId].items.map(item => {
        //参照的档案中没有显示"显示停用"
        item.isShowDisabledData = true;
        //财务组织根据角色权限显示
		if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					// funcode: app_code,
					funcode: props.getSearchParam('c'),//动态获取appcode 用于复制时过滤
					TreeRefActionExt: 'nccloud.web.tmpub.filter.FinanceOrgPermissionFilter'
				};
			};
        }
        //资金组织
        if (item.attrcode == "pk_org_r") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_creditorg: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue, 
                    TreeRefActionExt:"nccloud.web.tmpub.filter.CreditOrgFinanceRelationFilter"                      
                };
            };
        }
        if (item.attrcode == "pk_financepay") {
			item.queryCondition = () => {
                //财务组织
				let search_pkorg = props.search.getSearchValByField(list.searchCode, 'pk_org');
				if (search_pkorg) {
					search_pkorg = search_pkorg.value.firstvalue;
				} else {
					search_pkorg = null;
				}
				return {
					pk_orgForInterest: search_pkorg,
					GridRefActionExt:
						'nccloud.web.icdmc.icdmc.interestcompany.filter.FinancepayFilterByFinance'
				};
			};
        }
        if (item.attrcode == "contractid") {
            item.queryCondition = () => {
                return {
                    isquery: "true",
                    pk_org: props.search.getSearchValByField(
                        this.searchId,
                        "pk_org"
                    ).value.firstvalue
                };
            };
        }
    });
    meta[this.tableId].items = meta[this.tableId].items.map((item, key) => {
        let scene = props.getUrlParam("scene");
        // item.width = 150;
        if (item.attrcode == "vbillno") {
            item.render = (text, record, index) => {
                return (
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                go2CardCheck({
									props,
									url: gotocardcheck,
									pk: record[pkName].value,
									ts: record["ts"].value,
									checkTS: false,
									fieldPK: pkName,
									go2CardFunc: () => {
										props.pushTo("/card", {
                                            status: "browse",
                                            id: record[this.primaryId].value,
                                            pagecode: card.pageCode,
                                            scene,
                                            islisttocard: "islisttocard"
                                        });
									}
								})
                                
                            }}
                        >
                            {record && record.vbillno && record.vbillno.value}
                        </a>
                );
            };
        }
        return item;
    });
    //添加操作列
    if (!getDefData(linkdataSource, islink)) {
        //添加操作列
        meta[this.tableId].items.push({
            attrcode: "opr",
            label: this.state.json['36362IPR-000010'],/* 国际化处理： 操作*/
            width: 200,
            fixed: "right",
            itemtype: "customer",
            className: "table-opr",
            visible: true,
            render: (text, record, index) => {
                let buttonAry = [];
                let isTally = record.tallyflag && record.tallyflag.value; //是否记账
                if(!getDefData(linkdataSource, islink)){
                if (isTally) {
                    buttonAry = ["unBookkeeping_inner"];
                } else {
                    buttonAry = ["Bookkeeping_inner"];
                }
            }
                return <div>{
                    // 创建按钮
                     props.button.createErrorButton({
                         record: record,
                         sucessCallBack: () => {
                            return props.button.createOprationButton(buttonAry, {
                                rowIndex: index,
                                area: "list_inner",
                                buttonLimit: btnLimit,
                                onButtonClick: (props, key) =>
                                    bodyButtonClick.call(this, key, record, index)
                                });
                         }
                     })
     
                 }</div>
            }
        });
    }
    return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/