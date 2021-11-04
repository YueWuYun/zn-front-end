//mgBVjmwkvoNAq04L4PpN6ZIA/QzxBV+MCAAG69A2uj/sL1GH7iYAwCCuEuAH74h4
/**
 * 查询区编辑前事件
 */
import { ajax } from 'nc-lightapp-front';
import periodScheme from '../../../../public/excomponents/pubUtils/periodScheme.js';

let filterFields = ['pk_org', 'ccostcenterid'];
export default function (that, props, searchId, meta) {

    meta[searchId].items = meta[searchId].items.map((item, key) => {
        let attrcode = item.attrcode;
        item.isShowUnit = false;
        item.isShowDisabledData = true;
        item.unitValueIsNeeded = false;
        switch (attrcode) {
            case 'pk_org'://工厂
                item.queryCondition = () => {
                    item.isShowUnit = false;
                    return {
                        AppCode: props.getSearchParam('c'),
                        isDataPowerEnable: 'Y',
                        GridRefActionExt: 'nccloud.web.refer.sqlbuilder.PrimaryOrgSQLBuilder'
                    };
                }
                break;
            case 'itemid.ccustomerid'://客户
            case 'ccostobjectid.ccustomerid'://客户
            case 'itemid.cvendorid'://供应商
            case 'ccostobjectid.cvendorid'://供应商
            case 'itemid.cproductorid':// 生产厂商
            case 'ccostobjectid.cproductorid':// 生产厂商
            case 'itemid.cprojectid':// 项目
            case 'ccostobjectid.cprojectid':// 项目
                isShowUnitControl(item, props, searchId);
                item.queryCondition = () => {
                    let pkOrgValue = getFirstOrgValue((props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue);
                    return {
                        isDataPowerEnable: 'Y',
                        pk_org: pkOrgValue
                    };
                }
                break;
            case 'cperiod':// 会计期间
                item.queryCondition = () => {
                    let pkOrgValue = getFirstOrgValue((props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue);
                    let pk_accperiodscheme = periodScheme(props, pkOrgValue);
                    return {
                        pk_accperiodscheme: pk_accperiodscheme,
                        isDataPowerEnable: 'Y'
                    };
                }
                break;
            case 'ccostcenterid'://成本中心
            case 'ccostcenters'://成本中心组
            case 'ccostobjectid':// 成本对象
            case 'ccostobjectid.cmaterialid':// 产品
            case 'ccostobjectid.cmarcostclassid'://产品成本分类
            case 'ccostobjectid.cmaterialid.pk_marbasclass'://产品基本分类
            case 'itemid.cmaterialid'://物料
            case 'itemid.cmaterialid.pk_marbasclass'://材料基本分类
            case 'itemid.cmaterialvid.materialprod.pk_marcostclass'://材料成本分类
                isShowUnitControl(item, props, searchId);
                item.isShowDisabledData=true;
                item.isHasDisabledData=true;
                item.queryCondition = () => {
                    let pkOrgValue = getFirstOrgValue((props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue);
                    return {
                        isDataPowerEnable: 'Y',
                        pk_org: pkOrgValue
                    };
                }
                break;
            case 'itemid.celementid'://核算要素
                isShowUnitControl(item, props, searchId);
                item.queryCondition = () => {
                    let pkOrgValue = getFirstOrgValue((props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue);
                    let financeorgid = null;//获取财务组织ID
                    ajax({
                        url: '/nccloud/mapub/pub/cMGetFinanceorgByOrg.do',
                        async: false,//同步
                        data: {
                            pk_org: pkOrgValue
                        },
                        success: (res) => {
                            if (res.success) {
                                financeorgid = res.data;
                            }
                        }
                    })
                    return {
                        isDataPowerEnable: 'Y',
                        pk_org: financeorgid
                    };
                }
                break;
            //核算要素组
            case 'celements':
                isShowUnitControl(item, props, searchId);
                item.queryCondition = () => {
                    let pkOrgValue = getFirstOrgValue((props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue);
                    let cperiod = getFirstcpriod((props.search.getSearchValByField(searchId, 'cperiod') || {}).value.firstvalue);
                    let pk_factorchart = null;
                    ajax({
                        url: '/nccloud/cm/cmpub/getfactorchartByPkorg.do',
                        data: {
                            pk_org: pkOrgValue,
                            cperiod: cperiod
                        },
                        async: false,
                        success: (res) => {
                            if (res.success) {
                                pk_factorchart = res.data;
                            }
                        }
                    })
                    return {
                        isDataPowerEnable: 'Y',
                        pk_factorchart: pk_factorchart
                    };
                }
                break;
            default:
                isShowUnitControl(item, props, searchId);
                item.queryCondition = () => {
                    let pkOrgValue = getFirstOrgValue((props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue);
                    return {
                        isDataPowerEnable: 'Y',
                        pk_org: pkOrgValue
                    };
                }
        }
        return item;

    })
    return meta;
}

//获取选中的业务组织的第一个
function getFirstOrgValue(orgValues) {
    let pkOrgValue = '';
    if (orgValues != null) {
        let orgArray = orgValues.split(',');
        if (orgArray != null && orgArray.length > 0) {
            pkOrgValue = orgArray[0];
        }
    }
    return pkOrgValue;
}
//控制显示多级管控（业务单元切换）
function isShowUnitControl(item, props, searchId) {
    item.isShowUnit = true
    item.unitCondition = () => {
        return {
            pkOrgs: (props.search.getSearchValByField(searchId, 'pk_org') || {}).value.firstvalue,
            TreeRefActionExt: 'nccloud.web.cm.cmpub.ref.before.OrgSqlBuilder'
        }
    }
}

//获取选中的业务会计期间的第一个
function getFirstcpriod(cperiods) {
    let cperiod = '';
    if (cperiods != null) {
        let arrcperiods = cperiods.split(',');
        if (arrcperiods != null && arrcperiods.length > 0) {
            cperiod = arrcperiods[0];
        }
    }
    return cperiod;
}
//mgBVjmwkvoNAq04L4PpN6ZIA/QzxBV+MCAAG69A2uj/sL1GH7iYAwCCuEuAH74h4