//Kr9/TDTO8ohnkVZSPmPi6u3+7G9REjSk06egctQfWagvSFlQOF0nWviXeC+ReYgq
import React,{Component} from 'react';
import {base} from 'nc-lightapp-front';
import './Common.less';
import SupHotKeys from '../utils/SupplierHotKeys';
import {component} from '../../../public/platwapper/index';
const{NCRow,NCCol,NCHotKeys,NCDiv,NCTooltip} = base;
const{NCButton} = component;
const {USUAL_KEYS} = NCHotKeys;
export default class DeleteDialog extends Component{

    componentWillReceiveProps(newProps){
    }
    constructor(props){
        super(props);
        this.listener = this.props.listener || {};
        this.state = {
            resizeable:false || this.props.resizeable,
            dragable:true,
            showDialog: this.props.showDialog || false,
            isHotKeyClick:false,
            style:Object.assign({
                dialogWidth:'60%',
                dialogHeight:null,
                dialogZIndex: '100',
            },this.props.style),

            header:Object.assign({
                dialogTitle:'',
                onDialogClose:(before,after)=>{
                    const close = ()=>{
                        this.setState({showDialog:!this.state.showDialog},()=>{
                            document.body.style.overflow='auto';
                            after && typeof after === 'function' && after();
                            !after && this.listener.onAfterHeaderCloseClick && this.listener.onAfterHeaderCloseClick();
                        })
                    }
                    if(before && typeof before ==='function'){
                        before(close);
                    }else if(this.listener.onBeforeHeaderCloseClick){
                        this.listener.onBeforeHeaderCloseClick(close);
                    }else{
                        close();
                    }
                }
            },this.props.header),

            shoulder:Object.assign({
                showShoulderArea: false,
                renderShoulder:()=>{}
            },this.props.shoulder),

            body:Object.assign({
              renderDialogContent:()=>{},
              renderContentTitle:()=>{}
            },this.props.body),

            footer:Object.assign({
                renderInRight:true,
                defaultButton:{
                    sure:{
                        name:'确认',/* 国际化处理： 确认*/
                        key:'sure',
                        className:'button-primary',
                        id:'sure',
                        // style:{ backgroundColor: '#E14C46',color: '#fff'},
                        onClick:()=>{
                            this.state.header.onDialogClose(this.listener.onBeforeSureClick,this.listener.onAfterSureClick);
                        },
                    },
                    cancel:{
                        name: this.props.Lang['10140SUG-000004'],/* 国际化处理： 取消*/
                        key:'cancel',
                        id:'cancel',
                        className:'second-button',
                        // style:{backgroundColor: '#eee',color: '#666',marginLeft: '9px'},
                        onClick:()=>{
                            this.state.header.onDialogClose(this.listener.onBeforeCancelClick,this.listener.onAfterCancelClick);
                        },
                    }
                },
                renderSelfDefBtns:false,
                selfDefBtn:{
                    renderCancel:false,
                    buttonItem:[]/* 国际化处理： 你好*/
                },

            },this.props.footer),
            showFooter:!!this.props.showFooter, 
            hotKeysCfg:{
                className:"simpleModal-hotkeys-wrapper",
                enabled:true,
                focused:true,
                display:"inline-block",
                keyMap:{
                    delete: USUAL_KEYS.NC_DELETE,//del
                    asyncDelete:USUAL_KEYS.NC_DELETE_ROW,//alt+del
                    cancel: ["Alt+N",'Esc']},
                handlers:{
                   delete:()=>{this.state.showDialog && this.props.listener.doDelete(false);},
                   asyncDelete:()=>{this.state.showDialog && this.props.listener.doDelete(true);},
                   cancel:()=>{this.state.showDialog && this.state.header.onDialogClose(this.listener.onBeforeCancelClick,this.listener.onAfterCancelClick);}
                }
            }
        };
    }

    /**
     * 弹出Dialog
     */
    showDialog(config = {},beforeAction,afterAction){
        beforeAction && beforeAction();
        this.setState(Object.assign(config,this.state,{showDialog:true}),()=>{
            //禁用dom滚动条
            document.body.style.overflow='hidden';
            afterAction && afterAction();
        })
    }
    /**
     * 关闭弹窗
     */
    closeDialog(){
        this.setState({showDialog:false});
    }
    /**
     * 执行关闭
     */
    close = ()=>{
        this.setState({showDialog:!this.state.showDialog},()=>{
            document.body.style.overflow='auto';
            this.listener.onAfterCancelClick && typeof this.listener.onAfterCancelClick === 'function' && this.listener.onAfterCancelClick();
            !this.listener.onAfterCancelClick && this.listener.onAfterHeaderCloseClick && this.listener.onAfterHeaderCloseClick();
        })
    }

