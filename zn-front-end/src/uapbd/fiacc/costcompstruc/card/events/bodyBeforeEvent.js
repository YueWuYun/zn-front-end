//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp
import { ajax, toast,promptBox } from 'nc-lightapp-front';
import { pagecode,formId, tableId,tableId_edit} from '../constants';
import {loadPageValue} from './costCompStruc';
/*
 *表体编辑前事件
 */
export default function bodyBeforeEvent(props, moduleId, key, value, index, record, type) {
	let that = this;
	let meta = props.meta.getMeta();
    //工厂
    let pk_org = props.form.getFormItemsValue(formId, 'pk_org') ? props.form.getFormItemsValue(formId, 'pk_org').value : null;
    // 物料
    let cmaterialid = record.values.cmaterialid ? record.values.cmaterialid.value : null;
    var config = {
        isDataPowerEnable: 'Y',//使用权限
        pk_org: '',//工厂
        pk_accbook:'',
        GridRefActionExt:'',
        method:''
    }
    let flag = true;
    if(type == "model")
    {
        moduleId = tableId_edit;
    }
    meta[moduleId].items.map((item) => {
        item.isShowUnit = false;
        item.isShowDisabledData = false;
        var attrcode = item.attrcode;
        if (attrcode == key) {
            switch (attrcode) {
                case'cmaterialvid'://物料
                case'cmaterialid'://物料最新版本
                    item.isMultiSelectedEnabled = true;//支持多选
                    item.queryCondition = (p) => {
                        config.isDataPowerEnable='Y',//使用权限
                        config.pk_org = pk_org
                        return config;
                    }
                    break;
                case 'celementid'://核算要素
                    item.onlyLeafCanSelect = true;//只有叶子节点可选
                    item.isMultiSelectedEnabled = true;//支持多选
                    item.queryCondition = () => {
                        let pkOrgValue = (props.form.getFormItemsValue(formId, 'pk_org') || {}).value;
                        let financeorgid = null;//获取财务组织ID
                        ajax({
                            url: '/nccloud/mapub/pub/cMGetFinanceorgByOrg.do',
                            async:false,//同步
                            data: {
                                pk_org: pkOrgValue
                            },
                            success: (res) => {
                                if (res.success) {
                                    financeorgid = res.data;
                                }
                            }
                        })
                        config.isDataPowerEnable='Y',
                        config.pk_org=financeorgid,
                        config.TreeRefActionExt = 'nccloud.web.cm.stuff.reffilter.CelementidHandlerRefFilter'
                        return config;
                    }
                    // 物料不为空时，不能输入核算要素
                    if(cmaterialid){
                        flag =false;
                    }
                    break;
                default://默认
                    item.queryCondition = (p) => {
                        config.pk_org = pk_org;
                        return config;
                    }
                    break;
            }
        }
    });
    props.meta.setMeta(meta);
    return flag;

};

//U41ajtHAnBXc4J9azvHa6SkLGbPE4FR/anSdHpRnwoJmB/wkRuzi3jZ/RDt0NUZp