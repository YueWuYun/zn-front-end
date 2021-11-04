//E/17ql676j8DAc4ea6TORh3h+/XZVzxMlQNkIEIJ9BowL6mPsT1jeo5P14V0OJrw
/**
 * 生产信息卡片
 * @author  yinshb
 */
const formid = 'materialprod';
import { ajax, base,toast,cardCache,promptBox,print } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import updateModalButton from './updateModalButton'
export function createProdCard(props,values){
    let { button,form} = props;
    let { createForm } = form;
    let { createButtonApp } = button;
    return (
        <div style={{maxHeight:'400px'}}>
        <div className="nc-bill-card">
            <div className="nc-bill-header-area">
                <div className="header-title-search-area"></div>
                <div className="header-button-area">
                    {createButtonApp({
                        area: 'prod_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4PROD.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['prod_base','producecost','costvalutasst'],
                    onAfterEvent : onAfterEvent4PROD
                    //onAfterEvent: this.onAfterEvent.bind(this)
                })}
            </div>

        </div>
        </div>
    );
}

function onAfterEvent4PROD(props, moduleId, key, value,oldValue){
    //props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
    if(key === 'conversemethod'){
        if(value.value === '1'){
            props.form.setFormItemsDisabled(formid,{converstime:true});
            props.form.setFormItemsValue(formid,{converstime:{value:null,display:null}});
        }else{
            props.form.setFormItemsDisabled(formid,{converstime:false});
        }
    }else if(key === 'sfcbdx'){// 成本对象
        if(value.value){
            props.form.setFormItemsDisabled(formid,{sfcbdxtype:false});
        }else{
            props.form.setFormItemsDisabled(formid,{sfcbdxtype:true});
            props.form.setFormItemsDisabled(formid,{classfeature:true});
            props.form.setFormItemsValue(formid,{sfcbdxtype:{value:null,display:null}});
            props.form.setFormItemsValue(formid,{classfeature:{value:false,display:null}});
        }
    }else if(key === 'isuseroad'){// 核算工序成本
        if(value.value){
            props.form.setFormItemsDisabled(formid,{azcbzxtjcl:false});
        }else{
            props.form.setFormItemsDisabled(formid,{azcbzxtjcl:true});
            props.form.setFormItemsValue(formid,{azcbzxtjcl:{value:true,display:null}});
        }
    }else if(key === 'sffzfw'){// 辅助服务
        if(value.value){
            props.form.setFormItemsDisabled(formid,{sfcbdxtype:true});
            props.form.setFormItemsValue(formid,{sfcbdxtype:{value:'Sys001',display:'品种'}});
        }else{
            props.form.setFormItemsDisabled(formid,{sfcbdxtype:false});
        }
    }else if(key === 'sfcbdxtype'){//// 成本对象类型
        let meta = props.meta.getMeta();
        if(value.value === 'Sys004'){
            meta['producecost'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_marcostclass'){
                    meta['producecost'].items[index].queryCondition={
                        finalcostobj : 'Y',
                        pk_org:props.form.getFormItemsValue(formid,'pk_org').value,
                        TreeRefActionExt:'nccloud.web.uapbd.material.action.MaterialCostClassTreeRefExt'
                    }
                }
            });
            if(props.form.getFormItemsValue(formid,'sfcbdx') && props.form.getFormItemsValue(formid,'sfcbdx')){
                props.form.setFormItemsDisabled(formid,{classfeature:false});
            }else{
                props.form.setFormItemsDisabled(formid,{classfeature:true});
            }
            props.form.setFormItemsDisabled(formid,{costvalutasst2:true,costvalutasst3:true,costvalutasst4:true,costvalutasst5:true,costvalutasst6:true,costvalutasst7:true,costvalutasst8:true,costvalutasst9:true,costvalutasst10:true,costvalutasst11:true,costvalutasst12:true,costvalutasst13:true,costvalutasst14:true,costvalutasst15:true,costvalutasst100:true});
        }else{
            meta['producecost'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_marcostclass'){
                    meta['producecost'].items[index].queryCondition={
                        finalcostobj : 'N',
                        pk_org:props.form.getFormItemsValue(formid,'pk_org').value,
                        TreeRefActionExt:'nccloud.web.uapbd.material.action.MaterialCostClassTreeRefExt'
                    }
                }
            });
            props.form.setFormItemsDisabled(formid,{classfeature:true});
            props.form.setFormItemsDisabled(formid,{costvalutasst2:false,costvalutasst3:false,costvalutasst4:false,costvalutasst5:false,costvalutasst6:false,costvalutasst7:false,costvalutasst8:false,costvalutasst9:false,costvalutasst10:false,costvalutasst11:false,costvalutasst12:false,costvalutasst13:false,costvalutasst14:false,costvalutasst15:false,costvalutasst100:false});
        }
        //NCCLOUD-164011 [物料]轻量端中，物料生产信息页签，修改或清空成本分类后，应取消勾选“分类特征物料”
        props.form.setFormItemsValue(formid,{'pk_marcostclass':{display:"",value:""},'classfeature':{display:"",value:false}});
    }else if(key === "pk_marcostclass"){
        //值修改时，取消勾选“分类特征物料”
        props.form.setFormItemsValue(formid,{'classfeature':{display:"",value:false}});
    }
}

