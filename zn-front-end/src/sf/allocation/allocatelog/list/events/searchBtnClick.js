/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import {ajax, toast} from 'nc-lightapp-front';
import { jsoncode, requesturl } from '../../util/const.js';
//点击查询，获取查询区数据
export default function clickSearchBtn(props,searchVal, type, a, isRefresh = false) {
    if(searchVal){
        let pageInfo = props.table.getTablePageInfo(this.tableId);
        pageInfo.pageIndex = 0;
        let queryInfo = props.search.getQueryInfo(jsoncode.searchcode, false);
        let oid = queryInfo.oid;
        let conStr= '';
        let data={
            querycondition:searchVal,
            pageInfo:pageInfo,
            pagecode: '36321AALQ_L01',
            queryAreaCode:'search_allocatelog_01',  //查询区编码
            oid:oid,  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:"tree"
        };
        ajax({
            url: requesturl.search,
            data: data,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(isRefresh){
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36321AALQ") && this.props.MutiInit.getIntl("36321AALQ").get('36321AALQ-000012')});
                    }
                    if (data.grid) {
                        let retPageInfo = data.grid[this.tableId].pageInfo;
                        let totalnum = retPageInfo && retPageInfo.total;
                        let str1 = this.props.MutiInit.getIntl("36321AALQ") && this.props.MutiInit.getIntl("36321AALQ").get('36321AALQ-000013');
                        let str2 = this.props.MutiInit.getIntl("36321AALQ") && this.props.MutiInit.getIntl("36321AALQ").get('36321AALQ-000014');
                        conStr = str1 + totalnum + str2;
                        !isRefresh && toast({ color: 'success', content: conStr });
                        props.table.setAllTableData(this.tableId, data.grid[this.tableId]);  
                    } else {
                        !isRefresh && toast({ color: 'warning', content: this.props.MutiInit.getIntl("36321AALQ") && this.props.MutiInit.getIntl("36321AALQ").get('36321AALQ-000011') });
                        props.table.setAllTableData(this.tableId, { rows: [] });
                    }
                }
            }
        });
    }
    
};

/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/