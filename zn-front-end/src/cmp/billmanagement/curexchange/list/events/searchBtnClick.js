/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { createPage, ajax, base, high, toast, cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { setNavValue } from "./setNavValue";
import { pushDefaultNav } from "./pushDefaultNav";
import { setOnlyNavValue } from "./setOnlyNavValue";
//缓存
let {
    setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById
} = cardCache;

/**
 * [外币兑换]-查询方法
 * @param {*} props 
 * @param {*} searchVal 
 */
export default function clickSearchBtn(props, searchVal) {

    let oid = Templatedata.list_oid;
    if (props.meta.getMeta()[this.searchId].oid) {
        oid = props.meta.getMeta()[this.searchId].oid;//动态获取oid
    }
    if (searchVal) {
        //将所有查询条件赋值进缓存
        setDefData(this.searchKey, this.dataSource, searchVal);
        //增加页签数据
        let pushServal = pushDefaultNav.call(this, searchVal);
        //分页信息
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        pageInfo.pageIndex=0;//查询从第一页开始
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
            url: Templatedata.list_searchscheme,
            data: datas,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        if (data.totalnum && data.totalnum == '0') {
                            toast(
                                {
                                    color: 'warning',
                                    content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000083')/*国际化处理：'未查询出符合条件的数据!'*/
                                });
                            setOnlyNavValue.call(this, null);//页签赋值
                            this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                        } else {
                            toast(
                                {
                                    color: 'success',
                                    content:this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000086')/*国际化处理：'查詢成功!'*/
                                });
                            setOnlyNavValue.call(this, data);//页签赋值
                            if (data && data.grid) {
                                //列表赋值 
                                this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
                            }else{
                                this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                            }
                        }

                    } else {
                        toast(
                            {
                                color: 'warning',
                                content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000083')/*国际化处理：'未查询出符合条件的数据!'*/
                            });
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    }
                }
            }
        });
    }
};

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/