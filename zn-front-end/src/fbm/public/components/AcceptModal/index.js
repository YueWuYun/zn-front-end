/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/
import React from "react";
import { base } from "nc-lightapp-front";
const { NCModal, NCButton } = base;
const AcceptModal = props => (
  <div className="accept-modal">
    <NCModal fieldid="accept" show={props.show}>
      <NCModal.Header closeButton={true} onClick={props.onClose}>
        <NCModal.Title>{props.title}</NCModal.Title>
      </NCModal.Header>
      <NCModal.Body>{props.content}</NCModal.Body>
      <NCModal.Footer>
        <NCButton fieldid="sure" onClick={props.onSure}>{props.sureButtonText}</NCButton>
        <NCButton fieldid="deny" onClick={props.onDeny}>{props.denyButtonText}</NCButton>
        <NCButton fieldid="cancel" onClick={props.onCancel}>{props.cancelButtonText}</NCButton>
      </NCModal.Footer>
    </NCModal>
  </div>
);
export default AcceptModal;

/*VaWVqaRPOcVLGQLUZRykSxgnIQjEIjTW9U/b6aW00nKdzDdozdZOHT5Ld0dMJc5y*/