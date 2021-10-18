/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/
import { ajax, toast, cardCache, deepClone } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { pushDefaultNav } from "./pushDefaultNav";
import { setOnlyNavValue } from "./setOnlyNavValue";
let { setDefData, getDefData } = cardCache;
/**
 * [收款]-列表刷新
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const refresh = function () {
    let oid = Templatedata.list_oid;
    //查询条件必输项为空时不进行查询
    let searchValidate = this.props.search.getQueryInfo(this.searchId).oid;    
    if(!searchValidate){
        return;
    }
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
    //增加页签数据
    let pushServal = pushDefaultNav.call(this, searchVal);
    let searchdata = {
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
    let splicSearchData = {//查询区+页签条件
        querycondition: pushServal,
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
        'searchArea': searchdata,
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
                    toast({
                        color: 'success',
                        content: this.props.MutiInit.getIntl("36070RBM") &&
                            this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000127')//刷新成功
                    });

                } else {

                    this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
            }
        }
    });
}

/*TVz0urOFwYZ+3VqYTGVztzhrrjPi70YdaNg9MwNvzbgfuMFOrhBnOxeliQvYIsUk*/