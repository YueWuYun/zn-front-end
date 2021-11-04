//MfsJ+3nXoV/EAdf+VaxnsukDs9/kkDeaGy3YyZPA18iNdtdB77O4dRmrzS2hWhP+
import React, { Component } from 'react';
import { createPage, base, ajax ,toast,high} from 'nc-lightapp-front';
const {PopRefer,MultiLangWrapper} = high.Refer;
import './index.less';
const {NCRow,NCButton} = base;
/**
 * liupzhc 联系人 卡片界面
 *
 */
class LinkmanRefer extends PopRefer{
    constructor(props){
        super(props);
        this.state = {
            ...this.state, // 继承state
            oldData:null,
            areacode:'linkmanRefer',
            urls:{
                saveLinkmanUrl:'/nccloud/uapbd/ref/SaveReferLinkman.do'
            }
        };

    }
    componentWillReceiveProps(newProps){
        this.setState({...newProps});
    }
    /**
     * 去除查询区
     * @returns {null}
     */
    renderPopoverSearchArea=()=>{return null}
    /**
     * 复写原型方法：点击参照三个点的事件
     * 为了在打开弹出层时调用自己的方法加载数据
     * @returns {boolean}
     */
    show = () => {
        debugger
        let { disabled,form,value} = this.props;
        if (disabled) {
            return false;
        }
        let param = this.__getParam({});
        /**
         * 确保加载联系人的时候有pk值
         */
        if(!param.queryCondition || !param.queryCondition.pk_linkman){
            param.queryCondition.pk_linkman = value.value;
        }
        //打开的时候清空表单数据，然后赋值
        form.EmptyAllFormValue(this.state.areacode);
        this.loadLinkmanData(param).then((data) => {
            this.setState({oldData:data},()=>{
                this.setFormData('linkmanRefer',data);
            });
        });
        this.setState({
            isShow: true,
            isFirstShow: false,
            dropDownShow: false
        });
    };
    /**
     * 取消点击参照以外的地方会关闭弹出层的情况
     * @param e
     */
    close = (e) => {};
    /**
     *  复写原型方法：渲染弹出层头部
     * @returns {*[]}
     */
    renderPopoverHeader = () => {
        let { isMultiSelectedEnabled } = this.props;
        const { refName } = this.props;
        return [
            <div className="refer-title" key="1">
                {refName}
            </div>,
            <div className="refer-header-extend dnd-cancel" key="2">
                {this.renderPopoverHeaderExtend()}
            </div>,
            <div className="refer-refresh iconfont icon-shuaxin cancel-drag" onClick={this.refresh} key="3" />,
            <div className="refer-max iconfont icon-zuidahua cancel-drag" onClick={ () => {
                this.max()
            }} key="4" />,
            <div className="refer-close iconfont icon-guanbi cancel-drag" onClick={()=>{this.onCancel(this.onClosePopover)}} key="5" />
        ];
    };

