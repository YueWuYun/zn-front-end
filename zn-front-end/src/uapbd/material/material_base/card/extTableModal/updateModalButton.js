//ppeyBrRDCMUru8UQ85ZNEZ04GXcAUfOSRpYF+Cxs6NgZrU4JgNk/i0RQqdRTkrcI
export default function(props,modal,status){
    switch(modal){
        case 'fi':
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    fi_edit : false,
                    fi_delete : false,
                    fi_save : true,
                    fi_cancel : true,
                    fi_refresh : false,
                    fi_print : false,
                    fi_output : false
                });
            }else{
                props.button.setButtonsVisible({
                    fi_edit : true,
                    fi_delete : true,
                    fi_save : false,
                    fi_cancel : false,
                    fi_refresh : true,
                    fi_print : true,
                    fi_output : true
                });
            }
            break;
        case 'pfc':
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    pfc_edit : false,
                    pfc_delete : false,
                    pfc_save : true,
                    pfc_cancel : true,
                    pfc_refresh : false,
                    pfc_print : false,
                    pfc_output : false,
                    materialpfcsub_delete:true,
                    materialpfcsub_add:true
                });
            }else{
                props.button.setButtonsVisible({
                    pfc_edit : true,
                    pfc_delete : true,
                    pfc_save : false,
                    pfc_cancel : false,
                    pfc_refresh : true,
                    pfc_print : true,
                    pfc_output : true,
                    materialpfcsub_delete:false,
                    materialpfcsub_add:false
                });
            }
            break;
        case 'pu':
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    pu_edit : false,
                    pu_delete : false,
                    pu_save : true,
                    pu_cancel : true,
                    pu_refresh : false,
                    pu_print : false,
                    pu_output : false
                });
            }else{
                props.button.setButtonsVisible({
                    pu_edit : true,
                    pu_delete : true,
                    pu_save : false,
                    pu_cancel : false,
                    pu_refresh : true,
                    pu_print : true,
                    pu_output : true
                });
            }
            break;
            case 'sale' :
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    sale_edit : false,
                    sale_delete : false,
                    sale_save : true,
                    sale_cancel : true,
                    sale_refresh : false,
                    sale_print : false,
                    sale_output : false,
                    materialbindle_delete:true,
                    materialbindle_add:true
                });
            }else{
                props.button.setButtonsVisible({
                    sale_edit : true,
                    sale_delete : true,
                    sale_save : false,
                    sale_cancel : false,
                    sale_refresh : true,
                    sale_print : true,
                    sale_output : true,
                    materialbindle_delete:false,
                    materialbindle_add:false
                });
            }
            break;
        case 'stock' :
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    stock_edit : false,
                    stock_delete : false,
                    stock_save : true,
                    stock_cancel : true,
                    stock_refresh : false,
                    stock_print : false,
                    stock_output : false,
                    materialwarh_delete:true,
                    materialwarh_add:true
                });
            }else{
                props.button.setButtonsVisible({
                    stock_edit : true,
                    stock_delete : true,
                    stock_save : false,
                    stock_cancel : false,
                    stock_refresh : true,
                    stock_print : true,
                    stock_output : true,
                    materialwarh_delete:false,
                    materialwarh_add:false
                });
            }
            break;
        case 'plan' :
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    plan_edit : false,
                    plan_delete : false,
                    plan_save : true,
                    plan_cancel : true,
                    plan_refresh : false,
                    plan_print : false,
                    plan_output : false,
                    materialrepl_delete:true,
                    materialrepl_add:true
                });
            }else{
                props.button.setButtonsVisible({
                    plan_edit : true,
                    plan_delete : true,
                    plan_save : false,
                    plan_cancel : false,
                    plan_refresh : true,
                    plan_print : true,
                    plan_output : true,
                    materialrepl_delete:false,
                    materialrepl_add:false
                });
            }
            break;
        case 'prod':
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    prod_edit : false,
                    prod_delete : false,
                    prod_save : true,
                    prod_cancel : true,
                    prod_refresh : false,
                    prod_print : false,
                    prod_output : false
                });
            }else{
                props.button.setButtonsVisible({
                    prod_edit : true,
                    prod_delete : true,
                    prod_save : false,
                    prod_cancel : false,
                    prod_refresh : true,
                    prod_print : true,
                    prod_output : true
                });
            }
            break;
        case 'cost':
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    cost_edit : false,
                    cost_delete : false,
                    cost_save : true,
                    cost_cancel : true,
                    cost_refresh : false,
                    cost_print : false,
                    cost_output : false,
                    materialcostmode_delete:true,
                    materialcostmode_add:true
                });
            }else{
                props.button.setButtonsVisible({
                    cost_edit : true,
                    cost_delete : true,
                    cost_save : false,
                    cost_cancel : false,
                    cost_refresh : true,
                    cost_print : true,
                    cost_output : true,
                    materialcostmode_delete:false,
                    materialcostmode_add:false
                });
            }
            break;
        case 'pfccinfo':
            if(status === 'edit'){
                props.button.setButtonsVisible({
                    pfccinfo_edit : false,
                    pfccinfo_delete : false,
                    pfccinfo_save : true,
                    pfccinfo_cancel : true,
                    pfccinfo_refresh : false,
                    pfccinfo_print : false,
                    pfccinfo_output : false,
                    profitcostlist_delete:true,
                    profitcostlist_add:true
                });
            }else{
                props.button.setButtonsVisible({
                    pfccinfo_edit : true,
                    pfccinfo_delete : true,
                    pfccinfo_save : false,
                    pfccinfo_cancel : false,
                    pfccinfo_refresh : true,
                    pfccinfo_print : true,
                    pfccinfo_output : true,
                    profitcostlist_delete:false,
                    profitcostlist_add:false
                });
            }
            break;
    }
}
//ppeyBrRDCMUru8UQ85ZNEZ04GXcAUfOSRpYF+Cxs6NgZrU4JgNk/i0RQqdRTkrcI