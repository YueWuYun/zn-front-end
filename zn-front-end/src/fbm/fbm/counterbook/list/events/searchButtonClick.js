/*OJSK8pzdkJcNsMx6l+htTkwGLvCNQGR2rVtn0djBtfSv18nDgDai5Caaibv4VQxg*/
import {ajax,toast,cardCache} from 'nc-lightapp-front';
import { 
    LIST_TABLE_CODE,LIST_PAGE_CODE,LIST_SEARCH_CODE,DATASOURCE,URL_LIST,BTN_GROUP, APP_CODE
}
from "./../../cons/constant";
let { setDefData,getDefData } =  cardCache

//点击查询，获取查询区数据
export function searchButtonClick(props, searchVal, btncode) {
    let queryInfo = this.props.search.getQueryInfo(LIST_SEARCH_CODE);
    let querystatus = this.state.activeKey
    let pageInfo = this.props.table.getTablePageInfo(LIST_TABLE_CODE);

    if (!searchVal || !searchVal.conditions || searchVal.conditions.length == 0) {
        searchVal = getDefData('searchVal', DATASOURCE);
        if(!searchVal){
            return;
        }
    } else {
        setDefData('searchVal', DATASOURCE, searchVal);//放入缓存
    }
    let data = {
        querycondition: searchVal,
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
            if (success) {
                if (data && data.grid) {
                    this.props.table.setAllTableData(LIST_TABLE_CODE, data.grid[LIST_TABLE_CODE]);
                    setDefData(LIST_TABLE_CODE, DATASOURCE, data.grid);//放入缓存 
                    if(BTN_GROUP.REFRESHE == btncode){
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000001') })/* 国际化处理： 刷新成功!*/
                    }else{
                        let succ = this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000007') ;
                        let gong = this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000008') ;
                        let tiao = this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000009') ;
                        let content = succ + gong +  data.grid[LIST_TABLE_CODE].pageInfo.total + tiao;
                        toast({ color: 'success', content: content});/* 国际化处理： 查询成功!*/
                    }
                } else{
                    this.props.table.setAllTableData(LIST_TABLE_CODE, { rows: [] });
                    toast({ color: 'warning', content: this.props.MutiInit.getIntl("36181BL") && this.props.MutiInit.getIntl("36181BL").get('36181BL-000005') });/* 国际化处理： 未查询出数据！*/
                }
            }
        }
    });
    
};

/*OJSK8pzdkJcNsMx6l+htTkwGLvCNQGR2rVtn0djBtfSv18nDgDai5Caaibv4VQxg*/