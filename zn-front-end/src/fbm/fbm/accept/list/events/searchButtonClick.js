/*OJSK8pzdkJcNsMx6l+htTkwGLvCNQGR2rVtn0djBtfSv18nDgDai5Caaibv4VQxg*/
import { ajax, toast, cardCache } from 'nc-lightapp-front';
import { LIST_TABLE_CODE, DATASOURCE, LIST_SEARCH_CODE, LIST_PAGE_CODE, URL_LIST } from "./../../cons/const";
import { buttonVisiable } from "./index";
let { setDefData, getDefData } = cardCache


export function searchButtonClick(props, searchVal) {
    let queryInfo = this.props.search.getQueryInfo(LIST_SEARCH_CODE);
    let querystatus = this.state.activeKey;
    let pageInfo = this.props.table.getTablePageInfo(LIST_TABLE_CODE);
    let isSearchBtn = this.state.isSearchBtn;

    if (!searchVal || !searchVal.conditions || searchVal.conditions.length == 0) {
        searchVal = getDefData('searchVal', DATASOURCE);
        if (!searchVal) {
            return;
        }
    } else {
        setDefData('searchVal', DATASOURCE, searchVal);//放入缓存
    }

    let data = {
        querycondition: searchVal,
        custcondition: {
            conditions: [
                {
                    field: 'vbillstatus',
                    value: {
                        firstvalue: querystatus,
                        secondvalue: null
                    },
                    oprtype: '=',
                }
            ],
            logic: "and",
        },
        pageInfo: pageInfo,
        pagecode: LIST_PAGE_CODE,
        //查询区编码
        queryAreaCode: LIST_SEARCH_CODE,
        //查询模板id，手工添加在界面模板json中，放在查询区
        oid: queryInfo.oid,
        querytype: 'tree'
    };

    ajax({
        url: URL_LIST.QUERY,
        data: data,
        success: (res) => {
            let { success, data } = res;
            let mutiInit = this.props.MutiInit.getIntl("36180BP");
            if (success) {
                if (data.grid) {
                    this.props.table.setAllTableData(LIST_TABLE_CODE, data.grid[LIST_TABLE_CODE]);
                } else {
                    this.props.table.setAllTableData(LIST_TABLE_CODE, { rows: [] });
                }
                if (data.numvalues) {
                    this.setState({ numvalues: data.numvalues });
                    //放入缓存
                    setDefData('numvalues', DATASOURCE, data.numvalues);
                    setDefData('activeKey', DATASOURCE, querystatus);

                    if (isSearchBtn == 2){
                    }else if (parseInt(data.numvalues.ALL) < 1) {
                        toast({ color: 'warning', content: mutiInit && mutiInit.get('36180BP-000024') });/* 国际化处理： 未查询出数据！*/
                    } else {
                        if (isSearchBtn == 1)
                            toast({
                                color: 'success', content: mutiInit &&
                                    `${mutiInit.get("36180BP-000025")}${data.numvalues.ALL}${mutiInit.get(
                                        "36180BP-000034"
                                    )}`
                            })/* 国际化处理： 查询成功，共(n)条*/
                        else if (isSearchBtn == 0)
                            toast({ color: 'success', content: mutiInit && mutiInit.get('36180BP-000026') }) /* 国际化处理： 刷新成功!*/
                    }



                }
                this.setState({ isSearchBtn: true });
                setDefData(LIST_TABLE_CODE, DATASOURCE, data.grid);//放入缓存    
                buttonVisiable.call(this, this.props);
            }
        }
    });
};
/*OJSK8pzdkJcNsMx6l+htTkwGLvCNQGR2rVtn0djBtfSv18nDgDai5Caaibv4VQxg*/