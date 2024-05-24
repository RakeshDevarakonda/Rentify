import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalComponent(props) {

  const userdetails=props.sellerdetails
  return (
    <>
      <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Owner Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{overflowX:"scroll"}}>
        <table >
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>

          <tr>
            <td>Name</td>
            <td>{userdetails.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{userdetails.email}</td>
          </tr><tr>
            <td>Mobile Number</td>
            <td>{userdetails.mobilenumber}</td>
          </tr>
          </tbody>

        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default ModalComponent;
