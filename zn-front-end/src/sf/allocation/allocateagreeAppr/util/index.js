/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/
import { list_table_id, card_page_id, list_page_id, base_url, card_from_id, AllocateAgreeCache, pk_allocateapply_h, card_table_id, list_search_id, card_shouder_buttons } from "../cons/constant";

//引入轻量化api
import { ajax, cardCache } from 'nc-lightapp-front';
import { getDefData, setDefData } from '../../../../tmpub/pub/util/cache';
import { SCENE } from "../../../../tmpub/pub/cons/constant";

/**
 * 跳转卡片
 * @param {*} props 
 * @param {*} urlParam 
 */
export const go2card = function (props, urlParam, getStateFunc, callback) {
    //获取分组合计数据
    let groupCount = getStateFunc('numvalues');
    //缓存分组合计数据
    cardCache.setDefData('groupCount', AllocateAgreeCache, groupCount);
    //获取选中的分组页签
    let activeKey = getStateFunc('activeKey');
    //缓存选中的分组页签
    cardCache.setDefData('activeKey', AllocateAgreeCache, activeKey);
    //获取查询区域条件(不校验必输项)
    let searchData = props.search.getQueryInfo(list_search_id, false);
    //缓存查询区域条件
    cardCache.setDefData('searchData', AllocateAgreeCache, (searchData && searchData.querycondition && searchData.querycondition.conditions) || null);
    if (!urlParam) {
        urlParam = {};
        urlParam['status'] = 'browse';
    }
    urlParam['pagecode'] = card_page_id;

    //页面跳转
    props.pushTo('/card', urlParam);

    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/**
 * 获取缓存数据
 */
export const getCahceValue = function (props, updateStateFunc, callback) {
    debugger
    let updateStateObj = {};
    //从缓存中获取分组合计数据
    let groupCount = cardCache.getDefData('groupCount', AllocateAgreeCache);
    if (groupCount) {
        updateStateObj['numvalues'] = groupCount;
    }
    //从缓存中获取选中的分组页签数据
    let selectedGroup = cardCache.getDefData('activeKey', AllocateAgreeCache);
    if (null != selectedGroup) {
        //updateStateObj['activeKey'] = selectedGroup;
        updateStateObj['selectedGroup'] = selectedGroup + "";

    }
    //更新列表state
    if (Object.keys(updateStateObj).length > 0) {
        updateStateFunc(updateStateObj);
    }
    //回调
    if (callback && (typeof callback == 'function')) {
        callback(props);
    }
}

/**
 * 加载查询区域缓存
 * @param {*} props 
 */
export const loadSearchCache = function (props) {
    //从缓存中获取查询区域条件
    let searchData = cardCache.getDefData('searchData', AllocateAgreeCache);
    //更新查询区域
    if (searchData) {
        props.search.setSearchValue(list_search_id, searchData);
    }
}

/**
 * 预算联查单据
 * @param {*} props 页面内置对象
 * @param {*} type 类型
 */
export const TbbLinkBill = function (props) {
    const that = this;
    let url = null, data = null, extParam = null;
    //预算反联查参数
    let tbbParam = props.getUrlParam('pk_ntbparadimvo');
    if (!tbbParam) { return; }
    data = { pk: tbbParam, pageCode: list_page_id };
    ajax({
        url: base_url + 'alloagreelinkbill.do',
        data,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    let { grid } = data;
                    if (grid) {
                        let size = data.grid[list_table_id].rows.length;
                        if (size == 1) {
                            let pk = data.grid[list_table_id].rows[0].values.pk_allocateagree_h.value;
                            setDefData(AllocateAgreeCache, AllocateAgreeCache.linkSourceData + pk, data.grid[list_table_id]);
                            props.pushTo('/card', {
                                scene: SCENE.LINK,
                                status: 'browse',
                                id: pk,
                                pagecode: card_page_id
                            });
                        } else {
                            props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                        }
                    } else {
                        this.props.table.setAllTableData(list_table_id, { rows: [] });
                    }

                } else {
                    this.props.table.setAllTableData(list_table_id, { rows: [] });
                }
            } else {
                props.table.setAllTableData(list_table_id, { rows: [] });
            }
        }
    });
}

/**
 * 重设rowno,ca签名验签错误，所以重新赋值
 * @param {*} props 
 */
export const resetBodysRowno = function (props) {
    let allRows1 = props.cardTable.getAllRows(card_table_id, false);
    props.beforeUpdatePage();
    for (let index = 0; index < allRows1.length; index++) {
        props.cardTable.setValByKeyAndIndex(card_table_id, index, 'rowno', { value: Number(parseInt(index) + parseInt(1)).toString() })
    }
    props.updatePage(card_from_id, card_table_id);
}
/*cI4u54VYZVPxnvGrX5EL6Cuf8fNQJDonWRVA2/LRuYGwiXEjNsocrd+tA+pOCsWN*/