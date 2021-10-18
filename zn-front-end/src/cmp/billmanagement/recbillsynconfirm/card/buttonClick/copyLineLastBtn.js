/*TUjALmQQ8CzXA4MgzZQr7r1iAvHNbC7tZMbUIhRXTV14BdTZxHWQKb7meviNROWG*/
import { createPage, ajax, base, high, toast, cacheTools, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import { MakeBillApp } from '../../../../public/utils/Makebill';//制单
import { linkApp, linkVoucherApp } from '../../../../public/utils/LinkUtil';//凭证
import { BatchCopy } from '../../../../public/CMPButtonUtil.js';//表体按钮切换粘贴类
import { CopyLastHandleData } from '../events/CMPCopyUtil.js';
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款协同]-粘贴末行
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const copyLineLastBtn = function () {
    let selectRows = this.props.cardTable.getCheckedRows(this.tableId);
    if (selectRows == null || selectRows.length == 0) {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000007')/* 国际化处理： 未选中要复制的行*/
        });
        return false;
    }

    let copyindex = this.props.cardTable.getNumberOfRows(this.tableId, false);
    BatchCopy.call(this,this.props, this.tableId, copyindex);//调用组件使用粘贴
    //处理复制张贴数据数据
    CopyLastHandleData(this.props, this.tableId, copyindex, selectRows.length);
    this.setState({ pasteflag: false }, () => { this.toggleShow() });
}

/*TUjALmQQ8CzXA4MgzZQr7r1iAvHNbC7tZMbUIhRXTV14BdTZxHWQKb7meviNROWG*/