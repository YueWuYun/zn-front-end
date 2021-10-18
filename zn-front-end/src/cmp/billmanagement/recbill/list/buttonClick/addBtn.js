/*LsGmnUjuUJhgHTjWE0yOSWxao+3hIMM5BpjgAN++jbeaNaOUfEvOH5V8/BbaP53+*/
import { createPage, ajax, base, high, toast, cacheTools,cardCache,print,output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import { MakeBillApp } from '../../../../public/utils/Makebill';//制单
import { linkApp, linkVoucherApp } from '../../../../public/utils/LinkUtil';//凭证
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款]-新增按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const addBtn = function () {
    this.props.pushTo('/card', {
        status: 'add',
        pagecode: this.state.tradeCode,
        formlist: 'fromlist',
        id: this.state.add_pk,//查询后赋值，单据pk
        bill_no: this.state.add_status//查询后赋值，单据状态
    })
}

/*LsGmnUjuUJhgHTjWE0yOSWxao+3hIMM5BpjgAN++jbeaNaOUfEvOH5V8/BbaP53+*/