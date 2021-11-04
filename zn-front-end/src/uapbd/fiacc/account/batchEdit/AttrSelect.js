//dxD/HPD8Uv6hdyoFqYUHZXXRCOnfhALupEC66YA41N+sRaY7fuR6WhF3EgMZjzzs
import React, { Component } from 'react';
import {base,ajax ,toast} from 'nc-lightapp-front';
let { NCTable,NCSelect,NCTabs, NCButton,NCCheckbox,NCCol,NCRow, NCModal, NCCollapse,NCTree,NCFormControl  } = base;
import RefChart from '../../../refer/fiacc/AccChartTreeRef/index.js';
import RefItemSelect from '../refBatchAttr/index.js';
var EMPTY_FN = function(){};
class AttrSelect extends Component {
    constructor(props) {
        super(props);
        this.lang = props.lang;
        this.common = props.common;
        this.curParam = {};
        var me = this;
        this.state = {
            refChart:{
                isMultiSelectedEnabled: true,
                value:undefined,
                queryCondition:() =>{
                    return {
                        ...me.curParam.config || {},
                        isTemp:this.curParam.isTemp,
                        pk_accchart:this.curParam.pk_accchart,//addde by liusenc 20180920
                        pk_accsystem : this.curParam.pksys? this.curParam.pksys : '',
                        pk_org : this.curParam.config.nodetype == 'org' ?   this.curParam.pk_org : '',//.this.state.curParam.pkorg : '',
                        TreeRefActionExt:'nccloud.web.uapbd.account.action.RefCondAccChartExt'
                    };
                },
                onChange: (value) => {
                    this.state.refChart.value = value;
                    this.setState(this.state);
                }
            },
            refItemSelect:{
                value: undefined,
                onChange: (val) =>{
                    this.state.refItemSelect.value = val;
                    this.setState(this.state,() =>{
                        var meta = this.common.meta.getMeta();
                        var items = meta.batEditForm.items;
                        var refcodes = (val || []).map( (v) =>{
                            return v.refpk;
                        });
                        items.forEach(item => {
                            item.visible = refcodes.indexOf(item.attrcode) == -1 ? false: true;
                        });
                        this.common.meta.setMeta(meta);
                    });
                },
                queryCondition:() =>{
                    return {
                        meta:this.common.meta.getMeta().batEditForm.items || []
                    };
                }
            }
        };
    }

   

    loadDatarefChartVersion(callback){//加载科目版本日期；
        ajax({
            loading:true,
            url:'/nccloud/uapbd/account/ListVersionAction.do',
            data:{'pk_accchart': this.state.refChart.value ? this.state.refChart.value.refpk: ''},//修改20180814-20：49，发现参照突然变成了数组了
            success:(res) => callback && callback(res.data || [])
        });
    }

    init(curParam){
        this.curParam = curParam;
        this.common.form.setFormStatus('batEditForm', 'edit');
        var meta = this.common.meta.getMeta();
        var items = meta.batEditForm.items;
        items.forEach(item => {
            item.visible = false;
        });
        this.common.meta.setMeta(meta);
        setTimeout(() => {
            this.state.refChart.value = this.curParam.curchart ? [this.curParam.curchart] : [];
            this.setState(this.state);
        }, 0);
    }

    checkAttr(){
        var formData = this.common.form.getAllFormValue('batEditForm').rows[0].values,
            selectItems = this.state.refItemSelect.value || [],
            result = {};
        debugger;
        var nullnames = '';
        if(selectItems.length == 0){
            toast({content : this.lang['10140ACCB-001004'],color : 'warning'});
            return false;
        }

        selectItems.forEach(selectItem => {
            var name = selectItem.refpk,
                required = selectItem.values.required.value,
                val = formData[name].value;
            if(required && !val){
                nullnames = nullnames + ','+ selectItem.refname;
            }
        });
        if(nullnames.length == 0){
            return true;
        }
        toast({content : nullnames + ' ' + this.lang['10140ACCB-001001'],color : 'warning'});
        return false;
    }


    getAttrs(){
        var formData = this.common.form.getAllFormValue('batEditForm').rows[0].values,
            selectItems = this.state.refItemSelect.value || [],
            result = {};
        debugger;
        selectItems.forEach(selectItem => {
            var name = selectItem.refpk;
            var val = formData[name].value;
            result[name] = val;
            //if(selectItem.itemtype == 'checkbox_switch'){//20181119发现平台修改了显示属性的值；
			if(selectItem.values.itemtype.value == 'checkbox_switch'){	
                result[name] = val ? 'Y':'N';
            }
            /*if(selectItem.values.itemtype.value == 'select'){	
                result[name] = parseInt(val);
            }*/
        });
        return result;

    }

    getSelectItemType(){
        var selectItems = this.state.refItemSelect.value || [],
            result = {};
        debugger;
        selectItems.forEach(selectItem => {
            var name = selectItem.refpk;
            var val = selectItem.values.itemtype.value;
            result[name] = val;
        });
        return result;
    }

    getPKCharts(){
        var charts = this.state.refChart.value || [];
        return charts.map( c=>{
            return c.refpk;
        });
    }
    
    render() {
        return (
        <div>
            <div style={{marginTop: 10, display:'flex'}}>
                <div style={{width: 270, verticalAlign: 'top',display: 'flex'}}>
                    <div style={{width: 100,marginTop: 3,marginRight: 10}}>{this.lang['10140ACCB-001002']}:</div>
                    <div style={{width: '100%'}}>{RefChart(this.state.refChart)}</div>
                </div>
                <div style={{width: 300,marginLeft: 10,verticalAlign: 'top',display: 'flex'}}>
                    <div style={{width: 100,marginTop: 3,marginRight: 10}}>{this.lang['10140ACCB-001003']}:</div>
                    <div style={{width: '100%'}}>{RefItemSelect(this.state.refItemSelect)}</div>
                </div>
            </div>
            {this.common.form.createForm('batEditForm')}
        </div>
        )
    }
}
export default AttrSelect;

//dxD/HPD8Uv6hdyoFqYUHZXXRCOnfhALupEC66YA41N+sRaY7fuR6WhF3EgMZjzzs