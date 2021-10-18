/*mUOvDSO4b4LhhTZUVyxkKuHCdNKI34+S3a2TCTb+j6IecO2wl3etlwIrVdTvTUmu*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { setNavValue } from "./setNavValue";
//缓存
let { setDefData, getDefData, getCurrentLastId, getCacheById, updateCache, addCache, getNextId, deleteCacheById } = cardCache;

/**
 * [外币兑换]-查询数据得到分组的标签数据
 * @param {*} data 
 */
export const queryNavValue = function () {
    //获得缓存的查询区数据
    let searchVal = getDefData(this.searchKey, this.dataSource);
    if (searchVal && searchVal.conditions) {
        let oid = Templatedata.list_oid;
        if (this.props.meta.getMeta()[this.searchId].oid) {
            oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
        }
        let pageInfo = this.props.table.getTablePageInfo(this.tableId);
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
        ajax({
            url: Templatedata.list_searchscheme,
            data: searchdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    setNavValue.call(this, data);//页签数值赋值                      
                }
            }
        });
    }
}

/*mUOvDSO4b4LhhTZUVyxkKuHCdNKI34+S3a2TCTb+j6IecO2wl3etlwIrVdTvTUmu*/