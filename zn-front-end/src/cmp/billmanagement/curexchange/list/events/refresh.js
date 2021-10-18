/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { createPage, ajax, base, high, toast, cardCache, deepClone } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { setNavValue } from "./setNavValue";
import { pushDefaultNav } from "./pushDefaultNav";
import { setOnlyNavValue } from "./setOnlyNavValue";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;
let oid = Templatedata.list_oid;
/**
 * [外币兑换]-列表刷新
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const refresh = function () {
    //缓存的查询条件{需要先克隆一下}
    let searchVal = deepClone(getDefData(this.searchKey, this.dataSource));
    if (!searchVal) {
        searchVal = this.props.search.getAllSearchData(this.searchId);//查询区条件
        // 将所有查询条件赋值进缓存[查询的时候已经放入缓存]
        setDefData(this.searchKey, this.dataSource, searchVal);
    }
    if (this.props.meta.getMeta()[this.searchId].oid) {
        oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
    }
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);//分页
    pageInfo.pageIndex = 0;//保证分页从第一页开始
    //增加页签数据
    let pushServal = pushDefaultNav.call(this, searchVal);
    let searchdata = {
        querycondition: searchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: []
        },
        pageInfo: pageInfo,
        pageCode: this.pageCode,
        queryAreaCode: this.searchId,
        oid: oid,
        querytype: 'tree'
    };
    let splicSearchData = {
        querycondition: pushServal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: []
        },
        pageInfo: pageInfo,
        pageCode: this.pageCode,
        queryAreaCode: this.searchId,
        oid: oid,
        querytype: 'tree'
    };
    let datas = {
        'searchArea': searchdata,
        'splicSearchArea': splicSearchData
    }
    ajax({
        url: '/nccloud/cmp/curexchange/curexchangequeryscheme.do',
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
                    toast({
                        color: 'success',
                        content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000087')/*国际化处理：'查詢成功!'*/
                    });
                } else {
                    // toast(
                    //     {
                    //         color: 'warning',
                    //         content: '未查询出符合条件的数据!'
                    //     });
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        }
    });
}

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/