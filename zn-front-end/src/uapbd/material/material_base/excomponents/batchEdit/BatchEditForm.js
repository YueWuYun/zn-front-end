//Jt+6kHWNgkqsbBzAWvFn5iFPVpyBfvW28kWyHdcoqOGvhTDREeUFbFGVloALtg6n
/**
 * 批改属性选择
 * @author yinshb
 */
import React, { Component } from 'react';
import {base,ajax,toast } from 'nc-lightapp-front';
import BatchEditAttrRefer from '../../../../public/pubComponent/batchEditRefer/BatchEditAttrRefer';
let { NCTable,NCSelect, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCFormControl,NCSetColBtn,NCForm  } = base;
const NCOption = NCSelect.NCOption;
const NCFormItem = NCForm.NCFormItem;
import './BatchEditForm.less';

const formid = 'batchupdate';
const specialForm = 'special';

class Batcheditform extends Component {
    constructor(props) {
        super(props);
        this.tableItems = props.tableItems;
        this.state = {
            table: {
                main: this,
                rowKey: 'id',
                columns: [{
                    title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000154')/* 国际化处理： 编码*/,
                    dataIndex: 'code',
                    width: '50%'
                }, {
                    title: this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000155')/* 国际化处理： 名称*/,
                    dataIndex: 'name',
                    width: '50%'
                }]
            },
            tableData : [],
            pk_group:"",
            isSingle:true,
            itemModal : {
                show: false,
                modalDropup: true,
                size: 'xlg'
            },
            allAttrs : [],
            selectItemCode : [],
            currTabKey:'',
            selectItemName:'',
            isCreateForm : false,
            hasSpecial : false,
            specialItem : {},
            propVal:{},
            pk_batchupdatetab : '',
            json : {
                "batchedit-000000":this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('batchedit-000000')/* 国际化处理： 批改属性*/,
                "batchedit-000001":this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('batchedit-000001')/* 国际化处理： 名称*/
            }
        };
        this.props.meta.removeMeta(formid);
    }
    // hasPerm = (hasPermOrg,orgs) => {
    //     for(let i=0;i<orgs.length;i++){
    //         if(hasPermOrg.indexOf(orgs[i]) === -1){
    //             return false;
    //         }
    //     }
    //     return true;
    // }
    /**
     * 组织页签选择节点内容
     */
    getTabOption = () => {
        let option = [];
        Object.keys(this.tableItems).forEach(item => {
            option.push(<NCOption value={this.tableItems[item].code}>{this.tableItems[item].name}</NCOption>)
        });
        return option;
    }

