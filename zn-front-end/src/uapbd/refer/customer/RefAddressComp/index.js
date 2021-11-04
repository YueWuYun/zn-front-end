//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React, { Component } from 'react';
import {base, ajax ,toast,high} from 'nc-lightapp-front';
const {PopRefer} = high.Refer;
import './index.less';
const {NCRow,NCButton} = base;
/**
 *  zhenmx 地址簿 卡片界面
 */
class AddressRef extends PopRefer{
    constructor(props){
        super(props);
        this.state = {
            ...this.state, // 继承state
            formId:props.AddressReferId,//表单的id
            country:{
                value:'',
                display:''
            },
            province:{
                value:'',
                display:''
            },
            city:{
                value:'',
                display:''
            },
            vsection:{
                value:'',
                display:''
            },
            postcode:'',
            detailinfo:'',
            addfullname:''
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
        let param = this.__getParam();
        param.queryCondition = Object.assign({
            areacode:this.state.formId,
            pagecode:this.props.pagecode,
            pk_address:this.props.value.value
        },param.queryCondition);


        this.props.form.EmptyAllFormValue(this.state.formId);
        this.loadAddressData(param).then((data) => {
            this.setFormData(this.state.formId,data);
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
                    onClick={()=>{this.onSaveAddress(this.onClosePopover)}}
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

        if(!!data) {
            this.props.form.setAllFormValue({[target]: data[target]});
            this.state.addfullname = [data[target].rows[0]['values']['postcode']['value'],
                data[target].rows[0]['values']['country']['display'],
                data[target].rows[0]['values']['province']['display'],
                data[target].rows[0]['values']['city']['display'],
                data[target].rows[0]['values']['vsection']['display'],
                data[target].rows[0]['values']['detailinfo']['value']].join('');
            this.state.country = data[target].rows[0]['values']['country'];
            this.state.province = data[target].rows[0]['values']['province'];
            this.state.city = data[target].rows[0]['values']['city'];
            this.state.vsection = data[target].rows[0]['values']['vsection'];
            this.state.postcode = data[target].rows[0]['values']['postcode'];
            this.state.detailinfo = data[target].rows[0]['values']['detailinfo'];
            this.setState(this.state, () => {
                this.props.form.setFormItemsValue(target, {
                    'addfullname': {
                        value: this.state.addfullname,
                        display: this.state.addfullname
                    }
                });
            });
        }
    };
    /**
     * 请求地址簿数据
     * @param param
     * @returns {Promise<any>}
     */
    loadAddressData = async (param) => {
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
                            toast({ color: 'warning', content: e.message });
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
    onAfterFormEvent=(props,moduleId,key,value,data)=>{

        let meta = props.meta.getMeta();

        switch (key) {
            case'country':
                let provinceitem =  meta[moduleId]['items'].find(item=>item.attrcode ==='province');
                provinceitem.queryCondition = {
                    pk_country:value.value,
                    pk_father:'~'
                }
                this.state.country = value;
                this.state.province = {value: null, display: null};
                this.state.city = {value: null, display: null};
                this.state.vsection = {value: null, display: null};
                props.form.setFormItemsValue(moduleId, {
                    'province': {value: null, display: null},
                    'city': {display: null, value: null},
                    'vsection':{display: null, value: null}
                });

                break;
            case'province':
                let cityitem = meta[moduleId]['items'].find(item=>item.attrcode ==='city');
                cityitem.queryCondition = {
                    pk_country:this.state.pk_country,
                    pk_father:value.value
                }
                this.state.province = value;
                this.state.city = {display: null, value: null};
                this.state.vsection = {display: null, value: null};
                props.form.setFormItemsValue(moduleId, {
                    'city': {display: null, value: null},
                    'vsection':{display: null, value: null}
                });
                break;
            case'city':
                let vsectionitem = meta[moduleId]['items'].find(item=>item.attrcode ==='vsection');
                vsectionitem.queryCondition = {
                    pk_country:this.state.pk_country,
                    pk_father:value.value
                }
                this.state.city = value;
                this.state.vsection = {display: null, value: null};
                props.form.setFormItemsValue(moduleId, {
                    'vsection':{display: null, value: null}
                });
                break;
            case'vsection':
                this.state.vsection = value;
                break;
            case'postcode':
                this.state.postcode = value;
                break;
            case'detailinfo':
                this.state.detailinfo = value;
                break;
            default:
                break;

        }
        this.state.addfullname =[
            this.state.postcode.value,
            this.state.country.display,
            this.state.province.display,
            this.state.city.display,
            this.state.vsection.display,
            this.state.detailinfo.value].join('')
        this.setState(this.state,()=>{
            props.meta.setMeta(meta,()=>{
                props.form.setFormItemsValue(moduleId,{'addfullname':
                        {value:this.state.addfullname,
                            display:this.state.addfullname}});
            });
        });

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
                    createForm(this.state.formId,{
                        onAfterEvent:this.onAfterFormEvent.bind(this)
                    })
                }
            </div>

        )
    }

    /**
     * 保存地址簿信息
     * @param callback
     */
    onSaveAddress = (callback)=>{
        let _this = this;
        let formdata = _this.props.form.getAllFormValue(_this.state.formId);
        //如果什么都不输入点击确定
        !!formdata['rows'][0]['values']['addfullname']['value'] && ajax({
            url:_this.props.saveCustAddRef,
            data:{
                model:formdata,
                pageid:_this.props.pagecode,
                userjson:_this.state.formId
            },
            success:(res)=>{
                let{success,data} = res;
                if(success){
                    _this.state.selectedValues.set(data['pk_address'],data);
                    callback && callback();
                    _this.props.onAfterSave && _this.props.onAfterSave(data,_this.state.addfullname);
                }
            }
        });
        if(!!!formdata['rows'][0]['values']['addfullname']['value']){
            callback && callback();
        }
    }
    /**
     * 关闭弹出层
     */
    onClosePopover = ()=>{
        this.setState({
            isShow: false,
            isFirstShow: false,
            dropDownShow: false,
            country:{},
            province:{},
            city:{},
            vsection:{},
            postcode:'',
            detailinfo:''
        });
    }
}

export default function (props = {}) {
    return <AddressRef {...Object.assign({
        placeholder:props.json['10140CUST-000176'],
        refName:props.json['10140CUST-000176'],
        refType:'grid',
        queryGridUrl:'/nccloud/uapbd/custAddress/queryCustAddRef.do',
        saveCustAddRef:'/nccloud/uapbd/custAddress/saveCustAddRef.do'}, props)} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65