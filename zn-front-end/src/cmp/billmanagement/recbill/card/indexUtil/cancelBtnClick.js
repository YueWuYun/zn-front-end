/*pr0tUH1dV1X/xaCwJNPKCLAdfLZvdbFtHj+zIgjP9ipBT1X64ao5fm4c5E56o6Lp*/
/**
 * [收款结算]-切换组织取消按钮
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const cancelBtnClick = function () {
    if (this.org_value && this.org_value.length > 0) {
        this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: this.org_value, display: this.org_display } });
        // 表体pk_org赋值
        let totalNum = this.props.cardTable.getNumberOfRows(this.tableId);//表体table行数
        for (let i = 0; i < totalNum; i++) {
            this.props.cardTable.setValByKeyAndIndex(this.tableId, i, 'pk_org', { value: this.org_value, display: this.org_display });//给表体字段赋值
        }
    }
    //设置为编辑态
    this.props.resMetaAfterPkorgEdit();
    // buttonUsability.call(this,this.props);//控制卡片表体中肩部按钮是否可用
}

/*pr0tUH1dV1X/xaCwJNPKCLAdfLZvdbFtHj+zIgjP9ipBT1X64ao5fm4c5E56o6Lp*/