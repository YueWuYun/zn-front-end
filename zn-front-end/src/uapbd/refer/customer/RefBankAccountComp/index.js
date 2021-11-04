//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65
import React,{Component} from 'react';
import {base, ajax, toast, high} from 'nc-lightapp-front';
import '../refStyle/index.less';
const {PopRefer} = high.Refer;
const {NCRow, NCButton} = base;
/**
 * 银行账号IBAN参照
 * author zhenmx
 * 银行iban规则和bban规则优先取iban域规则
 * 来决定银行码标识b和银行账户标识c bban校验码x的长度
 * 生成的时候再拿bban规则校验一下符不符合比如
 * iban域规则中银行码的长度为x bban规则中银行码的长度为y
 * 时应该提示用户不符合bban规则
 *
 */
class BankAccountRef extends PopRefer {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // 继承state
            formId: props.ibanFormId,
            yhm: 0,
            yhzh: 0,
            bbanjym: 0,
            code: '',
            bankcode: '',
            ibanrule: '',
            bbanrule: '',
            ibanlength: '',
            bbanlength: ''
        }
    }

    /**
     * 去除查询区
     * @returns {null}
     */
    renderPopoverSearchArea = () => {
        return null
    }
    /**
     *去除刷新和最大化按钮
     * @returns {null}
     */

    // renderPopoverHeader = ()=>{return null}
    /**
     * 复写原型方法：点击参照三个点的事件
     * 为了在打开弹出层时调用自己的方法加载数据
     * @returns {boolean}
     */
    show = () => {
        let {disabled} = this.props;
        if (disabled) {
            return false;
        }
        this.setState({
            isShow: true,
            isFirstShow: false,
            dropDownShow: false
        }, () => {
            let param = this.getParam();
            this.loadBankDoc(param).then((data) => {
                this.setFormData(this.state.formId, data);
            });
        });
    };
    handleInput = val => {this.focusFlag = true;this.setState({referVal: val,dropDownShow: false});};
    /**
     * 取消点击参照以外的地方会关闭弹出层的情况
     * @param e
     */
    close = (e) => {
    };
    /**
     * 复写原型方法：渲染弹出层内容区
     * 这里主要为了调节渲染宽度
     * @returns {*}
     */
    renderPopoverContain = () => {
        const {refType} = this.props;
        let {activeKey} = this.state;
        return refType === 'gridTree' && activeKey == 1 ? (
            <NCRow className="refer-content-area" style={{width: '1020px'}}>
                {this.renderPopoverRight()}
            </NCRow>
        ) : (
            <NCRow className="refer-content-area">
                {refType !== 'grid' && (
                    <div style={{width: refType === 'tree' ? '640px' : '240px'}} className="refer-tree">
                        {this.renderPopoverLeft()}
                    </div>
                )}
                {refType !== 'tree' && (
                    <div style={{width: '900px'}} className="refer-grid">
                        {this.renderPopoverRight()}
                    </div>
                )}
            </NCRow>
        );
    }
    getParam = () => {
        return {
            pid: '',
            keyword: '',
            pageInfo: null,
            queryCondition: {
                pk_bankdoc: this.props.form.getFormItemsValue(this.props.mainFormId, 'pk_bankdoc').value,
                actionName: 'loadBankDoc'
            }
        }
    }
    /**
     * 重写弹出层底部按钮
     * @returns {*[]}
     */
    renderPopoverBottom = () => {
        return [
            <div className="refer-bottom-extend" key="2"/>,
            <div className="buttons" key="3">
                <NCButton
                    style={{
                        backgroundColor: '#E14C46',
                        color: '#fff',
                        marginLeft: '9px'
                    }}
                    onClick={this.generateIban}
                >
                    {this.props.json['ibanlang-000014']/* 国际化处理： 生成IBAN*/}
                </NCButton>
                <NCButton
                    style={{
                        backgroundColor: '#eee',
                        color: '#666',
                        marginLeft: '9px'
                    }}
                    onClick={this.beSure.bind(this, this.onClosePopover)}
                >
                    {this.props.json['ibanlang-000015']/* 国际化处理： 确定*/}
                </NCButton>
                <NCButton
                    style={{
                        backgroundColor: '#eee',
                        color: '#666',
                        marginLeft: '9px'
                    }}
                    onClick={this.onClosePopover}
                >
                    {this.props.json['ibanlang-000016']/* 国际化处理： 取消*/}
                </NCButton>
            </div>
        ]
    }
    /**
     * 设置表单数据 主要设置银行码
     * @param target
     * @param data
     */
    setFormData = (target, data) => {
        this.props.form.setFormStatus(target, 'edit');

        this.setState({
            bankcode: data.bankcode
        }, () => {
            this.props.form.setFormItemsValue(target, {
                'bankcode': {
                    value: data.bankcode,
                    display: data.bankcode
                }
            });
        })

    };
    /**
     * 请求银行档案数据
     * @param param
     * @returns {Promise<any>}
     */
    loadBankDoc = async (param) => {
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
                            toast({color: 'danger', content: e.message});
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
    renderPopoverRight = () => {
        let {form} = this.props;
        const {createForm} = form;
        return (
            <div>
                {
                    createForm(this.state.formId, {
                        onAfterEvent: this.onAfterFormEvent
                    })
                }
            </div>

        )
    }
    /**
     * iban表单编辑后事件
     *
     */
    onAfterFormEvent = (props, moduleId, key, value, oldValue) => {
        switch (key) {
            case'pk_country':
                ajax({
                    url: this.props.queryGridUrl,
                    data: {
                        pid: '',
                        keyword: '',
                        pageInfo: null,
                        queryCondition: {
                            pk_country: value.value,
                            actionName: 'loadIbaninfoByCountry'
                        }
                    },
                    success: (res) => {
                        let {success, data} = res;
                        if (success && data) {
                            let code = data.code;
                            let ibanrule = data.ibanrule;
                            let bbanrule = data.bbanrule;
                            let ibanlength = data.ibanlength;
                            let bbanlength = 0;
                            if (!!!data.bbanrule || !!!data.ibanrule) {
                                toast({
                                    color: 'warning',
                                    title: this.props.json['ibanlang-000000']/* 国际化处理： 国家的IBan规则为空，请先维护！*/
                                });
                                props.form.setFormItemsValue(this.state.formId, {
                                    'pk_country': {value: '', display: ''},
                                    'rule': {value: '', display: ''},
                                    'IBAN': {value: '', display: ''},
                                    'bankaccount': {value: '', display: ''},
                                    'bbancheckcode': {value: '', display: ''},
                                    'bankcode': {value: '', display: ''}
                                });
                                return
                            }
                            props.form.setFormItemsValue(this.state.formId, {
                                'rule': {value: '', display: ''},
                                'IBAN': {value: '', display: ''},
                                'bankaccount': {value: '', display: ''},
                                'bbancheckcode': {value: '', display: ''},
                                'bankcode': {value: '', display: ''}
                            });
                            bbanrule.split(',').map((i) => {
                                bbanlength = Number(bbanlength) + Number(i.substring(0, i.length - 1));
                            })

                            let ibanstr = data.ibanrule.substring(4, data.ibanrule.length);
                            let yhm = (ibanstr.split('b')).length - 1;
                            let yhzh = (ibanstr.split('c')).length - 1;
                            let bbanjym = (ibanstr.split('x')).length - 1;

                            let meta = props.meta.getMeta();
                            meta[this.state.formId]['items'].map((item) => {
                                if (item.attrcode == 'bankcode') {
                                    item.reg = !!!data.ibanrule || !!!data.bbanrule ?
                                        new RegExp('') : new RegExp('^[0-9a-zA-Z]{' + yhm + '}$');

                                    item.errorMessage =
                                        !!!data.ibanrule || !!!data.bbanrule ?
                                            this.props.json['ibanlang-000001'] :/* 国际化处理： 国家的Iban规则为空，请先维护！*/
                                            this.props.json['ibanlang-000002'] + yhm + this.props.json['ibanlang-000003'];/* 国际化处理： 银行码应为,位*/
                                }
                                if (item.attrcode == 'bankaccount') {
                                    item.reg = !!!data.ibanrule || !!!data.bbanrule ?
                                        new RegExp('') : new RegExp('^[0-9a-zA-Z]{' + yhzh + '}$');
                                    item.errorMessage =
                                        !!!data.ibanrule || !!!data.bbanrule ?
                                            this.props.json['ibanlang-000001'] :/* 国际化处理： 国家的Iban规则为空，请先维护！*/
                                            this.props.json['ibanlang-000004'] + yhzh + this.props.json['ibanlang-000003'];/* 国际化处理： 银行账号应为,位*/
                                }
                                if (item.attrcode == 'bbancheckcode') {
                                    item.reg = !!!data.ibanrule || !!!data.bbanrule ?
                                        new RegExp('') : new RegExp('^[0-9a-zA-Z]{' + bbanjym + '}$');
                                    item.errorMessage =
                                        !!!data.ibanrule || !!!data.bbanrule ?
                                            this.props.json['ibanlang-000001'] :/* 国际化处理： 国家的Iban规则为空，请先维护！*/
                                            this.props.json['ibanlang-000005'] + bbanjym + this.props.json['ibanlang-000003'];/* 国际化处理： BBAN校验码应为,位*/

                                }
                            });
                            this.setState({
                                yhm: yhm,
                                yhzh: yhzh,
                                bbanjym: bbanjym,
                                code: code,
                                ibanrule: ibanrule,
                                bbanrule: bbanrule,
                                ibanlength: ibanlength,
                                bbanlength: bbanlength
                            }, () => {
                                props.meta.setMeta(meta, () => {
                                    props.form.setFormItemsValue(this.state.formId, {
                                        'rule': {value: data.ibanrule || '', display: data.ibanrule || ''}
                                    });
                                });
                            });

                        }
                    }
                });
                break;
            default:
                break;

        }
    }
    /**
     * 生成IBAN号
     *
     */
    generateIban = () => {
        let formItems = this.props.form.getFormItemsValue(this.state.formId,
            ['pk_country', 'rule', 'bankcode', 'bankaccount', 'bbancheckcode']);
        //国家未选择直接点生成iban按钮直接return nc逻辑
        if (!!!formItems[0].value) {
            toast({color: 'warning', title: this.props.json['ibanlang-000006']});/* 国际化处理： 请先选择国家！*/
            return;
        }
        //选择国家以后如果iban域规则为空提示
        if (!!!formItems[1].value) {
            toast({color: 'warning', title: this.props.json['ibanlang-000007']});/* 国际化处理： 所选国家的IBAN规则为空！*/
            return;
        }

        // if (this.props.form.isCheckNow(this.state.formId)) {
        //
        // }
        if (Number(formItems[2].value.length) + Number(formItems[3].value.length) + Number(formItems[4].value.length) != this.state.bbanlength) {
            toast({
                color: 'warning',
                content: this.props.json['ibanlang-000008'] + this.state.bbanrule + this.props.json['ibanlang-000009']/* 国际化处理： 不符合BBAN规则:,，请修改后重新生成IBAN！*/
            });
            return;
        }
        let ibanFront = this.state.ibanrule.substring(0, 4);
        this.props.form.setFormItemsValue(this.state.formId, {
            'IBAN': {
                display: ibanFront + formItems[2].value + formItems[3].value,
                value: ibanFront + formItems[2].value + formItems[3].value
            }
        });
    }

    /**
     *确定
     *
     */
    beSure = (callback) => {
        //如果已经生成好了iban 点确定回显到单据上
        !!this.props.form.getFormItemsValue(this.state.formId, 'IBAN')
            .value && this.props.onAfterSave(this.props.form.getFormItemsValue(this.state.formId, 'IBAN'));
        !!this.props.form.getFormItemsValue(this.state.formId, 'IBAN')
            .value && callback && callback.call(this);
        //如果没有生成IBAN点确定提示
        !!this.props.form.getFormItemsValue(this.state.formId, 'IBAN')
            .value || toast({
            color: 'warning',
            title: this.props.json['ibanlang-000010']/* 国际化处理： 尚未生成IBAN，请先生成！*/
        })

    }
    /**
     * 关闭弹出层
     */
    onClosePopover = () => {
        this.setState({
            isShow: false,
            isFirstShow: false,
            dropDownShow: false,
            country: {},
            province: {},
            city: {},
            vsection: {},
            postcode: '',
            detailinfo: ''
        }, () => {
            this.props.form.EmptyAllFormValue(this.state.formId);
        });
    }
}
export default function (props = {}) {
    return <BankAccountRef {...Object.assign({
        placeholder:props.json['ibanlang-000011'],/* 国际化处理： 银行账号*/
        refName:props.json['ibanlang-000011'],/* 国际化处理： 银行账号*/
        refType:'grid',
        queryGridUrl:'/nccloud/uapbd/bankacc/queryBankDoc.do',
        columnConfig:[{
            name: [ props.json['ibanlang-000012'], props.json['ibanlang-000013'] ],/* 国际化处理： 编码,名称*/
            code: [ 'refcode', 'refname' ]
        }]
    }, props)} />
}

//bLkXFuKw3KUaZeb8Dj31ZbW4TYbp/FpJTggm9pjHvEEfh1GZfWjTZgkhzpdZeH65