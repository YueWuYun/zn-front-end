/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/
import { EmptyAreaValue } from "../../../../pub/utils/EmptyAreaValueUtil";
import { getCardData, setEditStatus } from "../../../../public/container/page";
import { CARD } from '../../cons/constant';
import { _buttonClick } from '../events';
import { afterEvent } from "./index";
export function buttonClick(props, id) {
    let status = props.getUrlParam("status");
    let pk =
        props.form.getFormItemsValue(this.formId, this.primaryId) &&
        props.form.getFormItemsValue(this.formId, this.primaryId).value;
    if (!pk) {
        // 按说不能够从url中取id，删除的单据可能还在url上
        pk = props.getUrlParam("id");
    }
    switch (id) {

             //复制
             case "Copy":
             props.pushTo("/card", {
                 status: "copy",
                 id: pk,
                 pagecode: CARD.page_id
             });
             setEditStatus.call(this, "edit");
             
             getCardData.call(this, pk, true,
                ()=>{
                    
                    let cyberbankflag = this.props.form.getFormItemsValue(this.formId, 'cyberbankflag') && this.props.form.getFormItemsValue(this.formId, 'cyberbankflag').value;
                    //let vbillno = this.props.form.getFormItemsValue(this.formId, 'vbillno') && this.props.form.getFormItemsValue(this.formId, 'vbillno').value;
                    if (cyberbankflag ) {
                        // 票据签发 有两个票据号码，复制的时候需要判断显示哪一个，这里加一下逻辑 
                        this.props.form.setFormItemsVisible(this.formId, {
                            fbmbillno2: true,
                            fbmbillno: false
                        });
                        this.props.form.setFormItemsRequired(this.formId, {
                            fbmbillno2: false, // 设置票据号码2非必输
                            pk_banktype: true  // 银行类别必输
                        });
                    }else{
                        this.props.form.setFormItemsDisabled(this.formId, {
                            fbmbillno: false
                        });
                    }
                    //如果是复制的签发 承兑相关的信息可能会因票据类型不同而赋不上值 这里先走一下编辑后事件 不影响后面修改其他字段的编辑后事件
                    let fbmbilltype = this.props.form.getFormItemsValue(this.formId, 'fbmbilltype');
                    afterEvent.call(this, props, this.formId, "fbmbilltype", fbmbilltype, { value: null });
            }
            
            );
             EmptyAreaValue.call(
                 this,
                 this.billInfo,
                 this.formId,
                 "pk_register."
             );
             break;
             default:
             _buttonClick.call(this,props, id);
             break;
    }
}

/*Hm9gUKDDwtNjV7Mk8onAzgtqWTSnheWr82/7b0hcayENhlkpucGtwuBG6oE0UJS0*/