    /**
     * 复写原型方法：渲染弹出层内容区
     * 这里主要为了调节渲染宽度
     * @returns {*}
     */
    renderPopoverContain = () => {
        const { refType } = this.props;
        let { activeKey } = this.state;
        return refType === 'gridTree' && activeKey == 1 ? (
            <NCRow className="refer-content-area" style={{ width: '1020px' }}>
                {this.renderPopoverRight()}
            </NCRow>
        ) : (
            <NCRow className="refer-content-area">
                {refType !== 'grid' && (
                    <div style={{ width: refType === 'tree' ? '640px' : '240px' }} className="refer-tree">
                        {this.renderPopoverLeft()}
                    </div>
                )}
                {refType !== 'tree' && (
                    <div style={{ width:'900px' }} className="refer-grid">
                        {this.renderPopoverRight()}
                    </div>
                )}
            </NCRow>
        );
    };
    /**
     * 重写弹出层底部按钮
     * @returns {*[]}
     */
    renderPopoverBottom = ()=>{
        return [
                <div className="refer-bottom-extend" key="2" />,
                <div className="buttons" key="3">
                    <NCButton
                        style={{
                            backgroundColor: '#E14C46',
                            color: '#fff'
                        }}
                        onClick={()=>{this.onSaveLinkman(this.onClosePopover)}}
                    >
                        {this.props.multiLang['refer-001010']}
                    </NCButton>
                    <NCButton
                        style={{
                            backgroundColor: '#eee',
                            color: '#666',
                            marginLeft: '9px'
                        }}
                        onClick={()=>{this.onCancel(this.onClosePopover)}}
                    >
                        {this.props.multiLang['refer-001011']}
                    </NCButton>
                </div>
            ]
    }
    /**
     * 设置表单数据
     * @param target
     * @param data
     */
    setFormData = (target,data) => {
        this.props.form.setFormStatus(target,'edit');
        debugger
        //设置表单数据
        !!data && this.props.form.setAllFormValue({[target]:data[target]});
    };
    /**
     * 请求联系人数据
     * @param param
     * @returns {Promise<any>}
     */
    loadLinkmanData = async (param) => {
        return await new Promise((resolve) => {
            this.setState(
                {
                    loading: true
                },
                () => {
                    let {queryGridUrl} = this.props;
                    ajax({
                        url: queryGridUrl,
                        data: param,
                        loading: false,
                        success: (res) => {
                            
                            let dealFormulamsg = (this.props.dealFormulamsg && typeof this.props.dealFormulamsg === 'function') ? this.props.dealFormulamsg : null;
                            if(!!dealFormulamsg && res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0){
                                dealFormulamsg(res,)
                            }
                            this.setState({
                                loading: false
                            });
                            if (!res.success) {
                                throw new Error(res.error.message);
                                return;
                            }
                            resolve(res.data);
                        },
                        error: (e) => {
                            toast({ color: 'danger', content: e.message });
                            this.setState({
                                loading: false
                            });
                            throw new Error(e);
                        }
                    });
                }
            );
        });
    };
    /**
     * 复写弹出层右侧内容区
     * @returns {*}
     */
    renderPopoverRight = ()=>{
        let {form} = this.props;
        const {createForm} = form;
        return(<div>
            {
                createForm('linkmanRefer',{
                    onAfterEvent:this.onAfterFormEvent
                })
            }
        </div>
        )
    }
    /**
     * 表单编辑后事件
     */
    onAfterFormEvent = ()=>{

    }
    /**
     * 保存联系人信息
     * @param callback
     */
    onSaveLinkman = (callback)=>{
        let _this = this;
        if(!this.props.form.isCheckNow(this.state.areacode)) {
            return;
        }
        //获得验证公式
        let validateToSave = (this.props.validateToSave && typeof this.props.validateToSave === 'function')?this.props.validateToSave:null;

        let formData = this.props.form.getAllFormValue(this.state.areacode);//获得表单信息
        formData.areacode = this.state.areacode;//添加表单的areacode编码
        formData.rows['status'] = '2';//设置状态
        let requestParam = {
            model : formData,
            pageid : this.props.pageid
        };
        let {selectedValue} = this.props;
        !!validateToSave ?validateToSave(requestParam,()=>{this.saveLinkman(requestParam,callback);},{[this.state.areacode]:'form'},'form'):
        this.saveLinkman(requestParam,callback);
    }
    saveLinkman = (requestParam,callback)=>{
        let _this = this;
        ajax({
            url:_this.state.urls.saveLinkmanUrl,
            data:requestParam,
            success:(res)=>{
                if(res.success){
                    // selectedValue = res.data;
                    //保存完成关闭弹出层
                    callback && callback();
                    _this.props.onAfterEdit && _this.props.onAfterEdit(res.data);
                }
            }
        })
    }
    
    handleInput = val => {this.focusFlag = true;this.setState({referVal: val,dropDownShow: false});};
    onCancel = (callback)=>{
        this.props.onAfterEdit && this.props.onAfterEdit(this.state.oldData);
        callback && callback();
    }
    /**
     * 关闭弹出层
     */
    onClosePopover = ()=>{
        this.setState({
            isShow: false,
            isFirstShow: false,
            dropDownShow: false
        });
    }
}

const LinkmanReferWrapper = MultiLangWrapper(LinkmanRefer)
export default LinkmanReferWrapper;



//MfsJ+3nXoV/EAdf+VaxnsukDs9/kkDeaGy3YyZPA18iNdtdB77O4dRmrzS2hWhP+