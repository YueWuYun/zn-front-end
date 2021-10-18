/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/
/* 
 开始、结束日期弹框组件
*/

import React, { Component } from "react";
import { base, toast } from "nc-lightapp-front";
import moment from "moment";
const { NCModal, NCDatePicker, NCButton, NCHotKeys, NCTransfer } = base;

export default class BeginEndDateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json: {},
      inlt: null,
      beginDate: props.begin.value || null,
      endDate: props.end.value || null
    };
  }

  componentWillMount() {
    let callback = (json, status, inlt) => {
      // json 多语json格式参数； status： 是否请求到json多语，可用来判断多语资源是否请求到并进行一些别的操作； inlt： 可用来进行占位符的一些操作
      if (status) {
        this.setState({ json, inlt }); // 保存json和inlt到页面state中并刷新页面
      }
    };
    this.props.MultiInit.getMultiLang({
      moduleId: "TMCPUB",
      domainName: "tmpub",
      callback
    });
  }

  //关闭弹窗
  handleClose = () => {
    this.props.onClose();
  };

  //清空日期框的值
  clearDateValue = () => {
    this.setState({
      beginDate: null,
      endDate: null
    });
  };

  //确定
  handleConfirm = () => {
    let { beginDate, endDate } = this.state;
    if (this.valid()) {
      this.props.onConfirm({
        beginDate,
        endDate
      });
    }
  };

  //校验
  valid = () => {
    let valid = true;
    let { beginDate, endDate } = this.state;
    let { begin, end, isTryCalculate } = this.props;
    if (isTryCalculate && !beginDate) {
      // 如果是试算 对开始日期进行校验
      toast({
        duration: 3,
        color: "warning",
        content: `${this.state.json["TMCPUB-000051"]}${begin.label}`
      }); /* 国际化处理： 请输入 */
      valid = false;
    } else if (!endDate) {
      toast({
        duration: 3,
        color: "warning",
        content: `${this.state.json["TMCPUB-000051"]}${end.label}`
      }); /* 国际化处理： 请输入 */
      valid = false;
    } else if (
      moment(beginDate).isSame(endDate) ||
      (beginDate && !moment(beginDate).isBefore(endDate))
    ) {
      toast({
        duration: 3,
        color: "warning",
        content: `${end.label}${this.state.json["TMCPUB-000052"]}${begin.label}`
      }); /* 国际化处理： [结束日期]必须晚于[开始日期] */
      valid = false;
    }
    return valid;
  };

  render() {
    const { beginDate, endDate, json } = this.state;
    const {
      showModal,
      title,
      begin,
      end,
      isBatch,
      isTryCalculate,
      dateFormat
    } = this.props;
    return (
      <NCModal
        show={showModal}
        size={isBatch && isTryCalculate ? "lg" : "sm"}
        fieldid="BeginEndDate"
        onHide={this.handleClose}
        onExited={this.clearDateValue}
      >
        <NCModal.Header closeButton={"true"}>
          <NCModal.Title>{title}</NCModal.Title>
        </NCModal.Header>
        <NCModal.Body>
          <div className="lightapp-component-form">
            <div className="form-item" style={{ width: "100%" }}>
              <div className="form-item-label">{begin.label}</div>
              <div className="form-item-control">
                <NCDatePicker
                  fieldid="beginDate"
                  format={dateFormat}
                  value={beginDate}
                  placeholder={begin.placeholder}
                  onChange={val => {
                    this.setState({
                      beginDate: val,
                      beginOpen: false
                    });
                  }}
                />
              </div>
            </div>
            <div className="form-item" style={{ width: "100%" }}>
              <div className="form-item-label">{end.label}</div>
              <div className="form-item-control">
                <NCDatePicker
                  fieldid="endDate"
                  format={dateFormat}
                  value={endDate}
                  placeholder={end.placeholder}
                  onChange={val => {
                    this.setState({
                      endDate: val,
                      endOpen: false
                    });
                  }}
                />
              </div>
            </div>
            {isBatch && isTryCalculate && (
              <div className="form-item" style={{ width: "100%" }}>
                <div
                  className="form-item-control"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%"
                  }}
                >
                  <NCTransfer
                    titles={[
                      json["TMCPUB-000059"],
                      json["TMCPUB-000060"]
                    ]} /* 国际化处理 数据 已选  */
                    dataSource={this.props.dataSource}
                    targetKeys={this.props.targetKeys}
                    notFoundContent={" "}
                    listStyle={{ height: 240 }}
                    onChange={this.props.handleChange}
                    render={item => item.title}
                    lazy={{ container: "modal" }}
                  />
                </div>
              </div>
            )}
          </div>
        </NCModal.Body>
        <NCModal.Footer>
          <NCHotKeys
            // 定制class
            className="reset-hotkeys-wrapper"
            keyMap={{
              confirmActionSign: ["NC_MODAL_CONFIRM", "Alt+Y"],
              cancelActionSign: ["NC_MODAL_CALCEL", "Alt+N"]
            }}
            handlers={{
              confirmActionSign: () => {
                this.handleConfirm();
              },
              cancelActionSign: () => {
                this.handleClose();
              }
            }}
            // 触发区域  默认为 document.body
            focused={true}
          />
          <NCButton fieldid="ok" colors="primary" onClick={this.handleConfirm}>
            {this.state.json["TMCPUB-000053"]}
          </NCButton>
          {/* 国际化处理： 确定*/}
          <NCButton fieldid="cancel" onClick={this.handleClose}>
            {this.state.json["TMCPUB-000019"]}
          </NCButton>
          {/* 国际化处理： 取消*/}
        </NCModal.Footer>
      </NCModal>
    );
  }
}

/*cI4u54VYZVPxnvGrX5EL6P9/uu0x1orarfWDj7u+UspQaEGoaGu88GdV1MyllIki*/