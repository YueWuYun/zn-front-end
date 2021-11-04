//mOAI1TYWnTTt7HkovvGUiNJuRT4lxHCrDSn3yIjK4UMWUmYPyfhf3D9iC9L+U7AZ
import {Component} from 'react';
import { base, high ,ajax ,toast} from 'nc-lightapp-front';
import AccTypeGridRef from '../../../refer/fiacc/AccTypeGridRef/index';
import AccAssItemGridRef from '../../../refer/fiacc/AccAssItemGridRef/index';
import './index.less';
const {NCButton,NCRadio,NCSelect,NCRow,NCCol,NCTable, NCDiv} =base;
const {NCOption} = NCSelect;
/***************************************
 * 高级选择组件
 * @author liupzhc
 * @date 2018-06-11
 * @version 1.0.0
 ***************************************/
class AccountHighFilter extends Component{
    constructor(props){
        super(props);
        this.state ={
            selectBeginValue:1,
            selectEndValue:1,
            level:props.codeLength,//级次范围
            pk_accsystem:null,
            disabledSureBtn:true,//默认禁用
            levelProp:{
                size:"sm",
                defaultValue:"1",
                style:{width: '50px','margin-right':'10px'},
                dropdownClassName:"lyx_refer"
            },
            accTypeRefConf:{
                onChange:this.onAccTypeChange,
                value:null,
                disabled: false,
                queryCondition:{
                    pk_accsystem:props.pk_accsystem,
                    GridRefActionExt:'nccloud.web.uapbd.ref.fiacc.AccTypeGridRefSqlBuilder'
                },
                popWindowClassName:'ncc-hr-refer-zIndex',
                fieldid: 'acctype'
            },
            accassItemRefConf:{
                onChange:this.onAccAssItemChange,
                value:null,
                disabled: false,
                popWindowClassName:'ncc-hr-refer-zIndex',
                isMultiSelectedEnabled:true,
                fieldid: 'accAssItem'
            },
            accassitemtable:{//辅助核算项表格配置
                columns:[{
                    attrcode:'refcode',
                    label:props.multiLang['refer-001000'],/* 国际化处理： 辅助核算项编码*/
                    title:(<div fieldid='refcode'>{props.multiLang['refer-001000']}</div>),/* 国际化处理： 辅助核算项编码*/
                    dataIndex: 'refcode',
                    width:"50%",
                    render: (text, record, index) => <div fieldid='refcode'>{text ? text : <span>&nbsp;</span>}</div>
                },{
                    attrcode:'refname',
                    label:props.multiLang['refer-001001'],/* 国际化处理： 辅助核算项名称*/
                    title:(<div fieldid='refname'>{props.multiLang['refer-001001']}</div>),/* 国际化处理： 辅助核算项名称*/
                    dataIndex: 'refname',
                    width:"50%",
                    render: (text, record, index) => <div fieldid='refname'>{text ? text : <span>&nbsp;</span>}</div>
                }],
                data:[]
            },
            radioGroupConf:{
                name:props.multiLang['refer-001007'],//科目级次选择
                style:{marginLeft:'10px',width:'88%',textAlign:'left'},
                defaultValue:'3',
                selectedValue:'3',
                onChange:this.onRadioChanged
            },
            okBtnConf:{colors:"primary",onClick:this.closeOK, fieldid: 'sure'},
            cancelBtnConf:{onClick:this.closeCancel, fieldid: 'cancel'}
        };
    }
    componentDidMount(){
        let {accassItemRefConf,accTypeRefConf} = this.state;
        this.setState({disabledSureBtn:!(accTypeRefConf.value && accTypeRefConf.value.refpk && accassItemRefConf.value &&  accassItemRefConf.value.length>0)})
    }
    componentWillReciveProps(newProps){this.setState({level:newProps.codeLength,pk_accsystem:newProps.pk_accsystem});}
    /***************************************************************
     * 科目类型参照 onChange事件
     * @param value
     ***************************************************************/
    onAccTypeChange =(value)=>{
        let {accassItemRefConf,accTypeRefConf} = this.state;accTypeRefConf.value = value;
        // this.setState({disabledSureBtn:!(value && value.refpk && accassItemRefConf.value && accassItemRefConf.value.length>0)});
    }
    /***************************************************************
     * 辅助核算类型参照onChange事件
     * @param value
     ***************************************************************/
    onAccAssItemChange =(value)=>{
        let {accassItemRefConf,accTypeRefConf,accassitemtable} = this.state;
        accassItemRefConf.value = value;
        accassitemtable.data = value;
        // this.setState({disabledSureBtn:!(value && value.length>0 && value[0].refpk && accTypeRefConf.value && accTypeRefConf.value.refpk)});
        this.setState({disabledSureBtn:!(value && value.length>0 && value[0].refpk)});
    }
    /***************************************************************
     * 下拉框选择改变事件
     * @param flag
     * @param value
     ***************************************************************/
    onSelectChanged = (flag)=>{return (value)=>{this.setState({[flag]:value});}}
    /***************************************************************
     * 单选按钮组选择改变事件
     * @param value
     ***************************************************************/
    onRadioChanged =(value)=>{this.state.radioGroupConf.selectedValue = value;this.setState(this.state);}
    /***************************************************************
     * 确认触发事件
     ***************************************************************/
    closeOK =()=>{
        let {accassItemRefConf,accTypeRefConf,radioGroupConf,selectBeginValue,selectEndValue} = this.state;
        let {onAfterHighFilterCloseOk} = this.props;
        const checkSelectValue = ()=>{
            if(selectBeginValue>selectEndValue){
                toast({content:this.props.multiLang['refer-001003'],title:this.props.multiLang['refer-001004'],color:'warning',duration:'10'});/* 国际化处理： 请正确设置科目级次范围！,提示*/
                return false;
            }
            return true;
        }
        let condition = {curAccType:accTypeRefConf.value,curAccAssItemArr:accassItemRefConf.value,accRange:radioGroupConf.selectedValue,level:[selectBeginValue,selectEndValue]};
        checkSelectValue() && onAfterHighFilterCloseOk && onAfterHighFilterCloseOk(condition);
    }
    /***************************************************************
     * 点击关闭按钮事件
     ***************************************************************/
    closeCancel =()=>{this.props.closeHighFilter && this.props.closeHighFilter();}
    /**
     * 渲染两个下拉框
     */
    renderClsRange =()=>{
        let level = this.state.level || '1';
        let options = new Array();
        for(var i = 0; i < parseInt(level); i++){
            options.push( <NCSelect.NCOption value={i+1}>{i+1}</NCSelect.NCOption>);
        }
        return (
            <span className='ncc-hr-select' style={{width:'100%',zIndex:9999999}}>
                <NCSelect {...this.state.levelProp} value={this.state.selectBeginValue || '1'} onChange={this.onSelectChanged('selectBeginValue')} fieldid='beginlevel'>
                {options}
                </NCSelect>
                <span className="ncc-hr-font-size" style={{'margin-right':'10px'}}>{this.props.multiLang['refer-001005']/* 国际化处理： 到*/}</span>
                <NCSelect {...this.state.levelProp} value={this.state.selectEndValue || '1'} onChange={this.onSelectChanged('selectEndValue')} fieldid='endlevel'>
                {options}
                </NCSelect>
            </span>
        )
    }
    
