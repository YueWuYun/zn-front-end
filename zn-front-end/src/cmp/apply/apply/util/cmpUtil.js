/*DillSV70weWBVwOSgE9MrD98USv6dAl1dnvgHa7X6Kf6iAOS03fV8W/tCIUF+96w*/
//引入组织版本试图api
import { orgVersionView } from "../../../../tmpub/pub/util/version/index";
//引入常量定义
import { CARD_PAGE_INFO, ITEM_INFO } from "../cons/constant";

/**
 * 组织多版本控制
 * @param {*} props 
 */
export const versionControl = function (props) {
    //表头组织字段数组
    let headOrgFieldArr = ['pk_org', 'pk_fundorg_r', 'pk_fundorg_p', 'pk_transactorg'];
    let formOrgFieldObj = {};
    formOrgFieldObj[CARD_PAGE_INFO.HEAD_CODE] = headOrgFieldArr;
    //Form区域组织字段对象
    let bodyOrgFieldArr = ['pk_financeorg_r', 'pk_financeorg_p'];
    let gridOrgFieldObj = {};
    //Grid区域编码映射表体组织字段数组
    gridOrgFieldObj[CARD_PAGE_INFO.BODY_CODE] = bodyOrgFieldArr;
    formOrgFieldObj[CARD_PAGE_INFO.BODY_BROWSE_CODE] = bodyOrgFieldArr;
    //组织版本试图
    orgVersionView(props, formOrgFieldObj, gridOrgFieldObj);
}

/**
 * 加载数据到卡片
 * @param {*} props 
 * @param {*} data 
 */
export const loadData2Card = function (props, data, callback) {
    let { head, body } = data;
    if (head) {
        props.form.setAllFormValue({ [CARD_PAGE_INFO.HEAD_CODE]: head[CARD_PAGE_INFO.HEAD_CODE] });
    }
    if (body) {
        props.cardTable.setTableData(CARD_PAGE_INFO.BODY_CODE, body[CARD_PAGE_INFO.BODY_CODE]);
    }
    callback(data);
}

/*DillSV70weWBVwOSgE9MrD98USv6dAl1dnvgHa7X6Kf6iAOS03fV8W/tCIUF+96w*/