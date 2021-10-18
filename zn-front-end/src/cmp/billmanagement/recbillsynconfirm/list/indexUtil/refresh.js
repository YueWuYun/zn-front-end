/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { ajax, cardCache, deepClone } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
let { setDefData, getDefData } = cardCache;
/**
 * [收款协同]-刷新
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const refresh = function () {
    let oid = Templatedata.list_oid;
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);//分页
    pageInfo.pageIndex = 0;
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
    /**
     * 限定只能，来源系统是：协同单据
     */
    let searval = [
        {

            field: 'source_flag',
            value: {
                firstvalue: '9',
                secondvalue: null
            },
            oprtype: '=',
            display: null
        }
    ];

    let searchData = {
        querycondition: searchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: [
                {
                    field: 'source_flag',
                    value: {
                        firstvalue: '9',
                        secondvalue: null
                    },
                    oprtype: '=',
                    display: null
                }
            ]
        },
        pageInfo: pageInfo,
        pageCode: this.pageId,
        queryAreaCode: this.searchId, //查询区编码
        oid: oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: 'tree'
    };
    searchVal.conditions.push(...searval);
    let splicSearchData = {
        querycondition: searchVal,
        custcondition: {
            logic: 'and', //逻辑操作符，and、or
            conditions: [
                {
                    field: 'source_flag',
                    value: {
                        firstvalue: '9',
                        secondvalue: null
                    },
                    oprtype: '=',
                    display: null
                }
            ]
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
                    //重新设置查询结果提示
                    if (data.totalnum && data.totalnum == '0') {
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    } else {
                        if (data && data.grid) {
                            this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
                        }
                    }
                } else {
                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        }
    });
}

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/