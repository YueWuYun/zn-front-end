import React, { Component } from 'react'
import { createPage, base, ajax, high, deepClone, getMultiLang,toast } from 'nc-lightapp-front'
// const { NCModal,Modal, NCButton, NCMessage,NCTooltip ,NCHotKeys } = base
let { NCModal: Modal, NCButton: Button, NCFormControl: FormControl, NCTooltip, NCHotKeys } = base;
const { Transfer } = high
let { Header, Body, Footer, Title } = Modal;
import './index.less'

class SubCf extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTreeNode: null, // 左侧树选中行
            rows: [],
            selectedRow: null,
            pk_accountingbook: '',
            selectedTreeNodes: [],
            pks: '',
            targetKeys: [],//材料价格来源穿梭框右边的值
            dataSource: [],//材料价格来源穿梭框左边的值
            target: [],//切换时，将所有数据保存，需要确定时使用
            json: {},
            showFormModal: true
        }
        this.status = "";
    }

    componentDidMount() {
        //  this.qryData()
    }
    componentWillMount() {
        let callback = (json) => {
            this.setState({ json: json }, () => {
                this.getTransferData();
            })
        }
        getMultiLang({ moduleId: 'busiparam', currentLocale: 'simpchn', domainName: 'mapub', callback })
    }
    componentWillReceiveProps(nextProps) {
        // if (nextProps.showFormModal && nextProps.showFormModal==true) {
        this.getTransferData();
        // }
    }


    // 查询数据
    //查询穿梭框的值
    getTransferData = () => {
        //首先获取模态框中的值
        let dataSource = [];
        ajax({
            url: this.props.url,
            data: { pk_org: this.props.pk_org },
            async: false,
            success: (res) => {
                if (res.data) {
                    this.splitSysinitvo(res.data);
                }
            }
        });
    }


    //把所有的值 根据之前的选中分割
    splitSysinitvo = (alldata) => {
        if (alldata) {
            let key = [];
            if ((this.props.busiparam.data.sysinitvo && this.props.busiparam.data.sysinitvo.value)) {
                alldata.map((ele, index) => {
                    //没被选中的放右边
                    if (this.props.busiparam.data.sysinitvo.value.indexOf(ele.key) >= 0) {
                        key.push(ele.key)
                    }
                })
                this.setState({
                    targetKeys: key
                })
            }
            this.setState({
                dataSource: alldata,
            })
        }
    }




    // 保存
    save = (value) => {
        if(this.props.busiparam.initcode&&this.props.busiparam.initcode=='CM017'
                    &&this.state.targetKeys.length==0){
            toast({ color: 'warning', content:  this.state.json['busiparam-000006']});/* 国际化处理： 必须至少选择一个参数*/
            return ;
        }

        let valueStr = [];
        let param = {};
        if (this.state.target.length > 0) {
            this.state.target.map((ele, index) => {
                valueStr.push(ele.key);
            })
        }else{
            valueStr=this.state.targetKeys
        }

        valueStr = valueStr.join(",");
        if (this.props.busiparam.batch) {
            // 批量修改
            param = this.props.busiparam.pkorgs.map((org) => {
                return { pk_org: org, value: valueStr };
            });
        } else {
            // 单独修改
            this.props.busiparam.data.sysinitvo && (this.props.busiparam.data.sysinitvo.value = valueStr);
            param = this.props.busiparam.data;
        }
        this.props.busiparam.valueChange(param);
    }

    contain(value) {
        if (pks.indexOf(value)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 取消按钮点击
     */
    cancelFormButtonClick() {
        // this.props.parent.setState({ [this.props.showFormModalState]: false });
        // this.props.parent.setState({ transfershowModal:false});

        // this.props.closeTransferModal && this.props.closeTransferModal('showTransModal', false);
        // this.props.busiparam.valueChange(false);
        this.props.closeFn(false);
    };

    onTargetKeysChange = (targetKeys) => {

        let flag = true;
        let dataSource = this.state.dataSource;
        let target = [];
        if (dataSource.length > 0) {
            dataSource.map((item, index) => {
                targetKeys.map((key, i) => {
                    if (key == item.key) {
                        target.push({ key: item.key, title: item.title });
                    }
                })
            })
        }
        if (targetKeys.length > 0) {
            if (targetKeys[0].key) {
                flag = false;
            }
        }
        if (flag == false) {
            targetKeys = [];
        }
        this.setState({
            targetKeys: targetKeys,
            target: target
        });
    };

    render() {
        const { showFormModal, parent, cancel, syncTree: { createSyncTree } } = this.props

        const transferProps = {
            dataSource: this.state.dataSource,
            targetKeys: this.state.targetKeys,
            onTargetKeysChange: this.onTargetKeysChange,
            checkable: true,
            className: 'my-transfer-demo',
            showMoveBtn: false,
            listRender: ({ key, title }) => title,
            // lazy:{container: 'modal'}
        };


        return (
            <div>
                <Modal show={true} id='SubTransfer' onHide={this.cancelFormButtonClick} className='SubTransfer-table' fieldid='subcf' ref={NCModal => (this.NCModal = NCModal)}>
                    <NCHotKeys
                        keyMap={{
                            sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                            cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
                        }}
                        handlers={{
                            sureBtnHandler: () => {
                                if (this.NCModal && this.NCModal.isTopModal()) {
                                    this.save.bind(this)();
                                }
                            },
                            cancelBtnHandler: () => {
                                if (this.NCModal && this.NCModal.isTopModal()) {
                                    this.cancelFormButtonClick.bind(this)();
                                }
                            }
                        }}
                        className="simpleModal-hotkeys-wrapper"
                        focused={true}
                        attach={document.body}
                        display="inline-block"
                    />



                    <Header>
                        <Title fieldid={this.state.json['busiparam-000000']}>{this.state.json['busiparam-000000']}</Title>{/* 国际化处理： 参数设置对话框*/}
                    </Header>
                    <Body>
                        <Transfer  {...transferProps} />
                    </Body>
                    <Footer>
                        <NCTooltip
                                placement="top"
                                inverse
                                overlay={`${this.state.json['busiparam-000004']}  (${
                                    NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM
                                    })`}
                                trigger={["focus", "hover"]}
                                className="model-helper-overlay"
                            >
                                <Button colors="primary" onClick={this.save.bind(this)} fieldid='save'>{this.state.json['busiparam-000004']/* 国际化处理： 保存*/}
                                (<span className="text-decoration-underline">Y</span>)</Button>
                            
                            </NCTooltip>
                            <NCTooltip
                                placement="top"
                                inverse
                                overlay={`${this.state.json['busiparam-000005']}  (${
                                    NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
                                    })`}
                                trigger={["focus", "hover"]}
                                className="model-helper-overlay"
                            >
                                <Button onClick={this.cancelFormButtonClick.bind(this)} fieldid='cancel'>{this.state.json['busiparam-000005']/* 国际化处理： 取消*/}
                                (<span className="text-decoration-underline">N</span>)</Button>
                                
                        </NCTooltip>
                    </Footer>
                </Modal>

            </div>
        )
    }
}
SubCf = createPage({})(SubCf);
export default SubCf;
