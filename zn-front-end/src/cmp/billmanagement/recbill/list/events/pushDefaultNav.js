/*W49ZO6+V/s9JXQoIPuX3Bzx9+zkWaY4Ku5Ks8Y/bbCKbHtdnfBW+kXBW/Nj170UQ*/
import { deepClone } from 'nc-lightapp-front';
/**
 * [收款]-查询条件中push默认页签数据
 * @param {*} searchVal 查询区条件
 */
export const pushDefaultNav = function (searchVal) {
    let defaultKey = this.state.defaultKey;//默认页签
    searchVal = deepClone(searchVal);//克隆防止修改缓存数据
    let serval;
    if (defaultKey == '0') {//待提交
        serval = [
            {

                field: 'bill_status',
                value: {
                    firstvalue: '-10',
                    secondvalue: null
                },
                oprtype: '=',
                datetype: 203
            }
        ];
        if (searchVal && searchVal.conditions) {
            searchVal.conditions.push(...serval);//合并查询条件
        }
        return searchVal;
    }
    if (defaultKey == '1') {//审批中
        serval = [
            {
                field: 'bill_status',
                value: {
                    firstvalue: '2',
                    secondvalue: null
                },
                oprtype: '=',
                datetype: 203
            }
        ];
        if (searchVal && searchVal.conditions) {
            searchVal.conditions.push(...serval);//合并查询条件
        }
        return searchVal;
    }
    if (defaultKey == '2') {//全部
        serval = [

        ];
        return searchVal;
    }
}

/*W49ZO6+V/s9JXQoIPuX3Bzx9+zkWaY4Ku5Ks8Y/bbCKbHtdnfBW+kXBW/Nj170UQ*/