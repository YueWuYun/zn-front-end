/*CAX9/j0I8zrvoAbG+fZCm8IZ+fcwOtu6NJHMwFeIqKfJPO7dyRp/bj7TDNeK1+3I*/
import { ajax, cardCache, deepClone } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { setOnlyNavValue } from "../events/setOnlyNavValue";
//缓存
let { getDefData,
} = cardCache;

/**
 * [收款]-页签切换调用
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const getData = function (serval) {

    //查询条件先取缓存，再去查询区
    let searchVal = deepClone(getDefData(this.searchKey, this.dataSource));//缓存的查询条件{需要先克隆一下}
    if (!searchVal) {
        return;
        // searchVal = this.props.search.getAllSearchData(this.searchId);//查询区条件
        // 将所有查询条件赋值进缓存[查询的时候已经放入缓存]
        // setDefData(this.searchKey, this.dataSource, searchVal);
    }
    if (!searchVal) {
        return;
    }
    if (!serval) {
        return;
    }
    let oid = Templatedata.list_oid;
    if (this.props.meta.getMeta()[this.searchId].oid) {
        oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
    }
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    pageInfo.pageIndex = 0;
    let onlySearchVal = deepClone(searchVal);
    let searchData = {
        querycondition: onlySearchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: []
        },
        pageInfo: pageInfo,
        pageCode: this.pageId,
        queryAreaCode: this.searchId, //查询区编码
        oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    searchVal.conditions.push(...serval);
    let splicSearchData = {//查询区+页签条件
        querycondition: searchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: []
        },
        pageInfo: pageInfo,
        pageCode: this.pageId,
        queryAreaCode: this.searchId, //查询区编码
        oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    let datas = {
        'searchArea': searchData,
        'splicSearchArea': splicSearchData
    }
    ajax({
        url: '/nccloud/cmp/recbill/recbillquery.do',
        data: datas,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                if (data) {
                    if (data.totalnum && data.totalnum == '0') {
                        setOnlyNavValue.call(this, null);//页签赋值
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    } else {
                        setOnlyNavValue.call(this, data);//页签赋值
                        if (data && data.grid) {
                            this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
                        } else {
                            this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                        }
                    }
                } else {
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        }
    });
}

/*CAX9/j0I8zrvoAbG+fZCm8IZ+fcwOtu6NJHMwFeIqKfJPO7dyRp/bj7TDNeK1+3I*/