/*BJzpvOTxrU0V69KiBNXco+OqPRHxvvBNmJyzHgSWk/Bl7nCSmHw/MkSfVOFkLeZB*/
import { ajax, toast, promptBox } from 'nc-lightapp-front';
import { CARD_PAGE_CODE,LIST_LINK_PAGE,URL_LIST,LIST_TABLE_CODE,LIST_INNERBTN } from "./../../cons/const";

export function bobyButtonClick(props, key, text, record, index){
    switch (key) {
        // 修改
        case LIST_INNERBTN.INNEREDIT:
            doInnerEidt.call(this, props, record, index);
            break;
        // 提交
        case LIST_INNERBTN.INNERCOMMIT:
            doInnerCommit.call(this, props, record, index);
            break;
        // 收回
        case LIST_INNERBTN.INNERUNCOMMIT:
            doInnerUnCommit.call(this,props,record,index);
            break;
        // 删除
        case LIST_INNERBTN.INNERDELETE:
            doInnerDelete.call(this,props,record,index);
            break;
        // 制证
        case LIST_INNERBTN.INNERVOUCHER:
            doInnerVoucher.call(this,props,record,index);
            break;
        // 取消制证
        case LIST_INNERBTN.INNERCANCELVOUCHER:
            doInnerCancelVoucher.call(this,props,record,index);
            break;
    }
}

/**
 * 修改
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerEidt(props, record, index){
    props.pushTo("/card", {
        status: 'edit',
        id: record.pk_accept && record.pk_accept.value,
        pagecode: CARD_PAGE_CODE,
    });
}

/**
 * 提交
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerCommit(props, record, index) {
    let pk = record.pk_accept.value
    let ts = record.ts.value

    let sendData = {
        pageid: LIST_LINK_PAGE,
        pks: [pk],
        tss: [ts],
        isCardOpt: false,
    }

    let successCallback = function (res) {

        let that = this
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid,index);
        }
        if (res.data.workflow &&
            (res.data.workflow == 'approveflow' || res.data.workflow == 'workflow')) {
            this.setState({
                compositedata: res.data,
                compositedisplay: true,
            });
            this.index = index
            this.record = record
        } else {
            let successIndexs = 0
            if (res.data.successpks) {
                successIndexs = res.data.successpks.length;
            }
            
            // 全部成功
            if (successIndexs == 1) {
                toast({
                    color: 'success',
                    content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000009')/* 国际化处理： 提交成功！*/
                })
            } else {
                toast({
                    color: 'error',
                    content: res.data.errMsg && res.data.errMsg.split('\n')
                })
            }
        }
    }


    doAjax.call(this, sendData, URL_LIST.COMMIT, successCallback)
}

/**
 * 收回
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerUnCommit(props,record,index){
    let pk = record.pk_accept.value
    let ts = record.ts.value

    let sendData = {
        pageid: LIST_LINK_PAGE,
        pks: [pk],
        tss: [ts],
        isCardOpt:false,
    }

    let successCallback = function (res) {

        let that = this
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid,index);
        }
        let successIndexs = 0
        if (res.data.successpks) {
            successIndexs = res.data.successpks.length;
        }
        
        // 全部成功
        if (successIndexs == 1) {
            toast({
                color: 'success',
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000011')/* 国际化处理： 收回成功！*/
            })
        }
        // 全部失败
        else{
            toast({
                color: 'error',
                content: res.data.errMsg && res.data.errMsg.split('\n')
            })
        }
        
    }


    doAjax.call(this, sendData, URL_LIST.UNCOMMIT, successCallback)
}

/**
 * 删除
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerDelete(props,record,index){
    let pks = [record.pk_accept.value];

    // 发送数据
    let sendData = {
        pks: pks
    };

    //成功回调
    let successCallback = function (res) {
        if (res.data.errMsg) {
            toast({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            toast({
                duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000016')/* 国际化处理： 删除成功！*/
            });
            this.props.table.deleteCacheId(LIST_TABLE_CODE, record.pk_accept.value);
            this.props.table.deleteTableRowsByIndex(LIST_TABLE_CODE, index);
        }

    };

    doAjax.call(this, sendData, URL_LIST.DELETE, successCallback);
}

/**
 * 制证
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerVoucher(props,record,index){
    let pk = record.pk_accept.value;

    // 发送数据
    let sendData = {
        pk: pk,
        isCardOpt: false,
        pageid:LIST_LINK_PAGE
    };

    //成功回调
    let successCallback = function (res) {
        let that = this
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid,index);
        }
        if (res.data.errMsg) {
            toast({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            toast({
                // duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000012')/* 国际化处理： 制证成功！*/
            });
            that.props.table.updateDataByIndexs(LIST_TABLE_CODE, res.data.grid[LIST_TABLE_CODE].rows[0].values);
        }

    };

    doAjax.call(this, sendData, URL_LIST.VOUCHER, successCallback);

}

/**
 * 取消制证
 * @param {*} props 
 * @param {*} record 
 * @param {*} index 
 */
function doInnerCancelVoucher(props,record,index){
    let pk = record.pk_accept.value;

    // 发送数据
    let sendData = {
        pk: pk,
        isCardOpt: false,
        pageid:LIST_LINK_PAGE
    };

    //成功回调
    let successCallback = function (res) {
        let that = this
        if (res.data.grid) {
            handleReturnData(that, record, res.data.grid,index);
        }
        if (res.data.errMsg) {
            toast({
                color: "error",
                content: res.data.errMsg
            });
        } else {
            toast({
                // duration: 'infinity',
                color: "success",
                content: this.props.MutiInit.getIntl("36180BP") && this.props.MutiInit.getIntl("36180BP").get('36180BP-000013')/* 国际化处理： 取消制证成功！*/
            });
        }

    };

    doAjax.call(this, sendData, URL_LIST.CANCELVOUCHER, successCallback);
}

function doAjax(sendData,url,successCallback){
    ajax({
        url: url,
        data: sendData,
        success: successCallback.bind(this)
    });
}

// 处理按钮操作返回数据，刷新选中记录数据
function handleReturnData(that, record, data,index) {
    let returnData = data[LIST_TABLE_CODE].rows;
    //处理选择数据
    let pk_accept_check = record.pk_accept.value
    returnData.forEach((retrunval) => {
        if (pk_accept_check === retrunval.values.pk_accept.value) {
            let updateDataArr = [{
                index: index,
                data: { values: retrunval.values }
            }];
            that.props.table.updateDataByIndexs(LIST_TABLE_CODE, updateDataArr);
        }
    });

}

/*BJzpvOTxrU0V69KiBNXco+OqPRHxvvBNmJyzHgSWk/Bl7nCSmHw/MkSfVOFkLeZB*/