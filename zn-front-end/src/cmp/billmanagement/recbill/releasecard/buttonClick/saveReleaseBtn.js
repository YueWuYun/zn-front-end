/*n+6yvNJswn42zdqYAmHrmky6HupVQKx7dlNzSeOiOD2jKzZnI3Ug0FuTa+KHzE+n*/
import { ajax, toast } from 'nc-lightapp-front';
import { informerCheckMoney } from "../events/informerCheck.js";
/**
 * [到账通知认领收款结算单]-认领保存
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const saveReleaseBtn = function () {
    if(!informerCheckMoney.call(this)){
        return;
    }
    let is_flag = this.props.form.isCheckNow(this.formId);//form必输项校验
    let is_tableflag = this.props.cardTable.checkTableRequired(this.tableId);//table必输项校验
    if (is_flag && is_tableflag) {
        let CardData = this.props.createMasterChildData(this.pageId, this.formId, this.tableId);
        let url = '/nccloud/cmp/recbill/releasesave.do'//认领保存
        ajax({
            url: url,
            data: CardData,
            success: (res) => {
                if (res.success) {
                    if (res.data) {
                        toast({ color: 'success', content: this.props.MutiInit.getIntl("36070RBM") && this.props.MutiInit.getIntl("36070RBM").get('36070RBM-000001') });/* 国际化处理： 保存成功*/
                        let pk_recbill;
                        if (res.data.head) {
                            this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
                            let ntbMessage = res.data.head[this.formId].rows[0].values.ntberrmsg.value;
                             pk_recbill = res.data.head[this.formId].rows[0].values.pk_recbill.value;
                            if (ntbMessage) {
								toast({
									color: 'warning',
									content: ntbMessage
								});
							}
                        }
                        if (res.data.body) {
                            this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
                        }
                        let release_billno = res.data.head[this.formId].rows[0].values.bill_no.value;
                        this.billno = release_billno;


                        this.props.setUrlParam({
                            status: 'browse',
                            id: pk_recbill
                            //pagecode: pagecode
                        });

                        this.releasetoggleShow('browse');
                        // //跳转下一个缩略图
                        // this.props.transferTable.setTransformFormStatus('leftarea', {
                        //     status: 'browse',
                        //     onChange: (current, next, currentIndex) => {
                        //         this.props.transferTable.setTransferListValueByIndex('leftarea', current, currentIndex);
                        //         //刷新左侧列表数据
                        //         let size = this.props.transferTable.getTransformFormAmount('leftarea');
                        //         let nextIndex = currentIndex + 1;
                        //         if (nextIndex == size) {
                        //             nextIndex = size;
                        //         }
                        //         this.props.transferTable.setTransferListValueByIndex('leftarea', res.data, currentIndex);
                        //     }
                        // });
                    }
                }
            }
        });
    }
}

/*n+6yvNJswn42zdqYAmHrmky6HupVQKx7dlNzSeOiOD2jKzZnI3Ug0FuTa+KHzE+n*/