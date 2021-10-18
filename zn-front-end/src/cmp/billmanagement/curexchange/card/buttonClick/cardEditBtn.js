/*M0WtqmEns1clT+Nsmb/El/IbFORubuJ6vq4VkvAuJpdYaR38s2/Viqc+zImMTih5*/
import { checkEditRight } from "../../util/checkEditRight.js";
/**
 * [外币兑换]-编辑修改按钮
 * @param {*} props  
 */
export const cardEditBtn = function () {
    //修改权限校验
    checkEditRight.call(this, this.props.getUrlParam('id')).then((res) => {
        //1,直接走后台查询一边数据即可
        this.props.pushTo('/card', {
            status: 'edit',
            id: this.props.getUrlParam('id'),
            bill_no: this.props.form.getFormItemsValue(this.formId, 'busistatus').value,
            pagecode: this.pageId
        })
        this.refresh();
        //2,不走后台直接修改页面状态即可
    });

}

/*M0WtqmEns1clT+Nsmb/El/IbFORubuJ6vq4VkvAuJpdYaR38s2/Viqc+zImMTih5*/