//cVIIr22oNYWqeOjlb0Zr54nyn2RdWpNyW6ltYdOF+92njUty/gA52anf9YSNoIWk

import React, { Component } from 'react';
import { ajax, base,toast,getBusinessInfo,getMultiLang } from 'nc-lightapp-front';
import BatchEditAttrRefer from '../../../public/pubComponent/batchEditRefer/BatchEditAttrRefer';
import CostRegionDefaultGridRef from '../../../refer/org/CostRegionDefaultGridRef/index';//成本域
import FinanceOrgTreeRef from '../../../refer/org/FinanceOrgTreeRef/index';//财务组织
import LiabilityCenterOrgTreeRef from '../../../refer/org/LiabilityCenterOrgTreeRef/index';//利润中心 
import LiactCostrgGridRef from '../../../refer/riaorgbd/LiactCostrgDefaultGridRef/index';//利润中心成本域
import BusinessUnitTreeRef from '../../../refer/org/BusinessUnitTreeRef/index';//计划信息（业务单元）
import FactoryGridRef from '../../../refer/org/FactoryGridRef/index';//生产信息（工厂）
import PurchaseOrgGridRef from '../../../refer/org/PurchaseOrgGridRef/index';//采购组织
import SaleOrgTreeRef from '../../../refer/org/SaleOrgTreeRef/index';//销售组织
import StockOrgGridRef from '../../../refer/org/StockOrgGridRef/index';//库存组织
import './rule.less'
const {NCModal,NCSelect,NCFormControl,NCTextArea,NCButton,NCCheckbox } = base;
var searchid = 'query';
var attrFormid = 'attrFormid';
const urls = {
    'queryBatchUpdateRuleTeam' : "/nccloud/uapbd/batchupdaterule/queryBatchUpdateRuleTeam.do",
    'readFromXml' : "/nccloud/uapbd/batchupdaterule/readFromXml.do",
    'wirteToXml' : "/nccloud/uapbd/batchupdaterule/writeToXml.do",
    'queryBatchUpdateTab' : '/nccloud/uapbd/material/queryBatchUpdateTab.do'
}

class Rule extends  Component{
    constructor(props){
        super(props);
        this.state = {
            formStatus : '',
            modal : {
                show : false,
                modalDropup: true,
                size: 'lg'
            },
            options : props.options,
            tabs : props.tabs,
            rule : { },
            form : { },
            pk_org : [],
            rowValue : {},
            rowid : null,
            selectOrgs : [],
            json:props.json
        }
    }

    componentWillMount(){
        /* let callback = (json) => {
            console.log(this.state.json);
            this.setState({json});
        }
        getMultiLang({moduleId: '10140BURG',domainName: 'uapbd',callback}); */
    }

    show = (rows) =>{
        if(rows && rows.length === 1){
            //修改
            this.state.formStatus = 'edit';
            console.log(rows);
            let values = rows[0].values;
            this.state.rowValue = values;
            this.state.rowid = rows[0].rowid;
            this.state.rule.pk_batchupdatetab = values.pk_batchupdatetab.value;
            let code = '';
            this.state.tabs.forEach(item=>{
                if(item.pk_batchupdatetab === values.pk_batchupdatetab.value){
                    this.state.form.tabCode = item.code;
                    code = item.code;
                }
            });
            this.state.rule.memo = values.memo.value;
            this.state.rule.sqlxmlcondition = values.sqlxmlcondition.value;
            this.state.rule.isonlyupdatenull = values.isonlyupdatenull.value;
            this.state.rule.sql = values.updateattrandvalue.value.sqlWhere;
            //处理批改字段
            let attrAndValueMap = values.updateattrandvalue.value.attr_valueMap;
            this.state.rule.attrAndValueMap = attrAndValueMap;
            this.state.rule.mainAttrCode = values.updateattrandvalue.value.mainAttrCode;
            let keys = Object.keys(attrAndValueMap);
            keys.push(values.updateattrandvalue.value.mainAttrCode);
            let meta = this.props.meta.getMeta();
            let items = [];
            let value_data = {};
            let codes = [];
            let batchEditAttr={refcode:values.updateattrandvalue.value.mainAttrCode,refpk:'123'};
            meta[code].items.forEach(item=>{
                if(keys.indexOf(item.attrcode)>-1){
                    items.push(item);
                    codes.push(item.attrcode);
                    value_data[item.attrcode] = {
                        value : attrAndValueMap[item.attrcode],
                        display : attrAndValueMap['#'+item.attrcode]
                    }
                    if(item.attrcode === batchEditAttr.refcode){
                        batchEditAttr.refname = item.label;
                    }
                }
            });
            //组织参照
            let selectOrgs = values.updateattrandvalue.value.selectedOrgs;
            let orgNames = attrAndValueMap['#orgNames#'];
            if(selectOrgs && selectOrgs.length > 0 && orgNames && orgNames.length === selectOrgs.length){
                let orgs = [];
                selectOrgs.forEach((item,index)=>{
                    orgs.push({
                        refpk:item,
                        refname:orgNames[index]
                    })
                });
                this.state.selectOrgs = orgs;
            }
            this.state.form.codes = codes;
            this.state.form.batchEditAttr = batchEditAttr;
            meta[attrFormid] = {
                code : attrFormid,
                moduletype : 'form',
                items : items
            }
            this.state.modal.show = true;
            this.props.meta.setMeta(meta,()=>{
                this.setState(this.state,()=>{
                    ajax({
                        url:urls['readFromXml'],
                        data:{
                            xml : this.state.rule.sqlxmlcondition
                        },
                        success:(res)=>{
                            console.log(res);
                            let {data} = res;
                            if(data && data.queryRule){
                                this.props.search.setSearchValue(searchid, data.queryRule);
                            }
                            if(data && data.sqlDscrpt){
                                this.state.rule.sqlDscrpt = data.sqlDscrpt;
                                this.setState(this.state);
                            }
                        }
                    })
                });
                this.props.form.setFormStatus(attrFormid,'edit');
                this.props.form.setFormItemsValue(attrFormid,value_data);
            });
        }else{
            //新增
            this.setState({
                formStatus : 'add',
                modal : {
                    show : true,
                    modalDropup: true,
                    size: 'lg'
                },
                rule : { },
                form : { },
                pk_org : [],
                rowValue : {},
                rowid : null,
                selectOrgs : []
            });
        }
    }

