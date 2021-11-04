//xbBNZdDFBeHR0NxHIc8oEDkBV4w+8uTzHTkEzXIGZXDwaVZztAZVmT8VChrpJM0G
import { ajax, base,toast,cardCache } from 'nc-lightapp-front';
import  _Utils from '../../../../public/utils';
import resetAssistant from './resetAssistant';
import modifierAssistant from './modifierAssistant';
import {updateModalButton,createFiCard,createPfcCard,createPuCard,createSaleCard,createStockCard,createProdCard,createPlanCard,createCostCard,createPfccinfoCard} from '../extTableModal';
let {setDefData, getDefData } = cardCache;
const queryUrls = {
    'fi' : '/nccloud/uapbd/material/queryMaterialfi.do',
    'pfc' : '/nccloud/uapbd/material/queryMaterialpfc.do',
    'pu' : '/nccloud/uapbd/material/queryMaterialpu.do',
    'sale' : '/nccloud/uapbd/material/queryMaterialsale.do',
    'stock' : '/nccloud/uapbd/material/queryMaterialstock.do',
    'plan' : '/nccloud/uapbd/material/queryMaterialplan.do',
    'prod' : '/nccloud/uapbd/material/queryMaterialprod.do',
    'cost' : '/nccloud/uapbd/material/queryMaterialcost.do',
    'pfccinfo' : '/nccloud/uapbd/material/queryMaterialpfcc.do'
}
var rul_values = {
    base : 'base',//物料基本信息
    convert : 'materialconvert',//辅助计量管理
    taxtype : 'materialtaxtype',//物料税类
    fi : 'fi',//财务信息
    pfc : 'pfc',//利润中心
    pu : 'pu',//采购信息
    sale : 'sale',//销售信息
    stock : 'stock',//库存信息
    plan : 'plan',//计划信息
    prod : 'prod',//生产信息
    cost : 'cost',//成本信息
    pfccinfo : 'pfccinfo'//利润中心成本
}
export default {
    fi : function(props,record,index) {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"fi_card\"\n}`,
                rqCode: 'fi_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialfi'] = res.data.fi_template.materialfi;
                    meta['fi_base'] = res.data.fi_template.fi_base;
                    meta['fi_audit'] = res.data.fi_template.fi_audit;
                    props.meta.setMeta(meta);
                }
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_materialfi'].value;
                    ajax({
                        url : queryUrls['fi'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['fi']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialfi":"form"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).fi = record.rowid;
                                let _fi_table_data = props.cardTable.getAllRows('fi');
                                _fi_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _fi_table_data[index] = data.head.materialfi.rows[0];
                                        _fi_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('fi',_fi_table_data);
                                props.button.setOprationBtnsRenderStatus(['fi'],true);
                                props.modal.show('fimodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000036'),										//标题/* 国际化处理： 财务信息*/
                                    content : createFiCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ fi_edit : true, fi_delete : true});props.form.setFormStatus('materialfi','browse');props.button.setOprationBtnsRenderStatus(['fi'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ fi_edit : true, fi_delete : true});props.form.setFormStatus('materialfi','browse');props.button.setOprationBtnsRenderStatus(['fi'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setFormStatus('materialfi','browse');
                                props.form.setAllFormValue({
                                    'materialfi' : {
                                        areacode : "materialfi",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialfi.rows[0].values
                                        }]
                                    }
                                });
                                updateModalButton(props,'fi','browse');
                            }
                        }
                    });
                }
            }
        })
        
    },
    pfc : function(props,record,index) {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"pfc_card\"\n}`,
                rqCode: 'pfc_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialpfc'] = res.data.pfc_template.materialpfc;
                    meta['pfc_base'] = res.data.pfc_template.pfc_base;
                    meta['pfc_audit'] = res.data.pfc_template.pfc_audit;
                    meta['materialpfcsub'] = res.data.pfc_template.materialpfcsub;
                    meta['materialpfcsub_childform1'] = res.data.pfc_template['materialpfcsub_childform1'];
                    meta['materialpfcsub_childform2'] = res.data.pfc_template['materialpfcsub_childform2'];
                    meta['gridrelation'].materialpfcsub={
                        tabRelation:['materialpfcsub'],
                        destBrowseAreaCode:'materialpfcsub_childform1',
                        destEditAreaCode:'materialpfcsub_childform2'
                    };
                    props.meta.setMeta(meta);
                }
                resetAssistant(props);
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_materialpfc'].value;
                    ajax({
                        url : queryUrls['pfc'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['pfc']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialpfc":"form",
                                        "materialpfcsub":"cardTable"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).pfc = record.rowid;
                                let _pfc_table_data = props.cardTable.getAllRows('pfc');
                                _pfc_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _pfc_table_data[index] = data.head.materialpfc.rows[0];
                                        _pfc_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('pfc',_pfc_table_data);
                                props.button.setOprationBtnsRenderStatus(['pfc'],true);
                                props.modal.show('pfcmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000037'),										//标题/* 国际化处理： 利润中心信息*/
                                    content : createPfcCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ pfc_edit : true, pfc_delete : true});props.form.setFormStatus('materialpfc','browse');props.button.setOprationBtnsRenderStatus(['pfc'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ pfc_edit : true, pfc_delete : true});props.form.setFormStatus('materialpfc','browse');props.button.setOprationBtnsRenderStatus(['pfc'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    'materialpfc' : {
                                        areacode : "materialpfc",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialpfc.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialpfcsub){
                                    props.cardTable.setTableData('materialpfcsub',data.bodys.materialpfcsub);
                                    data.bodys.materialpfcsub.rows.forEach(rowdata=>{
                                        props.cardTable.setValByKeyAndRowId('materialpfcsub',rowdata.rowid,'name',{value:rowdata.values['pk_liabilitybook.name'].display||" ",display: rowdata.values['pk_liabilitybook.name'].display})
                                    })
                                }else{
                                    props.cardTable.setTableData('materialpfcsub',{rows:[]});
                                }
                                props.form.setFormStatus('materialpfc','browse');
                                props.cardTable.setStatus('materialpfcsub','browse');
                                updateModalButton(props,'pfc','browse');
                            }
                        }
                    });
                }
            }
        });
    },
    pu : function(props,record,index)  {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"pu_card\"\n}`,
                rqCode: 'pu_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialpu'] = res.data.pu_template.materialpu;
                    meta['pu_base'] = res.data.pu_template.pu_base;
                    meta['pu_audit'] = res.data.pu_template.pu_audit;
                    props.meta.setMeta(meta);
                }
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_materialpu'].value;
                    ajax({
                        url : queryUrls['pu'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['pu']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialpu":"form"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).pu = record.rowid;
                                let _pu_table_data = props.cardTable.getAllRows('pu');
                                _pu_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _pu_table_data[index] = data.head.materialpu.rows[0];
                                        _pu_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('pu',_pu_table_data);
                                props.button.setOprationBtnsRenderStatus(['pu'],true);
                                props.modal.show('pumodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000038'),										//标题/* 国际化处理： 采购信息*/
                                    content : createPuCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ pu_edit : true, pu_delete : true});props.form.setFormStatus('materialpu','browse');props.button.setOprationBtnsRenderStatus(['pu'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ pu_edit : true, pu_delete : true});props.form.setFormStatus('materialpu','browse');props.button.setOprationBtnsRenderStatus(['pu'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setFormStatus('materialpu','browse');
                                props.form.setAllFormValue({
                                    'materialpu' : {
                                        areacode : "materialpu",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialpu.rows[0].values
                                        }]
                                    }
                                });
                                updateModalButton(props,'pu','browse');
                            }
                        }
                    });
                }
            }
        });
    },
    sale : function(props,record,index)  {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"sale_card\"\n}`,
                rqCode: 'sale_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialsale'] = res.data.sale_template.materialsale;
                    meta['sale_base'] = res.data.sale_template.sale_base;
                    meta['sale_audit'] = res.data.sale_template.sale_audit;
                    meta['materialbindle'] = res.data.sale_template.materialbindle;
                    meta['materialbindle_childform1'] = res.data.sale_template['materialbindle_childform1'];
                    meta['materialbindle_childform2'] = res.data.sale_template['materialbindle_childform2'];
                    meta['gridrelation'].materialbindle={
                        tabRelation:['materialbindle'],
                        destBrowseAreaCode:'materialbindle_childform1',
                        destEditAreaCode:'materialbindle_childform2'
                    };
                    props.meta.setMeta(meta);
                }
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_materialsale'].value;
                    ajax({
                        url : queryUrls['sale'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['sale']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialsale":"form",
                                        "materialbindle":"cardTable"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).sale = record.rowid;
                                let _sale_table_data = props.cardTable.getAllRows('sale');
                                _sale_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _sale_table_data[index] = data.head.materialsale.rows[0];
                                        _sale_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('sale',_sale_table_data);
                                props.button.setOprationBtnsRenderStatus(['sale'],true);
                                props.modal.show('salemodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000039'),										//标题/* 国际化处理： 销售信息*/
                                    content : createSaleCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ sale_edit : true, sale_delete : true});props.form.setFormStatus('materialsale','browse');props.button.setOprationBtnsRenderStatus(['sale'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ sale_edit : true, sale_delete : true});props.form.setFormStatus('materialsale','browse');props.button.setOprationBtnsRenderStatus(['sale'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    'materialsale' : {
                                        areacode : "materialsale",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialsale.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialbindle){
                                    props.cardTable.setTableData('materialbindle',data.bodys.materialbindle);
                                    data.bodys.materialbindle.rows.forEach(rowdata=>{
                                        props.cardTable.setValByKeyAndRowId('materialbindle',rowdata.rowid,'name',{value:rowdata.values['pk_bindle.name'].display||" ",display: rowdata.values['pk_bindle.name'].display}),
                                        props.cardTable.setValByKeyAndRowId('materialbindle',rowdata.rowid,'materialspec',{value:rowdata.values['pk_bindle.materialspec'].display||" ",display: rowdata.values['pk_bindle.materialspec'].display}),
                                        props.cardTable.setValByKeyAndRowId('materialbindle',rowdata.rowid,'materialtype',{value:rowdata.values['pk_bindle.materialtype'].display||" ",display: rowdata.values['pk_bindle.materialtype'].display}),
                                        props.cardTable.setValByKeyAndRowId('materialbindle',rowdata.rowid,'pk_measdoc',{value:rowdata.values['pk_bindle.pk_measdoc'].display||" ",display: rowdata.values['pk_bindle.pk_measdoc'].display})
                                    })
                                }else{
                                    props.cardTable.setTableData('materialbindle',{rows:[]});
                                }
                                props.form.setFormStatus('materialsale','browse');
                                props.cardTable.setStatus('materialbindle','browse');
                                updateModalButton(props,'sale','browse');
                            }
                        }
                    });
                }
            }
        })
        
    },
    stock : function(props,record,index)  {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"stock_card\"\n}`,
                rqCode: 'stock_template'
            },
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"prod_card\"\n}`,
                rqCode: 'prod_template'
            },
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"plan_card\"\n}`,
                rqCode: 'plan_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialstock'] = res.data.stock_template.materialstock;
                    meta['stock_base'] = res.data.stock_template.stock_base;
                    meta['stock_freeasst'] = res.data.stock_template.stock_freeasst;
                    meta['stock_check'] = res.data.stock_template.stock_check;
                    meta['stock_atp'] = res.data.stock_template.stock_atp;
                    meta['stock_realusableamount'] = res.data.stock_template.stock_realusableamount;
                    meta['costvalutasst'] = res.data.prod_template.costvalutasst;
                    meta['plan_marasst'] = res.data.plan_template.plan_marasst;
                    meta['stock_audit'] = res.data.stock_template.stock_audit;
                    meta['materialwarh'] = res.data.stock_template.materialwarh;
                    meta['materialwarh_childform1'] = res.data.stock_template['materialwarh_childform1'];
                    meta['materialwarh_childform2'] = res.data.stock_template['materialwarh_childform2'];
                    meta['gridrelation'].materialwarh={
                        tabRelation:['materialwarh'],
                        destBrowseAreaCode:'materialwarh_childform1',
                        destEditAreaCode:'materialwarh_childform2'
                    };
                    props.meta.setMeta(meta);
                }

                resetAssistant(props);
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_materialstock'].value;
                    ajax({
                        url : queryUrls['stock'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['stock']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialstock":"form",
                                        "materialwarh":"cardTable"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).stock = record.rowid;
                                let _stock_table_data = props.cardTable.getAllRows('stock');
                                _stock_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _stock_table_data[index] = data.head.materialstock.rows[0];
                                        _stock_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('stock',_stock_table_data);
                                props.button.setOprationBtnsRenderStatus(['stock'],true);
                                props.modal.show('stockmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000040'),										//标题/* 国际化处理： 库存信息*/
                                    content : createStockCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ stock_edit : true, stock_delete : true});props.form.setFormStatus('materialstock','browse');props.button.setOprationBtnsRenderStatus(['stock'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ stock_edit : true, stock_delete : true});props.form.setFormStatus('materialstock','browse');props.button.setOprationBtnsRenderStatus(['stock'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    'materialstock' : {
                                        areacode : "materialstock",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialstock.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialwarh){
                                    props.cardTable.setTableData('materialwarh',data.bodys.materialwarh);
                                }else{
                                    props.cardTable.setTableData('materialwarh',{rows:[]});
                                }
                                const meta = props.meta.getMeta();
                                meta.costvalutasst.areaVisible = true;
                                meta.plan_marasst.areaVisible = true;
                                meta.stock_freeasst.areaVisible = true;
                                props.form.setFormStatus('materialstock','browse');
                                props.cardTable.setStatus('materialwarh','browse');
                                updateModalButton(props,'stock','browse');
                            }
                        }
                    });
                }
            }
        })
    },
    plan : function(props,record,index)  {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"stock_card\"\n}`,
                rqCode: 'stock_template'
            },
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"prod_card\"\n}`,
                rqCode: 'prod_template'
            },
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"plan_card\"\n}`,
                rqCode: 'plan_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialplan'] = res.data.plan_template.materialplan;
                    meta['plan_base'] = res.data.plan_template.plan_base;
                    meta['plan_marasst'] = res.data.plan_template.plan_marasst;
                    meta['plan_audit'] = res.data.plan_template.plan_audit;
                    meta['stock_freeasst'] = res.data.stock_template.stock_freeasst;
                    meta['costvalutasst'] = res.data.prod_template.costvalutasst;
                    meta['materialrepl'] = res.data.plan_template.materialrepl;
                    meta['materialrepl_childform1'] = res.data.plan_template['materialrepl_childform1'];
                    meta['materialrepl_childform2'] = res.data.plan_template['materialrepl_childform2'];
                    meta['gridrelation'].materialrepl={
                        tabRelation:['materialrepl'],
                        destBrowseAreaCode:'materialrepl_childform1',
                        destEditAreaCode:'materialrepl_childform2'
                    };
                    props.meta.setMeta(meta);
                }
                resetAssistant(props);
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_materialplan'].value;
                    ajax({
                        url : queryUrls['plan'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['plan']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialplan":"form",
                                        "materialrepl":"cardTable"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).plan = record.rowid;
                                let _plan_table_data = props.cardTable.getAllRows('plan');
                                _plan_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _plan_table_data[index] = data.head.materialplan.rows[0];
                                        _plan_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('plan',_plan_table_data);
                                props.button.setOprationBtnsRenderStatus(['plan'],true);
                                props.modal.show('planmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000041'),										//标题/* 国际化处理： 计划信息*/
                                    content : createPlanCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ plan_edit : true, plan_delete : true});props.form.setFormStatus('materialplan','browse');props.button.setOprationBtnsRenderStatus(['plan'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ plan_edit : true, plan_delete : true});props.form.setFormStatus('materialplan','browse');props.button.setOprationBtnsRenderStatus(['plan'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    'materialplan' : {
                                        areacode : "materialplan",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialplan.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialrepl){
                                    props.cardTable.setTableData('materialrepl',data.bodys.materialrepl);
                                    data.bodys.materialrepl.rows.forEach(rowdata=>{
                                        props.cardTable.setValByKeyAndRowId('materialrepl',rowdata.rowid,'name',{value:rowdata.values['pk_replace.name'].display||" ",display: rowdata.values['pk_replace.name'].display})
                                    })
                                }else{
                                    props.cardTable.setTableData('materialrepl',{rows:[]});
                                }
                                const meta = props.meta.getMeta();
                                meta.costvalutasst.areaVisible = true;
                                meta.plan_marasst.areaVisible = true;
                                meta.stock_freeasst.areaVisible = true;
                                props.form.setFormStatus('materialplan','browse');
                                props.cardTable.setStatus('materialrepl','browse');
                                updateModalButton(props,'plan','browse');
                            }
                        }
                    });
                }
            }
        })
    },
    prod : function(props,record,index)  {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"stock_card\"\n}`,
                rqCode: 'stock_template'
            },
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"prod_card\"\n}`,
                rqCode: 'prod_template'
            },
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"plan_card\"\n}`,
                rqCode: 'plan_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialprod'] = res.data.prod_template.materialprod;
                    meta['prod_base'] = res.data.prod_template.prod_base;
                    meta['producecost'] = res.data.prod_template.producecost;
                    meta['plan_marasst'] = res.data.plan_template.plan_marasst;
                    meta['stock_freeasst'] = res.data.stock_template.stock_freeasst;
                    meta['costvalutasst'] = res.data.prod_template.costvalutasst;
                    meta['prod_audit'] = res.data.prod_template.prod_audit;
                    props.meta.setMeta(meta);
                }
                resetAssistant(props);
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_materialprod'].value;
                    ajax({
                        url : queryUrls['prod'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['prod']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialprod":"form"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).prod = record.rowid;
                                let _prod_table_data = props.cardTable.getAllRows('prod');
                                _prod_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _prod_table_data[index] = data.head.materialprod.rows[0];
                                        _prod_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('prod',_prod_table_data);
                                props.button.setOprationBtnsRenderStatus(['prod'],true);
                                props.modal.show('prodmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000042'),										//标题/* 国际化处理： 生产信息*/
                                    content : createProdCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ prod_edit : true, prod_delete : true});props.form.setFormStatus('materialprod','browse');props.button.setOprationBtnsRenderStatus(['prod'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ prod_edit : true, prod_delete : true});props.form.setFormStatus('materialprod','browse');props.button.setOprationBtnsRenderStatus(['prod'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setFormStatus('materialprod','browse');
                                props.form.setAllFormValue({
                                    'materialprod' : {
                                        areacode : "materialprod",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialprod.rows[0].values
                                        }]
                                    }
                                });
                                
                                const meta = props.meta.getMeta();
                                meta.costvalutasst.areaVisible = true;
                                meta.plan_marasst.areaVisible = true;
                                meta.stock_freeasst.areaVisible = true;
                                props.meta.setMeta(meta);
                                //props.form.setFormItemsVisible('materialprod',{costvalutasst2:true});
                                updateModalButton(props,'prod','browse');
                            }
                        }
                    });
                }
            }
        })
    },
    cost : function(props,record,index)  {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"cost_card\"\n}`,
                rqCode: 'cost_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialcost'] = res.data.cost_template.materialcost;
                    meta['cost_base'] = res.data.cost_template.cost_base;
                    meta['cost_audit'] = res.data.cost_template.cost_audit;
                    meta['materialcostmode'] = res.data.cost_template.materialcostmode;
                    meta['materialcostmode_childform1'] = res.data.cost_template['materialcostmode_childform1'];
                    meta['materialcostmode_childform2'] = res.data.cost_template['materialcostmode_childform2'];
                    meta['gridrelation'].materialcostmode={
                        tabRelation:['materialcostmode'],
                        destBrowseAreaCode:'materialcostmode_childform1',
                        destEditAreaCode:'materialcostmode_childform2'
                    };
                    props.meta.setMeta(meta);
                }
                resetAssistant(props);
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_materialcost'].value;
                    ajax({
                        url : queryUrls['cost'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['cost']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialcost":"form",
                                        "materialcostmode":"cardTable"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).cost = record.rowid;
                                let _cost_table_data = props.cardTable.getAllRows('cost');
                                _cost_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _cost_table_data[index] = data.head.materialcost.rows[0];
                                        _cost_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('cost',_cost_table_data);
                                props.button.setOprationBtnsRenderStatus(['cost'],true);
                                props.modal.show('costmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000043'),										//标题/* 国际化处理： 成本信息*/
                                    content : createCostCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ cost_edit : true, cost_delete : true});props.form.setFormStatus('materialcost','browse');props.button.setOprationBtnsRenderStatus(['cost'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ cost_edit : true, cost_delete : true});props.form.setFormStatus('materialcost','browse');props.button.setOprationBtnsRenderStatus(['cost'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    'materialcost' : {
                                        areacode : "materialcost",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialcost.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialcostmode){
                                    props.cardTable.setTableData('materialcostmode',data.bodys.materialcostmode);
                                    data.bodys.materialcostmode.rows.forEach(rowdata=>{
                                        props.cardTable.setValByKeyAndRowId('materialcostmode',rowdata.rowid,'name',{value:rowdata.values['pk_setofbook.name'].display||" ",display: rowdata.values['pk_setofbook.name'].display})
                                    })
                                }else{
                                    props.cardTable.setTableData('materialcostmode',{rows:[]});
                                }
                                props.form.setFormStatus('materialcost','browse');
                                props.cardTable.setStatus('materialcostmode','browse');
                                updateModalButton(props,'cost','browse');
                            }
                        }
                    });
                }
            }
        })
    },
    pfccinfo : function(props,record,index)  {
        let reqQueryData = [
            {
                rqUrl: '/platform/templet/querypage.do',
                rqJson: `{\n  \"pagecode\": \"profitcost_card\"\n}`,
                rqCode: 'pfcc_template'
            }
        ]
        const that = this;
        ajax({
            url : "/nccloud/platform/pub/mergerequest.do",
            data : reqQueryData,
            success : (res) => {
                if(res&&res.data){
                    let meta = props.meta.getMeta();
                    meta['materialpfcc'] = res.data.pfcc_template.materialpfcc;
                    meta['pfcc_base'] = res.data.pfcc_template.pfcc_base;
                    meta['pfcc_audit'] = res.data.pfcc_template.pfcc_audit;
                    meta['profitcostlist'] = res.data.pfcc_template.profitcostlist;
                    meta['profitcostlist_orgbrowse'] = _Utils.clone(res.data.pfcc_template.profitcostlist);
                    meta['profitcostlist_childform1'] = res.data.pfcc_template['profitcostlist_childform1'];
                    meta['profitcostlist_childform2'] = res.data.pfcc_template['profitcostlist_childform2'];
                    meta['gridrelation'].profitcostlist={
                        tabRelation:['profitcostlist'],
                        destBrowseAreaCode:'profitcostlist_childform1',
                        destEditAreaCode:'profitcostlist_childform2'
                    };
                    props.meta.setMeta(meta);
                }
                resetAssistant(props);
                if(props.form.getFormStatus('material') === 'browse'){
                    let pk = record.values['pk_mateprofcost'].value;
                    ajax({
                        url : queryUrls['pfccinfo'],
                        data : {
                            pk : pk,
                            pageid : props.config.pagecodeValues['pfccinfo']
                        },
                        success : (res) => {
                            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                                props.dealFormulamsg(
                                    res.formulamsg,  //参数一：返回的公式对象
                                    {                //参数二：界面使用的表格类型
                                        "materialpfcc":"form",
                                        "profitcostlist":"cardTable"
                                    }
                                );
                            }
                            let { success, data} = res;
                            if(success){
                                getDefData('cacheRowid',props.config.datasource).pfccinfo = record.rowid;
                                let _pfccinfo_table_data = props.cardTable.getAllRows('pfccinfo');
                                _pfccinfo_table_data.forEach((item,index) => {
                                    if(item.rowid === record.rowid){
                                        _pfccinfo_table_data[index] = data.head.materialpfcc.rows[0];
                                        _pfccinfo_table_data[index].rowid = record.rowid;
                                    }
                                });
                                props.cardTable.updateTableData('pfccinfo',_pfccinfo_table_data);
                                props.button.setOprationBtnsRenderStatus(['pfccinfo'],true);
                                props.modal.show('pfccinfomodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000044'),										//标题/* 国际化处理： 利润中心成本*/
                                    content : createPfccinfoCard.bind(that)(props,rul_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ pfccinfo_edit : true, pfccinfo_delete : true});props.form.setFormStatus('materialpfcc','browse');props.button.setOprationBtnsRenderStatus(['pfccinfo'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ pfccinfo_edit : true, pfccinfo_delete : true});props.form.setFormStatus('materialpfcc','browse');props.button.setOprationBtnsRenderStatus(['pfccinfo'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    'materialpfcc' : {
                                        areacode : "materialpfcc",
                                        rows : [{
                                            status : "0",
                                            values : data.head.materialpfcc.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.profitcostlist){
                                    props.cardTable.setTableData('profitcostlist',data.bodys.profitcostlist);
                                    data.bodys.profitcostlist.rows.forEach(rowdata=>{
                                        props.cardTable.setValByKeyAndRowId('profitcostlist',rowdata.rowid,'name',{value:rowdata.values['pk_liabilitybook.name'].display||" ",display: rowdata.values['pk_liabilitybook.name'].display})
                                    })
                                }else{
                                    props.cardTable.setTableData('profitcostlist',{rows:[]});
                                }
                                props.form.setFormStatus('materialpfcc','browse');
                                props.cardTable.setStatus('profitcostlist','browse');
                                updateModalButton(props,'pfccinfo','browse');
                            }
                        }
                    });
                }
            }
        })
    },
}
//xbBNZdDFBeHR0NxHIc8oEDkBV4w+8uTzHTkEzXIGZXDwaVZztAZVmT8VChrpJM0G