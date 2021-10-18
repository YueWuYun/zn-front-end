/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/
import { ajax,cardCache ,toast} from 'nc-lightapp-front';
import { app_id, searchArea,demandintcalCacheKey, list_search_id, list_table_id } from '../../cons/constant.js';
import { requesturl } from '../../cons/requesturl.js';
import buttonUsability from './buttonUsability';
let {setDefData, getDefData } = cardCache;
//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if (searchVal) {
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        setDefData( searchArea, demandintcalCacheKey, searchVal);
        let queryInfo = props.search.getQueryInfo(list_search_id);
        let oid = queryInfo.oid;
        pageInfo.pageIndex = 0;
        let data = {
            querycondition: searchVal,
            custcondition: {
                logic: "and",   //逻辑操作符，and、or
                conditions: [
                ],
            },
            pageInfo: pageInfo,
            pagecode: app_id,
            queryAreaCode: list_search_id,  //查询区编码
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };
        ajax({
            url: requesturl.query,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        giveToast.call(this,props, data[list_table_id].pageInfo.total);
                        this.props.table.setAllTableData(this.tableId, data[this.tableId]);
                        this.setState({ activeKey: 5 });
                    } else {
                        this.props.table.setAllTableData(this.tableId, { rows: [] });
                        this.setState({ numvalues: {} });
                        giveToast.call(this,props)
                    }
                }else{
                    giveToast.call(this,props)
                }

                buttonUsability.call(this, props,null);
            }
        });
    }

};

const giveToast = function (props, resLength) {
    if (resLength && resLength > 0) {
        toast({
            duration: 6,
            color: 'success',
            title: this.state.json['36340CDIB-000008']
                 +this.state.json['36340CDIB-000010']+resLength+this.state.json['36340CDIB-000011']/**国际化处理：查询成功 */
        })
    }
    else {
        toast({
            duration: 6,
            color: 'warning',
            title: this.state.json['36340CDIB-000009']/**国际化处理：为查询出符合条件的数据 */
        })
    }
}
/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/