/*mUOvDSO4b4LhhTZUVyxkKuHCdNKI34+S3a2TCTb+j6IecO2wl3etlwIrVdTvTUmu*/
import { ajax,cardCache } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { setNavValue } from "./setNavValue";
//缓存
let {  getDefData } = cardCache;

/**
 * [收款协同]-查询数据得到分组的标签数据
 * @param {*} data 
 */
export const queryNavValue = function () {
    //根据缓存查询页签数据
    let searchVal = getDefData(this.searchKey, this.dataSource);
    if (searchVal && searchVal.conditions) {
        let oid = Templatedata.list_oid;
        if (this.props.meta.getMeta()[this.searchId].oid) {
            oid = this.props.meta.getMeta()[this.searchId].oid;//动态获取oid
        }
        let pageInfo = this.props.table.getTablePageInfo(this.tableId);
        let searchdata = {
            querycondition: searchVal,
            custcondition: {
                logic: 'and', //逻辑操作符，and、or
                conditions: [
                    {
                        field: 'source_flag',
                        value: {
                            firstvalue: '9',
                            secondvalue: null
                        },
                        oprtype: '=',
                        display: null
                    }
                ]
            },
            pageInfo: pageInfo,
            pageCode: this.pageCode,
            queryAreaCode: this.searchId,
            oid: oid,
            querytype: 'tree'
        };
        ajax({
            url: '/nccloud/cmp/recbill/recbillquery.do',
            data: searchdata,
            success: (res) => {
                let { success, data } = res;
                if (success) {
                    if (data) {
                        setNavValue.call(this, data);//页签数值赋值                      
                    } 
                }
            }
        });
    }
}

/*mUOvDSO4b4LhhTZUVyxkKuHCdNKI34+S3a2TCTb+j6IecO2wl3etlwIrVdTvTUmu*/