    getData = () => {
        let row = this.state.rowValue;
        row.isonlyupdatenull = {value:!!this.state.rule.isonlyupdatenull};
        row.mainattrcode = {value:this.state.form.batchEditAttr.refcode};
        row.memo = {value:this.state.rule.memo,display:this.state.rule.memo};
        let tabName = '';
        this.state.tabs.forEach(item=>{
            if(item.pk_batchupdatetab === this.state.rule.pk_batchupdatetab){
                tabName = item.name;
            }
        });
        row.pk_batchupdatetab = {value:this.state.rule.pk_batchupdatetab,display:tabName};//此处要添加display
        row.pk_batchupruleteam = this.props.form.getFormItemsValue('base','pk_batchupruleteam');
        row.sqlxmlcondition = {value:this.state.rule.sqlxmlcondition};
        let updateattrandvalue = {value:{}};
        if(this.state.formStatus === 'edit'){
            updateattrandvalue = row.updateattrandvalue;
        }
        updateattrandvalue.value.mainAttrCode = this.state.form.batchEditAttr.refcode;
        let orgNames = []
        // if(this.props.config.node_type === 'GROUP_NODE'){
        //     let businessInfo = getBusinessInfo();
        //     updateattrandvalue.value.selectedOrgs = [businessInfo.groupId];
        //     orgNames.push(businessInfo.groupName);
        // }else{
            let orgs = [];
            this.state.selectOrgs.forEach(item=>{orgs.push(item.refpk);orgNames.push(item.refname);});
            updateattrandvalue.value.selectedOrgs = orgs;
        //}
        //selectedOrgs
        updateattrandvalue.value.sqlWhere = this.state.rule.sql;
        updateattrandvalue.value.tabId = this.state.rule.pk_batchupdatetab;
        updateattrandvalue.value.status  = this.state.formStatus === 'add' ? '1' : '2';
        //处理批改字段键值对
        let _formValues = this.props.form.getFormItemsValue(attrFormid,this.state.form.codes);
        let attrAndValueMap = {};
        this.state.form.codes.forEach((key,index)=>{
            attrAndValueMap[key] = _formValues[index].value;
            attrAndValueMap['#'+key] = _formValues[index].display;
        });
        attrAndValueMap['#orgNames#'] = orgNames;
        updateattrandvalue.value.attr_valueMap = attrAndValueMap;
        row.updateattrandvalue = updateattrandvalue;
        return row;
    }

    /**
     * 批改页签选择改变事件
     */
    TabChange = (value) => {
        this.state.rule.pk_batchupdatetab = value;
        this.state.tabs.forEach(item=>{
            if(item.pk_batchupdatetab === value){
                this.state.form.tabCode = item.code;
            }
        });
        this.setState(this.state);
    }

