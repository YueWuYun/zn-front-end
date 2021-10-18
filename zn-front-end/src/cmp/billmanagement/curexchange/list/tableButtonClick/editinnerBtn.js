/*hnUKX+o9bXg0bSmA5UgIY43DMQmwBux09IqRS2+ki7YrfFbN+fJEzQyPhGY7mlp9*/
import { checkEditRight } from "../../util/checkEditRight.js";
import { go2CardCheck } from "../../../../../tmpub/pub/util";
import { Templatedata } from "../../config/Templatedata";
/**
 * [外币兑换]-编辑按钮
 * @param {*} props  
 */
export const editinnerBtn = function (props,record, index) {
    //修改权限校验
    let id = record.pk_cruexchange.value;
    let ts = record.ts.value
    checkEditRight.call(this, id).then((res) => {

         //tm begin lidyu 并发交互跳转卡片检查 20200311
         go2CardCheck({
            props,
            url: Templatedata.gotocardcheck,
            pk: record.pk_cruexchange.value,
            ts: record.ts.value,
            checkTS: ts ? true : false,
            fieldPK: Templatedata.pkname,
            actionCode : null ,
            permissionCode: null ,
            go2CardFunc: () => {
                this.props.pushTo('/card', {
                    status: 'edit',
                    id: record.pk_cruexchange.value,
                    pagecode: this.pageCode
                });
          }
    })
        //tm end lidyu 并发交互跳转卡片检查 20200311

        
    });
}

/*hnUKX+o9bXg0bSmA5UgIY43DMQmwBux09IqRS2+ki7YrfFbN+fJEzQyPhGY7mlp9*/