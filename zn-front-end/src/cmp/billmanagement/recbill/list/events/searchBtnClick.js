/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { pushDefaultNav } from "./pushDefaultNav";
import { setOnlyNavValue } from "./setOnlyNavValue";
let { setDefData } = cardCache;
/**
 * 收款结算-查询按钮
 * @param {*} props 
 * @param {*} searchVal 
 */
export default function clickSearchBtn(props, searchVal) {
    let oid = Templatedata.list_oid;
    if (props.meta.getMeta()[this.searchId].oid) {
        oid = props.meta.getMeta()[this.searchId].oid;//动态获取oid
    }
    if (searchVal) {
        // 将所有查询条件赋值进缓存
        setDefData(this.searchKey, this.dataSource, searchVal);
        //增加页签数据
        let pushServal = pushDefaultNav.call(this, searchVal);
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        pageInfo.pageIndex=0;//保证数据从第一页开始加载
        let searchdata = {//查询区条件
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
                        //重新设置查询结果提示
                        if (data.totalnum && data.totalnum == '0') {
                            toast({
                                color: 'warning',
                                content: this.props.MutiInit.getIntl("36070RBM") &&
                                    this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000115')//未查询出符合条件的数据!
                            });
                            setOnlyNavValue.call(this, null);//页签赋值
                            this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                        } else {
                            toast({
                                color: 'success',
                                content: this.props.MutiInit.getIntl("36070RBM") &&
                                    this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000126')//查询成功
                            });
                            setOnlyNavValue.call(this, data);//页签赋值
                            if (data && data.grid) {
                                this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);//表格赋值
                            } else {
                                this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                            }

                        }

                    } else {
                        toast({
                            color: 'warning',
                            content: this.props.MutiInit.getIntl("36070RBM") &&
                                this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000115')//未查询出符合条件的数据!
                        });
                        setOnlyNavValue.call(this, null);//页签赋值
                        this.props.table.setAllTableData(this.tableId, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    }
                }
            }
        });
    }
};

/*YuO8szH0cVixePu/Bt+mG/yGx6B6bNQcEcxHQUMM+NAAM3FTKHqGr7ttwrzT9blR*/