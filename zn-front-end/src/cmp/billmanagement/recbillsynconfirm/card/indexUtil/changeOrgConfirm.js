/*TE0TDPJaZX5V1NCycUAF0MBODyKos96ASe0UUNSIwP6uQutThp5tTc5lWfeJbOC+*/
import { ajax } from 'nc-lightapp-front';
/**
 * [收款协同]-组织改变
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const changeOrgConfirm = function () {
    //组织
    let pk_org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let pk_org_dly = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    //恢复之前的值，设置edit状态
    this.props.form.cancel(this.formId);
    this.props.form.setFormStatus(this.formId, 'edit');
    //table清楚之前的状态
    this.props.cardTable.resetTableData(this.tableId);
    this.props.cardTable.setStatus(this.tableId, 'edit');
    let org_data = this.props.createHeadAfterEventData(this.pageId, this.formId, this.tableId, this.formId, 'pk_org', this.value);
    ajax({
        url: '/nccloud/cmp/recbill/recbillorgafterevent.do',
        data: org_data,
        success: (res) => {
            if (res.success) {
                if (res.data) {
                    if (res.data.head) {
                        //设置form的编辑属性
                        this.props.resMetaAfterPkorgEdit();//选择主组织以后，恢复其他字段的编辑性
                        //组织本币币种
                        let currtype = res.data.head[this.formId].rows[0].values.pk_currtype.value;
                        let currtypedly = res.data.head[this.formId].rows[0].values.pk_currtype.display;
                        //页面渲染,不能用这种方式，否则的话无法设置form和table的编辑性
                        // props.form.setAllFormValue({ [moduleId]: res.data.head[moduleId] });
                        //查询获取的币种汇率
                        let re_local_rate_form = res.data.head[this.formId].rows[0].values.local_rate.value;
                        let re_local_money_from = res.data.head[this.formId].rows[0].values.local_money.value;

                        if (pk_org_dly && pk_org_val) {
                            this.props.form.setFormItemsValue(this.formId, { 'pk_org': { display: pk_org_dly, value: pk_org_val } });
                        }

                    }
                    if (res.data.body) {
                        this.props.cardTable.setStatus(this.tableId, 'edit');
                    }
                }

            }
        }
    });
}

/*TE0TDPJaZX5V1NCycUAF0MBODyKos96ASe0UUNSIwP6uQutThp5tTc5lWfeJbOC+*/