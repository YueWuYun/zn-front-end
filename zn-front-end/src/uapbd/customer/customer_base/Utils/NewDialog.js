//h5nQ7Y18tV8BUrFRHLMheaPU8Aap+Rs6M1bY+7kUnGlPR8xtypo8wlPak49KMbAV
import React,{Component} from 'react';
import {base} from 'nc-lightapp-front';
import './Dialog.less';
const{NCRow,NCCol,NCButton} = base;

/****
 *  NewDialog 和 OldDialog 的区别
 *  OldDialog：传递的参数 需要在初始页面的时候传递好，在触发的时候不能传递参数
 *  NewDialog: 传递的参数 在初始页面时可以传递，在触发打开的时候也可以传递
 *
 *  比如 有些时候，触发Dialog时需要异步请求返回的结果，这时候就可以使用NewDialog
 *
 */
export default class NewDialog extends Component{
    constructor(props){
        super(props);
        this.state = Object.assign({
            showDialog:false,
            dialogTitle:'',
            dialogZIndex:'100',
            dialogWidth:'50%',
            dialogHeight:'50%',
            showFooter:true,
            showDefaultBtn:true,
            listener:this.props.listener||{},
            buttons: {
                sure: {
                    name: '',
                    key: 'sure',
                    style: {backgroundColor: '#eee', color: '#666'},//#E14C46
                    action: () => {
                        this.closeOk();
                    },
                },
                cancel: {
                    name: '',
                    key: 'cancel',
                    style: {backgroundColor: '#eee', color: '#666', marginLeft: '9px'},
                    action: () => {
                        this.close();
                    },
                }
            }
        },this.props)
    }
    setButtonName = (sureName,cancelName)=>{
        this.state.buttons.sure.name = sureName || this.state.buttons.sure.name;
        this.state.buttons.cancel.name = cancelName || this.state.buttons.cancel.name;
        this.setState(this.state);
    }
    componentWillReceiveProps(newProps){
        this.setState(newProps);
    }
    closeOk = ()=>{
        console.log(this.state.listener.onBeforeSureClick);
        (this.state.listener.onBeforeSureClick
            && typeof this.state.listener.onBeforeSureClick ==='function')?
            this.state.listener.onBeforeSureClick(this.closeDialog.bind(this,this.state.listener.onAfterSureClick)):
            this.closeDialog(this.state.listener.onAfterSureClick?this.state.listener.onAfterSureClick:null);
    }
    close = ()=>{
        (this.state.listener.onBeforeCancelClick
            && typeof this.state.listener.onBeforeCancelClick ==='function')?
            this.state.listener.onBeforeCancelClick(this.closeDialog.bind(this,this.state.listener.onAfterCancelClick)):
            this.closeDialog(this.state.listener.onAfterCancelClick?this.state.listener.onAfterCancelClick:null);
    }
    closeDialog =(after)=>{
        document.body.style.overflow = 'auto';
        this.setState({showDialog:false},()=>{
            after && typeof after === 'function' && after();
        });
    }
    showDialog=(config,callback)=>{
        document.body.style.overflow = 'hidden';
        this.state = Object.assign(this.state,config,{showDialog:true});
        this.setState(this.state,()=>{
            this.state.listener.onAfterShow && this.state.listener.onAfterShow()
            callback && callback();
        });
    }
    renderDefaultButtons = ()=>{
        /**
         * 渲染默认按钮
         */
        const renderDefaultButton = ()=>{
            if(this.state.buttons){
                return Object.values(this.state.buttons).map((button)=>{
                    return <NCButton style={button.style} onClick={button.action}>{button.name}</NCButton>
                })
            }
        }
        return(
            <NCRow style={{'margin-left':'auto','margin-right':'auto'}}>
                <NCCol xs={12} md={12} sm={12}>
                {renderDefaultButton.call(this)}
                </NCCol>
            </NCRow>
        )
    }
    render(){
        return(
            <div
                className="refer-pop-window"
                style={{ display: this.state.showDialog ? 'flex' : 'none','z-index':this.state.dialogZIndex }}
                onMouseOver={(e) => {e.stopPropagation();}}>
                <div
                    className="refer-popover clearfix"
                    ref={(dom) => {this.popover = dom;}}
                    onClick={(e) => {e.stopPropagation();}}
                    style={{width:this.state.dialogWidth,height:this.state.dialogHeight}}>
                    <div className="refer-header">
                        <div className="refer-title" key="1">
                            {this.state.dialogTitle || ''}
                        </div>
                        <div className="refer-header-extend" key="2"/>
                        <div className="refer-close iconfont icon-guanbi" onClick={this.close} key="5" />
                    </div>
                    {/*渲染内容区*/}
                    <div style={{padding: 20}} className={`refer-content-area ${this.state.showFooter?'ncc-hr-dialog-content-area0':'ncc-hr-dialog-content-area1'}`} style={{ width: '100%', 'overflow':'auto'}}>
                        {this.state.listener.renderContentArea ? this.state.listener.renderContentArea():''}
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

//h5nQ7Y18tV8BUrFRHLMheaPU8Aap+Rs6M1bY+7kUnGlPR8xtypo8wlPak49KMbAV