    render(){
        let {accassitemtable,accTypeRefConf,okBtnConf,cancelBtnConf,radioGroupConf,accassItemRefConf} = this.state;
        return (
            <NCDiv fieldid="advfilter" areaCode={NCDiv.config.MODAL}>
                <div className="refer-pop-window" onMouseOver={(e) => {e.stopPropagation();}}>
                    <div className="refer-popover clearfix userdef-area" ref={(dom) => {this.popover = dom;}} onClick={(e) => {e.stopPropagation();}} style={{width:'50%'}}>
                        <NCDiv areaCode={NCDiv.config.HEADER} className="refer-header">
                            <NCDiv fieldid={this.props.multiLang['refer-001006'] || '高级选择'} areaCode={NCDiv.config.Title} className="refer-title ncc-hr-font-size" key="1">{this.props.multiLang['refer-001006'] || '高级选择'}</NCDiv>
                            <div className="refer-header-extend" key="2"/>
                            <div className="refer-close iconfont icon-guanbi" onClick={this.closeCancel} key="5" />
                        </NCDiv>
                        <div className="loading-container" ref={(dom) => { this.loadingContainer = dom;}}>
                            <div className="refer-search">
                                <NCRow style={{width:'100%'}}>
                                    <NCCol md={4} xs={4} sm={4}><div className='refer-search-m12'><AccTypeGridRef {...accTypeRefConf}/></div></NCCol>
                                    <NCCol md={4} xs={4} sm={4}><AccAssItemGridRef {...accassItemRefConf}/></NCCol>
                                </NCRow>
                            </div>
                            <NCRow className="refer-content-area" >
                                <NCTable {...accassitemtable}
                                    scroll= {{ x: true, y: '295px'}}
                                />

                            </NCRow>{/*表格*/}
                            {/*radio 区域*/}
                            <div className="refer-page ncc-radio-select nc-theme-area-split-bc">
                                <div className="ncc-hr-font-size nc-theme-common-font-c">{this.props.multiLang['refer-001007']/* 国际化处理： 科目级次选择*/}</div>
                                <NCRadio.NCRadioGroup {...radioGroupConf}>
                                    <NCRadio value="1" color='success' fieldid='level' style={{width:'70%'}} className="ncc-group-first">{this.renderClsRange()}</NCRadio>
                                    <NCRadio value="2" color='success' className="ncc-hr-font-size" style={{width:'15%'}}>{this.props.multiLang['refer-001008']/* 国际化处理： 包含下级*/}</NCRadio>
                                    <NCRadio value="3" color='success' className="ncc-hr-font-size" style={{width:'15%'}}>{this.props.multiLang['refer-001009']/* 国际化处理： 只显示末级*/}</NCRadio>
                                </NCRadio.NCRadioGroup>
                            </div>
                            {/*确定 取消 按钮 区域*/}
                            <NCDiv areaCode={NCDiv.config.BOTTOM} className="refer-bottom">
                                <div className='refer-bottom-extend'></div>
                                <div className="buttons" key="3">
                                    <NCButton {...okBtnConf} >{this.props.multiLang['refer-001010']/* 国际化处理： 确定*/}</NCButton>
                                    <NCButton {...cancelBtnConf}>{this.props.multiLang['refer-001011']/* 国际化处理： 取消*/}</NCButton>
                                </div>
                            </NCDiv>
                        </div>
                    </div>
                </div>
            </NCDiv>
        )
    }
}
export default AccountHighFilter

//mOAI1TYWnTTt7HkovvGUiNJuRT4lxHCrDSn3yIjK4UMWUmYPyfhf3D9iC9L+U7AZ