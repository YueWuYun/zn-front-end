/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import { ajax, toast } from 'nc-lightapp-front';
import { setPropCache, saveMultiLangRes, loadMultiLang } from "../../../../../tmpub/pub/util/index";
import { dataSource, list_page_code, grid_code, list_search_code } from '../../cons/constant.js';
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if (searchVal) {
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let queryInfo = props.search.getQueryInfo(list_search_code, false);
        let searchdata = {
            querycondition: searchVal,
            custcondition: {
                logic: 'and', //逻辑操作符，and、or
                conditions: []
            },
            pageInfo,
            pageCode: this.pageCode,
            queryAreaCode: this.searchId, //查询区编码
            oid: queryInfo.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };
        ajax({
            url: '/nccloud/sf/allocateReceiptCenter/queryscheme.do',
            data: searchdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        toast({ color: 'success' , content: loadMultiLang(this.props, '36320FARF-000025') });/* 国际化处理： 查询成功*/
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                    } else {
                        toast({ color: 'warning', content: loadMultiLang(this.props, '36320FARF-000023') });/* 国际化处理： 未查询出符合条件的数据!*/
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                    }

                }
            }
        });
    }

};

/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/