//GgM0V17TrM/OleQX9jR0rsH1hMmOiibFKb5m6yf1zTlK1o35rdhHgfMeOfkns4eU
/**
 * 计划信息卡片
 * @author  yinshb
 */
const formid = 'materialplan';
const tableid = 'materialrepl';
import { ajax, base,toast,cardCache,promptBox,print } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import updateModalButton from './updateModalButton'
export function createPlanCard(props,values){
    let { button,form} = props;
    let { createForm } = form;
    let { createButtonApp } = button;
    let getTableHead = () => {
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'materialrepl_table_head',//按钮注册中的按钮区域
                        onButtonClick: (props,id)=>{
                            if(id==='materialrepl_add'){
                                props.cardTable.addRow(tableid);
                            }
                            if(id==='materialrepl_delete'){
                                let index =props.cardTable.getCurrentIndex(tableid);
                                props.cardTable.delRowsByIndex(tableid,index);
                            }
                        }
                    })}
                </div>	
            </div>
        )
    }
    return (
        <div style={{maxHeight:'400px'}}>
        <div className="nc-bill-card">
            <div className="nc-bill-header-area">
                <div className="header-title-search-area"></div>
                <div className="header-button-area">
                    {createButtonApp({
                        area: 'plan_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4PLAN.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['plan_base','plan_marasst'],
                    onAfterEvent : onAfterEvent4PLAN
                })}
            </div>
            <div className="nc-bill-table-area">
                {props.cardTable.createCardTable(tableid, {//列表区
                    tableHead: getTableHead,
                    useFixedHeader:true,    
                    onAfterEvent : onAfterEvent4materialrepl.bind(this), 
                    showIndex:true				//显示序号
                })}
            </div>
        </div>
        </div>
    );
}

function onAfterEvent4materialrepl(props, moduleId, key, value, changedrows, index, record,type, method){
    //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, index（当前index）, record（行数据）,type(表格内为line，弹窗为modal), method(有blur有change)
    if(key === 'pk_replace'){
        if(value.values){
            props.beforeUpdatePage()
            props.cardTable.setValByKeysAndIndex(tableid,index,{
                'version' :{value:value.values.version.value,display:value.values.version.value}
            });
            props.cardTable.setValByKeyAndRowId(moduleId, record.rowid, 'substituterate', {value: '1/1',display:'1/1'});
            props.updatePage(null,tableid)
        }else{
            props.cardTable.setValByKeysAndIndex(tableid,index,{
                'version' :{value: null,display: null},
            });
        }
    }else if(key=='substituterate'){
        if(!value || value === ''){
            return;
        }
        var reg = new RegExp('^([1-9]+\\d*)/([1-9]+\\d*)$');
        if(!reg.test(value)){
            toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000011')/* 国际化处理： 请录入分数，例如‘1/2’，/两侧为大于0的数值！*/,color:'warning',title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/});
            props.cardTable.setValByKeyAndRowId(moduleId, record.rowid, 'substituterate', {value: '',display:''});
        }
    }
}


