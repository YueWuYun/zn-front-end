//SMtmvZkFWKN9a36jE1joYrhnOLbziizr1izDQ2V7dEqJfBdLX71NZqJakgnd0W9Z
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {base} from 'nc-lightapp-front';
const {NCRow, NCCol, NCDiv} = base;
import './index.less';
class ReferForm extends Component{
    constructor(props){
        super(props);
        this.formMeta = [{
            label: props.multiLang['refer-001021'],/* 国际化处理： 科目编码:*/
            itemtype:'input',
            col:'4',
            attrcode: "code"
        },{
            label: props.multiLang['refer-001022'],/* 国际化处理： 科目名称:*/
            itemtype:'input',
            col:'8',
            attrcode: "name",
        },{
            label: props.multiLang['refer-001023'],/* 国际化处理： 现金分类:*/
            itemtype:'input',
            col:'4',
            attrcode: "cashtype"
        },{
            label: props.multiLang['refer-001024'],/* 国际化处理： 数量核算:*/
            itemtype:'checkbox',
            col:'4',
            attrcode: "quantity",
        },{
            label: props.multiLang['refer-001025'],/* 国际化处理： 计量单位:*/
            itemtype:'input',
            col:'4',
            attrcode: "unit"
        }];
        this.state = {formData:null,formMeta:this.formMeta};
        this.cashTypeWapper = {
            0:props.multiLang['refer-001052'],/* 国际化处理： 其它*/
            1:props.multiLang['refer-001053'],/* 国际化处理： 现金科目*/
            2:props.multiLang['refer-001054'],/* 国际化处理： 银行科目*/
            3:props.multiLang['refer-001055']/* 国际化处理： 现金等价物*/
        }
    }
    componentWillReceiveProps(newProps){this.setState({formData:newProps.formData});}
    wrapValue = (attrcode,value)=>{
        if(attrcode == 'cashtype'){
            value = this.cashTypeWapper[value];
        }else if(attrcode == 'quantity'){
            value = (value || value == true || value == 'Y')?this.props.multiLang['refer-001061']:this.props.multiLang['refer-001062'];
        }
        return value;
    }
    render(){
        const renderFormItems = ()=>{
            let {formData,formMeta} = this.state;
            return (formMeta || []).map(item=>{
                let value = (formData && formData.hasOwnProperty('length') && formData.length > 0 )?formData[0][item.attrcode]:'';
                value = this.wrapValue(item.attrcode,value);
                let {col,itemtype,attrcode,label} = item;
                let labelCol = col > 5 ? 3 : 6
                return (
                    <NCCol xs={col} fieldid={attrcode}>
                        <NCCol xs={labelCol} className="formLabel nc-theme-common-font-c" style={{lineHeight: '28px',height: '28px',textAlign: 'right','font-size':'13px','text-overflow':'ellipsis'}}>
                            {label}
                        </NCCol>
                        <NCCol xs={12-labelCol} className = 'clearfix formControl nc-theme-title-font-c' style={{paddingLeft: '12px'}}>
                            {<div style={{minHeight: '28px','font-size':'13px','line-height':'28px'}} className={`form-component-item-wrapper ${itemtype}-wrapper browse`}>
                                {value}
                            </div>}
                        </NCCol>
                    </NCCol>
                )
            })
        }
        return <NCDiv className={'account-refer-form-style'} fieldid={this.props.fieldid} areaCode={NCDiv.config.FORM}><NCRow>{renderFormItems()}</NCRow></NCDiv>
    }
}
export default ReferForm
//SMtmvZkFWKN9a36jE1joYrhnOLbziizr1izDQ2V7dEqJfBdLX71NZqJakgnd0W9Z