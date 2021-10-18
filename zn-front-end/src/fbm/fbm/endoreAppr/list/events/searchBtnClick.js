/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/
/**
 * 背书办理列表 查询区按钮事件
 * @author：gaokung
 */
import { cardCache, ajax, toast } from "nc-lightapp-front";
import { URI, LIST, DATASOURCE } from "./../../cons/constant";
import buttonDisabledRule from "./buttonDisabledRule";
import { doAjax } from "../../utils/commonUtil";
let { setDefData, getDefData } = cardCache;
export default function searchBtnClick(props, searchData) {
    // 缓存处理
    searchData = searchCatchHandle(searchData);
    // 如果刷新时 没有历史查询数据，则不进行查询操作
    if (!searchData) return;
    let searchOid = this.props.search.getQueryInfo(LIST.searchCode).oid;
    let pageInfo = this.props.table.getTablePageInfo(LIST.tableCode);
    // 整理查询数据
    let data = searchDataHandle(
        searchData,
        this.state.activeKey,
        pageInfo,
        searchOid
    );
    // 获取列表数据
    doAjax.call(this, data, URI.endoreListMainQuery, setListRender);
}

/**
 * 查询条件缓存处理
 * @param {*} searchData
 */
const searchCatchHandle = searchData => {
    if (
        searchData &&
        searchData.conditions &&
        searchData.conditions.length > 0
    ) {
        // 放入缓存
        setDefData(LIST.searchCode, DATASOURCE, searchData);
    } else {
        // 从缓存取出
        searchData = getDefData(LIST.searchCode, DATASOURCE);
        if (!searchData) {
            return;
        }
    }
    return searchData;
};

/**
 * 整理查询需要的数据及数据结构
 * @param {*} searchData // 查询数据 （查询组件返回的数据）
 * @param {*} status // 对应状态
 * @param {*} pageInfo // 分页信息
 * @param {*} oid // 查询模版 oid
 */
const searchDataHandle = (searchData, status, pageInfo, oid) => {
    return {
        querycondition: searchData,
        custcondition: {
            conditions: [
                {
                    field: "vbillstatus",
                    value: {
                        firstvalue: status,
                        secondvalue: null
                    },
                    oprtype: "="
                }
            ],
            logic: "and"
        },
        pageInfo: pageInfo,
        pagecode: LIST.pageCode,
        //查询区编码
        queryAreaCode: LIST.searchCode,
        //查询模板id，手工添加在界面模板json中，放在查询区
        oid: oid,
        querytype: "tree"
    };
};

/**
 * 列表数据处理
 * @param {*} param0
 */
const setListRender = function({ data: { grid, numvalues } }) {
    // 表格数据
    if (grid) {
        this.props.table.setAllTableData(LIST.tableCode, grid[LIST.tableCode]);
    } else {
        this.props.table.setAllTableData(LIST.tableCode, { rows: [] });
    }
    // 状态页签数据
    if (numvalues) {
        // 防止后台少传状态 造成页签内容显示不全
        this.setState({ numvalues: { ...this.state.numvalues, ...numvalues } });
        //放入缓存
        setDefData("numvalues", DATASOURCE, this.state.numvalues);
        setDefData("activeKey", DATASOURCE, this.state.activeKey);
        if (parseInt(numvalues.ALL) < 1) {
            toast({ color: "warning", content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000041') });/* 国际化处理： 未查询出数据！*/
        } else {
            toast({ color: "success", content: this.props.MutiInit.getIntl("36180ETAPPR") && this.props.MutiInit.getIntl("36180ETAPPR").get('36180ETAPPR-000042') });/* 国际化处理： 查询成功!*/
        }
    }
    //放入缓存
    setDefData(LIST.tableCode, DATASOURCE, grid);
    // 重置按钮 状态
    buttonDisabledRule.call(this);
};

/*YuO8szH0cVixePu/Bt+mG4wwt1ZCV6u4IgNbgRHpTsn8KoXosovF0Q43KKMn41B9*/