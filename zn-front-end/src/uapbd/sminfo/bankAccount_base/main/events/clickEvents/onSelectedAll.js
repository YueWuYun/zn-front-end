//815Pjv2LAHo9WMsAccu+yNnbt9Z6ULDbi9+y7RpQO5cOVH4hk3ZxgrONddjcOUie
export default function (props, moduleId, status, length) {
    //这里设置哪些按钮全选数据可以点
    let tableData = props.table.getCheckedRows(moduleId);
    let cantDeleteArr = [];
    if (tableData.length > 0) {
        tableData.map((ele) => {
            if (ele.data.values.accstate.value === '3') {
                cantDeleteArr.push(ele.data.values.pk_bankaccbas.value);
            }
        });
    }
    // 单条数据 全选的按钮控制  by zhangchenm
    if (tableData.length == 1) {
        props.button.setButtonDisabled(['btnAdjust', 'btnCancellAcc'], false);
    } else {
        props.button.setButtonDisabled(['btnAdjust', 'btnCancellAcc'], true);
    }
    props.button.setButtonDisabled(['btnDel', 'btnAuthorization', 'authorization', 'unAuthorization', 'listEnable', 'listDisable'], cantDeleteArr.length != 0 || !status);
    this.setState(this.state);

}

//815Pjv2LAHo9WMsAccu+yNnbt9Z6ULDbi9+y7RpQO5cOVH4hk3ZxgrONddjcOUie