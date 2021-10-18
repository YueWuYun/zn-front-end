/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/
import { ajax, deepClone, toast, cardCache } from 'nc-lightapp-front';
import { constant, LIST, API_URL } from "../../cons/constant";//配置的id和area信息

let table_id = LIST.table_id;
let page_code = LIST.page_id;
let search_id = LIST.search_id;
let { setDefData, getDefData } = cardCache;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {

    let _this = this;
    let tabKey = this.state.activeTab;
    // 用于查询页签数量
    let searchdata = this.props.search.getQueryInfo(this.searchId);
    setDefData(this.searchCache.key, this.searchCache.dataSource, searchVal);
    if (!searchdata || JSON.stringify(searchdata) == "{}") {
        return;
    }
    let conditions = [];
    if (tabKey != 'all') {
        conditions = filterSearchValue.call(this, searchdata.querycondition);
    }
    let pageInfo = props.table.getTablePageInfo(table_id);
    pageInfo.pageIndex = 0;
    searchdata['custcondition'] = {
        logic: 'and', //逻辑操作符，and、or
        conditions
    }
    searchdata['pageInfo'] = pageInfo;
    searchdata['pageCode'] = page_code;
    ajax({
        url: API_URL['queryList'],
        data: searchdata,
        success: (res) => {
            let { success, data } = res;
            if (success) {
                let selectedData = props.table.getCheckedRows(this.tableId);
                if (selectedData.length == 0) {
                    // props.button.setButtonDisabled(constant.allBtnName, true);//没有数据时按钮不可用
                }
                if (data && data.grid && data.grid[table_id]) {

                    props.table.setAllTableData(table_id, data.grid[table_id]);
                    // 保存当前页的pks，用于在操作时候刷新页面数据
                    // 当前pk在pageinfo里可以获取到
                    // let pks = [];
                    // _this.setState({
                    //     pks: pks
                    // });
                } else {
                    // toast({ color: 'warning', content: '未查询出符合条件的数据!' });
                    props.table.setAllTableData(table_id, { rows: [], pageInfo: { pageIndex: 0, pageSize: 10, total: 0, totalPage: 0 } });
                }
                if (data && data.groupData) {
                    //页签赋值
                    setDefData("numvalues", "tabCache", data.groupData);
                    setDefData("selectedGroup", "tabCache", _this.state.activeTab);
                    _this.setState({
                        tabNum: data.groupData
                    })
                    // if (data.groupData.tab00=='0') {
                    //     // toast({ color: 'warning', content: '未查询出符合条件的数据!' });
                    // }else{
                    //     // toast({ color: 'success', content: '查询成功' });
                    // }
                } else {
                    // toast({ color: 'warning', content: '未查询出符合条件的数据!' });
                }
            }
        }
    });

};
// 过滤查询条件，用于页签查询和初始化第一次查询查询待签字的数据
function filterSearchValue(searchVal) {
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
    if (tabKey == '-1') {
        // 待提交
    }
    if (tabKey == '2,3') {
        // 审批中
        condition.value.firstvalue = '2,3';
        condition.oprtype = 'in';
    }
    if (tabKey == '10') {
        // 支付处理中
        condition.field = 'paymentstatus';
        condition.value.firstvalue = '2,3';
        condition.oprtype = 'in';
        let disablecondition = deepClone(orgcondition);
        disablecondition.field = 'disableflag';
        disablecondition.value.firstvalue = 'N';
        disablecondition.display = '';
        conditions.push(disablecondition);
        // condition.datatype="204";
    }
    conditions.push(condition);
    return conditions;
}

/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/