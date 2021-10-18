/*i2ttZGBLUD5i+3NoC85dIXohU3WVGCUinYUnpQWpa3s4/6PQu0+dETCJ0vkzVTTc*/
/**
 * [收款]-编辑页面取消按钮逻辑
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const cancelConfirm = function () {
    //关联结算信息取消直接跳列表了
    let settlement_src_cancel = this.props.getUrlParam('src');
    console.log(settlement_src_cancel, 'from_settle_to_cancel');
    if (settlement_src_cancel) {
        window.onbeforeunload = null;
        this.props.pushTo('/list');
    }
    //编辑态
    if (this.props.getUrlParam('status') === 'edit') {
        let edit_pk = this.props.getUrlParam('id');
        let edit_billstatus = this.props.form.getFormItemsValue(this.formId, 'bill_status').value;
        let edit_pagecode = this.pageId;
        this.cancleNewPage(edit_pk, edit_billstatus, edit_pagecode);
    }
    //新增[针对于取消而言]
    //1,列表点击新增按钮-->进入卡片
    // 1.1 如果查询出数据，跳转到最后一条数据
    // 1.2 如果没有查询数据，跳转到空白页面
    //2,卡片新增按钮
    //2.1 取消直接返回卡片新增前的单据展示即可
    //3, 卡片保存新增按钮
    //3.1 保存成功后取消单据展示之前保存后缓存展示即可。
    if (this.props.getUrlParam('status') === 'add') {
        //新增请求的时候
        if (this.props.getUrlParam('formlist')) {
            //列表请求新增发送请求
            let url_id = this.props.getUrlParam('id');//单据pk
            let url_billno = this.props.getUrlParam('bill_no');//单据状态
            if (url_id && url_id.length > 0 && url_billno && url_billno.length > 0) {
                //1,查询后跳转新增页面
                this.cancleNewPage(
                    this.props.getUrlParam('id'),
                    this.props.getUrlParam('bill_no'),
                    this.pageId
                );
            } else {
                //2,未查询后跳转新增页面
                //清空表单form所有数据
                this.cancleSkyPage();
            }
        } else {
            //卡片请求新增
            //清空表单form所有数据
            this.props.form.EmptyAllFormValue(this.formId);
            //清空table所有数据
            this.props.cardTable.setTableData(this.tableId, { rows: [] });
            /**
             * 卡片新增--取消
             */
            if (this.props.getUrlParam('bill_no') &&
                this.props.getUrlParam('id')) {
                this.cancleNewPage(
                    this.props.getUrlParam('id'),
                    this.props.getUrlParam('bill_no'),
                    this.pageId
                );
            } else {
                // this.loadCacheData();//加载缓存
                this.cancleSkyPage();//跳转空白页面
            }
        }
    }
    //复制
    if (this.props.getUrlParam('status') === 'copy') {
        //复制pagecode变化
        let copy_tradetype = this.pageId;
        let copy_pk = this.props.getUrlParam('id');
        let copy_billstatus = this.props.getUrlParam('bill_no');
        if (this.props.form.getFormItemsValue(this.formId, 'trade_type').value) {
            copy_tradetype = this.props.form.getFormItemsValue(this.formId, 'trade_type').value
        }
        this.cancleNewPage(copy_pk, copy_billstatus, copy_tradetype);
    }
}

/*i2ttZGBLUD5i+3NoC85dIXohU3WVGCUinYUnpQWpa3s4/6PQu0+dETCJ0vkzVTTc*/