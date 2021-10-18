/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import { ajax, cardCache, toast } from 'nc-lightapp-front';
let { setDefData, getDefData } = cardCache;

import {
    app_id, module_id, base_url, oid,
    list_page_id, list_search_id, list_table_id, link_list_page_id,
    cachesearchKey, dataSourceLink, cacheTabKey, cacheTabActiveKey
}
    from '../../cons/constant.js';

import clickBtn from './setButtonUsability';
import { loadMultiLang } from '../../../../../tmpub/pub/util'

//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if (searchVal) {
        setDefData(cachesearchKey, dataSourceLink, searchVal);
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        let queryInfo = props.search.getQueryInfo(list_search_id, false);
        let oid = queryInfo.oid;
        let data = {
            querycondition: searchVal,
            custcondition: {
                conditions: [
                    {
                        field: 'billstatus',
                        value: {
                            firstvalue: '6',
                            secondvalue: null
                        },
                        oprtype: '=',
                        datatype: 203,
                    }
                ],
                logic: "and",
            },
            pageInfo: pageInfo,
            pagecode: link_list_page_id,
            //查询区编码
            queryAreaCode: list_search_id,
            //查询模板id，手工添加在界面模板json中，放在查询区
            oid: oid,
            querytype: 'tree'
        };
        ajax({
            url: '/nccloud/sf/delivery/deliveryquery.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        if (data.grid) {
                            toast({
                                color: 'success', content: loadMultiLang(this.props, '3601-000014')/**多语 查询成功！ */
                            });
                            this.props.table.setAllTableData(this.tableId, data.grid[this.tableId]);
                        } else {
                            /* 国际化处理：未查询出符合条件的数据! */
                            toast({
                                color: 'warning', content: loadMultiLang(this.props, '3601-000016')/* 国际化处理：未查询出符合条件的数据! */
                            });
                            this.props.table.setAllTableData(this.tableId, { rows: [] });
                        }
                        if (data.numvalues) {
                            this.setState({ numvalues: data.numvalues, activeKey: '1' });
                            setDefData(cacheTabKey, dataSourceLink, this.state.numvalues);
                            setDefData(cacheTabActiveKey, dataSourceLink, this.state.activeKey);
                        } else {
                            this.setState({ numvalues: {} });
                        }
                        clickBtn.call(this, this.props);
                    } else {
                        /* 国际化处理：未查询出符合条件的数据! */
                        toast({
                            color: 'warning', content: this.props.MutiInit.getIntl("36320FDA")
                                && this.props.MutiInit.getIntl("36320FDA").get('36320FDA--000092')
                        });
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                        this.setState({ numvalues: {} });
                    }
                }
            }
        });
    }

};

/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/