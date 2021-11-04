//pzPQOCNyrLX4Rl6sWYkkb5b3fvyIi+OBsbDpZZPLSRN3O2sNslsuX4C2f/hIH7Y6
import React,{Component} from 'react';
import {base} from 'nc-lightapp-front';
import SupHotKeys from '../utils/SupplierHotKeys';
import {component} from '../../../public/platwapper/index.js';
const {NCButton} = component;
const{NCRow,NCCol,NCHotKeys} = base;
const {USUAL_KEYS} = NCHotKeys;
import './Common.less';

export default class NewDialog extends Component{
    constructor(props){
        super(props);
        this.state = Object.assign({
            showDialog:false,
            dialogTitle:'',
            dialogZIndex:'100',
            dialogWidth:'50%',
            dialogHeight:'50%',
            dialogSize:'xlg',
            showFooter:true,
            showDefaultBtn:true,
            isHotKeyClick:false,
            destroyHotKeys:false,
            listener:this.props.listener||{},
            buttons: {
                sure: {
                    name: this.props.Lang['10140SUG-000074'],
                    key: 'sure',id:'sure',
                    className:'button-primary',
                   // style: {backgroundColor: '#eee', color: '#666'},//#E14C46
                    onClick:this.closeOk
                },
                cancel: {
                    name: this.props.Lang['10140SUG-000004'],
                    key: 'cancel',id:'cancel',
                    className:'second-button',
                   // style: {backgroundColor: '#eee', color: '#666', marginLeft: '9px'},
                    onClick:this.close
                }
            },
            hotKeysCfg:{
                className:"simpleModal-hotkeys-wrapper",
                enabled:true,
                focused:true,
                display:"inline-block",
                keyMap:{
                    ok: USUAL_KEYS.NC_MODAL_CONFIRM,
                    cancel: ['Alt+N'],
                    close:'Esc'},
                handlers:{
                   ok:()=>{this.state.showDialog && !this.state.destroyHotKeys && this.closeOk(true)},
                   cancel:()=>{this.state.showDialog && !this.state.destroyHotKeys && this.close(true);},
                   close:()=>{this.state.showDialog && !this.state.destroyHotKeys && this.close(true);}
                }
            }
        },this.props)
    }
    prevOverflow = null;
    setButtonName = (sureName,cancelName)=>{
        this.state.buttons.sure.name = sureName || this.state.buttons.sure.name;
        this.state.buttons.cancel.name = cancelName || this.state.buttons.cancel.name;
        this.setState(this.state);
    }
    componentWillReceiveProps(newProps){
        this.setState(newProps);
    }

    closeOk = (isHotKeyClick = false)=>{
        (this.state.listener.onBeforeSureClick && typeof this.state.listener.onBeforeSureClick ==='function')?
            this.state.listener.onBeforeSureClick(this.closeDialog.bind(this,this.state.listener.onAfterSureClick),this.destroyHotKeys):
            this.closeDialog(this.state.listener.onAfterSureClick?this.state.listener.onAfterSureClick:null);  
    }
    destroyHotKeys = (destroyHotKeys,callback)=>{
        this.state.destroyHotKeys = destroyHotKeys;
        this.setState(this.state,callback);
    }
    close = (isHotKeyClick = false)=>{
        (this.state.listener.onBeforeCancelClick
            && typeof this.state.listener.onBeforeCancelClick ==='function')?
            this.state.listener.onBeforeCancelClick(this.closeDialog.bind(this,this.state.listener.onAfterCancelClick),this.destroyHotKeys):
            this.closeDialog(this.state.listener.onAfterCancelClick?this.state.listener.onAfterCancelClick:null);
    }
    closeDialog =(after)=>{
        this.setState({showDialog:false},()=>{
            after && typeof after === 'function' && after();
            document.body.style.overflow = this.prevOverflow || 'auto';
            this.prevOverflow = null;
        });
    }
    showDialog=(config,callback)=>{
        this.state = Object.assign(this.state,config,{showDialog:true});
        this.setState(this.state,()=>{
            this.prevOverflow =  document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            this.state.listener.onAfterShow && this.state.listener.onAfterShow()
            callback && callback();
        });
    }
    renderDefaultButtons = ()=>{
        /**
         * 渲染默认按钮
         */
        const renderDefaultButton = ()=>{
            let {buttons,hotKeysCfg} = this.state;let {sure,cancel} = buttons;
            let config = {
                btnComps:[sure,cancel].map((btn)=>{
                    return <NCButton {...btn}>{btn.name}</NCButton>
                }),
                hotKeysCfg
            }
            return <SupHotKeys {...config}/>
        }
        return(
            <NCRow style={{'margin-left':'auto','margin-right':'auto'}}>
                <NCCol xs={12} md={12} sm={12}>
                    {renderDefaultButton()}
                </NCCol>
            </NCRow>
        )
    }
    render(){
        let {buttons,hotKeysCfg} = this.state;
            let cfg = {
                btnComps:<a className="refer-close iconfont icon-guanbi" onClick={this.close} key="5" />,
                hotKeysCfg
            };
        return(
            <div
                className="refer-pop-window"
                style={{ display: this.state.showDialog ? 'flex' : 'none','z-index':this.state.dialogZIndex }}
                onMouseOver={(e) => {e.stopPropagation();}} fieldid="newDialog_modal-area">
                <div
                    className="refer-popover clearfix"
                    ref={(dom) => {this.popover = dom;}}
                    onClick={(e) => {e.stopPropagation();}}
                    style={{width:this.state.dialogWidth,height:this.state.dialogHeight}}>
                    <div className="refer-header">
                        <div className="refer-title" key="1" fieldid= {this.state.dialogTitle || ''+"_title"}>
                            {this.state.dialogTitle || ''}
                        </div>
                        <div className="refer-header-extend" key="2"/>
                        <SupHotKeys {...cfg}/>
                        {/* <a className="refer-close iconfont icon-guanbi" onClick={this.close} key="5" /> */}
                    </div>
                    {/*渲染内容区*/}
                    <div style={{padding: 20}} className={`refer-content-area ${this.state.showFooter?'ncc-hr-dialog-content-area0':'ncc-hr-dialog-content-area1'}`} style={{ width: '100%', 'overflow':'auto'}}>
                        {this.state.listener.renderContentArea ? this.state.listener.renderContentArea():this.props.Lang['10140SUG-000075']/* 国际化处理： 无数据!*/}
                    </div>
                    {/*渲染bottom确认和取消按钮*/}
                    {this.state.showFooter &&
                    <div className="loading-container">
                        <div className="refer-buttom" style={{textAlign:'right'}}>
                            <div className="buttons" style={{width:'100%',marginTop: 8,marginRight: 8,paddingRight:10}} key="3">
                                {this.state.showDefaultBtn?this.renderDefaultButtons():this.state.listener.renderButtons?this.listener.renderButtons():null}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        )
    }
}

//pzPQOCNyrLX4Rl6sWYkkb5b3fvyIi+OBsbDpZZPLSRN3O2sNslsuX4C2f/hIH7Y6