    /**
     * 渲染
     * @returns {*}
     */
    renderFooterButtons = () => {
        /**
         * 渲染自定义按钮
         * @returns {any[]}
         */
        const renderButtonItems = ()=>{
            if(this.state.footer.renderSelfDefBtns){
                let {buttonItem} = this.state.footer.selfDefBtn;
                return buttonItem.map((button)=>{
                    return <NCTooltip
                                placement="top"
                                inverse
                                overlay={`${button.name}  (${this.state.hotKeysCfg.keyMap[button.id]})`}
                                trigger={["hover", "focus"]}
                                className="model-helper-overlay">
                                    <NCButton {...button}>{button.name}</NCButton>
                            </NCTooltip>
                })
            }
        }
        /**
         * 渲染取消按钮
         */
        const renderCancelButton = ()=>{
            if(this.state.footer.renderSelfDefBtns && this.state.footer.selfDefBtn.renderCancel){
                let {cancel} = this.state.footer.defaultButton;
                return  <NCTooltip
                            placement="top"
                            inverse
                            overlay={`${cancel.name}  (Alt+N)`}
                            trigger={["hover", "focus"]}
                            className="model-helper-overlay">
                            <NCButton {...cancel}>{cancel.name}</NCButton>
                        </NCTooltip>
            }
        }
        /**
         * 渲染默认按钮
         */
        const renderDefaultButton = ()=>{
            if(!this.state.footer.renderSelfDefBtns){
                let {sure,cancel} = this.state.footer.defaultButton;
                return [sure,cancel].map((button)=>{
                    return <NCButton {...button}>{button.name}</NCButton>
                })
            }
        }
        let config = {
            btnComps:<NCRow style={{'margin-left':'auto','margin-right':'auto'}}>
                        <NCCol xs={12} md={12} sm={12}>
                            {renderButtonItems()}{renderCancelButton()}{renderDefaultButton()}
                        </NCCol>
                    </NCRow>,
            hotKeysCfg : this.state.hotKeysCfg
        };
        return <SupHotKeys {...config}/>
    }

    render(){
        return(
            <NCDiv fieldid={"deleteDialog"} areaCode={NCDiv.config.MODAL}>
                <div
                    id={'deleteDlgContainer'}
                    className="refer-pop-window"
                    style={{ display: this.state.showDialog ? 'flex' : 'none','z-index':this.state.style.dialogZIndex }}
                    onMouseOver={(e) => {e.stopPropagation();}}>
                    <div
                        className="refer-popover clearfix"
                        ref={(dom) => {this.popover = dom;}}
                        onClick={(e) => {e.stopPropagation();}}
                        style={{width:this.state.style.dialogWidth,height:this.state.style.dialogHeight}}>
                        <NCDiv className="refer-header" areaCode={NCDiv.config.HEADER} >
                            <div className="refer-title" key="1">
                            <NCDiv fieldid={this.state.header.dialogTitle} areaCode={NCDiv.config.Title}>
                                    {this.state.header.dialogTitle || ''}
                            </NCDiv>
                            </div>
                            <div className="refer-header-extend" key="2"/>
                            <div className="refer-close iconfont icon-guanbi" onClick={this.state.header.onDialogClose} key="5" />
                        </NCDiv>
                        {/*渲染shoulder按钮*/}
                        {this.state.shoulder.showShoulderArea &&
                            <div className="refer-search">
                                {this.state.shoulder.renderShoulder()}
                            </div>
                        }
                        {/*渲染内容区*/}
                        <div className={`${this.state.showFooter?'ncc-hr-dialog-content-area0':'ncc-hr-dialog-content-area1'}`} style={{ width: '100%', 'overflow':'auto'}}>
                            {this.props.body.renderDialogContent()}
                        </div>
                        {/*渲染bottom确认和取消按钮*/}
                        {this.state.showFooter &&
                            <NCDiv  className="loading-container" areaCode={NCDiv.config.BOTTOM} style={{'margin-top': 10,'padding-right': 10}}>
                                <div className="refer-buttom" style={{textAlign:'right'}}>
                                    <div className="buttons" style={{width:'100%'}} key="3">
                                        {this.renderFooterButtons()}
                                    </div>
                                </div>
                            </NCDiv>}
                    </div>
                </div>
            </NCDiv>
        )
    }
}

//Kr9/TDTO8ohnkVZSPmPi6u3+7G9REjSk06egctQfWagvSFlQOF0nWviXeC+ReYgq