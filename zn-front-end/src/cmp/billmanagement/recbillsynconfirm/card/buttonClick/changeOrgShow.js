/*9KFtDin8/taitRCNBwjg633kSZRmfY9epGrQnOnFU1oKdBW+Bqt/jZMcTeSmWiKj*/
import { createPage, ajax, base, toast, cacheTools, print, cardCache,promptBox } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { changeOrgConfirm } from "../indexUtil/changeOrgConfirm.js";
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款协同]-切换组织
 * @param {*} props  
 */
export const changeOrgShow = function () {
    promptBox({
        color: "warning",
        content: this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000038'),/* 国际化处理： 是否修改组织，这样会清空您录入的信息?*/
        beSureBtnClick: changeOrgConfirm.bind(this), //使用call直接執行了
      });
}

/*9KFtDin8/taitRCNBwjg633kSZRmfY9epGrQnOnFU1oKdBW+Bqt/jZMcTeSmWiKj*/