    /**
     * 规则编辑页面查询区查询事件
     */
    clickSearchBtn = (props,data) => {
        let searchVal = this.props.search.getQueryInfo(searchid);
        if(!searchVal || !searchVal.querycondition) return;
        searchVal.pageCode = this.props.config.pagecodeValues.pagecode;
        ajax({
            url : urls['wirteToXml'],
            data : searchVal,
            success:(res) => {
                let {data} = res;
                console.log(res);
                if(data){
                    this.state.rule.sqlDscrpt = data.sqlDscrpt;
                    this.state.rule.sqlxmlcondition = data.xmlString;
                    this.state.rule.sql = data.sql;
                    this.setState(this.state);
                }
            }
        })
    }

    /**
     * 批改属性参照选择变更事件
     * batchEditAttr 记录批改属性参照选中的值
     * codes 数组记录所有要修改的字段（包含选择的批改字段和关联的批改字段）
     */
    AttrRefonChange = (value) => {
        console.log(value);
        this.state.form.batchEditAttr = value;
        let items = [];
        let meta = this.props.meta.getMeta();
        let codes = [];
        codes.push(value.refcode);
        if(value && value.values && value.values.relatedattr && value.values.relatedattr.value){
            let a = value.values.relatedattr.value.split(',');
            a.forEach(item=>{codes.push(item)});
        }
        this.state.form.codes = codes;
        meta[this.state.form.tabCode].items.forEach(item => {
            if(codes.indexOf(item.attrcode)>-1){
                items.push(item);
            }
        })
        meta[attrFormid] = {
            code : attrFormid,
            moduletype : 'form',
            items : items
        }
        this.props.meta.setMeta(meta,()=>{this.setState(this.state);this.props.form.setFormStatus(attrFormid,'edit')});
    }

    /**
     * 批改属性的编辑后事件
     */
    onValueFormAfterEvent = () => {

    }

    /**
     * 模态框确认按钮点击事件
     */
    onsubmit = () => {
        let values = this.getData();
        if(this.state.formStatus === 'add'){
            //新增
            this.props.cardTable.addRow('rule',0,values,false,()=>{
                this.props.cardTable.setStatus('rule','browse');
            });
        }else if(this.state.formStatus === 'edit'){
            //修改
            let row = {
                rowid : this.state.rowid,
                status : '1',
                values : values,
                selected : true
            }
            this.props.cardTable.updateTableData('rule',{rows : [row]});
        }
        this.state.modal.show = false;
        this.setState(this.state);
    }

    OrgChange = (value) => {
        this.setState({
            selectOrgs : value
        })
    }

