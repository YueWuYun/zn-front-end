//yWLZuUfEAVgXxlZlcB1wbPGBFRyoJeqkYEWipsA10nB0tWR/m83QFfG6BZ4nyfZ/
import React,{Component} from 'react';
import {base} from 'nc-lightapp-front';
import './Dialog.less';
const{NCRow,NCCol,NCButton} = base;
var createComp = function(name){

}

export default class Dialog extends Component{

    componentWillReceiveProps(newProps){
        var updateProps = {
            show: newProps.show,
            compName: newProps.compName
        };
        this.setState({...updateProps});
    }

    constructor(props){
        super(props);
        this.listener = this.props.listener || {};
        this.state = {
            showDialog: this.props.showDialog || false,
            style:Object.assign({
                dialogWidth:'60%',
                dialogHeight:null,
                dialogZIndex: '300',
            },this.props.style),
            header:Object.assign({
                dialogTitle:'',
                onDialogClose:(before,after)=>{
                    before && typeof before === 'function' && before();
                    !before && this.listener.onBeforeHeaderCloseClick && this.listener.onBeforeHeaderCloseClick();
                    this.setState({showDialog:!this.state.showDialog},()=>{
                        document.body.style.overflow='auto';
                        after && typeof after === 'function' && after();
                        !after && this.listener.onAfterHeaderCloseClick && this.listener.onAfterHeaderCloseClick();
                    })
                }
            },this.props.header),
            shoulder:Object.assign({
                showShoulderArea: false,
                renderShoulder:()=>{}
            },this.props.shoulder),

            body:Object.assign({
              renderDialogContent:()=>{}
            },this.props.body),

            footer:Object.assign({
                renderInRight:true,
                defaultButton:{
                    sure:{
                        name:'确认',
                        key:'sure',
                        style:{ backgroundColor: '#E14C46',color: '#fff'},
                        action:()=>{
                            this.state.header.onDialogClose(this.listener.onBeforeSureClick,this.listener.onAfterSureClick);
                        },
                    },
                    cancel:{
                        name: '取消',
                        key:'cancel',
                        style:{backgroundColor: '#eee',color: '#666',marginLeft: '9px'},
                        action:()=>{
                            this.state.header.onDialogClose(this.listener.onBeforeCancelClick,this.listener.onAfterCancelClick);
                        },
                    }
                },
                renderSelfDefBtns:false,
                selfDefBtn:{
                    renderCancel:false,
                    buttonItem:[{name:'你好',action:()=>{},style:{}}]
                },

            },this.props.footer),
            showFooter:!!this.props.showFooter ? true:false,//默认显示底部按钮
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
     * 渲染
     * @returns {*}
     */
    renderFooterButtons(){
        /**
         * 渲染自定义按钮
         * @returns {any[]}
         */
        const renderButtonItems = ()=>{
            if(this.state.footer.renderSelfDefBtns){
                return this.state.footer.selfDefBtn.buttonItem.map((button)=>{
                    return <NCButton style={button.style} onClick={button.action}>{button.name}</NCButton>
                })
            }
        }
        /**
         * 渲染取消按钮
         */
        const renderCancelButton = ()=>{
            if(this.state.footer.renderSelfDefBtns && this.state.footer.selfDefBtn.renderCancel){
                return <NCButton style={this.state.footer.defaultButton.cancel.style} onClick={this.state.footer.defaultButton.cancel.action}>{this.state.footer.defaultButton.cancel.name}</NCButton>
            }
        }
        /**
         * 渲染默认按钮
         */
        const renderDefaultButton = ()=>{
            if(!this.state.footer.renderSelfDefBtns){
                return Object.values(this.state.footer.defaultButton).map((button)=>{
                    return <NCButton style={button.style} onClick={button.action}>{button.name}</NCButton>
                })
            }
        }
        return (
            <NCRow style={{'margin-left':'auto','margin-right':'auto'}}>
                <NCCol xs={12} md={12} sm={12}>
                    {renderButtonItems.call(this)}{renderCancelButton.call(this)}{renderDefaultButton.call(this)}
                </NCCol>
            </NCRow>
        )
    }
    render(){
        return(
            <div
                className="refer-pop-window"
                style={{ display: this.state.showDialog ? 'flex' : 'none','z-index':this.state.style.dialogZIndex }}
                onMouseOver={(e) => {e.stopPropagation();}}>
                <div
                    className="refer-popover clearfix"
                    ref={(dom) => {this.popover = dom;}}
                    onClick={(e) => {e.stopPropagation();}}
                    style={{width:this.state.style.dialogWidth,height:this.state.style.dialogHeight}}>
                    <div className="refer-header">
                        <div className="refer-title" key="1">
                            {this.state.header.dialogTitle || ''}
                        </div>
                        <div className="refer-header-extend" key="2"/>
                        <div className="refer-close iconfont icon-guanbi" onClick={this.state.header.onDialogClose} key="5" />
                    </div>
                    {/*渲染shoulder按钮*/}
                    {this.state.shoulder.showShoulderArea &&
                        <div className="refer-search">
                            {this.state.shoulder.renderShoulder()}
                        </div>
                    }
                    {/*渲染内容区*/}
                    <div className={`refer-content-area ${this.state.showFooter?'ncc-hr-dialog-content-area0':'ncc-hr-dialog-content-area1'}`} style={{ width: '100%', 'overflow':'auto'}}>
                        {this.state.body.renderDialogContent()}
                    </div>
                    {/*渲染bottom确认和取消按钮*/}
                    {this.state.showFooter &&
                        <div className="loading-container">
                            <div className="refer-buttom" style={{textAlign:'right'}}>
                                <div className="buttons" style={{width:'100%'}} key="3">
                                    {this.renderFooterButtons.call(this)}
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        )
    }
}
//yWLZuUfEAVgXxlZlcB1wbPGBFRyoJeqkYEWipsA10nB0tWR/m83QFfG6BZ4nyfZ/