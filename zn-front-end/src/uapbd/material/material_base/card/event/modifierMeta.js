//IhNZwCt51BEWV6ein2VxuWasmZpniK/YBTzpOyQcyyvJSYS8/umxu8EV2TmywKP8
/**
 * 模板处理
 * @author yinshb
 */
import { ajax, base,toast,cardCache } from 'nc-lightapp-front';
import  __Utils from '../../../../public/utils';
import resetAssistant from './resetAssistant';
import updateModalButton from '../extTableModal/updateModalButton';
import {createFiCard,createPfcCard,createPuCard,createSaleCard,createStockCard,createProdCard,createPlanCard,createCostCard,createPfccinfoCard} from '../extTableModal';
String.prototype.startWith = function(str) {  
    var reg = new RegExp("^" + str);  
    return reg.test(this);  
}  
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
const delUrls = {
    'fi' : '/nccloud/uapbd/material/delMaterialfi.do',
    'pfc' : '/nccloud/uapbd/material/delMaterialpfc.do',
    'pu' : '/nccloud/uapbd/material/delMaterialpu.do',
    'sale' : '/nccloud/uapbd/material/delMaterialsale.do',
    'stock' : '/nccloud/uapbd/material/delMaterialstock.do',
    'plan' : '/nccloud/uapbd/material/delMaterialplan.do',
    'prod' : '/nccloud/uapbd/material/delMaterialprod.do',
    'cost' : '/nccloud/uapbd/material/delMaterialcost.do',
    'pfccinfo' : '/nccloud/uapbd/material/delMaterialpfcc.do'
}
var ruls_values = {
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
let pageids = {};
export default function(props, meta,values,pageCodeValues){
    pageids = pageCodeValues;
    let convert_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['convert_delete'],
                {
                    area:'convert_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['convert']].items.push(convert_porCol);

    //财务信息
    let fi_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['fi_edit','fi_delete'],
                {
                    area:'fi_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['fi']].items.push(fi_porCol);
    //利润中心信息
    let pfc_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['pfc_edit','pfc_delete'],
                {
                    area:'pfc_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['pfc']].items.push(pfc_porCol);
    //采购信息
    let pu_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['pu_edit','pu_delete'],
                {
                    area:'pu_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['pu']].items.push(pu_porCol);
    //销售信息
    let sale_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['sale_edit','sale_delete'],
                {
                    area:'sale_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['sale']].items.push(sale_porCol);
    //库存信息
    let stock_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['stock_edit','stock_delete'],
                {
                    area:'stock_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['stock']].items.push(stock_porCol);
    //计划信息
    let plan_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['plan_edit','plan_delete'],
                {
                    area:'plan_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['plan']].items.push(plan_porCol);
    //生产信息
    let prod_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['prod_edit','prod_delete'],
                {
                    area:'prod_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['prod']].items.push(prod_porCol);
    //成本信息
    let cost_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['cost_edit','cost_delete'],
                {
                    area:'cost_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['cost']].items.push(cost_porCol);
    //利润中心成本
    let pfccinfo_porCol = {
        attrcode: 'opr',
        key : 'opr',
		label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
		visible: true,
		className:'table-opr',
        width:200,
        itemtype: 'customer',
		fixed:'right',
		render(text, record, index) {
            return props.button.createOprationButton(
                ['pfccinfo_edit','pfccinfo_delete'],
                {
                    area:'pfccinfo_table_inner',
                    buttonLimit:3,
                    onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
                }
            );
		}
	};
    meta[values['pfccinfo']].items.push(pfccinfo_porCol);
    
    //利润中心子表
    // let materialpfcsub_porCol = {
    //     attrcode: 'opr',
    //     key : 'opr',
	// 	label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
	// 	visible: true,
	// 	className:'table-opr',
    //     width:200,
    //     itemtype: 'customer',
	// 	fixed:'right',
	// 	render(text, record, index) {
    //         return props.button.createOprationButton(
    //             ['materialpfcsub_delete'],
    //             {
    //                 area:'materialpfcsub_table_inner',
    //                 buttonLimit:3,
    //                 onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
    //             }
    //         );
	// 	}
	// };
    // meta['materialpfcsub'].items.push(materialpfcsub_porCol);

    //销售信息子表
    // let materialbindle_porCol = {
    //     attrcode: 'opr',
    //     key : 'opr',
	// 	label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
	// 	visible: true,
	// 	className:'table-opr',
    //     width:200,
    //     itemtype: 'customer',
	// 	fixed:'right',
	// 	render(text, record, index) {
    //         return props.button.createOprationButton(
    //             ['materialbindle_delete'],
    //             {
    //                 area:'materialbindle_table_inner',
    //                 buttonLimit:3,
    //                 onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
    //             }
    //         );
	// 	}
	// };
    // meta['materialbindle'].items.push(materialbindle_porCol);

    //库存信息子表
    // let materialwarh_porCol = {
    //     attrcode: 'opr',
    //     key : 'opr',
	// 	label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
	// 	visible: true,
	// 	className:'table-opr',
    //     width:200,
    //     itemtype: 'customer',
	// 	fixed:'right',
	// 	render(text, record, index) {
    //         return props.button.createOprationButton(
    //             ['materialwarh_delete'],
    //             {
    //                 area:'materialwarh_table_inner',
    //                 buttonLimit:3,
    //                 onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
    //             }
    //         );
	// 	}
	// };
    // meta['materialwarh'].items.push(materialwarh_porCol);

    //计划信息子表
    // let materialrepl_porCol = {
    //     attrcode: 'opr',
    //     key : 'opr',
	// 	label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
	// 	visible: true,
	// 	className:'table-opr',
    //     width:200,
    //     itemtype: 'customer',
	// 	fixed:'right',
	// 	render(text, record, index) {
    //         return props.button.createOprationButton(
    //             ['materialrepl_delete'],
    //             {
    //                 area:'materialrepl_table_inner',
    //                 buttonLimit:3,
    //                 onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
    //             }
    //         );
	// 	}
	// };
    // meta['materialrepl'].items.push(materialrepl_porCol);

    //成本信息子表
    // let materialcostmode_porCol = {
    //     attrcode: 'opr',
    //     key : 'opr',
	// 	label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
	// 	visible: true,
	// 	className:'table-opr',
    //     width:200,
    //     itemtype: 'customer',
	// 	fixed:'right',
	// 	render(text, record, index) {
    //         return props.button.createOprationButton(
    //             ['materialcostmode_delete'],
    //             {
    //                 area:'materialcostmode_table_inner',
    //                 buttonLimit:3,
    //                 onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
    //             }
    //         );
	// 	}
	// };
    // meta['materialcostmode'].items.push(materialcostmode_porCol);

    //利润中心成本子表信息
    // let profitcostlist_porCol = {
    //     attrcode: 'opr',
    //     key : 'opr',
	// 	label: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000060')/* 国际化处理： 操作*/,
	// 	visible: true,
	// 	className:'table-opr',
    //     width:200,
    //     itemtype: 'customer',
	// 	fixed:'right',
	// 	render(text, record, index) {
    //         return props.button.createOprationButton(
    //             ['profitcostlist_delete'],
    //             {
    //                 area:'profitcostlist_table_inner',
    //                 buttonLimit:3,
    //                 onButtonClick : (props,id) => tableButtonClick(props, id, text, record, index)
    //             }
    //         );
	// 	}
	// };
    // meta['profitcostlist'].items.push(profitcostlist_porCol);
    let areas = {
        base : 'base',//物料基本信息
        convert : 'materialconvert',//辅助计量管理
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
    
    //updated by wangying16 for NCCLOUD-130587
    //依据原nc逻辑，给所有为参照的自定义项赋pk_org条件
    Object.values(areas).forEach(area=>{
        meta[area].items.forEach(item=>{
            if(item.datatype=='204'&&item.itemtype=='refer'&&item.attrcode.startWith("def")){
                item.queryCondition=()=>{
                    return{
                        pk_org:props.form.getFormItemsValue('material','pk_org').value
                    }
                }
            }
        })
    })

    return meta;
}


function tableButtonClick(props, id, text, record, index){
    switch(id){
        case 'convert_delete':
            props.cardTable.delRowsByIndex('materialconvert',index);
            break;
        case 'fi_edit'://财务信息编辑
            let fi_reqQueryData = [
                {
                    rqUrl: '/platform/templet/querypage.do',
                    rqJson: `{\n  \"pagecode\": \"fi_card\"\n}`,
                    rqCode: 'fi_template'
                }
            ]
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : fi_reqQueryData,
                success : (res) => {
                    if(res&&res.data){
                        let meta = props.meta.getMeta();
                        meta['materialfi'] = res.data.fi_template.materialfi;
                        meta['fi_base'] = res.data.fi_template.fi_base;
                        meta['fi_audit'] = res.data.fi_template.fi_audit;
                        props.meta.setMeta(meta);
                    }
                    let node_typefi = props.config.node_type;
            let pk_orgfi = record.values.pk_org.value;
            let pk_groupfi = record.values.pk_group.value;
            if(node_typefi=='ORG_NODE'&&pk_orgfi==pk_groupfi){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.EmptyAllFormValue('materialfi');
            ajax({
                url : queryUrls['fi'],
                data : {
                    pk : record.values['pk_materialfi'].value,
                    pageid : pageids['fi']
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
                        props.button.setOprationBtnsRenderStatus(['fi'],true);
                        props.modal.show('fimodal',{
                            title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000036'),										//标题/* 国际化处理： 财务信息*/
                            content : createFiCard.bind(this)(props,ruls_values),
                            hasCloseBtn:true,
                            className:'affix-zdy',
                            closeModalEve:()=>{props.button.setButtonsVisible({ fi_edit : true, fi_delete : true});props.form.setFormStatus('materialfi','browse');props.button.setOprationBtnsRenderStatus(['fi'],false);},
                            cancelBtnClick:()=>{props.button.setButtonsVisible({ fi_edit : true, fi_delete : true});props.form.setFormStatus('materialfi','browse');props.button.setOprationBtnsRenderStatus(['fi'],false);},
                            size : 'xlg',
                            noFooter : true							
                        });
                        props.form.setFormStatus('materialfi','edit');
                        props.form.setAllFormValue({
                            materialfi : {
                                areacode : "materialfi",
                                rows : [{
                                    status : "1",
                                    values : data.head.materialfi.rows[0].values
                                }]
                            }
                        });
                        props.form.setFormItemsDisabled('materialfi',{pk_org:true});
                        updateModalButton(props,'fi','edit');
                    }
                }
            });
                }
            })
            
            break;
        case 'fi_delete':
            ajax({
                url : delUrls['fi'],
                data : {
                    pk : [record.values['pk_materialfi'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('fi',record.rowid);
                    }
                }
            });
            break;
        case 'pfc_edit':
            let pfc_reqQueryData = [
                {
                    rqUrl: '/platform/templet/querypage.do',
                    rqJson: `{\n  \"pagecode\": \"pfc_card\"\n}`,
                    rqCode: 'pfc_template'
                }
            ]
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : pfc_reqQueryData,
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
                    let node_typepfc = props.config.node_type;
                    let pk_orgpfc = record.values.pk_org.value;
                    let pk_grouppfc = record.values.pk_group.value;
                    if(node_typepfc=='ORG_NODE'&&pk_orgpfc==pk_grouppfc){
                        toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
                        return;
                    }
                    props.form.EmptyAllFormValue('materialpfc');
                    props.cardTable.setTableData('materialpfcsub',{rows:[]});
                    ajax({
                        url : queryUrls['pfc'],
                        data : {
                        pk : record.values['pk_materialpfc'].value,
                        pageid : pageids['pfc']
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
                        props.button.setOprationBtnsRenderStatus(['pfc'],true);
                        props.modal.show('pfcmodal',{
                            title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000037'),										//标题/* 国际化处理： 利润中心信息*/
                            content : createPfcCard.bind(this)(props,ruls_values),
                            hasCloseBtn:true,
                            className:'affix-zdy',
                            closeModalEve:()=>{props.button.setButtonsVisible({ pfc_edit : true, pfc_delete : true});props.form.setFormStatus('materialpfc','browse');props.button.setOprationBtnsRenderStatus(['pfc'],false);},
                            cancelBtnClick:()=>{props.button.setButtonsVisible({ pfc_edit : true, pfc_delete : true});props.form.setFormStatus('materialpfc','browse');props.button.setOprationBtnsRenderStatus(['pfc'],false);},
                            size : 'xlg',
                            noFooter : true							
                        });
                        props.form.setAllFormValue({
                            materialpfc : {
                                areacode : "materialpfc",
                                rows : [{
                                    status : "1",
                                    values : data.head.materialpfc.rows[0].values
                                }]
                            }
                        });
                        if(data.bodys.materialpfcsub){
                            props.cardTable.setTableData('materialpfcsub',data.bodys.materialpfcsub);
                            data.bodys.materialpfcsub.rows.forEach(rowdata=>{
                                props.cardTable.setValByKeyAndRowId('materialpfcsub',rowdata.rowid,'name',{value:rowdata.values['pk_liabilitybook.name'].display||" ",display: rowdata.values['pk_liabilitybook.name'].display})
                            })
                        }
                        updateModalButton(props,'pfc','edit');
                        props.form.setFormStatus('materialpfc','edit');
                        props.form.setFormItemsDisabled('materialpfc',{pk_org:true});
                        props.cardTable.setStatus('materialpfcsub','edit');

                        let meta = props.meta.getMeta();
                        meta['pfc_base'].items.forEach((item,index)=>{
                            if(item.attrcode === 'pk_marcostcls'){
                                meta['pfc_base'].items[index].queryCondition={
                                    pk_org : data.head.materialpfc.rows[0].values['pk_org'].value
                                }
                            }
                        });
                        meta['materialpfcsub'].items.forEach((item,index)=>{
                            if(item.attrcode === 'pk_liabilitybook'){
                                meta['materialpfcsub'].items[index].queryCondition={
                                    pk_relorg: data.head.materialpfc.rows[0].values['pk_org'].value,
                                    TreeRefActionExt : 'nccloud.web.uapbd.material.action.LiabilityBookTreeRefExt'
                                }
                            }
                        });
                        props.meta.setMeta(meta);
                    }
                }
            });
                }
            })
            
            break;
        case 'pfc_delete':
            ajax({
                url : delUrls['pfc'],
                data : {
                    pk : [record.values['pk_materialpfc'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('pfc',record.rowid);
                    }
                }
            });
            break;
        case 'pu_edit':
            let pu_reqQueryData = [
                {
                    rqUrl: '/platform/templet/querypage.do',
                    rqJson: `{\n  \"pagecode\": \"pu_card\"\n}`,
                    rqCode: 'pu_template'
                }
            ]
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : pu_reqQueryData,
                success : (res) => {
                    if(res&&res.data){
                        let meta = props.meta.getMeta();
                        meta['materialpu'] = res.data.pu_template.materialpu;
                        meta['pu_base'] = res.data.pu_template.pu_base;
                        meta['pu_audit'] = res.data.pu_template.pu_audit;
                        props.meta.setMeta(meta);
                    }
                    let node_typepu = props.config.node_type;
                    let pk_orgpu = record.values.pk_org.value;
                    let pk_grouppu = record.values.pk_group.value;
                    if(node_typepu=='ORG_NODE'&&pk_orgpu==pk_grouppu){
                        toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
                    
                        return;
                    }   
                    props.form.EmptyAllFormValue('materialpu');
                    ajax({
                        url : queryUrls['pu'],
                        data : {
                            pk : record.values['pk_materialpu'].value,
                            pageid : pageids['pu']
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
                                props.button.setOprationBtnsRenderStatus(['pu'],true);
                                props.modal.show('pumodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000038'),										//标题/* 国际化处理： 采购信息*/
                                    content : createPuCard.bind(this)(props,ruls_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ pu_edit : true, pu_delete : true});props.form.setFormStatus('materialpu','browse');props.button.setOprationBtnsRenderStatus(['pu'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ pu_edit : true, pu_delete : true});props.form.setFormStatus('materialpu','browse');props.button.setOprationBtnsRenderStatus(['pu'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    materialpu : {
                                        areacode : "materialpu",
                                        rows : [{
                                            status : "1",
                                            values : data.head.materialpu.rows[0].values
                                        }]
                                    }
                                });
                                let meta = props.meta.getMeta();
                                meta['pu_base'].items.forEach((item,index)=>{
                                    if(item.attrcode === 'pk_cumandoc'){
                                        meta['pu_base'].items[index].queryCondition={
                                            pk_org : data.head.materialpu.rows[0].values['pk_org'].value
                                        }
                                    }
                                });
                                props.meta.setMeta(meta);
                                updateModalButton(props,'pu','edit');
                                props.form.setFormStatus('materialpu','edit');
                                props.form.setFormItemsDisabled('materialpu',{pk_org:true});
                            }
                        }
                    });
                }
            })
            
            break;
        case 'pu_delete':
            ajax({
                url : delUrls['pu'],
                data : {
                    pk : [record.values['pk_materialpu'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('pu',record.rowid);
                    }
                }
            });
            break;
        case 'sale_edit':
            let sale_reqQueryData = [
                {
                    rqUrl: '/platform/templet/querypage.do',
                    rqJson: `{\n  \"pagecode\": \"sale_card\"\n}`,
                    rqCode: 'sale_template'
                }
            ]
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : sale_reqQueryData,
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

                    let node_typesale = props.config.node_type;
                    let pk_orgsale = record.values.pk_org.value;
                    let pk_groupsale = record.values.pk_group.value;
                    if(node_typesale=='ORG_NODE'&&pk_orgsale==pk_groupsale){
                        toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
                    
                        return;
                    }
                    props.form.EmptyAllFormValue('materialsale');
                    props.cardTable.setTableData('materialbindle',{rows:[]});
                    ajax({
                        url : queryUrls['sale'],
                        data : {
                            pk : record.values['pk_materialsale'].value,
                            pageid : pageids['sale']
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
                                props.button.setOprationBtnsRenderStatus(['sale'],true);
                                props.modal.show('salemodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000039'),										//标题/* 国际化处理： 销售信息*/
                                    content : createSaleCard.bind(this)(props,ruls_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ sale_edit : true, sale_delete : true});props.form.setFormStatus('materialsale','browse');props.button.setOprationBtnsRenderStatus(['sale'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ sale_edit : true, sale_delete : true});props.form.setFormStatus('materialsale','browse');props.button.setOprationBtnsRenderStatus(['sale'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    materialsale : {
                                        areacode : "materialsale",
                                        rows : [{
                                            status : "1",
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
                                }
                                updateModalButton(props,'sale','edit');
                                props.form.setFormStatus('materialsale','edit');
                                props.form.setFormItemsDisabled('materialsale',{pk_org:true});
                                props.cardTable.setStatus('materialbindle','edit');
                                let meta = props.meta.getMeta();
                                meta['sale_base'].items.forEach((item,index)=>{
                                    if(item.attrcode === 'pk_marsaleclass'){
                                        meta['sale_base'].items[index].queryCondition={
                                            pk_org : data.head.materialsale.rows[0].values['pk_org'].value
                                        }
                                    }
                                });
                                meta['materialbindle'].items.forEach((item,index)=>{
                                    if(item.attrcode === 'pk_bindle'){
                                        meta['materialbindle'].items[index].queryCondition={
                                            pk_org : data.head.materialsale.rows[0].values['pk_org'].value
                                        }
                                    }
                                });
                                props.meta.setMeta(meta);
                            }
                        }
                    });
                }
            })
            
            break;
        case 'sale_delete':
            ajax({
                url : delUrls['sale'],
                data : {
                    pk : [record.values['pk_materialsale'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('sale',record.rowid);
                    }
                }
            });
            break;
        case 'stock_edit':
            let stock_reqQueryData = [
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
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : stock_reqQueryData,
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
                    let node_typestock = props.config.node_type;
                    let pk_orgstock = record.values.pk_org.value;
                    let pk_groupstock = record.values.pk_group.value;
                    if(node_typestock=='ORG_NODE'&&pk_orgstock==pk_groupstock){
                        toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
                    
                        return;
                    }
                    props.form.EmptyAllFormValue('materialstock');
                    props.cardTable.setTableData('materialwarh',{rows:[]});
                    ajax({
                        url : queryUrls['stock'],
                        data : {
                            pk : record.values['pk_materialstock'].value,
                            pageid : pageids['stock']
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
                                let pk_measdoc = props.form.getFormItemsValue('material','pk_measdoc');
                                let cardTableData = props.cardTable.getAllRows('materialconvert');
                                let meta = props.meta.getMeta();
                                let arr = [];
                                if(pk_measdoc && pk_measdoc.value){
                                    arr.push(pk_measdoc.value);
                                }
                                (cardTableData || []).forEach(element => {
                                    arr.push(element.values['pk_measdoc'].value);
                                });
                                meta['stock_base'].items.forEach((item,index)=>{
                                    if(item.attrcode === 'sernumunit'){
                                        meta['stock_base'].items[index].queryCondition={
                                            pk_measdoc : JSON.stringify(arr),
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.MeasdocDefaultGridRefExt'
                                        }
                                    }else if(item.attrcode === 'pk_marpuclass'){
                                        meta['stock_base'].items[index].queryCondition={
                                            pk_org : data.head.materialstock.rows[0].values['pk_org'].value
                                        }
                                    }
                                });
                                meta['materialwarh'].items.forEach(item=>{
                                    if(item.attrcode === 'pk_stordoc'){
                                        item.queryCondition = {
                                            pk_org : data.head.materialstock.rows[0].values['pk_org'].value
                                        }
                                    }
                                });
                                props.meta.setMeta(meta);
                                props.button.setOprationBtnsRenderStatus(['stock'],true);
                                props.modal.show('stockmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000040'),										//标题/* 国际化处理： 库存信息*/
                                    content : createStockCard.bind(this)(props,ruls_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ stock_edit : true, stock_delete : true});props.form.setFormStatus('materialstock','browse');props.button.setOprationBtnsRenderStatus(['stock'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ stock_edit : true, stock_delete : true});props.form.setFormStatus('materialstock','browse');props.button.setOprationBtnsRenderStatus(['stock'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    materialstock : {
                                        areacode : "materialstock",
                                        rows : [{
                                            status : "1",
                                            values : data.head.materialstock.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialwarh){
                                    props.cardTable.setTableData('materialwarh',data.bodys.materialwarh);
                                }
                                updateModalButton(props,'stock','edit');
                                meta.costvalutasst.areaVisible = true;
                                meta.plan_marasst.areaVisible = true;
                                meta.stock_freeasst.areaVisible = true;
                                props.form.setFormStatus('materialstock','edit');
                                props.form.setFormItemsDisabled('materialstock',{pk_org:true});
                                props.cardTable.setStatus('materialwarh','edit');
                                if(data.head.materialstock.rows[0].values && data.head.materialstock.rows[0].values['isretfreeofchk'] && data.head.materialstock.rows[0].values['isretfreeofchk'].value){
                                    props.form.setFormItemsDisabled('materialstock',{isretinstobychk:true});
                                }else{
                                    props.form.setFormItemsDisabled('materialstock',{isretinstobychk:false});
                                }
                                if(data.head.materialstock.rows[0].values && data.head.materialstock.rows[0].values['serialmanaflag'] && data.head.materialstock.rows[0].values['serialmanaflag'].value){
                                    props.form.setFormItemsDisabled('materialstock',{issinglcheck:false});
                                }else{
                                    props.form.setFormItemsDisabled('materialstock',{issinglcheck:true});
                                }
                            }
                        }
                    });
                }
            })
            
            break;
        case 'stock_delete':
            ajax({
                url : delUrls['stock'],
                data : {
                    pk : [record.values['pk_materialstock'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('stock',record.rowid);
                    }
                }
            });
            break;
        case 'plan_edit':
            let plan_reqQueryData = [
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
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : plan_reqQueryData,
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
                    let node_typeplan = props.config.node_type;
                    let pk_orgplan = record.values.pk_org.value;
                    let pk_groupplan = record.values.pk_group.value;
                    if(node_typeplan=='ORG_NODE'&&pk_orgplan==pk_groupplan){
                        toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
                    
                        return;
                    }
                    let AppCode =props.getAppCode();
                    props.form.EmptyAllFormValue('materialplan');
                    props.cardTable.setTableData('materialrepl',{rows:[]});
                    ajax({
                        url : queryUrls['plan'],
                        data : {
                            pk : record.values['pk_materialplan'].value,
                            pageid : pageids['plan']
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
                                props.button.setOprationBtnsRenderStatus(['plan'],true);
                                props.modal.show('planmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000041'),										//标题/* 国际化处理： 计划信息*/
                                    content : createPlanCard.bind(this)(props,ruls_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ plan_edit : true, plan_delete : true});props.form.setFormStatus('materialplan','browse');props.button.setOprationBtnsRenderStatus(['plan'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ plan_edit : true, plan_delete : true});props.form.setFormStatus('materialplan','browse');props.button.setOprationBtnsRenderStatus(['plan'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    materialplan : {
                                        areacode : "materialplan",
                                        rows : [{
                                            status : "1",
                                            values : data.head.materialplan.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialrepl){
                                    props.cardTable.setTableData('materialrepl',data.bodys.materialrepl);
                                    data.bodys.materialrepl.rows.forEach(rowdata=>{
                                        props.cardTable.setValByKeyAndRowId('materialrepl',rowdata.rowid,'name',{value:rowdata.values['pk_replace.name'].display||" ",display: rowdata.values['pk_replace.name'].display})
                                    })
                                }
                                let meta = props.meta.getMeta();
                                
                                meta['plan_base'].items.forEach(item=>{
                                    if(item.attrcode === 'planstrategygroup'){
                                        item.queryCondition = {
                                            pk_org : data.head.materialplan.rows[0].values['pk_org'].value
                                        }
                                    }else if(item.attrcode === 'pk_prodfactory'){
                                        meta['plan_base'].items[index].queryCondition={
                                            AppCode : AppCode,
                                            orgType : 'FACTORYTYPE000000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }
                                    }
                                });
                                props.meta.setMeta(meta);
                                meta.costvalutasst.areaVisible = true;
                                meta.plan_marasst.areaVisible = true;
                                meta.stock_freeasst.areaVisible = true;
                                updateModalButton(props,'plan','edit');
                                props.form.setFormStatus('materialplan','edit');
                                props.form.setFormItemsDisabled('materialplan',{pk_org:true});
                                props.cardTable.setStatus('materialrepl','edit');
                                if(data.head.materialplan.rows[0].values && data.head.materialplan.rows[0].values['combineflag'] && data.head.materialplan.rows[0].values['combineflag'].value){
                                    if(data.head.materialplan.rows[0].values['materialreqcombintype'] && data.head.materialplan.rows[0].values['materialreqcombintype'].value === '2'){
                                        props.form.setFormItemsDisabled('materialplan',{materialreqcombintype:false,reqcombmoment:false,fixcombinreqday:true});
                                    }else{
                                        props.form.setFormItemsDisabled('materialplan',{materialreqcombintype:false,reqcombmoment:false,fixcombinreqday:false});
                                    }
                                    if(data.head.materialplan.rows[0].values['reqcombmoment'] && data.head.materialplan.rows[0].values['reqcombmoment'].value){
                                        props.form.setFormItemsDisabled('materialplan',{numofcombindays:false});
                                    }else{
                                        props.form.setFormItemsDisabled('materialplan',{numofcombindays:true});
                                    }
                                }else{
                                    props.form.setFormItemsDisabled('materialplan',{materialreqcombintype:true,reqcombmoment:true,fixcombinreqday:true,numofcombindays:true});
                                }
                            }
                        }
                    });
                }
            })
            
            break;
        case 'plan_delete':
            ajax({
                url : delUrls['plan'],
                data : {
                    pk : [record.values['pk_materialplan'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('plan',record.rowid);
                    }
                }
            });
            break;
        case 'prod_edit':
            let prod_reqQueryData = [
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
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : prod_reqQueryData,
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
                    let node_typeprod = props.config.node_type;
                    let pk_orgprod = record.values.pk_org.value;
                    let pk_groupprod = record.values.pk_group.value;
                    if(node_typeprod=='ORG_NODE'&&pk_orgprod==pk_groupprod){
                        toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
                    
                        return;
                    }
                    props.form.EmptyAllFormValue('materialprod');
                    ajax({
                        url : queryUrls['prod'],
                        data : {
                            pk : record.values['pk_materialprod'].value,
                            pageid : pageids['prod']
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
                                let meta = props.meta.getMeta();
                                meta['prod_base'].items.forEach(item=>{
                                    if(item.attrcode === 'pk_prodeptdoc'){
                                        item.queryCondition = {
                                            busifuncode:'fa',
                                            pk_org : data.head.materialprod.rows[0].values['pk_org'].value
                                        }
                                    }else if(item.attrcode === 'pk_propsndoc'){
                                        item.queryCondition = {
                                            pk_org : data.head.materialprod.rows[0].values['pk_org'].value
                                        }
                                    }
                                });
                                meta['producecost'].items.forEach((item,index)=>{
                                    if(item.attrcode === 'pk_marcostclass'){
                                        let sfcbdxtype = data.head.materialprod.rows[0].values['sfcbdxtype'];
                                        if(sfcbdxtype && sfcbdxtype.value === 'Sys004'){
                                            meta['producecost'].items[index].queryCondition={
                                                finalcostobj : 'Y',
                                                pk_org:data.head.materialprod.rows[0].values['pk_org'].value,
                                                TreeRefActionExt:'nccloud.web.uapbd.material.action.MaterialCostClassTreeRefExt'
                                            }
                                        }else{
                                            meta['producecost'].items[index].queryCondition={
                                                finalcostobj : 'N',
                                                pk_org:data.head.materialprod.rows[0].values['pk_org'].value,
                                                TreeRefActionExt:'nccloud.web.uapbd.material.action.MaterialCostClassTreeRefExt'
                                            }
                                        }
                                    }else if(item.attrcode === 'disbearfactory'){
                                        meta['producecost'].items[index].queryCondition={
                                            pk_fianaceorg:data.head.materialprod.rows[0].values['pk_org'].value,
                                            pk_org:props.form.getFormItemsValue('material','pk_org').value,
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.DisbearFactiorRefExt'
                                        }
                                    }
                                });
                                meta.costvalutasst.areaVisible = true;
                                meta.plan_marasst.areaVisible = true;
                                meta.stock_freeasst.areaVisible = true;
                                props.meta.setMeta(meta);
                                props.button.setOprationBtnsRenderStatus(['prod'],true);
                                props.modal.show('prodmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000042'),										//标题/* 国际化处理： 生产信息*/
                                    content : createProdCard.bind(this)(props,ruls_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ prod_edit : true, prod_delete : true});props.form.setFormStatus('materialprod','browse');props.button.setOprationBtnsRenderStatus(['prod'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ prod_edit : true, prod_delete : true});props.form.setFormStatus('materialprod','browse');props.button.setOprationBtnsRenderStatus(['prod'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setFormStatus('materialprod','edit');
                                props.form.setAllFormValue({
                                    materialprod : {
                                        areacode : "materialprod",
                                        rows : [{
                                            status : "1",
                                            values : data.head.materialprod.rows[0].values
                                        }]
                                    }
                                });
                                if(data.head.materialprod.rows[0].values && data.head.materialprod.rows[0].values['conversemethod'] && data.head.materialprod.rows[0].values['conversemethod'].value === '1'){
                                    props.form.setFormItemsDisabled('materialprod',{converstime:true});
                                }else{
                                    props.form.setFormItemsDisabled('materialprod',{converstime:false});
                                }
                                if(data.head.materialprod.rows[0].values && data.head.materialprod.rows[0].values['sfcbdx'] && data.head.materialprod.rows[0].values['sfcbdx'].value){//成本对象
                                    props.form.setFormItemsDisabled('materialprod',{sfcbdxtype:false});
                                    if(data.head.materialprod.rows[0].values['sfcbdxtype'] && data.head.materialprod.rows[0].values['sfcbdxtype'].value === 'Sys004'){
                                        props.form.setFormItemsDisabled('materialprod',{classfeature:false});
                                    }else{
                                        props.form.setFormItemsDisabled('materialprod',{classfeature:true});
                                    }
                                }else{
                                    props.form.setFormItemsDisabled('materialprod',{sfcbdxtype:true});
                                    props.form.setFormItemsDisabled('materialprod',{classfeature:true});
                                }

                                if(data.head.materialprod.rows[0].values && data.head.materialprod.rows[0].values['isuseroad'] && data.head.materialprod.rows[0].values['isuseroad'].value){
                                    props.form.setFormItemsDisabled('materialprod',{azcbzxtjcl:false});
                                }else{
                                    props.form.setFormItemsDisabled('materialprod',{azcbzxtjcl:true});
                                }
                                props.form.setFormItemsDisabled('materialprod',{pk_org:true});
                                updateModalButton(props,'prod','edit');
                            }
                        }
                    });
                }
            })
            
            break;
        case 'prod_delete':
            ajax({
                url : delUrls['prod'],
                data : {
                    pk : [record.values['pk_materialprod'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('prod',record.rowid);
                    }
                }
            });
            break;
        case 'cost_edit':
            let cost_reqQueryData = [
                {
                    rqUrl: '/platform/templet/querypage.do',
                    rqJson: `{\n  \"pagecode\": \"cost_card\"\n}`,
                    rqCode: 'cost_template'
                }
            ]
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : cost_reqQueryData,
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
                    let node_typecost = props.config.node_type;
                    let pk_orgcost = record.values.pk_org.value;
                    let pk_groupcost = record.values.pk_group.value;
                    if(node_typecost=='ORG_NODE'&&pk_orgcost==pk_groupcost){
                        toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
                    
                        return;
                    }
                    props.form.EmptyAllFormValue('materialcost');
                    props.cardTable.setTableData('materialcostmode',{rows:[]});
                    ajax({
                        url : queryUrls['cost'],
                        data : {
                            pk : record.values['pk_materialcost'].value,
                            pageid : pageids['cost']
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
                                let meta = props.meta.getMeta();
                                meta['materialcostmode'].items.forEach(item=>{
                                    if(item.attrcode === 'pk_setofbook'){
                                        item.queryCondition = {
                                            costorg : data.head.materialcost.rows[0].values['pk_org'].value,
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.AccountBookTreeRefExt'
                                        }
                                    }
                                });
                                props.meta.setMeta(meta);
                                props.button.setOprationBtnsRenderStatus(['cost'],true);
                                props.modal.show('costmodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000043'),										//标题/* 国际化处理： 成本信息*/
                                    content : createCostCard.bind(this)(props,ruls_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ cost_edit : true, cost_delete : true});props.form.setFormStatus('materialcost','browse');props.button.setOprationBtnsRenderStatus(['cost'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ cost_edit : true, cost_delete : true});props.form.setFormStatus('materialcost','browse');props.button.setOprationBtnsRenderStatus(['cost'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    materialcost : {
                                        areacode : "materialcost",
                                        rows : [{
                                            status : "1",
                                            values : data.head.materialcost.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.materialcostmode){
                                    props.cardTable.setTableData('materialcostmode',data.bodys.materialcostmode);
                                    data.bodys.materialcostmode.rows.forEach(rowdata=>{
                                        props.cardTable.setValByKeyAndRowId('materialcostmode',rowdata.rowid,'name',{value:rowdata.values['pk_setofbook.name'].display||" ",display: rowdata.values['pk_setofbook.name'].display})
                                    })
                                }
                                updateModalButton(props,'cost','edit');
                                props.form.setFormStatus('materialcost','edit');
                                props.form.setFormItemsDisabled('materialcost',{pk_org:true});
                                props.cardTable.setStatus('materialcostmode','edit');
                            }
                        }
                    });
                }
            })
            
            break;
        case 'cost_delete':
            ajax({
                url : delUrls['cost'],
                data : {
                    pk : [record.values['pk_materialcost'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('cost',record.rowid);
                    }
                }
            });
            break;
        case 'pfccinfo_edit':
            let pfcc_reqQueryData = [
                {
                    rqUrl: '/platform/templet/querypage.do',
                    rqJson: `{\n  \"pagecode\": \"profitcost_card\"\n}`,
                    rqCode: 'pfcc_template'
                }
            ]
            ajax({
                url : "/nccloud/platform/pub/mergerequest.do",
                data : pfcc_reqQueryData,
                success : (res) => {
                    if(res&&res.data){
                        let meta = props.meta.getMeta();
                        meta['materialpfcc'] = res.data.pfcc_template.materialpfcc;
                        meta['pfcc_base'] = res.data.pfcc_template.pfcc_base;
                        meta['pfcc_audit'] = res.data.pfcc_template.pfcc_audit;
                        meta['profitcostlist'] = res.data.pfcc_template.profitcostlist;
                        meta['profitcostlist_orgbrowse'] = __Utils.clone(res.data.pfcc_template.profitcostlist);
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
                    let node_typepfccinfo = props.config.node_type;
                    let pk_orgpfccinfo = record.values.pk_org.value;
                    let pk_grouppfccinfo = record.values.pk_group.value;
                    if(node_typepfccinfo=='ORG_NODE'&&pk_orgpfccinfo==pk_grouppfccinfo){
                        toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
                    
                        return;
                    }
                    props.form.EmptyAllFormValue('materialpfcc');
                    props.cardTable.setTableData('profitcostlist',{rows:[]});
                    ajax({
                        url : queryUrls['pfccinfo'],
                        data : {
                            pk : record.values['pk_mateprofcost'].value,
                            pageid : pageids['pfccinfo']
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
                                let meta = props.meta.getMeta();
                                meta['profitcostlist'].items.forEach(item=>{
                                    if(item.attrcode === 'pk_liabilitybook'){
                                        item.queryCondition = {
                                            pk_relorg: data.head.materialpfcc.rows[0].values['pk_org'].value,
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.LiabilityBookTreeRefExt'
                                        }
                                    }
                                });
                                props.meta.setMeta(meta);
                                props.button.setOprationBtnsRenderStatus(['pfccinfo'],true);
                                props.modal.show('pfccinfomodal',{
                                    title : props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000044'),										//标题/* 国际化处理： 利润中心成本*/
                                    content : createPfccinfoCard.bind(this)(props,ruls_values),
                                    hasCloseBtn:true,
                                    className:'affix-zdy',
                                    closeModalEve:()=>{props.button.setButtonsVisible({ pfccinfo_edit : true, pfccinfo_delete : true});props.form.setFormStatus('materialpfcc','browse');props.button.setOprationBtnsRenderStatus(['pfccinfo'],false);},
                                    cancelBtnClick:()=>{props.button.setButtonsVisible({ pfccinfo_edit : true, pfccinfo_delete : true});props.form.setFormStatus('materialpfcc','browse');props.button.setOprationBtnsRenderStatus(['pfccinfo'],false);},
                                    size : 'xlg',
                                    noFooter : true							
                                });
                                props.form.setAllFormValue({
                                    materialpfcc : {
                                        areacode : "materialpfcc",
                                        rows : [{
                                            status : "1",
                                            values : data.head.materialpfcc.rows[0].values
                                        }]
                                    }
                                });
                                if(data.bodys.profitcostlist){
                                    props.cardTable.setTableData('profitcostlist',data.bodys.profitcostlist);
                                    data.bodys.profitcostlist.rows.forEach(rowdata=>{
                                        props.cardTable.setValByKeyAndRowId('profitcostlist',rowdata.rowid,'name',{value:rowdata.values['pk_liabilitybook.name'].display||" ",display: rowdata.values['pk_liabilitybook.name'].display})
                                    })
                                }
                                updateModalButton(props,'pfccinfo','edit');
                                props.form.setFormStatus('materialpfcc','edit');
                                props.form.setFormItemsDisabled('materialpfcc',{pk_org:true});
                                props.cardTable.setStatus('profitcostlist','edit');
                            }
                        }
                    });
                }
            })
            
            break;
        case 'pfccinfo_delete':
            ajax({
                url : delUrls['pfccinfo'],
                data : {
                    pk : [record.values['pk_mateprofcost'].value],
                    ts : [record.values['ts'].value]
                },
                success:(res) => {
                    if(res.success){
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                        props.cardTable.delRowByRowId('pfccinfo',record.rowid);
                    }
                }
            });
            break;
        case 'materialpfcsub_delete':
            props.cardTable.delRowsByIndex('materialpfcsub',index);
            break;
        case 'materialbindle_delete':
            props.cardTable.delRowsByIndex('materialbindle',index);
            break;
        case 'materialwarh_delete':
            props.cardTable.delRowsByIndex('materialwarh',index);
            break;
        case 'materialrepl_delete':
            props.cardTable.delRowsByIndex('materialrepl',index);
            break;
        case 'materialcostmode_delete':
            props.cardTable.delRowsByIndex('materialcostmode',index);
            break;
        case 'profitcostlist_delete':
            props.cardTable.delRowsByIndex('profitcostlist',index);
            break;
    }

}
//IhNZwCt51BEWV6ein2VxuWasmZpniK/YBTzpOyQcyyvJSYS8/umxu8EV2TmywKP8