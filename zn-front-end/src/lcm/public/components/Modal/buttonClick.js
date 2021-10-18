/* modal按钮操作 */
export default function(props, key) {
  let { ModalConfig } = this.props;
  if (!ModalConfig) return;
  let { BtnConfig } = ModalConfig;
  if (!BtnConfig) return;
  switch (key) {
    // 确认
    case "ConfirmModal":
    case "BatchConfirm":
      BtnConfig.handleConfirm();
      break;
    // 取消
    case "CancelModal":
    case "BatchCancel":
      BtnConfig.handleCancel();
      break;
  }
}
