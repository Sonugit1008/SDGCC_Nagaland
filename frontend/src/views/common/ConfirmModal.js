import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const ConfirmModal = (props) => {
  const { className, message } = props;

  const [modal, setModal] = useState(true);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Confirm</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              setModal(!modal);
              props.finalfunction();
            }}
          >
            Confirm
          </Button>{" "}
          <Button color="secondary" onClick={() => {toggle();props.closePopUp()}} >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConfirmModal;
