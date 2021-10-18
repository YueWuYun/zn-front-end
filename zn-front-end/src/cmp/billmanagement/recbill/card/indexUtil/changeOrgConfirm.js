/*TE0TDPJaZX5V1NCycUAF0MBODyKos96ASe0UUNSIwP6uQutThp5tTc5lWfeJbOC+*/
import { ajax } from 'nc-lightapp-front';
import { formRateEditinfo } from "../events/judgeCurrtype.js";
/**
 * [外币兑换]-组织改变确定
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const changeOrgConfirm = function () {
    //组织
    let pk_org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let pk_org_dly = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    //begin
    //切换组织-->将表单值取消到上次保存状态并切换到浏览态
    this.props.form.cancel(this.formId);
    this.props.form.setFormStatus(this.formId, 'edit');
    //table清楚之前的状态
    this.props.cardTable.resetTableData(this.tableId);
    this.props.cardTable.setStatus(this.tableId, 'edit');
    //end
    if(pk_org_val&&pk_org_val.length>0){
        this.props.form.setFormItemsValue(this.formId, { 'pk_org': { display: pk_org_dly, value: pk_org_val } });
    }
    let org_data = this.props.createHeadAfterEventData(this.pageId, this.formId, this.tableId, this.formId, 'pk_org', this.value);
    org_data.newvalue = org_data.oldvalue;//使用上述方法,newvalue不存在值
    let newvalue = org_data.newvalue;
    if (newvalue.value == null || newvalue.value == '') {
        //新组织未选择
        this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: null, display: null } });
        this.props.cardTable.setTableData(this.tableId, { rows: [] });//没有组织的时候要清空表体
        return;
    }
    if (org_data) {
        ajax({
            url: '/nccloud/cmp/recbill/recbillorgafterevent.do',
            data: org_data,
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        if (res.data.head) {
                            //组织pk_org赋值
                            if (pk_org_dly && pk_org_val) {
                                this.props.form.setFormItemsValue(this.formId, { 'pk_org': { display: pk_org_dly, value: pk_org_val } });
                                // 表体pk_org赋值
                                let orgtotalNum = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
                                for (let i = 0; i < orgtotalNum; i++) {
                                    this.props.cardTable.setValByKeyAndIndex(this.tableId, i, 'pk_org', { value: pk_org_val, display: pk_org_dly });
                                }
                            }
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(this.tableId, { rows: [] });
                            this.props.cardTable.setStatus(this.tableId, 'edit');
                            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                        }
                        //币种关联本币汇率字段编辑性
                        formRateEditinfo.call(this,res.data.userjson);
                    } else {
                        //清空数据
                        this.props.form.EmptyAllFormValue(this.formId);
                        this.props.cardTable.setTableData(this.tableId, { rows: [] });
                    }
                }
            }
        });
    }
    // buttonUsability.call(this,this.props);//控制卡片表体中肩部按钮是否可用
}

/*TE0TDPJaZX5V1NCycUAF0MBODyKos96ASe0UUNSIwP6uQutThp5tTc5lWfeJbOC+*/