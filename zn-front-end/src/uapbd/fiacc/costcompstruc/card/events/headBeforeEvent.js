//SXDj+UzVnkytqCOCr56eS4AbxRMpmrXcyKgOPi8qpw9K1S/uX6VSJWtu4W3exUTP
import { ajax, toast,promptBox } from 'nc-lightapp-front';
import toggleShow from './toggleShow';
import { pagecode,formId, tableId} from '../constants';
import {loadPageValue} from './costCompStruc';
/*
 *表头编辑前事件
 */
export default function headBeforeEvent(props, moduleId, key, value, changedrows, i, s, g) {
	let that = this;
    let meta = props.meta.getMeta();
    //工厂
    let pk_org = props.form.getFormItemsValue(moduleId, 'pk_org') ? props.form.getFormItemsValue(moduleId, 'pk_org').value : null;
    var config = {
        isDataPowerEnable: 'Y',//使用权限
        pk_org: '',//财务组织
        GridRefActionExt:'',
        AppCode:''
    }
    meta[moduleId].items.map((item) => {
        item.isShowUnit = false;
        item.isShowDisabledData = false;
        var attrcode = item.attrcode;
        if (item.itemtype == 'refer') {
            item.isMultiSelectedEnabled = false;
        }
        if (attrcode == key) {
            switch (attrcode) {
                case 'pk_org'://工厂
                    item.queryCondition = (p) => {
                        config.AppCode = props.getSearchParam('c'),
                        config.GridRefActionExt = 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                        return config;
                    }
                break;
                case 'ccostcenterid'://成本中心编码
                    item.queryCondition = (p) => {
                        config.pk_org = pk_org
                        return config;
                    }
                    break;
                case 'ccostobjectid'://成本对象
                    item.queryCondition = () => {
                        return {
                            isShowDisabledData : false,
                            pk_org: pk_org
                        };
                    }
                    break;
                default://自定义项 加上组织过滤
                    item.queryCondition = (p) => {
                        config.pk_org = pk_org;
                        return config;
                    }
                    break;
                }
        }

    });
    props.meta.setMeta(meta);
    return true;
};

//SXDj+UzVnkytqCOCr56eS4AbxRMpmrXcyKgOPi8qpw9K1S/uX6VSJWtu4W3exUTP