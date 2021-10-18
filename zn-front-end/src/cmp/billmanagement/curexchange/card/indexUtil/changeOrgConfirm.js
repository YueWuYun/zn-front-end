/*TE0TDPJaZX5V1NCycUAF0MBODyKos96ASe0UUNSIwP6uQutThp5tTc5lWfeJbOC+*/
import { ajax } from 'nc-lightapp-front';
import { resetEditData } from "./resetEditData";
import { Rateinfo } from "../../util/commonUtil";
/**
 * [外币兑换index]-组织改变--确认
 * @param {*}  
 */
export const changeOrgConfirm = function () {
    this.props.form.cancel(this.formId);  //恢复之前的值，设置edit状态
    resetEditData.call(this);//编辑性控制
    this.props.form.setFormStatus(this.formId, 'edit');
    let org_data = this.props.createFormAfterEventData(this.pageId, this.formId, this.formId, 'pk_org', this.value);
    org_data.newvalue = org_data.oldvalue;//使用上述方法,newvalue不存在值
    let newvalue = org_data.newvalue;
    if (!newvalue.value) {
        //新组织未选择
        this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: null, display: null } });
        this.props.form.EmptyAllFormValue(this.formId);//清空form表单
        this.props.initMetaByPkorg();//单据有主组织，新增时,将其他字段设置为不可编辑.
        return;
    }
    if (org_data) {
        this.props.form.EmptyAllFormValue(this.formId);//清空form表单
        ajax({
            url: '/nccloud/cmp/curexchange/curexchangeorgafterevent.do',
            data: org_data,
            async: false,
            success: (res) => {
                let { success } = res;
                if (success) {
                    this.props.form.setAllFormValue({ [this.formId]: res.data[this.formId] });
                    //汇率编辑性控制
                    Rateinfo.call(this, res.data.userjson, 'pk_chargecurrtype');
                }
            }
        });
    }
}

/*TE0TDPJaZX5V1NCycUAF0MBODyKos96ASe0UUNSIwP6uQutThp5tTc5lWfeJbOC+*/