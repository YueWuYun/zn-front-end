import SyncTreeToListModal from "../packages/syncTreeToListModal";

export default function(
  newProps,
  params = {data: {}, url: ""},
  call
) {
  let callback = (json, init, bool) => {
    newProps.modal.show("syncTreeToList", {
      title: params.modalTitle || "数据修改",
      size: "lg",
      noFooter: true,
      content: (
        <SyncTreeToListModal
          params={params}
          onCancelInfoSave={() => {
            closeModal(newProps);
          }}
          onEnsureInfoSave={info => {
            closeModal(newProps);
            if (call && typeof call === "function") {
              call(info);
            }
          }}
        />
      ),
      closeModalEve: closeModal(newProps)
    });
  }
  callback();
}

const closeModal = props => {
  props.modal.close("syncTreeToList");
};