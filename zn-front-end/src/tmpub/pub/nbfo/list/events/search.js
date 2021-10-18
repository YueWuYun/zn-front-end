/*w/8iNiAH+zj8WJF4+Br6+hKdGDAof9HPKN2+vymi+iI3tF0G8PLm4teGOaiBQKxH*/
import { ajax, toast } from "nc-lightapp-front";
import { baseReqUrl, javaUrl, list } from "../../cons/constant.js";
import { selectedEvent } from "./page.js";

/**
 * 点击查询，获取查询区数据
 * @param {*} props
 * @param {*} condition
 * @param {*} type
 * @param {*} querycondition
 * @param {*} isRefresh
 */
export function searchBtnClick(
    props,
    condition,
    type,
    querycondition,
    isRefresh = false
) {
    props = this.props;
    //查询区域查询条件(判断查询参数是否传了，若没传，则将目前的查询参数交给它)
    if (!querycondition) {
        querycondition = props.search.getAllSearchData(this.searchId);
        if (!querycondition) {
            return;
        }
    }
    if (!condition) {
        condition = props.search.getAllSearchData(this.searchId);
    }
    let pageInfo = props.editTable.getTablePageInfo(list.tableCode);
    let metaData = props.meta.getMeta();
    let searchOid = metaData.search.oid;
    let searchdata = {
        querycondition: condition,
        pageInfo: pageInfo,
        pagecode: list.pageCode,
        queryAreaCode: list.searchCode, //查询区编码
        oid: searchOid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
        querytype: "tree"
    };
    if (this.appcode === "36010NBFOO") {
        searchdata.querycondition.conditions.push({
            field: "orgflag",
            oprtype: "=",
            display: this.state.json["36010NBFO-000049"] /* 国际化处理： 组织*/,
            value: {
                firstvalue: 0,
                secondvalue: null
            }
        });
    } else if (this.appcode === "36010NBFOG") {
        searchdata.querycondition.conditions.push({
            field: "orgflag",
            oprtype: "=",
            display: this.state.json["36010NBFO-000048"] /* 国际化处理： 集团*/,
            value: {
                firstvalue: 1,
                secondvalue: null
            }
        });
    } else {
        searchdata.querycondition.conditions.push({
            field: "orgflag",
            oprtype: "=",
            display: this.state.json["36010NBFO-000046"] /* 国际化处理： 全局*/,
            value: {
                firstvalue: 2,
                secondvalue: null
            }
        });
    }
    if (this.state.typeQueryPk && this.state.typeQueryPk !== "-1") {
        searchdata.querycondition.conditions.push({
            field: "type",
            oprtype: "=",
            value: {
                firstvalue: this.state.typeQueryPk,
                secondvalue: null
            }
        });
    }
    getListData.call(this, javaUrl.list, searchdata, isRefresh);
}

/**
 * 点击分页、改变每页条数
 * @param {*} props           页面内置对象
 * @param {*} config          大家查一下文档，没细看，貌似没用上
 * @param {*} pks             拿到当前页的所有pks
 */
export function pageInfoClick(props, config, pks) {
    let data = {
        pks,
        pageCode: this.pageId
    };
    this.setState({
        showToast: false
    });
    getListData.call(this, javaUrl.pks, data);
}

/**
 * 请求列表接口
 * @param {*} path       接口地址
 * @param {*} data       数据
 * @param {*} isRefresh  是否为刷新操作
 */
function getListData(path, data, isRefresh) {
    ajax({
        url: `${baseReqUrl}${path}.do`,
        data,
        success: res => {
            listRender.call(this, res, isRefresh);
            this.props.button.setButtonDisabled("refresh", false);
        },
        error: () => {
            listRender.call(this, {
                success: false
            });
        }
    });
}

/**
 * 拿到返回的数据，对列表进行渲染
 * @param {*} res            后台返回的res
 * @param {*} isRefresh 	是否为刷新操作
 */
function listRender(res, isRefresh) {
    let { success, data } = res;
    if (success && data && data.grid && data.grid[this.tableId]) {
        this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
        this.props.button.setButtonDisabled("Refresh", false);
        selectedEvent.call(this, this.props);
        if (this.state.showToast) {
            if (isRefresh) {
                toast({
                    color: "success",
                    content: this.state.json["36010NBFO-000047"]
                }); /* 国际化处理： 刷新成功!*/
            } else {
                toast({
                    color: "success",
                    content: `${this.state.json["36010NBFO-000024"]}，${
                        this.state.json["36010NBFO-000025"]
                    }${data.grid[this.tableId].pageInfo.total}${
                        this.state.json["36010NBFO-000026"]
                    }`
                }); /* 国际化处理： 查询成功,共,条*/
            }
        }
    } else {
        this.props.table.setAllTableData(this.tableId, {
            rows: []
        });
    }
}

/*w/8iNiAH+zj8WJF4+Br6+hKdGDAof9HPKN2+vymi+iI3tF0G8PLm4teGOaiBQKxH*/