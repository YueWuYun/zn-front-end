/*OJSK8pzdkJcNsMx6l+htTkwGLvCNQGR2rVtn0djBtfSv18nDgDai5Caaibv4VQxg*/
import {ajax,toast,cardCache} from 'nc-lightapp-front';
import { LIST_TABLE_CODE,LIST_PAGE_CODE,LIST_SEARCH_CODE,DATASOURCE,URL_LIST} from "./../../cons/constant";
import { buttonVisiable } from "./buttonVisiable";
let { setDefData,getDefData } =  cardCache
//点击查询，获取查询区数据
export function searchButtonClick(props, searchVal) {
    let queryInfo = this.props.search.getQueryInfo(LIST_SEARCH_CODE);
    let querystatus = this.state.activeKey
    let conditions = [];
    let pageInfo = this.props.table.getTablePageInfo(LIST_TABLE_CODE);
    let isSearchBtn = this.state.isSearchBtn
   let isRefresh = null;
   let isdelete = null;
   let isChangeTab = null;
    if(searchVal == 'refresh'){
      isRefresh =  searchVal;
      searchVal = undefined;
    }else if(searchVal == 'delete'){
      isdelete =  searchVal;
      searchVal = undefined;
    }else if(searchVal == 'changeTab'){
      isChangeTab =  searchVal;
      searchVal = undefined;
    }

    if (querystatus == "3") {
        conditions = [
          {
            field: "sfflag",
            value: {
              firstvalue: "N",
              secondvalue: null
            },
            oprtype: "="
          },
          {
            field: "vbillstatus",
            value: {
              firstvalue: 1,
              secondvalue: null
            },
            oprtype: "="
          },
          {
            field: "disableflag",
            value: {
              firstvalue: "Y",
              secondvalue: null
            },
            oprtype: "!="
          },
          {
            field: "elcpaymentstatus",
            value: {
              firstvalue: '1,3',
              secondvalue: null
            },
            oprtype: "!="
          },
          {
            field: "registerstatus",
            value: {
              firstvalue: "register",
              secondvalue: null
            },
            oprtype: "="
          }
        ];
      } else if (querystatus == "4") {
        conditions = [
          {
            field: "elcpaymentstatus",
            value: {
              firstvalue: '2,3',
              secondvalue: null
            },
            oprtype: "="
          },
          {
            field: "disableflag",
            value: {
              firstvalue: 'Y',
              secondvalue: null
            },
            oprtype: "!="
          }
        ];
      } else {
        let querystatus = -1
        let activeKey = this.state.activeKey
        if(activeKey =='0'){
            // 待提交
            querystatus =  -1
        }else if(activeKey == '1'){
            // 审批中
            querystatus = 2
        }else{
            // 全部
            querystatus = 0
        }
        conditions = [
          {
            field: "vbillstatus",
            value: {
              firstvalue: querystatus,
              secondvalue: null
            },
            oprtype: "="
          }
        ];
      }

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
        custcondition: {
            conditions: conditions,
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
            if (success) {
                if (data.grid) {
                    this.props.table.setAllTableData(LIST_TABLE_CODE, data.grid[LIST_TABLE_CODE]);
                } else{
                    this.props.table.setAllTableData(LIST_TABLE_CODE, { rows: [] });
                }
                if(data.numvalues){
                    this.setState({ numvalues: data.numvalues });
                    //放入缓存
                    setDefData('numvalues', DATASOURCE, data.numvalues);
                    setDefData('activeKey', DATASOURCE, querystatus);

                    if (parseInt(data.numvalues.ALL) < 1) {
                        toast({ color: 'warning', content: this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000034') });/* 国际化处理： 未查询出数据！*/
                    } else {
                      if(isdelete === 'delete'){

                      }else if(isChangeTab == 'changeTab'){

                      }else if(isRefresh !== 'refresh'){
                        let successStr = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000035');
                        // let totalStr = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000052');
                        // let recordStr = this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000053');
                        // let content = successStr + ',' + totalStr + data.numvalues.ALL + recordStr;
                            toast({ color: 'success', content: successStr})/* 国际化处理： 查询成功!*/
                      }else{
                            toast({ color: 'success', content: this.props.MutiInit.getIntl("36180RBR") && this.props.MutiInit.getIntl("36180RBR").get('36180RBR-000018') })/* 国际化处理： 刷新成功!*/
                      }                       
                    }                
                    
                }                
                setDefData(LIST_TABLE_CODE, DATASOURCE, data.grid);//放入缓存 
                buttonVisiable.call(this, this.props);                   
            }
            this.setState({ isSearchBtn: true });
        }
    });
    
};

/*OJSK8pzdkJcNsMx6l+htTkwGLvCNQGR2rVtn0djBtfSv18nDgDai5Caaibv4VQxg*/