function onAfterEvent4PLAN(props, moduleId, key, value,oldValue){
    //props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
    if(key === 'combineflag'){
        if(value.value){
            props.form.setFormItemsDisabled(formid,{materialreqcombintype:false,reqcombmoment:false,fixcombinreqday:false,numofcombindays:true});
        }else{
            props.form.setFormItemsDisabled(formid,{materialreqcombintype:true,reqcombmoment:true,fixcombinreqday:true,numofcombindays:true});
            props.form.setFormItemsValue(formid,{materialreqcombintype:{value:null,display:null},reqcombmoment:{value:null,display:null},fixcombinreqday:{value:null,display:null},numofcombindays:{value:null,display:null}});
        }
    }else if(key === 'materialreqcombintype'){
        if(value.value === '2'){
            props.form.setFormItemsValue(formid,{fixcombinreqday:{value:'1',display:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000092')/* 国际化处理： 需求首日*/}});
            props.form.setFormItemsDisabled(formid,{fixcombinreqday:true});
        }else{
            props.form.setFormItemsDisabled(formid,{fixcombinreqday:false});
            props.form.setFormItemsValue(formid,{fixcombinreqday:{value:'1',display:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000092')/* 国际化处理： 需求首日*/}});
        }
    }else if(key === 'reqcombmoment'){
        if(value.value){
            props.form.setFormItemsDisabled(formid,{numofcombindays:false});
        }else{
            props.form.setFormItemsDisabled(formid,{numofcombindays:true});
            props.form.setFormItemsValue(formid,{numofcombindays:{value:null,display:null}});
        }
    }
}

function onButtonClick4PLAN(props,id) {
    switch(id){
        case 'plan_edit':
            let node_typep = props.config.node_type;
            let pk_orgp =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_groupp =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typep=='ORG_NODE'&&pk_orgp==pk_groupp){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.setFormStatus(formid,'edit');
            props.cardTable.setStatus(tableid,'edit');
            updateModalButton(props,'plan','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            
            if(props.form.getFormItemsValue(formid,'combineflag').value){
                if(props.form.getFormItemsValue(formid,'materialreqcombintype').value === '2'){
                    props.form.setFormItemsDisabled(formid,{materialreqcombintype:false,reqcombmoment:false,fixcombinreqday:true});
                }else{
                    props.form.setFormItemsDisabled(formid,{materialreqcombintype:false,reqcombmoment:false,fixcombinreqday:false});
                }
                if(props.form.getFormItemsValue(formid,'reqcombmoment').value){
                    props.form.setFormItemsDisabled(formid,{numofcombindays:false});
                }else{
                    props.form.setFormItemsDisabled(formid,{numofcombindays:true});
                }
            }else{
                props.form.setFormItemsDisabled(formid,{materialreqcombintype:true,reqcombmoment:true,fixcombinreqday:true,numofcombindays:true});
            }
            let meta = props.meta.getMeta();
            meta['plan_base'].items.forEach((item,index)=>{
                if(item.attrcode === 'planstrategygroup'){
                    meta['plan_base'].items[index].queryCondition={
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }else if(item.attrcode === 'pk_prodfactory'){
                    meta['plan_base'].items[index].queryCondition={
                        AppCode : '10140MAO',
                        orgType : 'FACTORYTYPE000000000',
                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                }
            });
            meta['materialrepl'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_replace'){
                    meta['materialrepl'].items[index].queryCondition={
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }
            });
            props.meta.setMeta(meta);
            break;
        case 'plan_cancel':
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
                    updateModalButton(props,'plan','browse');
                    props.cardTable.resetTableData(tableid);
                    props.cardTable.setStatus(tableid,'browse');
                }
            });
            break;
        case 'plan_save':
            let checked = props.cardTable.checkTableRequired(tableid);
            if(!checked){
                return;
            }
            let CardData = props.createMasterChildData(props.config.pagecodeValues['plan'], formid, tableid);
            let reqData = {
                pageid : props.config.pagecodeValues['plan'],
                head : CardData.head,
                bodys : CardData.body
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialplan.do',
                    data:reqData,
                    success : (res) => {
                        let {success,data} = res;
                            if(success){
                                let _plan_table_data = props.cardTable.getAllRows('plan');
                                _plan_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).plan){
                                        _plan_table_data[index] = data.head.materialplan.rows[0];
                                        _plan_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).plan;
                                    }
                                });
                                props.button.setButtonsVisible({ plan_edit : true, plan_delete : true});
                                props.cardTable.updateTableData('plan',_plan_table_data);
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
                                    props.cardTable.updateTableData('materialrepl',data.bodys.materialrepl);
                                }
                                props.modal.close('planmodal');
                                
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            }
                    }
                });
            }
            props.validateToSave(reqData,saveFunction,{'materialplan':'form','materialrepl':'cardTable'},'extcard');
            break;
        case 'plan_delete':
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
                        url : '/nccloud/uapbd/material/delMaterialplan.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_materialplan').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('plan',getDefData('cacheRowid',props.config.datasource).plan);
                                props.modal.close('planmodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'plan_refresh':
            let pk = props.form.getFormItemsValue(formid,'pk_materialplan');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialplan.do',
                data : {
                    pk : pk.value,
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
                        let _plan_table_data = props.cardTable.getAllRows('plan');
                        _plan_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).plan){
                                _plan_table_data[index] = data.head.materialplan.rows[0];
                                _plan_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).plan;
                            }
                        });
                        props.cardTable.updateTableData('plan',_plan_table_data);
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
                        }else{
                            props.cardTable.setTableData('materialrepl',{rows:[]});
                        }
                    }
                    toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                }
            });
            break;
        case 'plan_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_materialplan');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['plan'],
                {
                    funcode : props.config.printcard.plan.funcode,
                    nodekey : props.config.printcard.plan.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'plan_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_materialplan');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['plan'];
            this.state.printConfig.funcode = this.config.printcard.plan.funcode;
            this.state.printConfig.nodekey = this.config.printcard.plan.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}
//GgM0V17TrM/OleQX9jR0rsH1hMmOiibFKb5m6yf1zTlK1o35rdhHgfMeOfkns4eU