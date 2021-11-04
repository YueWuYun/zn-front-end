//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import { base, ajax ,toast,high} from 'nc-lightapp-front';
const {PopRefer} = high.Refer;
import '../refStyle/index.less';
const {NCRow,NCButton} = base;
/**
 *  联系人 卡片界面
 *
 */
class LinkmanRefer extends PopRefer{
    constructor(props){
        super(props);
        this.state = {
            ...this.state, // 继承state
            areacode:'10140LM',
            isBeEdit:false
        }
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
        let { disabled} = this.props;
        if (disabled) {
            return false;
        }
        this.props.form.EmptyAllFormValue('10140LM');
        let param = this.__getParam({});
        param.queryCondition = Object.assign({
            areacode:this.state.areacode,
            pagecode:this.props.pagecode,
            pk_linkman:this.props.value.value
        },param.queryCondition);

        this.loadLinkmanData(param).then((data) => {
            this.setFormData('10140LM',data);
        });
        this.setState({
            isShow: true,
            isFirstShow: false,
            dropDownShow: false
        });
    };
    handleInput = val => {this.focusFlag = true;this.setState({referVal: val,dropDownShow: false});};

    /**
     * 取消点击参照以外的地方会关闭弹出层的情况
     * @param e
     */
    close = (e) => {};
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
                    <div style={{ width: refType === 'tree' ? '480' : '360' }} className="refer-tree">
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
                    {this.props.json['10140CUST-000174']}
                </NCButton>
                <NCButton
                    style={{
                        backgroundColor: '#eee',
                        color: '#666',
                        marginLeft: '9px'
                    }}
                    onClick={this.onClosePopover}
                >
                    {this.props.json['10140CUST-000175']}
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
    onAfterFormEvent =(props, moduleId, key, value,oldValue)=>{
        this.state.isBeEdit = true;
        this.setState(this.state);
    }
    /**
     * 复写弹出层右侧内容区
     * @returns {*}
     */
    renderPopoverRight = ()=>{
        let {form} = this.props;
        const {createForm} = form;
        return(
            <div>
                {
                    createForm('10140LM',{
                        onAfterEvent:this.onAfterFormEvent
                    })
                }
            </div>

        )
    }

    /**
     * 保存联系人信息
     * @param callback
     */
    onSaveLinkman = (callback)=>{
        let _this = this;
        let formData = this.props.form.getAllFormValue(this.state.areacode);//获得表单信息
        formData.areacode = this.state.areacode;//添加表单的areacode编码
        let requestParam = {
            pageid:_this.props.pagecode,
            model : formData
        };
        let {selectedValue} = this.props;
        //如果触发过联系人的编辑后事件才能执行保存
        this.state.isBeEdit && ajax({
            url:_this.props.saveLinkmanUrl,
            data:requestParam,
            success:(res)=>{
                if(res.success){
                    selectedValue = res.data;
                    //保存完成关闭弹出层
                    callback && callback();
                    _this.props.onAfterSave && _this.props.onAfterSave(res.data);
                }
            }
        });
        if(!this.state.isBeEdit){
            callback && callback();
            _this.props.onAfterSave && _this.props.onAfterSave(null);
        }
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

export default function (props = {}) {
    return <LinkmanRefer {...Object.assign({
        placeholder:props.json['10140CUST-000177'],
        refName:props.json['10140CUST-000177'],
        refType:'grid',
        queryGridUrl:'/nccloud/uapbd/custsubinfo/queryLinkman.do',
        saveLinkmanUrl:'/nccloud/uapbd/custsubinfo/saveLinkman.do'}, props)} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65