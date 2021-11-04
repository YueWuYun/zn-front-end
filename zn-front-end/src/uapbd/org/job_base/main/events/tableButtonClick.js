//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK
import { ajax, base, toast, getBusinessInfo } from 'nc-lightapp-front';
import Utils from '../../../../public/utils';
import manageModeUtils from '../../../../public/utils/ManageModeUtils';

let ajaxurl = {
    edit: '/nccloud/uapbd/jobglb/edit.do'
}
export default function (record, index, props, key) {
    let gridId = props.config.gridId;
    let pagecode = props.config.pagecode;

    let recordVal = record.values;
    //以下操作都涉及到管控模式，所以管控模式代码写到这里
    let rem = manageModeUtils.call(this, props.config.NODE_TYPE, recordVal.pk_org.value, recordVal.pk_group.value, [], getBusinessInfo().groupId);
    if (!rem.editFlag) {
        toast({ 'color': 'warning', 'title': rem.message });
        return;
    }
    //管控end
    switch (key) {
        // 表格操作按钮
        case 'oprExtend':
            props.editTable.openModel(gridId, 'edit', record, index);
            this.gridStatusChange();
            break;
        case 'oprEdit':
            ajax({
                url: ajaxurl.edit,
                data: {
                    model: {
                        rows: Utils.convertGridEnablestateToSave([Utils.clone(record)]),
                    },
                    pageid: pagecode
                },
                success: (res) => {
                    let { success } = res;
                    if (success) {
                        props.editTable.openModel(gridId, 'edit', record, index);
                        this.gridStatusChange();
                    }
                }
            });
            break;
        case 'oprDelete':
            if (recordVal['dataoriginflag']['value'] === '-1') {
                NCMessage.create({ content: this.state.json['10100JOB-000000'], color: 'warning' });///* 国际化处理： 系统预置，无法删除！*/
                return;
            } else {
                if (!!!recordVal.pk_job.value && !!recordVal.jobcode.value) {
                    //如果删除的是新增的数据
                    let rollbackcodearr = this.state.rollbackcode;
                    rollbackcodearr.push(recordVal.jobcode.value);
                    this.setState({
                        rollbackcode: rollbackcodearr
                    }, () => {
                        props.editTable.deleteTableRowsByIndex(gridId, index, false);
                        this.props.button.setButtonDisabled({
                            'btnDel': true
                        });
                    });
                } else {
                    props.editTable.deleteTableRowsByIndex(gridId, index, false);
                    this.props.button.setButtonDisabled({
                        'btnDel': true
                    });
                }
            }
            break;
        case 'oprDeleteBrowse':

            if (recordVal['dataoriginflag']['value'] === '-1') {
                NCMessage.create({ content: this.state.json['10100JOB-000000'], color: 'warning' });///* 国际化处理： 系统预置，无法删除！*/
                return;
            }
            let rows = Utils.convertGridEnablestateToSave([Utils.clone(record)]);
            let paramData = {
                'pageid': pagecode,
                'gridModel': {
                    'pageinfo': {},
                    'areacode': gridId,
                    'rows': rows
                }
            }
            ajax({
                url: '/nccloud/uapbd/jobglb/delete.do',
                data: paramData,
                success: (res) => {
                    if (res.success) {
                        props.editTable.deleteTableRowsByIndex(gridId, index, true);
                        toast({ color: 'success', title: this.state.json['10100JOB-000001'] });
                        /* 国际化处理： 删除成功*/
                        props.button.setButtonDisabled({
                            'btnDel': true
                        });
                    }
                }
            });

            break;
        default:
            console.log(key, index);
            break;
    }
}


//0GI1xcoeligdpMeXoHBphl8uIBw6LJckhNxvWOn8MuVPf0wNYVhZExZEIRShAnDK