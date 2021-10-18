/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, toast, base } from "nc-lightapp-front";
import { list, appCode, btnLimit, card ,linkdataSource, islink} from "../../cons/constant.js";
import {
    setDefOrg2ListSrchArea,
    setDefOrg2AdvanceSrchArea,
    go2CardCheck
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
                //console.log(data);
                if (data.template) {
                    let meta = data.template;
                    let src = props.getUrlParam("scene");
                    if ("fip" == src) {
                        //将联查标志加入缓存
                        setDefData(linkdataSource, islink, true);
                    }

                    meta = modifierMeta.call(this, props, meta);
                    // 给高级查询区域赋默认业务单元(在setMeta之前使用)
                    !this.props.getUrlParam("id") &&
                        setDefOrg2AdvanceSrchArea(props, list.searchCode, data);
                    props.meta.setMeta(meta);
                    // 给列表查询区域赋默认业务单元(在setMeta之后使用)
                    if(!getDefData(linkdataSource, islink) && !this.props.getUrlParam("id")){
                        setDefOrg2ListSrchArea(props, list.searchCode, data);
                    }
                    linkVoucher.call(this, props, "interestlist");
                }
                if (data.button) {
                    /* 按钮适配  第一步：将请求回来的按钮组数据设置到页面的 buttons 属性上 */
                    let button = data.button;
                    props.button.setButtons(button);
                    props.button.setButtonDisabled(list.disabled_btn, true);
                    //被联查时 没有制证相关、刷新
                    if (getDefData(linkdataSource, islink)) {
						props.button.setButtonVisible(['accreditation', 'unAccreditation','refresh_n'], false);
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
    //meta[this.tableId].pagination = true;
    let src = props.getUrlParam('scene');
	let islinkquery = props.getUrlParam('islinkquery');
    if(!islinkquery&&!src){
		meta[this.tableId].pagination = true;
	}else{
		meta[this.tableId].pagination = false;
	}
    meta[this.searchId].items.map(item => {
        // 是否有【显示停用】功能
        item.isHasDisabledData = true, 
        //参照的档案中没有显示"显示停用"
        item.isShowDisabledData = true;        
        //发送发组织，接收方组织：根据用户权限过滤
        if (item.attrcode == "pk_org") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    TreeRefActionExt:
                        "nccloud.web.tmpub.filter.FinanceOrgPermissionFilter"
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
        //贷款单位
        if (item.attrcode == "financorgid") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_orgfilter: (props.search.getSearchValByField(this.searchId, 'pk_org') || {}).value.firstvalue, 
                    TreeRefActionExt:"nccloud.web.icdmc.icdmc.interestcompany.filter.FinancorgidFilterByPkorg"                        
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
        // item.width = 150;
        if (item.attrcode == "vbillno") {
            item.render = (text, record, index) => {
                return (
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                go2CardCheck({
                                    props,
                                    url: '/nccloud/icdmc/interestlist/check2card.do',
                                    pk: record.pk_interestlisticdmc.value,
                                    ts: record.ts.value,
                                    //checkTS: record.ts.value ? true : false,
                                    checkTS:  false,
                                    checkSaga: false,
                                    fieldPK: 'pk_interestlisticdmc',
                                    go2CardFunc: () =>{
                                        props.pushTo("/card", {
                                            status: "browse",
                                            id: record[this.primaryId].value,
                                            pagecode: card.pageCode
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
        meta[this.tableId].items.push({
            attrcode: "opr",
            label: this.state.json['36362FCIB-000003'],/* 国际化处理： 操作*/
            width: 200,
            fixed: "right",
            itemtype: "customer",
            className: "table-opr",
            visible: true,
            render: (text, record, index) => {
                let buttonAry = [];
                let voucherflag =
                    record.voucherflag && record.voucherflag.value; //单据状态
                if (voucherflag) {
                    buttonAry = ["unAccreditation_inner"];
                } else {
                    buttonAry = ["accreditation_inner"];
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