//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a
import { ajax, toast } from 'nc-lightapp-front';
export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
    let _this = this;
    let mdclassid = props.form.getFormItemsValue('head', 'mdclassid').value;
    if (key == 'recordattr') {
        let fullpath = null;
        if (value && value.values && value.values.fullpath) {
            fullpath = value.values.fullpath;
        }
        ajax({
            url: '/nccloud/bcbd/barappobject/bodyafter.do',
            data: {
                fullpath: fullpath,
                mdclassid: mdclassid
            },
            async: false,
            success: (res) => {
                if (res && res.success && res.data) {
                    _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'mdattrid', { value: res.data.code });
                    _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'mdfullname', { value: res.data.mdattrid });
                    if (res.data.datatype) {
                        _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'datatype', { value: value.values.typeId, display: value.values.typeName });
                    } else {
                        _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'datatype', { value: null, display: null });
                    }
                    _this.props.cardTable.setEditableByIndex(moduleId, index, 'datatype', false);
                    if (res.data.refrecordtype) {
                        _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'refrecordtype', { value: res.data.refrecordtype, display: value.refname });
                    } else {
                        _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'refrecordtype', { value: null });
                    }
                } else {
                    _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'mdattrid', { value: null });
                    _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'mdfullname', { value: null });
                    _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'datatype', { value: null, display: null });
                    _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'refrecordtype', { value: null, display: null });
                    _this.props.cardTable.setEditableByIndex(moduleId, index, 'datatype', true);
                }
            }
        });
        if (value && value.values) {
            _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'recordattr', { value: value.values.fulldisplayname, display: value.values.fulldisplayname });
        } else {
            _this.props.cardTable.setValByKeyAndIndex(moduleId, index, 'recordattr', { value: null, display: null });
        }
    }
}
//OWmq6Ugo6jPE4W7xoi1UXj8PR512kyTS21rNeRW00hlQtkkV5JQfVNGNrH/0ar1a