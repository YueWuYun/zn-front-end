/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
let { setDefData } = cardCache;
let oid = Templatedata.list_oid;
//查询
export default function clickSearchBtn(props, searchVal) {
    if (props.meta.getMeta()[this.searchId].oid) {
        oid = props.meta.getMeta()[this.searchId].oid;//动态获取oid
    }
    if (!searchVal) {
        return;
    }
    /**
     * 限定只能，来源系统是：协同单据
     */
    let setServal = [
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
    if (searchVal) {
        // 将所有查询条件赋值进缓存
        setDefData(this.searchKey, this.dataSource, searchVal);
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        pageInfo.pageIndex=0;//报账单据从第一页开始加载数据
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
        searchVal.conditions.push(...setServal);
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
                            toast(
                                {
                                    color: 'warning',
                                    content: this.props.MutiInit.getIntl("36070RBMCP") &&
                                    this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000066')//'未查询出符合条件的数据!'
                                });
                            this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                        } else {
                            toast(
                                {
                                    color: 'success'
                                });
                            if (data && data.grid) {
                                this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
                            }
                        }

                    } else {
                        toast(
                            {
                                color: 'warning',
                                content: this.props.MutiInit.getIntl("36070RBMCP") &&
                                this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000066')//'未查询出符合条件的数据!'
                            });
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    }
                }
            }
        });
    }
};

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/