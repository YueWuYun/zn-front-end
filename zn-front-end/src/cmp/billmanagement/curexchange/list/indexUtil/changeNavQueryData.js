/*ivekUC7MkPaLK12iemKx4aVanRGfvi4NI6cE9DJWmRYmdxvDMrTQOeZ3uJHpgcSU*/
import { createPage, ajax, base, high, toast, cardCache, deepClone } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';
import { restNavData } from "./restNavData";
import { setNavValue } from "../events/setNavValue";
import { setOnlyNavValue } from "../events/setOnlyNavValue";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [外币兑换index]-切换页签执行方法
 * @param {*}  serval 页签数据
 */
export const changeNavQueryData = function (serval) {
    let oid = Templatedata.list_oid;
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
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    if (this.props.meta.getMeta()[this.searchId].oid) {
        oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
    }
    if (serval) {

       let  onlySearchVal = deepClone(searchVal);
        let searchdata = {
            querycondition: onlySearchVal,
            custcondition: {
                logic: 'and', //逻辑操作符，and、or
                conditions: []
            },
            pageInfo: pageInfo,
            pageCode: this.pageCode,
            queryAreaCode: this.searchId, //查询区编码
            oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };
        searchVal.conditions.push(...serval);//合并查询条件
        let splicSearchData = {
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
                            //表格赋值
                              this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
                            }else{
                                this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } }); 
                            }
                        }
                    } else {
                        setOnlyNavValue.call(this, null);//页签赋值
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    }
                }
            }
        });
    }
}

/*ivekUC7MkPaLK12iemKx4aVanRGfvi4NI6cE9DJWmRYmdxvDMrTQOeZ3uJHpgcSU*/