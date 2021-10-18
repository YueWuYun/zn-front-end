/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/
import { ajax,cardCache ,toast} from 'nc-lightapp-front';

import { app_id, oid, base_url, pageCodeList, searchId, tableId,head_hidden_buttons, FixDepositProcessConst, LISTGROUP } from '../../cons/constant.js';


//点击查询，获取查询区数据
export default function clickSearchBtn(props, searchVal) {
    if (searchVal) {
        let pageInfo = props.table.getTablePageInfo(tableId);
        // setDefData( searchArea, search_key, searchVal);
        let queryInfo = props.search.getQueryInfo(searchId);
        let oid = queryInfo.oid;
        pageInfo.pageIndex = 0;
        let data = {
            querycondition: searchVal,
            custcondition: {
                logic: "and",   //逻辑操作符，and、or
                conditions: [
                ],
            },
            pageInfo: pageInfo,
            pageCode: pageCodeList,
            queryAreaCode: searchId,  //查询区编码
            oid: oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype: 'tree'
        };
        ajax({
            url: base_url+'pagequeryaction.do',
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        giveToast.call(this,props, data[tableId].allpks.length);
                        this.props.table.setAllTableData(tableId, data[tableId]);
                        this.setState({ activeKey: 5 });
                    } else {
                        this.props.table.setAllTableData(tableId, { rows: [] });
                        this.setState({ numvalues: {} });
                        giveToast.call(this,props)
                    }
                }else{
                    giveToast.call(this,props)
                }
            }
        });
    }

};

const giveToast = function (props, resLength) {
    if (resLength && resLength > 0) {
        toast({
            duration: 6,
            color: 'success',
            title: this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000050') + resLength + this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000061')
 })
    }
    else {
        toast({
            duration: 6,
            color: 'warning',
            title: this.props.MutiInit.getIntl("36140NDSR").get('36140NDSR-000012')    /* 国际化处理： 未查询出符合条件的数据！*/
        })
    }
    props.button.setButtonDisabled(head_hidden_buttons, true);
    //新增，刷新可见
    props.button.setButtonDisabled(['Add', 'Refresh', 'Link'], false);
}
/*YuO8szH0cVixePu/Bt+mGzpFGcu+B+/4LbnQ7jXcBB3F+W7ut3Ygc4tAx8nyRZYl*/