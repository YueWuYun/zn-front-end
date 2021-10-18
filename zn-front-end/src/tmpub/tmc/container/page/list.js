/*CZmKz6+V+h047al940SNFH5Ju3rw4fE8oPOj+RQfSDg=*/
/* 
  封装列表的业务方法
  created by: liyaoh 2018-09-08
*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
//引入组织版本视图api
let { getDefData } = cardCache;
/**
 * 加载列表页面
 *
 */
export function initList() {
    toggleListHeadBtnDisabled.call(this);
}

/**
 * 请求列表接口
 * @param {*} cusCondition     自定义查询条件
 */
export function getListData(cusCondition) {
    let cacheCondition = getDefData(this.searchCache.key, this.searchCache.dataSource);
    let pageInfo = this.props.table.getTablePageInfo(this.tableId);
    let searchdata = cacheCondition ?
        {
            querycondition: cacheCondition,
            pageInfo: pageInfo,
            oid: this.oid,
            pageCode: this.pageId,
            queryAreaCode: this.searchId,  //查询区编码
            querytype: 'tree'
        }
        :
        this.props.search.getQueryInfo(this.searchId);
    if (cusCondition) {
        searchdata.custcondition = {
            logic: "and",   //逻辑操作符，and、or
            conditions: cusCondition
        }
    }
    searchdata.pageCode = this.pageId;
    searchdata.pageInfo = pageInfo;
    ajax({
        url: this.API_URL.queryList,
        data: searchdata,
        success: (res) => {
            listRender.call(this, res);
            this.queryListCallback && this.queryListCallback(res);
            toggleListHeadBtnDisabled.call(this);
        }
    });
}

/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 */
export function listRender(res) {
    let { success, data } = res;
    if (success && data && data.grid && data.grid[this.tableId]) {
        this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
    } else {
        this.props.table.setAllTableData(this.tableId, { rows: [] });
    }
}

/**
 * 切换列表表头按钮禁用状态，使用call调用
 * @param {*} params 参数格式：
 *  [{
        key: 'creditagreementid', //根据哪个字段判断
        btnName: 'CreditAmount',  //对应控制的按钮名称
        rules: function           //选传。按钮禁用的控制规则，传此字段key可不传
    }]
 *
 */
export function toggleListHeadBtnDisabled(params) {
    let btnParams = params || this.disabledBtnsParam;
    let selectDatas = this.props.table.getCheckedRows(this.tableId);
    if (selectDatas.length === 0) {
        this.props.button.setButtonDisabled(this.disabledBtn, true);
    } else {
        if (this.disabledBtnOne && this.disabledBtnOne.length > 0&&selectDatas.length > 1) {
            //当只有一条数据的时候，按钮才能为可用
            let oneLineBtns = [...this.disabledBtn];
            this.disabledBtnOne.map((ele) => {
                if(this.disabledBtn.indexOf(ele)>-1){
                    oneLineBtns.splice(this.disabledBtn.indexOf(ele), 1);
                }
            });
            this.props.button.setButtonDisabled(oneLineBtns, false);
            this.props.button.setButtonDisabled(this.disabledBtnOne, true);
        } else {
            this.props.button.setButtonDisabled(this.disabledBtn, false);
        }
        if (Array.isArray(btnParams)) {
            btnParams.forEach(item => {
                let condition = (item.rules && item.rules(selectDatas)) || 
                    (selectDatas[0].data.values[item.key] && selectDatas[0].data.values[item.key].value);
                if (selectDatas.length > 1) { //多选禁用
                    this.props.button.setButtonDisabled(item.btnName, true);
                } else if (selectDatas.length == 1) {
                    if (condition) {
                        this.props.button.setButtonDisabled(item.btnName, false);
                    } else {
                        this.props.button.setButtonDisabled(item.btnName, true);
                    }
                }
            });
        }
    }
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
    ajax({
        url: this.API_URL.queryListPks,
        data: { pks, pageCode: this.pageId},
        success: (res) => {
            listRender.call(this, res);
        }
    });
}
/*CZmKz6+V+h047al940SNFH5Ju3rw4fE8oPOj+RQfSDg=*/