    /**
     * 页签选择改变事件
     */
    TabChange = (value) => {
        let specialItem = this.tableItems[value].special;
        let AppCode =this.props.getAppCode();
        if(specialItem){
            switch (value){
                case 'fi_info':
                    specialItem.queryCondition = {
                        AppCode : AppCode,
                        orgType : 'FINANCEORGTYPE000000',
                        TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
                case 'pu_info':
                    specialItem.queryCondition = {
                        AppCode : AppCode,
                        orgType : 'PURCHASEORGTYPE00000',
                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
                case 'stock_info':
                    specialItem.queryCondition = {
                        AppCode : AppCode,
                        orgType : 'STOCKORGTYPE00000000',
                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
                case 'sale_info':
                    specialItem.queryCondition = {
                        AppCode : AppCode,
                        orgType : 'SALEORGTYPE000000000',
                        TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
                case 'prod_info':
                    specialItem.queryCondition = {
                        AppCode : AppCode,
                        orgType : 'FACTORYTYPE000000000',
                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
                case 'cost_info':
                    specialItem.queryCondition = {
                        AppCode : AppCode,
                        orgType : 'COSTREGION0000000000',
                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
                case 'plan_info':
                    specialItem.queryCondition = {
                        tab : 'plan_info',
                        AppCode : AppCode,
                        orgType : 'STOCKPLANTYPE0000000',
                        TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
                case 'pfc_info':
                    specialItem.queryCondition = {
                        AppCode : AppCode,
                        orgType : 'LIACENTERTYPE0000000',
                        TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
                case 'pfcc_info':
                    specialItem.queryCondition = {
                        AppCode : AppCode,
                        orgType : 'LIACTCOSTRG000000000',
                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                    }
                    break;
            }
        }
        // let nodetype =this.props.config.node_type;
        // let orgs = this.props.orgs;
        // let pks = this.props.pks;
        // let pk_group = this.props.pk_group;
        // let hasPermOrg =this.props.hasPermOrg;
        // if(value&&value=='base_info'&&nodetype=='ORG_NODE'&&!this.hasPerm(hasPermOrg,orgs)){
            
        //     toast({color:"warning",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000152')/* 国际化处理： 出错啦！*/,content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000161')/* 国际化处理： 业务单元节点不允许操作集团物料的基本信息*/});
        // }else{
            this.setState({
                allAttrs : this.tableItems[value].attrs,
                selectItemCode : [],
                pk_batchupdatetab : this.tableItems[value].pk_batchupdatetab,
                propVal : {},
                currTabKey : value,
                selectItemName : '',
                specialItem : specialItem,
                hasSpecial : this.tableItems[value].special?true:false,
                tableData:[]
            },()=>{
            //清空表体
            let meta = this.props.meta.getMeta();
            meta[formid] = {
                code : formid,
                moduletype : 'form',
                items : []
            };
            meta[specialForm] = {
                code : specialForm,
                moduletype : 'form',
                items : this.state.hasSpecial?[this.state.specialItem]:[]
            };
            this.props.meta.setMeta(meta,()=>{this.props.form.setFormStatus(specialForm,'edit');this.props.form.EmptyAllFormValue(specialForm);});
            });
            
        }
        
        
    //}

    /**
     * 打开选择修改属性modal
     */
    openSelectItemModal = () => {
        if(this.state.allAttrs.length === 0){
            toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000103')/* 国际化处理： 请先选择属性所在页签*/});
            return;
        }
        this.state.itemModal.show = true;
        this.setState(this.state);
    }

    onAfterEvent = (props, moduleId, key, value,oldValue) => {
        //props, moduleId(区域id), key(操作的键), value（当前值），oldValue(旧值)
        let data = [];
        ajax({
            url:"/nccloud/uapbd/material/querygroupid.do",
            data:{},
            success: (res)=>{
                let {success} = res;
                if(success){
                    console.log(res.data);
                    
                    this.setState({pk_group:res.data});
                    if(data){
                        let num =0;
                        for(let i=0;i<data.length;i++){
                            if(data[i].id===this.state.pk_group){
                                num++;
                            }
                        }
                        if(num>0||data.length>1){
                            this.state.isSingle=false;
                        }else{
                            this.state.isSingle=true;
                        }
                    }
                }
            }
        });
        if(value.value && value.value !== ''){
            let values = value.value.split(',');
            let displays = value.display.split(',');
            values.forEach((v,index)=>{
                data.push({
                    id: v,
                    code: value[index].refcode,
                    name: value[index].refname
                });
            })
        }
        this.state.tableData = data;
        
        ////////////////////////////////////////
        this.state.selectItemCode = [];
        this.state.isCreateForm = false;
        this.state.propVal = [];
        let meta = this.props.meta.getMeta();
        meta[formid] = {
            code : formid,
            moduletype : 'form',
            items : []
        }
        this.props.meta.setMeta(meta,()=>{this.setState(this.state)});
        ////////////////////////////////////////
    }

    /**
     * 批改属性表单区域编辑后事件
     */
    onValueFormAfterEvent = (props, moduleId, key, value,oldValue) => {
        if(this.state.currTabKey === 'stock_info' && key === 'isretfreeofchk'){//库存信息页签下的销售退货免检
            if(value.value){
                this.props.form.setFormItemsValue(formid,{isretinstobychk:{value:false,display:'否'}});
                this.props.form.setFormItemsDisabled(formid,{isretinstobychk:true});
            }else{
                this.props.form.setFormItemsDisabled(formid,{isretinstobychk:false});
            }
        }else if(this.state.currTabKey === 'plan_info' && key === 'fixcombinreqday'){//计划信息页签下的合并需求日
            if(value.value == ''){
                this.props.form.setFormItemsValue(formid,{fixcombinreqday:{value:null,display:''}});
            }
        }else if(this.state.currTabKey == 'base_info' && key === 'materialmgt'){
            console.log(value);
            if(value && value.value && value != ''){
                this.props.form.setFormItemsValue(formid,{discountflag:{value:false},fee:{value:false}});
                this.props.form.setFormItemsDisabled(formid,{discountflag:true,fee:true});
            }else{
                this.props.form.setFormItemsDisabled(formid,{discountflag:false,fee:false});
            }
        }
    }

    /**
     * 选择完成要修改的属性，点击确定事件
     */
    AttrRefonChange = (value) => {
        console.log('value',value);
        console.log(this.state.currTabKey);
        //////////////////////////////////////////////////////////////////
        //开始提示
        /////////////////////////////////////////////////////////////////
        if(this.state.currTabKey == 'base_info'){//基本信息页签
            value.forEach(item => {
                if(item.refcode == 'pk_marbasclass'){//物料分类
                    toast({color:"warning",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000152')/* 国际化处理： 警告*/,content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000153')/* 国际化处理： 总账的存货科目如果使用物料分类做辅助核算，修改物料分类可能导致总账与存货核算对账不平，请谨慎操作！*/});
                }
            });
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.state.propVal = value;
        let items = [];
        let _items = [];
        this.tableItems[this.state.currTabKey].attrItems.forEach(item=>{
            value.forEach(code=>{
                if(code.refcode === item.attrcode && _items.indexOf(item.attrcode) === -1){
                    if(item.attrcode == 'pk_marbasclass'){//物料分类
                        item.isShowUnit = true;
                    }
                    if(this.state.tableData.length === 1){
                        if(item.attrcode == 'pk_stordoc' || item.attrcode === 'pk_cumandoc'){
                            item.queryCondition = {
                                pk_org : this.state.tableData[0].id
                            }
                        }else if(item.attrcode == 'pk_prodeptdoc' || item.attrcode == 'pk_propsndoc'){
                            item.queryCondition = {
                                pk_org : this.state.tableData[0].id
                            }
                        }
                    }
                    items.push(item);
                    _items.push(item.attrcode);
                }
                if(code.values.relatedattr && code.values.relatedattr.value){
                    let relatedattr = code.values.relatedattr.value.split(',');
                    relatedattr.forEach(attr=>{
                        if(item.attrcode === attr && _items.indexOf(attr) === -1){
                            items.push(item);
                            _items.push(attr);
                        }
                    });
                }
            });
        });
        let selectItemCode = [];
        value.forEach(code=>{
            selectItemCode.push(code.refcode);
            if(code.values.relatedattr && code.values.relatedattr.value){
                let relatedattr = code.values.relatedattr.value.split(',');
                selectItemCode = selectItemCode.concat(relatedattr);
            }
        });
        this.state.selectItemCode = selectItemCode;
        this.state.isCreateForm = true;
        let meta = this.props.meta.getMeta();
        meta[formid] = {
            code : formid,
            moduletype : 'form',
            items : items
        }
        this.props.meta.setMeta(meta,()=>{this.setState(this.state)});
        this.props.form.setFormStatus(formid,'edit');
        
    }

    /* selectItemFinish = () => {
        let n = '';
        this.state.selectItemCode.forEach(code=>{
            this.state.allAttrs.forEach(attr=>{
                if(attr.code === code){
                    if(n === ''){
                        n += attr.name;
                    }else{
                        n += ',' + attr.name;
                    }
                }
            });
        });
        let items = [];
        this.tableItems[this.state.currTabKey].attrItems.forEach(item=>{
            this.state.selectItemCode.forEach(code=>{
                if(code === item.attrcode){
                    items.push(item);
                }
            });
        });
        this.state.itemModal.show = false;
        this.state.selectItemName = n;
        this.state.isCreateForm = true;
        ///////////////////////////////
        let meta = this.props.meta.getMeta();
        meta[formid] = {
            code : formid,
            moduletype : 'form',
            items : items
        }
        this.props.meta.setMeta(meta,()=>{this.setState(this.state)});
        this.props.form.setFormStatus(formid,'edit');
    } */

    /**
     * 组织能够修改的属性内容
     */
    getCheckBoxItem = () => {
        let boxes = [];
        this.state.allAttrs.forEach(attr=>{
            boxes.push(<div><NCCheckbox checked={this.state.selectItemCode.indexOf(attr.code)!==-1} onChange={(value)=>{this.changeCheck(value,attr.code)}}>{attr.name}</NCCheckbox></div>);
            });
        return boxes;
    }

    /**
     * 修改属性选择改变事件
     * @param {*} value 
     * @param {*} key 
     */
    changeCheck (value,key){
        if(value){
            this.state.selectItemCode.push(key);
        }else{
            this.state.selectItemCode.remove(key);
        }
        this.setState(this.state);
    }

    getData = () => {
        if(this.state.allAttrs.length === 0){
            toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000104')/* 国际化处理： 属性所在页签不能为空*/});
            return false;
        }
        if(this.state.selectItemCode.length === 0){
            toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000106')/* 国际化处理： 修改属性不能为空*/});
            return false;
        }
        let returnData = {};
        returnData.currTabKey = this.state.currTabKey;
        if(this.state.hasSpecial){
            let specialValue = this.props.form.getFormItemsValue(specialForm,this.state.specialItem.attrcode);
            if(!specialValue || !specialValue.value || specialValue.value === ''){
                toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000105',{name:this.state.specialItem.label})/* 国际化处理： {name}不能为空*/});
                return false;
            }else{
                returnData.selectedOrgs = specialValue.value.split(',');
            }
        }
        if(this.state.propVal.length === 0){
            toast({color:"danger",title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000003')/* 国际化处理： 出错啦！*/,content:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000106')/* 国际化处理： 修改属性不能为空*/});
            return false;
        }
        let isCheck = this.props.form.isCheckNow(formid);
        if(!isCheck){
            return false;
        }else{
            returnData.attrs = this.state.selectItemCode;
            returnData.attrValues = this.props.form.getFormItemsValue(formid,this.state.selectItemCode);
        }
        return returnData;
    }

    render(){

        return (
            <div className="BatchEditForm nc-theme-gray-area-bgc">
                <div style={{display:'flex'}}>
                    <div className="inline-block-area" style={{display: 'flex',width: 'auto'}}>
                        <div className="input-title nc-theme-form-label-c" style={{marginTop: 3}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000107')/* 国际化处理： 批改属性所在页签*/}</div>
                        <div className="input-class">
                            <NCSelect fieldid = 'orgsel' style={{ width: 200, marginRight: 6 }} onChange={this.TabChange} >
                              {this.getTabOption()}
                            </NCSelect>
                        </div>
                    </div>
                </div>
                <div className="org-class" style={this.state.currTabKey == 'pfcc_info' ? {marginBottom: 10,marginLeft: 0}:{marginBottom: 10}}>
                    {this.state.hasSpecial && this.props.form.createForm(specialForm,{onAfterEvent:this.onAfterEvent,isNoStandard:true})}
                </div>
                <div style={{display:'flex'}}>
                    <div className="inline-block-area" style={{display: 'flex',width: 'auto'}}>
                        <div className="input-title nc-theme-form-label-c" style={{marginTop: 3}}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000108')/* 国际化处理： 批改属性*/}</div>
                        <div className="input-class" style={{marginTop: 0}}>
                            {BatchEditAttrRefer({
                                    fieldid:'BatchEditAttrRefer',
                                    json : this.state.json,
                                    value:this.state.propVal,
                                    onChange: this.AttrRefonChange,
                                    queryCondition: () => {
                                        return {
                                            //选择组织的个数查到的批改属性不一样
                                            NODE_TYPE:this.props.config.NODE_TYPE,
                                            checkedOrgLenth: this.props.oprFlag === 'directEdit' && this.state.currTabKey === 'base_info' ?this.props.hasPermOrg.length :(this.state.isSingle)?1: this.state.tableData.length+1,
                                            pk_batchupdatetab: this.state.pk_batchupdatetab,
                                            oprFlag:this.props.oprFlag,
                                            batchUpdateForm:'material',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.BatchEditAttrRefExt'
                                        }
                                    }
                                })}
                        </div>
                    </div>
                </div>
                <div>
                    {this.state.hasSpecial && (<NCTable {...this.state.table} data={this.state.tableData} {...{
                            bodyStyle: {'overflow-y': 'auto', height: '180px'},
                            useFixedHeader: true
                    }}>
                    </NCTable>)}
                </div>
                
                <div>
                    {this.state.isCreateForm && this.props.form.createForm(formid,{onAfterEvent: this.onValueFormAfterEvent})}
                </div>

                <NCModal {...this.state.itemModal} fieldid={'batchEditForm'}>
                    <NCModal.Header closeButton={false}>
                        <NCModal.Title>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-0000108')/* 国际化处理： 批改属性*/}</NCModal.Title>
                    </NCModal.Header>
                    <NCModal.Body>
                    </NCModal.Body>
                    <NCModal.Footer>
                        <div style={{maxHeight:'400px'}}>{this.getCheckBoxItem()}</div>
                        <span><NCButton fieldid={'sure'} onClick={ this.selectItemFinish}>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000016')/* 国际化处理： 确定*/}</NCButton></span>
                        <NCButton fieldid={'cannel'} onClick={ ()=>{this.state.itemModal.show=false;this.setState(this.state);} }>{this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000017')/* 国际化处理： 取消*/}</NCButton>
                    </NCModal.Footer>
                </NCModal>

                {this.props.modal.createModal('modal', {
                    color:'danger', // 值： "success"/"info"/"warning"/"danger"
                    title:this.props.MutiInit.getIntl("10140MATERIAL") && this.props.MutiInit.getIntl("10140MATERIAL").get('10140MATERIAL-000050')/* 国际化处理： 提示*/,
                    content:'',
                    beSureBtnClick: ()=>{this.props.modal.close('modal')}, 
                    cancelBtnClick: ()=>{this.props.modal.close('modal')} 
                })}
            </div>
        )
    }

}

export default Batcheditform;


//Jt+6kHWNgkqsbBzAWvFn5iFPVpyBfvW28kWyHdcoqOGvhTDREeUFbFGVloALtg6n