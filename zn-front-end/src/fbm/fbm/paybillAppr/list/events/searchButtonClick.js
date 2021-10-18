/*OJSK8pzdkJcNsMx6l+htTkwGLvCNQGR2rVtn0djBtfSv18nDgDai5Caaibv4VQxg*/
import { ajax, cardCache, toast } from "nc-lightapp-front";
import { DATASOURCE, LIST_PAGE_CODE, LIST_SEARCH_CODE, LIST_TABLE_CODE, URL_LIST } from "./../../cons/constant";
let { setDefData, getDefData } = cardCache;

//点击查询，获取查询区数据
export function searchButtonClick(content, props, searchVal) {
  let queryInfo = this.props.search.getQueryInfo(LIST_SEARCH_CODE);
  let querystatus = this.state.activeKey;
  let pageInfo = this.props.table.getTablePageInfo(LIST_TABLE_CODE);

  if (!searchVal || !searchVal.conditions || searchVal.conditions.length == 0) {
    searchVal = getDefData("searchVal", DATASOURCE);
    if (!searchVal) {
      return;
    }
  } else {
    setDefData("searchVal", DATASOURCE, searchVal); //放入缓存
  }
  let data = {
    querycondition: searchVal,
    custcondition: {
      conditions: [
        {
          field: "vbillstatus",
          value: {
            firstvalue: querystatus,
            secondvalue: null
          },
          oprtype: "="
        }
      ],
      logic: "and"
    },
    pageInfo: pageInfo,
    pageCode: LIST_PAGE_CODE,
    //查询区编码
    queryAreaCode: LIST_SEARCH_CODE,
    //查询模板id，手工添加在界面模板json中，放在查询区
    oid: queryInfo.oid,
    querytype: "tree"
  };

  ajax({
    url: URL_LIST.QUERY,
    data: data,
    success: res => {
      let { success, data } = res;
      if (success) {
        if (data.grid) {
          this.props.table.setAllTableData(
            LIST_TABLE_CODE,
            data.grid[LIST_TABLE_CODE]
          );
        } else {
          this.props.table.setAllTableData(LIST_TABLE_CODE, { rows: [] });
        }
        if (data.numvalues) {
          this.setState({ numvalues: data.numvalues });
          //放入缓存
          setDefData("numvalues", DATASOURCE, data.numvalues);
          setDefData("activeKey", DATASOURCE, querystatus);

          if (parseInt(data.numvalues.ALL) < 1) {
            toast({ color: "warning", content: this.props.MutiInit.getIntl("36180PBR_APPR") && this.props.MutiInit.getIntl("36180PBR_APPR").get('36180PBR_APPR-000035') });/* 国际化处理： 未查询出数据！*/
          } else {
            if (content && content.length > 0) {
            toast({ color: "success", content: content });}
          }
        }
        setDefData(LIST_TABLE_CODE, DATASOURCE, data.grid); //放入缓存
      }
    }
  });
}

/*OJSK8pzdkJcNsMx6l+htTkwGLvCNQGR2rVtn0djBtfSv18nDgDai5Caaibv4VQxg*/