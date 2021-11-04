//Q716ELHQTkztH+203VFiBsEfIlOSt4B7sAFJCCPAlQB9MNvBvPjzrT13dEqLqAyk
/**
 * 财务信息卡片
 * @author  yinshb
 */
const formid = 'materialfi';
import { ajax, base,toast,cardCache,print,promptBox } from 'nc-lightapp-front';
let {setDefData, getDefData } = cardCache;
import updateModalButton from './updateModalButton';
export function createFiCard(props,values){
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
                        area: 'fi_table_inner',
                        buttonLimit: 3, 
                         onButtonClick: onButtonClick4FI.bind(this), 
                         popContainer: document.querySelector('.u-modal-content')
        
                    })}
                </div>
            </div>
            <div className="nc-bill-form-area">
                {createForm(formid, {
                    expandArr : ['fi_base']
                    //onAfterEvent: this.onAfterEvent.bind(this)
                })}
            </div>
        </div>
        </div>
    );
}

function onButtonClick4FI(props,id) {
    switch(id){
        case 'fi_edit':
            let node_typep = props.config.node_type;
            let pk_orgp =  props.form.getFormItemsValue(formid,'pk_org').value
            let pk_groupp =  props.form.getFormItemsValue(formid,'pk_group').value;
            if(node_typep=='ORG_NODE'&&pk_orgp==pk_groupp){
                toast({content:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000013'),color:'warning'});/* 国际化处理： 组织节点只能维护当前节点有权限组织的数据！*/ 
            
                return;
            }
            props.form.setFormStatus(formid,'edit');
            updateModalButton(props,'fi','edit');
            props.form.setFormItemsDisabled(formid,{pk_org:true});
            break;
        case 'fi_cancel':
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
                    updateModalButton(props,'fi','browse');
                }
            });
            break;
        case 'fi_save':
            let formValues = props.form.getAllFormValue(formid);
            let data = {
                pageid:props.config.pagecodeValues['fi'],
                model : {
                    areacode : 'materialfi',
                    areaType : 'form',
                    rows : formValues.rows
                }
            }
            let saveFunction = () => {
                ajax({
                    url : '/nccloud/uapbd/material/saveMaterialfi.do',
                    data:data,
                    success : (res) => {
                        let {success,data} = res;
                            if(success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000089'),color:'success'});/* 国际化处理： 保存成功*/
                                let _fi_table_data = props.cardTable.getAllRows('fi');
                                _fi_table_data.forEach((item,index) => {
                                    if(item.rowid === getDefData('cacheRowid',props.config.datasource).fi){
                                        _fi_table_data[index] = data.head.materialfi.rows[0];
                                    }
                                });
                                props.button.setButtonsVisible({ fi_edit : true, fi_delete : true});
                                props.cardTable.updateTableData('fi',_fi_table_data);
                                props.modal.close('fimodal');
                                
                            }
                    }
                });
            }
            props.validateToSave(data,saveFunction,{'materialfi':'form'},'form');
            break;
        case 'fi_delete':
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
                        url : '/nccloud/uapbd/material/delMaterialfi.do',
                        data : {
                            pk : [props.form.getFormItemsValue(formid,'pk_materialfi').value],
                            ts : [props.form.getFormItemsValue(formid,'ts').value]
                        },
                        success:(res) => {
                            if(res.success){
                                toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000029')/* 国际化处理： 删除成功*/,color:'success'});
                                props.cardTable.delRowByRowId('fi',getDefData('cacheRowid',props.config.datasource).fi);
                                props.modal.close('fimodal');
                            }
                        }
                    });
                }
            });
            break;
        case 'fi_refresh':
            let pk = props.form.getFormItemsValue(formid,'pk_materialfi');
            ajax({
                url : '/nccloud/uapbd/material/queryMaterialfi.do',
                data : {
                    pk : pk.value,
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
                        let _fi_table_data = props.cardTable.getAllRows('fi');
                        _fi_table_data.forEach((item,index) => {
                            if(item.rowid === getDefData('cacheRowid',props.config.datasource).fi){
                                _fi_table_data[index] = data.head.materialfi.rows[0];
                                _fi_table_data[index].rowid = getDefData('cacheRowid',props.config.datasource).fi;
                            }
                        });
                        props.cardTable.updateTableData('fi',_fi_table_data);
                        props.form.setAllFormValue({
                            'materialfi' : {
                                areacode : "materialfi",
                                rows : [{
                                    status : "0",
                                    values : data.head.materialfi.rows[0].values
                                }]
                            }
                        });
                        toast({title:props.MutiInit.getIntl("10140MATERIAL") && props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000147'),color:'success'});/* 国际化处理： 刷新成功*/
                    }
                }
            });
            break;
        case 'fi_print':
            let _print_pk = props.form.getFormItemsValue(formid,'pk_materialfi');
            if(!_print_pk || !_print_pk.value){
                return 
            }
            print('pdf',
                props.config.printUrls['fi'],
                {
                    funcode : props.config.printcard.fi.funcode,
                    nodekey : props.config.printcard.fi.nodekey,
                    oids : [_print_pk.value]
                })
            break;
        case 'fi_output':
            let _output_pk = props.form.getFormItemsValue(formid,'pk_materialfi');
            if(!_output_pk || !_output_pk.value){
                return
            }
            this.state.printConfig.url = props.config.printUrls['fi'];
            this.state.printConfig.funcode = this.config.printcard.fi.funcode;
            this.state.printConfig.nodekey = this.config.printcard.fi.nodekey;
            this.state.oids = [_output_pk.value];
            this.setState(this.state,
            this.refs.childPrintOutput.open());
            break;
        
    }
}
//Q716ELHQTkztH+203VFiBsEfIlOSt4B7sAFJCCPAlQB9MNvBvPjzrT13dEqLqAyk