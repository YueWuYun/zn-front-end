/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/
import { createPage, ajax, base, toast, cardCache } from 'nc-lightapp-front';
import { constant, requesturl, buttonDisable }  from '../../config/config';
import { buttonVisible } from './buttonVisible';
import { go2CardCheck } from "../../../../../tmpub/pub/util/index";

let { NCTooltip } = base;
let { setDefData, getDefData } = cardCache;
let searchcode = constant.searchcode;
let ltablecode = constant.ltablecode;
let cacheDataSource = constant.cacheDataSource;
let pk = constant.pkname;
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
					meta = modifierMeta.call(this, props, meta);
                    props.meta.setMeta(meta);
                    
                    // 给列表查询区域赋默认业务单元(在setMeta之后使用)
                    setDefOrg2ListSrchArea(props, searchcode, data);
                    setDefOrg2AdvanceSrchArea(props, searchcode, data);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button, () => {
						buttonVisible.call(this, props);
					});
					// if(this.props.getUrlParam('resource') != 'card'){
					// 	props.button.setButtonDisabled(buttonDisable.listdisable, true);
					// }
					props.button.setButtonDisabled(buttonDisable.listdisable, true);
				}
			}
		}
	);
}

function seperateDate(date) {
	if (typeof date !== 'string') return;
	let result = date.split(' ') && date.split(' ')[0];
	return result;
}

function modifierMeta(props, meta) {

	meta[ltablecode].pagination = true;
	meta[searchcode].items = meta[searchcode].items.map((item, key) => {
		// item.visible = true;
		// item.col = '3';
		return item;
    });
    
    meta[searchcode].items.map((item) => {
        item.isShowDisabledData = true;
        // 贷款单位
        if (item.attrcode == "pk_loanorg") {
            item.queryCondition = () => {
                return {
                    funcode: props.getSearchParam("c"), //appcode获取
                    pk_creditorg: (props.search.getSearchValByField(searchcode, 'pk_org') || {}).value.firstvalue, 
                    TreeRefActionExt:"nccloud.web.tmpub.filter.CreditOrgFinanceRelationFilter"                        
                };
            };
        }
    });
	
	meta[ltablecode].items = meta[ltablecode].items.map((item, key) => {
        // item.width = 150;
        if (item.attrcode == "contractno") {
            let scene = this.props.getUrlParam("scene");
            item.render = (text, record, index) => {
                if(record && record.contractno && record.contractno.value){
                    return (
                        // <NCTooltip placement="top">
                            <a
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    go2CardCheck({
                                        props,
                                        url: requesturl.gotocardcheck,
                                        pk: record[constant.pkname].value,
                                        ts: record["ts"].value,
                                        checkTS: false,
                                        checkSaga: false,
                                        fieldPK: constant.pkname,
                                        go2CardFunc: () => {
                                            props.pushTo("/card", {
                                                status: "browse",
                                                id: record[pk].value,
                                                pagecode: constant.lpagecode,
                                                scene: scene,
                                                islisttocard: "islisttocard"
                                            });
                                        }
                                    })
                                }}
                            >
                            {record && record.contractno && record.contractno.value}
                            </a>
                        // </NCTooltip>
                    );
                }else{
                    return (
                        // <NCTooltip placement="top">
                            <a
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    go2CardCheck({
                                        props,
                                        url: requesturl.gotocardcheck,
                                        pk: record[constant.pkname].value,
                                        ts: record["ts"].value,
                                        checkTS: false,
                                        checkSaga: false,
                                        fieldPK: constant.pkname,
                                        go2CardFunc: () => {
                                            props.pushTo("/card", {
                                                status: "browse",
                                                id: record[pk].value,
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
                        // </NCTooltip>
                    );
                }               
            };
        }
        return item;
    });

	// 财务组织：设置参照可以多选和是否清除记录
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_org').showHistory = true;
    meta[searchcode].items.find((e) => e.attrcode === 'pk_org').isTreelazyLoad = false;// 全加载
    
    // 贷款单位：设置参照可以多选和是否清除记录
	meta[searchcode].items.find((e) => e.attrcode === 'pk_loanorg').isMultiSelectedEnabled = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_loanorg').showHistory = true;
	meta[searchcode].items.find((e) => e.attrcode === 'pk_loanorg').isTreelazyLoad = false;// 全加载
	
	return meta;
}

/*pmFWCFu5nhKkBzYmrkBakVo5ITe7k6v6fooPn6uJkKpgTS1x5SWxlfyE9bmCTxYR*/