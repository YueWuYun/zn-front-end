/*bwmF6IPMGkZoKiqugZGE2oXH++yRVUPuuTdEDGrX2ENElcdZ6U00UcgHoMuKO5B1*/
import { toast } from 'nc-lightapp-front';
import { checkEditRight } from "../../util/checkEditRight.js";
import { go2CardCheck } from "../../../../../tmpub/pub/util";
import { Templatedata } from "../../config/Templatedata";
/**
 * [外币兑换]-编辑按钮
 * @param {*} props  
 */
export const editBtn = function () {
    let editData = this.props.table.getCheckedRows(this.tableId);
    if (editData.length != 1) {
        toast({
            duration: 3,          // 消失时间，默认是3秒; 值为 infinity 时不消失,非必输
            color: 'warning',     // 提示类别，默认是 "success",非必输
            title: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000044'),      // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输/* 国际化处理： 请注意*/
            content: this.props.MutiInit.getIntl("36070FCE") && this.props.MutiInit.getIntl("36070FCE").get('36070FCE-000045')   // 提示内容,非必输/* 国际化处理： 请选择单条数据!*/
        })
        return;
    }
    let editId = 0;
    editData.forEach((val) => {
        editId = val.data.values.pk_cruexchange.value;//主键
        ts = val.data.values.ts.value  
    });
    //修改权限校验
    checkEditRight.call(this, editId).then((res) => {   
        //tm begin lidyu 并发交互跳转卡片检查 20200311
        go2CardCheck({
            props,
            url: Templatedata.gotocardcheck,
            pk: editId,
            ts: ts,
            checkTS: ts ? true : false,
            fieldPK: Templatedata.pkname,
            actionCode : null ,
            permissionCode: null ,
            go2CardFunc: () => {
                this.props.pushTo('/card', {
                    status: 'edit',
                    id: editId,
                    pagecode: this.pageCode
                })
          }
    })
        //tm end lidyu 并发交互跳转卡片检查 20200311

       
    });

}

/*bwmF6IPMGkZoKiqugZGE2oXH++yRVUPuuTdEDGrX2ENElcdZ6U00UcgHoMuKO5B1*/