/*+9uoo/JZireYS8f88ZiqwjEqrx5SHy0NjSLbaXIl2RSaUOXW1+/BKC2Yu7DjghZj*/
import { createPage, ajax, base, high, toast, cacheTools, cardCache, print, output } from 'nc-lightapp-front';
import { Templatedata } from "../../config/Templatedata";
import { BatchToast } from '../../../../public/CMPMessage.js';//批量提示语句
import { MakeBillApp } from '../../../../public/utils/Makebill';//制单
import { linkApp, linkVoucherApp } from '../../../../public/utils/LinkUtil';//凭证
//缓存
let { setDefData, getDefData,
    getCurrentLastId, getCacheById,
    updateCache, addCache, getNextId,
    deleteCacheById } = cardCache;

/**
 * [收款协同]-表体新增行
 * @param {*} props 
 * @param {*} config 
 * @param {*} pks 
 */
export const addbodyBtn = function () {
    let org_val = this.props.form.getFormItemsValue(this.formId, 'pk_org').value;
    let org_display = this.props.form.getFormItemsValue(this.formId, 'pk_org').display;
    if (org_val && org_display) {
        this.props.cardTable.addRow(this.tableId);
        //根据表头数据给新增表体数据赋值
        let keyArr = ['pk_currtype', 'pk_balatype', 'pk_account', 'rec_primal', 'note_type',
            'mon_account', 'note_no', 'mon_account', 'local_rate', 'rec_local', 'objecttype',
            'pk_customer', 'pk_org', 'pk_pcorg', 'pk_busiman', 'pk_dept', 'pk_group', 'creator',
            'creationtime', 'bill_date','pk_oppaccount'];
        keyArr.forEach((val) => {
            let key = val;
            if (this.props.form.getFormItemsValue(this.formId, key)) {
                let value = this.props.form.getFormItemsValue(this.formId, key).value;
                let dly = this.props.form.getFormItemsValue(this.formId, key).display;
                if (value) {
                    let rownum = this.props.cardTable.getNumberOfRows(this.tableId);//表格行数
                    this.props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, key, { value: value, display: dly });//给表体字段赋值

                    //保存必要数据赋值,否则保存不成功---->等待平台修改新增方法！
                    this.props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'direction', { value: '1', display: '1' });//给表体字段direction
                    this.props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'bill_type',
                        {
                            value: this.props.form.getFormItemsValue(this.formId, 'bill_type').value,
                            display: this.props.form.getFormItemsValue(this.formId, 'bill_type').display
                        });//给表体字段bill_type
                    this.props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'teade_type',
                        {
                            value: this.props.form.getFormItemsValue(this.formId, 'trade_type').value,
                            display: this.props.form.getFormItemsValue(this.formId, 'trade_type').display
                        });//给表体字段bill_type
                    this.props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'trade_type',
                        {
                            value: this.props.form.getFormItemsValue(this.formId, 'trade_type').value,
                            display: this.props.form.getFormItemsValue(this.formId, 'trade_type').display
                        });//给表体字段bill_type
                    this.props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'billclass',
                        {
                            value: this.props.form.getFormItemsValue(this.formId, 'billclass').value,
                            display: this.props.form.getFormItemsValue(this.formId, 'billclass').display
                        });//给表体字段bill_type
                    this.props.cardTable.setValByKeyAndIndex(this.tableId, rownum - 1, 'billdetail_no',
                        {
                            value: '0',
                            display: '0'
                        });//给表体字段bill_type
                    if (key == 'local_rate') {
                        //设置本币汇率的编辑性
                        let isEdit = this.props.form.getFormItemsDisabled(this.formId, key);
                        if (!isEdit) {
                            this.props.cardTable.setEditableByIndex(this.tableId, rownum - 1, 'local_rate', true);//可以编辑
                        }
                    }
                }
            }
        });
        //表体精度处理
        let body_primal = this.props.form.getFormItemsValue(this.formId, 'primal_money');//原币
        let body_local = this.props.form.getFormItemsValue(this.formId, 'local_money');//本币
        let body_rate = this.props.form.getFormItemsValue(this.formId, 'local_rate');//汇率
        let body_primal_scale = '2';
        let body_local_scale = '2';
        let body_rate_scale = '2';
        if (body_primal && body_primal.scale) {
            body_primal_scale = body_primal.scale;
        }
        if (body_local && body_local.scale) {
            body_local_scale = body_local.scale;
        }
        if (body_rate && body_rate.scale) {
            body_rate_scale = body_rate.scale;
        }
          //精度处理了
          this.props.cardTable.setColScale([
            {areacode: this.tableId, fieldcode: 'rec_primal', scale: body_primal_scale},

            {areacode: this.tableId, fieldcode: 'local_rate', scale: body_rate_scale},
            {areacode: this.tableId, fieldcode: 'group_rate', scale: body_rate_scale},
            {areacode: this.tableId, fieldcode: 'global_rate', scale: body_rate_scale},

            {areacode: this.tableId, fieldcode: 'rec_local', scale: body_local_scale},
            {areacode: this.tableId, fieldcode: 'global_local_rec', scale: body_local_scale},
            {areacode: this.tableId, fieldcode: 'global_local_ts', scale: body_local_scale},
            {areacode: this.tableId, fieldcode: 'group_local_ts', scale: body_local_scale},
            {areacode: this.tableId, fieldcode: 'group_local_rec', scale: body_local_scale},
            {areacode: this.tableId, fieldcode: 'ts_local', scale: body_local_scale},
      ]);
    } else {
        toast({
            'color': 'warning',
            'content': this.props.MutiInit.getIntl("36070RBMCP") && this.props.MutiInit.getIntl("36070RBMCP").get('36070RBMCP-000004')/* 国际化处理： 请先填写财务组织！*/
        });
        return;
    }
}

/*+9uoo/JZireYS8f88ZiqwjEqrx5SHy0NjSLbaXIl2RSaUOXW1+/BKC2Yu7DjghZj*/