function onButtonClick4PROD(props,id) {
    switch(id){
        case 'prod_edit':
            let node_typep = props.config.node_type;
            let pk_orgp =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_groupp =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typep=='ORG_NODE'&&pk_orgp==pk_groupp){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            let meta = props.meta.getMeta();
            meta['prod_base'].items.forEach(item=>{
                if(item.attrcode === 'pk_prodeptdoc'){
                    item.queryCondition = {
                        busifuncode:'fa',
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }else if(item.attrcode === 'pk_propsndoc'){
                    item.queryCondition = {
                        busifuncode:'fa',
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }
            });
            meta['producecost'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_marcostclass'){
                    let sfcbdxtype = props.form.getFormItemsValue(formid,'sfcbdxtype');
                    if(sfcbdxtype && sfcbdxtype.value === 'Sys004'){
                        meta['producecost'].items[index].queryCondition={
                            finalcostobj : 'Y',
                            pk_org:props.form.getFormItemsValue(formid,'pk_org').value,
                            TreeRefActionExt:'nccloud.web.uapbd.material.action.MaterialCostClassTreeRefExt'
                        }
                    }else{
                        meta['producecost'].items[index].queryCondition={
                            finalcostobj : 'N',
                            pk_org:props.form.getFormItemsValue(formid,'pk_org').value,
                            TreeRefActionExt:'nccloud.web.uapbd.material.action.MaterialCostClassTreeRefExt'
                        }
                    }
                }else if(item.attrcode === 'disbearfactory'){
                    meta['producecost'].items[index].queryCondition={
                        pk_fianaceorg:props.form.getFormItemsValue(formid,'pk_org').value,
                        pk_org:props.form.getFormItemsValue('material','pk_org').value,
                        GridRefActionExt:'nccloud.web.uapbd.material.action.DisbearFactiorRefExt'
                    }
                }
            });
            props.meta.setMeta(meta);
            props.form.setFormStatus(formid,'edit');
            updateModalButton(props,'prod','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            if(props.form.getFormItemsValue(formid,'conversemethod').value === '1'){
                props.form.setFormItemsDisabled(formid,{converstime:true});
            }else{
                props.form.setFormItemsDisabled(formid,{converstime:false});
            }
            if(props.form.getFormItemsValue(formid,'sfcbdx').value){//成本对象
                props.form.setFormItemsDisabled(formid,{sfcbdxtype:false});
                if(props.form.getFormItemsValue(formid,'sfcbdxtype').value === 'Sys004'){
                    props.form.setFormItemsDisabled(formid,{classfeature:false});
                }else{
                    props.form.setFormItemsDisabled(formid,{classfeature:true});
                }
            }else{
                props.form.setFormItemsDisabled(formid,{sfcbdxtype:true});
                props.form.setFormItemsDisabled(formid,{classfeature:true});
            }
            if(props.form.getFormItemsValue(formid,'isuseroad').value){
                props.form.setFormItemsDisabled(formid,{azcbzxtjcl:false});
            }else{
                props.form.setFormItemsDisabled(formid,{azcbzxtjcl:true});
            }
            break;
        case 'prod_cancel':
            promptBox({
                color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000014')/* 国际化处理： 确认取消*/,                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                content: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000015')/* 国际化处理： 是否确认要取消？*/,             // 提示内容,非必输
                noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                beSureBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016')/* 国际化处理： 确定*/,          // 确定按钮名称, 默认为"确定",非必输
                cancelBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/,           // 取消按钮名称, 默认为"取消",非必输
                focusBody:false,
                beSureBtnClick: () => {
                    props.form.cancel(formid);
                    updateModalButton(props,'prod','browse');
                }
            });
            break;
        case 'prod_save':
            let formValues = props.form.getAllFormValue(formid);
            let data = {
                pageid:props.config.pagecodeValues['prod'],
                model : {
                    areacode : formid,
                    areaType : 'form',
                    rows : formValues.rows
                }
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialprod.do',
                    data:data,
                    success : (res) => {
                        let {success,data} = res;
                            if(success){
                                let _prod_table_data = props.cardTable.getAllRows('prod');
                                _prod_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).prod){
                                        _prod_table_data[index] = data.head.materialprod.rows[0];
                                    }
                                });
                                props.button.setButtonsVisible({ prod_edit : true, prod_delete : true});
                                props.cardTable.setTableData('prod',_prod_table_data);
                                props.modal.close('prodmodal');
                                
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            }
                    }
                });
            }
            props.validateToSave(data,saveFunction,{'materialprod':'form'},'form');
            break;
        case 'prod_delete':
            promptBox({
                color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                title: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000046')/* 国际化处理： 确认删除*/,                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                content: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000090')/* 国际化处理： 确认删除该数据吗？*/,             // 提示内容,非必输
                noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                beSureBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016')/* 国际化处理： 确定*/,          // 确定按钮名称, 默认为"确定",非必输
                cancelBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/,           // 取消按钮名称, 默认为"取消",非必输
                beSureBtnClick: () => {
                    ajax({
                        url : '/nccloud/uapbd/material/delMaterialprod.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_materialprod').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('prod',getDefData('cacheRowid',props.config.datasource).prod);
                                props.modal.close('prodmodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'prod_refresh':
            let pk = props.form.getFormItemsValue(formid,'pk_materialprod');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialprod.do',
                data : {
                    pk : pk.value,
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
                        let _prod_table_data = props.cardTable.getAllRows('prod');
                        _prod_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).prod){
                                _prod_table_data[index] = data.head.materialprod.rows[0];
                                _prod_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).prod;
                            }
                        });
                        props.cardTable.updateTableData('prod',_prod_table_data);
                        props.form.setAllFormValue({
                            'materialprod' : {
                                areacode : "materialprod",
                                rows : [{
                                    status : "0",
                                    values : data.head.materialprod.rows[0].values
                                }]
                            }
                        });
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                    }
                }
            });
            break;
        case 'prod_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_materialprod');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['prod'],
                {
                    funcode : props.config.printcard.prod.funcode,
                    nodekey : props.config.printcard.prod.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'prod_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_materialprod');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['prod'];
            this.state.printConfig.funcode = this.config.printcard.prod.funcode;
            this.state.printConfig.nodekey = this.config.printcard.prod.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}
//E/17ql676j8DAc4ea6TORh3h+/XZVzxMlQNkIEIJ9BowL6mPsT1jeo5P14V0OJrw