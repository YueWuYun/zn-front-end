/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/
import { ajax, toast, cardCache, deepClone } from 'nc-lightapp-front';
import {CARD, LIST, app_code, module_id, DATA_SOURCE, searchCache, nodekey, API_URL, billtype, DISABLE_BTN_PARAM,modelname } from '../../cons/constant';
let { setDefData, getDefData } = cardCache;
let table_id = LIST.table_id;
let page_code = LIST.page_id;
let search_id = LIST.search_id;

let querytype = LIST.list_querytype;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal,a,b,c,d,e,f) {
    let searchdatas = this.props.search.getQueryInfo(this.searchId);
    searchVal = searchdatas.querycondition;
    let _this = this;
    let queryInfo = props.search.getQueryInfo(search_id, false);
    setDefData(this.searchCache.key, this.searchCache.dataSource, searchVal);
    let oid = queryInfo.oid;
    let tabKey = this.state.activeTab;
    // 用于查询页签数量
    let conditions = [];
    if (tabKey != 'all') {
        conditions = filterSearchValue.call(this,searchVal);
    }
    if (searchVal) {
        let pageInfo = props.table.getTablePageInfo(table_id);

        let searchdata = {
            querycondition: searchVal,
            custcondition: {
                logic: 'and', //逻辑操作符，and、or
                conditions
            },
            pageInfo: pageInfo,
            pageCode: page_code,
            queryAreaCode: search_id,  //查询区编码
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };
        let datainfo = {
            param:searchdata
        }
        ajax({
            url: API_URL.queryList,
            data: searchdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    let selectedData = props.table.getCheckedRows(this.tableId);
                    // if (selectedData.length == 0) {
                    //     props.button.setButtonDisabled(constant.allBtnName, true);//没有数据时按钮不可用
                    // }
                    if (data && data.grid) {
                        // 此处提示已成功
                        //toast({ color: 'success', content: '查询成功' });
                        props.table.setAllTableData(table_id, data.grid[table_id]);
                        // 保存当前页的pks，用于在操作时候刷新页面数据
                        // 当前pk在pageinfo里可以获取到
                        let pks = [];
                        _this.setState({
                            pks: pks
                        });
                    } else {
                        //toast({ color: 'warning', content: '未查询出符合条件的数据!' });
                        props.table.setAllTableData(table_id, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                    }
                    if (data && data.groupData) {
                        //页签赋值
                        setDefData("numvalues", "tabCache", data.groupData); //页签数字放到缓存中
                        setDefData("selectedGroup", "tabCache", _this.state.activeTab);
                        _this.setState({
                            tabNum: data.groupData
                        })
                        // 此处提示已成功
                        if (a) {
                            // a有值代表是點擊查詢來的，提示，否則不提示
                            if (data.groupData.ALL=='0') {
                                toast({ color: 'warning', content: '未查询出符合条件的数据!' });
                            }else{
                                toast({ color: 'success', content: '查询成功' });
                            }
                        }
                        // if (data.groupData.tab00=='0') {
                        //     toast({ color: 'warning', content: '未查询出符合条件的数据!' });
                        // }
                    } 
                }
            }
        });
    }

};
// 过滤查询条件，用于页签查询和初始化第一次查询查询待签字的数据
let filterSearchValue = function(searchVal) {
    let tabKey = this.state.activeTab;
    if (tabKey == 'all') {
        // 如果是全部的话，则返回
        return;
    }
    let conditions = [];
    let orgcondition = searchVal.conditions.find((e) => e.field === 'pk_org');
    let condition = deepClone(orgcondition);
    // vbillstatus： 业务单据审批状态；审批未通过=0,审批通过=1,审批进行中=2,提交=3,自由=-1
    // paymentstatus : 支付指令状态；1交易成功，2交易失败，3交易不明
    condition.field = 'vbillstatus';
    condition.value.firstvalue = -1;
    condition.display = '';
    condition.datatype = "1";  // 1表示输入框类型
    let condition2 = deepClone(condition);
    condition2.field = 'pk_billtypecode';
    condition2.value.firstvalue = '36H2';
    
    if (tabKey == '1') {
        // 待提交
        
    }
    if (tabKey == '2') {
        // 审批中
        //condition.value.firstvalue = 2;
        condition.value.firstvalue = '2,3';
        condition.oprtype = 'in';
    }
    if (tabKey == '10') {
        // 指令处理中
        condition.field = 'elcpaymentstatus';
        condition.value.firstvalue = '2,3';
        condition.oprtype = 'in';
        let disablecondition = deepClone(orgcondition);
        disablecondition.field = 'disableflag';
        disablecondition.value.firstvalue = 'N';
        disablecondition.display = '';
        disablecondition.datatype="1";
        conditions.push(disablecondition);
    }

    conditions.push(condition);
    conditions.push(condition2);
    return conditions;
}

/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/