    render () {
        let {search} = this.props;
        let {NCCreateSearch} = search;

        return (
            <NCModal {...this.state.modal}>
                <NCModal.Header closeButton={false}>
                    <NCModal.Title>{this.state.json['10140BURG-000011']}</NCModal.Title>{/* 国际化处理： 批改规则*/}
                </NCModal.Header>
                <NCModal.Body>
                    <div>
                        <div>
                            <div className = 'entry-name'>{this.state.json['10140BURG-000032']}:</div>{/* 国际化处理： 属性所在页签*/}
                            <div className = 'entry-text'>
                                <NCSelect style={{ width: 200, marginRight: 6 }} onChange={this.TabChange} value={this.state.rule.pk_batchupdatetab}>
                                    {this.state.options}
                                </NCSelect>
                            </div>
                        </div>
                        <div className = 'entry-top'>
                            <div className = 'entry-name'>{this.state.json['10140BURG-000033']}:</div>{/* 国际化处理： 规则描述*/}
                            <div className = 'entry-text entry-text-input'>
                                <NCFormControl
                                    className="demo-input"
                                    value={this.state.rule.memo}
                                    onChange={(value)=>{this.state.rule.memo = value;this.setState(this.state);}}
                                    size="sm"
                                />
                            </div>
                        </div>
                        {
                            this.state.form.tabCode === 'cost_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000034']}</div>{/* 国际化处理： 成本域*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <CostRegionDefaultGridRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                        AppCode : '10140MAO',
                                        orgType : 'COSTREGION0000000000',
                                        GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                    }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.form.tabCode === 'fi_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000035']}</div>{/* 国际化处理： 财务组织*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <FinanceOrgTreeRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                        AppCode : '10140MAO',
                                        orgType : 'FINANCEORGTYPE000000',
                                        TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                    }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.form.tabCode === 'pfc_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000036']}</div>{/* 国际化处理： 利润中心*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <LiabilityCenterOrgTreeRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                            AppCode : '10140MAO',
                                            orgType : 'LIACENTERTYPE0000000',
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.form.tabCode === 'pfcc_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000037']}</div>{/* 国际化处理： 利润中心成本域*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <LiactCostrgGridRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                            AppCode : '10140MAO',
                                            orgType : 'LIACTCOSTRG000000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.form.tabCode === 'plan_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000038']}</div>{/* 国际化处理： 业务单元*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <BusinessUnitTreeRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                            AppCode : '10140MAO',
                                            orgType : 'STOCKPLANTYPE0000000',
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.form.tabCode === 'prod_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000039']}</div>{/* 国际化处理： 工厂*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <FactoryGridRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                            AppCode : '10140MAO',
                                            orgType : 'FACTORYTYPE000000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.form.tabCode === 'pu_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000040']}</div>{/* 国际化处理： 采购组织*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <PurchaseOrgGridRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                            AppCode : '10140MAO',
                                            orgType : 'FACTORYTYPE000000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.form.tabCode === 'sale_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000041']}</div>{/* 国际化处理： 销售组织*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <SaleOrgTreeRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                            AppCode : '10140MAO',
                                            orgType : 'SALEORGTYPE000000000',
                                            TreeRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        {
                            this.state.form.tabCode === 'stock_info' && <div className = 'entry-top'>
                                <div className = 'entry-name'>{this.state.json['10140BURG-000042']}</div>{/* 国际化处理： 库存组织*/}
                                <div className = 'entry-middle entry-text-input'>
                                    <StockOrgGridRef 
                                        value = {this.state.selectOrgs}
                                        onChange = {this.OrgChange}
                                        isMultiSelectedEnabled = {true}
                                        queryCondition = {{
                                            AppCode : '10140MAO',
                                            orgType : 'STOCKORGTYPE00000000',
                                            GridRefActionExt:'nccloud.web.uapbd.material.action.PrimaryOrgSQLBuilderByOrgType'
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        <div className = 'entry-top'>
                            <div>
                                <div className = 'update-name'>
                                    <div className = 'entry-text'>{this.state.json['10140BURG-000043']}：</div>{/* 国际化处理： 修改满足以下条件的数据*/}
                                    <div className = 'entry-middle'>
                                        {NCCreateSearch(
                                            searchid,//模块id
                                            {
                                                clickSearchBtn: this.clickSearchBtn,//   点击按钮事件
                                                onlyShowSuperBtn:true,
                                                showAdvBtn: true,                           //  显示高级按钮
                                                replaceSuperBtn : this.state.json['10140BURG-000031'],/* 国际化处理： 设置*/
                                                searchBtnName : this.state.json['10140BURG-000028'],/* 国际化处理： 确定*/
                                                oid:'1009Z01000000005855D'        //查询模板的oid，用于查询查询方案
                                            }
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <NCTextArea value={this.state.rule.sqlDscrpt}/>
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className = 'entry-top'>
                            <div className = 'entry-name'>{this.state.json['10140BURG-000044']}:</div>{/* 国际化处理： 选择批改主属性*/}
                            <div className = 'entry-middle entry-batchEditAttrRefer'>
                                <BatchEditAttrRefer
                                json = {{}}
                                value = {this.state.form.batchEditAttr}
                                onChange = {this.AttrRefonChange}
                                isMultiSelectedEnabled = {false}
                                queryCondition = {{
                                    NODE_TYPE:this.props.config.NODE_TYPE,
                                    checkedOrgLenth: 1,
                                    pk_batchupdatetab: this.state.rule.pk_batchupdatetab,
                                    batchUpdateForm:'material',
                                    ruleUpdate:'isRuleUpdate',
                                    GridRefActionExt:'nccloud.web.uapbd.material.action.BatchEditAttrRefExt'
                                }}
                                />
                            </div>
                            <div className = 'entry-form'>
                                {this.props.form.createForm(attrFormid,{onAfterEvent: this.onValueFormAfterEvent})}
                            </div>
                        </div>
                        <div className = 'entry-top'>
                            {this.state.json['10140BURG-000045']} <NCCheckbox colors="info" onChange={(value)=>{this.state.rule.isonlyupdatenull=value;this.setState(this.state)}} checked={this.state.rule.isonlyupdatenull} ></NCCheckbox>{/* 国际化处理： 仅修改属性值为空的属性*/}
                        </div>
                    </div>
                </NCModal.Body>
                <NCModal.Footer>
                    <span><NCButton onClick={ this.onsubmit }>{this.state.json['10140BURG-000028']}</NCButton></span>{/* 国际化处理： 确定*/}
                    <NCButton onClick={()=>{this.state.modal.show = false;this.setState(this.state);}}>{this.state.json['10140BURG-000029']}</NCButton>{/* 国际化处理： 取消*/}
                </NCModal.Footer>
            </NCModal>
        );
    }
}

export default Rule;

//cVIIr22oNYWqeOjlb0Zr54nyn2RdWpNyW6ltYdOF+92njUty/gA52anf9YSNoIWk