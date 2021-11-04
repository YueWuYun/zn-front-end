//mgBVjmwkvoNAq04L4PpN6ZIA/QzxBV+MCAAG69A2uj/sL1GH7iYAwCCuEuAH74h4
import { ajax, toast } from 'nc-lightapp-front';
export default function beforeEvent(props, moduleId, key, value, index, record) {
    let _this = this;
    if (key == 'memo' || key == 'bruleused') {
        return true;
    }
    let isdefault = record.values.isdefault.value;
    if (isdefault) {
        return false;
    }
    if (key == 'refrecordtype') {
        return false;
    }
    if (key == 'recordattr' || key == 'datatype') {//引用档案类型
        let flag = false;
        let mdclassid = props.form.getFormItemsValue('head', 'mdclassid').value;
        ajax({
            url: '/nccloud/bcbd/barappobject/bodybefore.do',
            data: {
                mdclassid: mdclassid,
                key: key
            },
            async: false,
            success: (res) => {
                if (res && res.success) {
                    flag = res.data.isedit;
                    let meta = _this.props.meta.getMeta();
                    if (key == 'recordattr') {
                        _this.props.renderItem('table', 'body', 'recordattr', null);
                        meta['body'].items.find((item) => item.attrcode == 'recordattr').itemtype = res.data.type;
                        meta['body'].items.find((item) => item.attrcode == 'recordattr').refcode = res.data.refpath;
                        meta['body'].items.find((item) => item.attrcode == 'recordattr').queryCondition = () => {
                            return {
                                beanId: mdclassid
                            }
                        };
                        _this.props.meta.setMeta(meta);
                    }
                }
            }
        })
        return flag;
    }
    return true;
}

//mgBVjmwkvoNAq04L4PpN6ZIA/QzxBV+MCAAG69A2uj/sL1GH7iYAwCCuEuAH74h4