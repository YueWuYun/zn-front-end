/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/
import {ajax} from 'nc-lightapp-front';
import {loadSearchCache} from "../../util/index";
import { list_page_id ,list_table_id} from '../../../allocate/cons/constant';
import { loadMultiLang } from "../../../../../tmpub/pub/util/index";
//点击查询，获取查询区数据
export const searchBtnClick = function clickSearchBtn(props,searchVal, groupKey) {
    
    if (!searchVal) {
        searchVal = props.search.getAllSearchData(this.searchId);
        if (!searchVal) {
            return;
        }
    }
    if (!searchVal.conditions || searchVal.conditions.length == 0) {
        return;
    }
    if(searchVal){
        let pageInfo = props.table.getTablePageInfo(list_table_id);
        // let pageCode = props.getSearchParam('p');
        let pageCode=list_page_id;
        if(groupKey!=0&&groupKey!=1&&groupKey!=2&&groupKey!=3&&groupKey!=4&&groupKey!=5&&groupKey!=6&&groupKey!=7) {
            groupKey=this.state.activeKey;
        }
        let groupCondition = getGroupCondition.call(this, groupKey);
        let data={
            querycondition:searchVal,
            custcondition: {
                logic: "and",
                conditions: [
                    groupCondition
                ],
            },
            pageInfo:pageInfo,
            pagecode: '36320FA_L01',
            queryAreaCode:'search_allocate_01',  //查询区编码
            oid:'1001Z610000000006A2Z',  //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
            querytype:'tree'
        };
        let searchData=JSON.stringify(data);
        let reqData = {data:searchData,pageCode};
        ajax({
            url: '/nccloud/sf/allocation/queryscheme.do',
            data:reqData,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if(data.grid){
                        this.props.table.setAllTableData(list_table_id, data.grid[list_table_id]);
                    }else{
                        this.props.table.setAllTableData(list_table_id, {rows:[]});
                    }
                    if (data.numvalues) {
                        this.setState({ numvalues: data.numvalues });
                        this.setState({
                            defaultSelectGrup: groupKey,
                            activeKey: groupKey,
                            groupCount: {
                                DTJ: data.numvalues.DTJ || 0,
                                DSP: data.numvalues.DSP || 0,
                                DZF: data.numvalues.DZF || 0,
                                ZFZ: data.numvalues.ZFZ || 0,
                                ZZCG: data.numvalues.ZZCG || 0,
                                YZF: data.numvalues.YZF || 0,
                                QB: data.numvalues.QB || 0
                            }
                        });
                    }
                }else {
                    this.props.table.setAllTableData(this.tableId, { rows: [] });
                    this.setState({ numvalues: {} });
                }
            }
        });
    }
    
};


/**
 * 获取分组查询条件
 * @param {*} groupKey 分组键
 */
const getGroupCondition = function (groupKey) {
    let groupCondition;
    switch (groupKey) {
        //待提交
        case '0':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 1,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '0' });
            break;
        //待审批
        case '1':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 2,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '1' });
            break;
        //待支付
        case '2':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 3,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '2' });
            break;
        //支付中
        case '3':
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 4,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '3' });
            break;
        
        //全部
        case '6':
            groupCondition = {};
            this.setState({ activeKey: '6' });
            break;
        //默认作为全部处理
        default:
            groupCondition = {
                field: 'billstatus',
                value: {
                    firstvalue: 1,
                    secondvalue: null
                },
                oprtype: '='
            };
            this.setState({ activeKey: '0' });
            break;
    }
    return groupCondition;
}

/*YuO8szH0cVixePu/Bt+mG3xLU1kiwlRoiHua7KSdy34vuINV2NlGCuVIDO1kbSwU*/