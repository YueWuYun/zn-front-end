/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/
import { appcode, card_form_id, card_table_id, card_page_id, FIELD, URL_INFO, PAGE_STATUS, search_key, search_source, card_search_id } from '../../cons/constant.js';
import buttonVisible from './buttonVisible';
import { getQueryData, qryData } from '../../util/index';
import { cardCache } from 'nc-lightapp-front';
const formId = card_form_id;
const tableId = card_table_id;
const pageId = card_page_id;
const searchId = card_search_id;
export default function (props) {
    let that = this;
    props.createUIDom(
        {
            pagecode: pageId,//页面id
        },
        function (data) {
            if (data) {
                if (data.template) {
                    let meta = data.template;
                    //个性化处理模板
                    modifierMeta(that, props, meta);
                    //更新模板
                    props.meta.setMeta(meta, () => {
                    });
                    //初始化界面数据
                    initData.call(that, props);
                }
                if (data.button) {
                    let button = data.button;
                    props.button.setButtons(button);
                }
                buttonVisible.call(that, props, PAGE_STATUS.BROWSER, true);//按钮显隐性
            }
        }
    )
}

function modifierMeta(that, props, meta) {
    let status = props.getUrlParam(URL_INFO.PARAM.STATUS);
    meta[formId].status = status;
    meta[tableId].status = status;
    //参照过滤
    meta[searchId].items.map((item) => {
		//显示停用
        item.isShowDisabledData = true;
        //资金组织
        if (item.attrcode == FIELD.HEAD.PKORG) {
            item.queryCondition = () => {
                return {
                    funcode: appcode,
                    TreeRefActionExt: 'nccloud.web.tmpub.filter.FundOrgPermissionFilter'
                };
            };
        }
        //计息对象
        if (item.attrcode == FIELD.SEARCH.PKINTOBJ) {
            item.queryCondition = () => {
                //资金组织
                let pkorg = props.search.getSearchValByField(card_search_id, FIELD.SEARCH.PKORG).value.firstvalue;
                //币种
                let pkcurrtype = props.search.getSearchValByField(card_search_id, FIELD.SEARCH.PKCURRTYPE).value.firstvalue;
                //结息日
                let settledate = props.search.getSearchValByField(card_search_id, FIELD.SEARCH.SETTLEDATE).value.firstvalue;
                return {
                    pkorgs: pkorg,
                    pkcurrtype: pkcurrtype,
                    settledate: settledate,
                    GridRefActionExt: 'nccloud.web.ifac.adjustmount.filter.AdjustmountIntObjFilter'
                };
            };
        }
    });
    return meta;
}

/**
 * 初始化数据
 * @param {*} props 
 */
const initData = function (props) {
    let islinkquery = props.getUrlParam(URL_INFO.PARAM.ISLINKQUERY);
    if (islinkquery) {
        let data = getQueryData.call(this, props);
        if (!data) {
            return;
        }
        qryData.call(this, props, data, false, false, () => {
            cardCache.setDefData(search_key, search_source, data);
        });
    }

}

/*pmFWCFu5nhKkBzYmrkBakZo6JgaGEMjcDnk5H/eOIfRBR4HikidAxo8JBIbJJRG6*/