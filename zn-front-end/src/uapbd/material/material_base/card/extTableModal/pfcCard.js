//VWDNmxQcVYV/F5WE4hjcJyl3UTlxx4wt+z1Bj3XnZUtGu2w8LPReU8Ds7qLnqGN+
/**
 * 利润中心信息卡片
 * @author  yinshb
 */
const formid = 'materialpfc';
const tableid = 'materialpfcsub';
import { ajax, base,toast,cardCache,promptBox,print } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import updateModalButton from './updateModalButton'
export function createPfcCard(props,values){
    let { button,form} = props;
    let { createForm } = form;
    let { createButtonApp } = button;
    let getTableHead = ()=>{
        return (
            <div className="shoulder-definition-area">
                <div className="definition-icons">
                    {createButtonApp({
                        area: 'materialpfcsub_table_head',//按钮注册中的按钮区域
                        onButtonClick: (props,id)=>{
                            if(id==='materialpfcsub_add'){
                                props.cardTable.addRow(tableid);
                            }
                            if(id==='materialpfcsub_delete'){
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
                        area: 'pfc_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4PFC.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['pfc_base']
                    //onAfterEvent: this.onAfterEvent.bind(this)
                })}
            </div>
            <div className="nc-bill-table-area">
                {props.cardTable.createCardTable(tableid, {//列表区
                    tableHead: getTableHead,
                    useFixedHeader:true,    
                    onAfterEvent : onAfterEvent4materialpfcsub.bind(this), 
                    showIndex:true				//显示序号
                })}
            </div>
        </div>
        </div>
    );
}

function onAfterEvent4materialpfcsub(props, moduleId, key, value, changedrows, index, record,type, method){
    //props, moduleId(区域id), key(操作的键), value（当前值）, changedrows（新旧值集合）, index（当前index）, record（行数据）,type(表格内为line，弹窗为modal), method(有blur有change)
    if(key === 'pk_liabilitybook'){
        if(value.refname){
            props.cardTable.setValByKeysAndIndex(tableid,index,{
                'name' :{value: value.refname,display: value.refname}
            });
        }else{
            props.cardTable.setValByKeysAndIndex(tableid,index,{
                'name' :{value: null,display: null}
            });
        }
        
    }
}

function onButtonClick4PFC(props,id) {
    switch(id){
        case 'pfc_edit':
            let node_typep = props.config.node_type;
            let pk_orgp =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_groupp =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typep=='ORG_NODE'&&pk_orgp==pk_groupp){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.setFormStatus(formid,'edit');
            props.cardTable.setStatus(tableid,'edit');
            updateModalButton(props,'pfc','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            let meta = props.meta.getMeta();
            meta['pfc_base'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_marcostcls'){
                    meta['pfc_base'].items[index].queryCondition={
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }
            });
            meta['materialpfcsub'].items.forEach((item,index)=>{
                if(item.attrcode === 'pk_liabilitybook'){
                    meta['materialpfcsub'].items[index].queryCondition={
                        pk_relorg: props.form.getFormItemsValue(formid,'pk_org').value,
                        TreeRefActionExt : 'nccloud.web.uapbd.material.action.LiabilityBookTreeRefExt'
                    }
                }
            });
            props.meta.setMeta(meta);
            break;
        case 'pfc_cancel':
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
                    updateModalButton(props,'pfc','browse');
                    props.cardTable.resetTableData(tableid);
                    props.cardTable.setStatus(tableid,'browse');
                }
            });
            break;
        case 'pfc_save':
            let checked = props.cardTable.checkTableRequired(tableid);
            if(!checked){
                return;
            }
            let CardData = props.createMasterChildData(props.config.pagecodeValues['pfc'], formid, tableid);
            let reqData = {
                pageid : props.config.pagecodeValues['pfc'],
                head : CardData.head,
                bodys : CardData.body,
                userjson : `{ \"isSure\" : \"0\" }`
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialpfc.do',
                    data:reqData,
                    success : (res) => {
                        let {success,data} = res;
                            if(res.data && res.data.returnMsg){
                                promptBox({
                                    color: 'info',               // 提示类别默认"success"， "success"/"info"/"warning"/"danger",非必输
                                    title: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000032')/* 国际化处理： 提示信息*/,                // 提示标题, 默认不同类别下分别为："已成功"/"帮助信息"/"请注意"/"出错啦",非必输
                                    content: res.data.returnMsg,             // 提示内容,非必输
                                    noFooter: false,                // 是否显示底部按钮(确定、取消),默认显示(false),非必输
                                    noCancelBtn: false,             // 是否显示取消按钮,，默认显示(false),非必输
                                    beSureBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016')/* 国际化处理： 确定*/,          // 确定按钮名称, 默认为"确定",非必输
                                    cancelBtnName: props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/,           // 取消按钮名称, 默认为"取消",非必输
                                    beSureBtnClick:  ()=>{beSureSavePfcMaterial(props);}
                                });
                            }else{
                                let _pfc_table_data = props.cardTable.getAllRows('pfc');
                                _pfc_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).pfc){
                                        _pfc_table_data[index] = data.head.materialpfc.rows[0];
                                        _pfc_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).pfc;
                                    }
                                });
                                props.button.setButtonsVisible({ pfc_edit : true, pfc_delete : true});
                                props.cardTable.updateTableData('pfc',_pfc_table_data);
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
                                    props.cardTable.updateTableData('materialpfcsub',data.bodys.materialpfcsub);
                                }
                                props.modal.close('pfcmodal');
                                
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            }
                    }
                });
            }
            props.validateToSave(reqData,saveFunction,{'materialpfc':'form','materialpfcsub':'cardTable'},'extcard');
            break;
        case 'pfc_delete':
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
                        url : '/nccloud/uapbd/material/delMaterialpfc.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_materialpfc').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('pfc',getDefData('cacheRowid',props.config.datasource).pfc);
                                props.modal.close('pfcmodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'pfc_refresh':
            let pk = props.form.getFormItemsValue(formid,'pk_materialpfc');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialpfc.do',
                data : {
                    pk : pk.value,
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
                        let _pfc_table_data = props.cardTable.getAllRows('pfc');
                        _pfc_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).pfc){
                                _pfc_table_data[index] = data.head.materialpfc.rows[0];
                                _pfc_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).pfc;
                            }
                        });
                        props.cardTable.updateTableData('pfc',_pfc_table_data);
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
                        }else{
                            props.cardTable.setTableData('materialpfcsub',{rows:[]});
                        }
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                    }
                }
            });
            break;
        case 'pfc_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_materialpfc');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['pfc'],
                {
                    funcode : props.config.printcard.pfc.funcode,
                    nodekey : props.config.printcard.pfc.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'pfc_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_materialpfc');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['pfc'];
            this.state.printConfig.funcode = this.config.printcard.pfc.funcode;
            this.state.printConfig.nodekey = this.config.printcard.pfc.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}

/**
 * 确认保存
 */
function beSureSavePfcMaterial(props){
    let CardData = props.createMasterChildData(props.config.pagecodeValues['pfc'], formid, tableid);
    let reqData = {
        pageid : props.config.pagecodeValues['pfc'],
        head : CardData.head,
        bodys : CardData.body,
        userjson : `{ \"isSure\" : \"1\" }`
    }
    ajax({
        url : '/nccloud/uapbd/material/saveMaterialpfc.do',
        data:reqData,
        success : (res) => {
            let {success,data} = res;
            let _pfc_table_data = props.cardTable.getAllRows('pfc');
            _pfc_table_data.forEach((item,index) => {
                if(item.rowid === getDefData('cacheRowid',props.config.datasource).pfc){
                    _pfc_table_data[index] = data.head.materialpfc.rows[0];
                    _pfc_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).pfc;
                }
            });
            props.cardTable.updateTableData('pfc',_pfc_table_data);
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
                props.cardTable.updateTableData('materialpfcsub',data.bodys.materialpfcsub);
            }
            props.modal.close('pfcmodal');
        }
    });
}
//VWDNmxQcVYV/F5WE4hjcJyl3UTlxx4wt+z1Bj3XnZUtGu2w8LPReU8Ds7qLnqGN+