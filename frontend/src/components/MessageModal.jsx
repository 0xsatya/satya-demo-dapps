import React from "react";
import Modal from "react-modal";
import CloseIcon from "@material-ui/icons/Close";

// Modal.setAppElement(this);

function MessageModal({ modalIsOpen, modalMessage, closeModalBoxHandler }) {
  var subtitle;
  //   const [isOpen, setIsOpen] = React.useState(false);
  //   setIsOpen(modalIsOpen);

  // function openModal() {
  //   setIsOpen(true);
  // }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  //   function closeModal() {
  //     closeModalBoxHandler(false);
  //   }

  const customStyles = {
    content: {
      top: "40%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50vw",
      minHeight: "50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      backgroundColor: "#fff",
      border: "1px solid olive",
    },
  };

  function createMarkup() {
    return {__html: modalMessage};
  }

  return (
    <div className="messageModal">
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModalBoxHandler}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div style={{width: "100%", display: "flex", flexDirection: "row-reverse" }}>
        <CloseIcon
          onClick={closeModalBoxHandler}
          style={{ fontSize: "large" }}
        />
        </div>
        <div style={{width: "100%", display: "flex", justifyContent: "center" }}>
        <h3 ref={(_subtitle) => (subtitle = _subtitle)}>Message for you !!</h3>
        </div>
        <div style={{width: "100%", display: "flex", justifyContent: "left" }}>
        {/* <h6>{modalMessage}</h6> */}

        <div dangerouslySetInnerHTML={createMarkup()} style={{fontSize:"medium" }}></div>
        </div>
        
        
        
      </Modal>
    </div>
  );
}

export default MessageModal;
