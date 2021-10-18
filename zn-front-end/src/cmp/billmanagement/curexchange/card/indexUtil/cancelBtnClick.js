/*pr0tUH1dV1X/xaCwJNPKCLAdfLZvdbFtHj+zIgjP9ipBT1X64ao5fm4c5E56o6Lp*/
/**
 * [外币兑换index]-取消确认按钮
 * @param {*}  
 */
export const cancelBtnClick = function () {
    if (this.state.org_value && this.state.org_value.length > 0) {
        this.props.form.setFormItemsValue(this.formId, { 'pk_org': { value: this.state.org_value, display: this.state.org_display } });
    }
    //设置为编辑态
    this.props.resMetaAfterPkorgEdit();
}

/*pr0tUH1dV1X/xaCwJNPKCLAdfLZvdbFtHj+zIgjP9ipBT1X64ao5fm4c5E56o6Lp*/