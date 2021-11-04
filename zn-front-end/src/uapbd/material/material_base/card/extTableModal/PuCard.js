//dGKnF2MNe6Q4vJJnwOMsh5B1GYj8gHd2H8o1Z72xKQ7P7FpdLNhksR4T2vXue4M5
/**
 * 采购信息卡片
 * @author  yinshb
 */
const formid = 'materialpu';
import { ajax, base,toast,cardCache,promptBox,print } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import updateModalButton from './updateModalButton'
export function createPuCard(props,values){
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
                        area: 'pu_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4PU.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['pu_base']
                    //onAfterEvent: this.onAfterEvent.bind(this)
                })}
            </div>

        </div>
        </div>
    );
}

function onButtonClick4PU(props,id) {
    switch(id){
        case 'pu_edit':
            let node_typep = props.config.node_type;
            let pk_orgp =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_groupp =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typep=='ORG_NODE'&&pk_orgp==pk_groupp){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.setFormStatus(formid,'edit');
            updateModalButton(props,'pu','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            let meta = props.meta.getMeta();
            meta['pu_base'].items.forEach(item=>{
                if(item.attrcode === 'pk_cumandoc'){
                    item.queryCondition = {
                        pk_org : props.form.getFormItemsValue(formid,'pk_org').value
                    }
                }
            });
            props.meta.setMeta(meta);
            break;
        case 'pu_cancel':
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
                    updateModalButton(props,'pu','browse');
                }
            });
            break;
        case 'pu_save':
            let formValues = props.form.getAllFormValue(formid);
            let data = {
                pageid:props.config.pagecodeValues['pu'],
                model : {
                    areacode : formid,
                    areaType : 'form',
                    rows : formValues.rows
                }
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialpu.do',
                    data:data,
                    success : (res) => {
                        let {success,data} = res;
                            if(success){
                                let _pu_table_data = props.cardTable.getAllRows('pu');
                                _pu_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).pu){
                                        _pu_table_data[index] = data.head.materialpu.rows[0];
                                    }
                                });
                                props.button.setButtonsVisible({ pu_edit : true, pu_delete : true});
                                props.cardTable.updateTableData('pu',_pu_table_data);
                                props.modal.close('pumodal');
                                
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                            }
                    }
                });
            }
            props.validateToSave(data,saveFunction,{'materialpu':'form'},'form');
            break;
        case 'pu_delete':
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
                        url : '/nccloud/uapbd/material/delMaterialpu.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_materialpu').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('pu',getDefData('cacheRowid',props.config.datasource).pu);
                                props.modal.close('pumodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'pu_refresh':
            if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
                props.dealFormulamsg(
                    res.formulamsg,  //参数一：返回的公式对象
                    {                //参数二：界面使用的表格类型
                        "materialpu":"form"
                    }
                );
            }
            let pk = props.form.getFormItemsValue(formid,'pk_materialpu');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialpu.do',
                data : {
                    pk : pk.value,
                    pageid : props.config.pagecodeValues['pu']
                },
                success : (res) => {
                    let { success, data} = res;
                    if(success){
                        let _pu_table_data = props.cardTable.getAllRows('pu');
                        _pu_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).pu){
                                _pu_table_data[index] = data.head.materialpu.rows[0];
                                _pu_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).pu;
                            }
                        });
                        props.cardTable.updateTableData('pu',_pu_table_data);
                        props.form.setAllFormValue({
                            'materialpu' : {
                                areacode : "materialpu",
                                rows : [{
                                    status : "0",
                                    values : data.head.materialpu.rows[0].values
                                }]
                            }
                        });
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                    }
                }
            });
            break;
        case 'pu_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_materialpu');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['pu'],
                {
                    funcode : props.config.printcard.pu.funcode,
                    nodekey : props.config.printcard.pu.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'pu_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_materialpu');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['pu'];
            this.state.printConfig.funcode = this.config.printcard.pu.funcode;
            this.state.printConfig.nodekey = this.config.printcard.pu.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}
//dGKnF2MNe6Q4vJJnwOMsh5B1GYj8gHd2H8o1Z72xKQ7P7FpdLNhksR4T2vXue4M5