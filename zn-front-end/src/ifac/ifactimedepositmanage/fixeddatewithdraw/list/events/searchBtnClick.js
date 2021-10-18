/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/
import { ajax, toast } from 'nc-lightapp-front';
import {  base_url, pageCodeList, searchId, tableId,  FixedWithDrawConst, LISTGROUP,tabStatus } from '../../cons/constant.js';
import { setDefData, getDefData } from '../../../../../tmpub/pub/util/cache';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";

//点击查询，获取查询区数据
export default function searchBtnClick(props, condition, type, a, isSearchButton = true, isRefresh = false) {
    // let isToast=true;
    let oid = oid;
    if (props.meta.getMeta()[searchId].oid) {
        oid = props.meta.getMeta()[searchId].oid;//动态获取oid
    }
    //点击查询按钮，将查询条件放入缓存
    if (isSearchButton) {
        setDefData(FixedWithDrawConst.dataSource, FixedWithDrawConst.queryCondition, condition);
    }
    //点击刷新按钮，从缓存中获取查询条件
    // else if (isRefresh) {
    //     condition = getDefData(FixedWithDrawConst.dataSource, FixedWithDrawConst.queryCondition);
    // }
    //点击页签查询，从缓存中获取查询条件，获取查询区条件未改变前的查询条件
    else {
        condition = getDefData(FixedWithDrawConst.dataSource,FixedWithDrawConst.queryCondition);
    }
    if (!condition || !condition.conditions || condition.conditions.length == 0) {
        // toast({color: 'warning', content: loadMultiLang(this.props, '36340FDW-000033'),/* 国际化处理： 未查询出符合条件的数据!*/});
        return;
    }

    //构建查询条件        
    let groupCondition = getGroupCondition.call(this, this.state.selectedGroup);
    let pageInfo = props.table.getTablePageInfo(tableId);
    pageInfo.pageIndex= 0;
    // let data = {
    //     querycondition: condition,
    //     custcondition: {
    //         logic: 'and', //逻辑操作符，and、or
    //         conditions: [groupCondition]
    //     },
    //     pageInfo: pageInfo,
    //     pageCode: pageCodeList,
    //     queryAreaCode: searchId,  //查询区编码
    //     oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
    //     querytype: 'tree'
    // };
    let data = {
        querycondition: condition,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: [groupCondition]
        },
        pageInfo: pageInfo,
        pageCode: pageCodeList,
        queryAreaCode: searchId,  //查询区编码
        oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    ajax({
        url: base_url+'pagequeryaction.do',
        data: data,
        success: (res) => {
            listRender.call(this, res, isRefresh,isSearchButton);
        },
        error: (res) => {
            listRender.call(this, {success: false});
            toast({color: 'warning', content: res.message});
        }
    });
};
/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 */
function listRender (res, isRefresh,isSearchButton) {
    let { success, data } = res;
    let tabContainer= data ? data['groupData'] || {} : {};
    if (success && data && data.grid && data.grid[tableId]) {
        this.props.table.setAllTableData(tableId, data.grid[tableId]);
        let flag= tabContainer['ALL'];
        if (flag!="0") {
            if (isRefresh) {
                toast({color: 'success', content: loadMultiLang(this.props, '36340FDW-000023'),/* 国际化处理： 刷新成功！*/});
            }else if(isSearchButton){
                toast({color: 'success', content: loadMultiLang(this.props, '36340FDW-000024'),/* 国际化处理： 查询成功！*/});
            }
        }else if(isSearchButton||isRefresh){
            toast({color: 'warning', content: loadMultiLang(this.props, '36340FDW-000012'),/* 国际化处理： 未查询出符合条件的数据!*/});
        }
    } else {
        this.props.table.setAllTableData(tableId, { rows: [] });
    }
    setStatusNumKey.call(this, tabContainer);
}
/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function (groupKey) {
    let groupCondition;
    switch (groupKey) {
        //待提交
        case LISTGROUP.NEEDCOMMIT:
            groupCondition = {
                field: 'billstate',
                value: {
                    firstvalue: parseInt(1),
                    secondvalue: null
                },
                oprtype: '=',
                datatype: '203',

            };
            break;
        //待审批
        case LISTGROUP.APPROVING:
            groupCondition = {
                field: 'billstate',
                value: {
                    firstvalue: parseInt(2),
                    secondvalue: null
                },
                oprtype: '=',
                datatype: '203',
            };
            break;
        //全部
        case LISTGROUP.ALL:
            groupCondition = {};
            break;
        //默认作为全部处理
        default:
            groupCondition = {};
            break;
    }
    return groupCondition;
}
export function setStatusNumKey (tabContainer) {
    if (Object.keys(tabContainer).length) {
        let { numvalues }= this.state;
        for (let item of tabStatus) {
            numvalues[item]= tabContainer[item];
        }
        this.setState({numvalues});
        setDefData(FixedWithDrawConst.dataSource, 'numvalues', numvalues);
    }
}
/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/