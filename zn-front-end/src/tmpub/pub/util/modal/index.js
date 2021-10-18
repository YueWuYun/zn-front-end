/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
import React, { Component } from "react";
import { base, toast, getMultiLang } from "nc-lightapp-front";
import "./index.less";
let { NCModal, NCButton, NCTextArea, NCHotKeys,NCTooltip } = base;

export default class Modal extends Component {
    static defaultProps = {
        show: false,
        title: "",
        label: "",
        content: "",
        isRequire: true,
        size: "sm",
        okShow: true,
        closeShow: true,
        className: "",
        placeholder: "",
        maxlen: 100
    };

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            lang: {}
        };
    }
    componentWillMount() {
        getMultiLang({
            moduleId: {
                //tmpub公共多语
                ["tmpub"]: ["3601"]
            },
            //回调
            callback: lang => {
                this.setState({ lang });
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.content!== this.props.content) {
        //     this.setState({
        //         value: nextProps.content
        //     });
        // }
        if (nextProps.show && nextProps.show !== this.props.show) {
            this.setState({
                value: ""
            });
        }
    }

    strlen = str => {
        str += "";
        let len = 0,
            lens = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                len += 2;
            } else {
                len++;
            }
            lens++;
        }
        return { len, lens };
    };

    render() {
        let {
            title,
            size,
            show,
            content,
            onOk,
            onClose,
            className,
            okShow,
            closeShow,
            label,
            isRequire,
            placeholder,
            maxlen
        } = this.props;
        let { value, lang } = this.state;
        return (
            <NCModal
                fieldid="reback"
                animation={false}
                backdrop="static"
                show={show}
                onHide={onClose}
                className={`zijin-modal ${size} ${className}`}
            >
                <NCHotKeys
                    keyMap={{
                        sureBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                        cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
                    }}
                    handlers={{
                        sureBtnHandler: () => {
                            // // 确定按钮的事件 增加top的判断避免所有弹窗逻辑都被触发 by bbqin
                            // if (this.NCModal && this.NCModal.isTopModal()) {
                            //     //console.log(
                            //     "createModal sureBtnHandler 事件回调",
                            //     this.NCModal.isTopModal()
                            // );
                            // beSureClick.bind(this)();
                            // }
                            if (isRequire && !value) {
                                toast({
                                    color: "warning",
                                    content: lang["3601-000007"] + `${label}`
                                });
                                return;
                            }
                            onOk && onOk(value);
                        },
                        cancelBtnHandler: () => {
                            // // 取消按钮的事件 增加top的判断避免所有弹窗逻辑都被触发 by bbqin
                            // if (this.NCModal && this.NCModal.isTopModal()) {
                            //     //console.log(
                            //     "createModal cancelBtnHandler 事件回调"
                            // );
                            // cancelClick.bind(this)();
                            // }
                            onClose && onClose();
                        }
                    }}
                    className="simpleModal-hotkeys-wrapper"
                    focused={true}
                    attach={document.body}
                    display="inline-block"
                />

                <NCModal.Header closeButton>
                    <NCModal.Title>{title}</NCModal.Title>
                </NCModal.Header>

                <NCModal.Body>
                    <div className="area-box">
                        <span className="modal-label nc-theme-common-font-c">
                            {isRequire && (
                                <span className="require-icon">* </span>
                            )}
                            {label}
                        </span>
                        <NCTextArea
                            fieldid="rebackreason"
                            value={value}
                            placeholder={placeholder}
                            onChange={e => {
                                if (e.length > maxlen) {
                                    e = e.substr(0, maxlen);
                                }
                                this.setState({
                                    value: e
                                });
                            }}
                        />
                        <span className="value-length">
                            <span className="normal-length">
                                {value.length}{" "}
                            </span>
                            /<span className="max-length"> {maxlen}</span>
                        </span>
                    </div>
                </NCModal.Body>

                <NCModal.Footer>
                    {okShow && (
                       <NCTooltip
                       placement="top"
                       inverse
                       overlay={lang["3601-000005"]+` (${
                           NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM
                       })`}
                       trigger={["hover", "focus"]}
                       className="model-helper-overlay"
                   >
                        <NCButton
                            fieldid="rebackok"
                            className="button-primary"
                            onClick={() => {
                                if (isRequire && !value) {
                                    toast({
                                        color: "warning",
                                        content:
                                            lang["3601-000007"] + `${label}`
                                    });
                                    return;
                                }
                                onOk && onOk(value);
                            }}
                        >
                            {lang["3601-000005"]}(<span className="text-decoration-underline">Y</span>)
                        </NCButton>
                        </NCTooltip>
                    )}
                    {closeShow && (
                        <NCTooltip
                        placement="top"
                        inverse
                        overlay={lang["3601-000006"]+` (${
                            NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
                        })`}
                        trigger={["focus", "hover"]}
                        className="model-helper-overlay"
                    >

                        <NCButton
                            fieldid="rebackcancel"
                            onClick={() => {
                                onClose && onClose();
                            }}
                        >
                            {lang["3601-000006"]}(<span className="text-decoration-underline">N</span>)
                        </NCButton>
                        </NCTooltip>
                    )}
                </NCModal.Footer>
            </NCModal>
        );
    }
}

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/