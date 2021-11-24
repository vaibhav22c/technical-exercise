import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import '../App.css';

function Tree() {
  const [show, setShow] = useState(false);
  const [selectedNode, setSelectedNode] = useState(1);
  const [max, setMax] = useState(1);
  const [nodes, setNodes] = useState([
    {
      id: 1,
      color: "#fff",
      childNodes: false
    }
  ]);

  const pushItemById = (array, id, data) => {
    return array.map(item => {
      if (item.id == id) {
        item.childNodes = data
      }
      else if (item.childNodes) {
        pushItemById(item.childNodes, id, data)
      }
      return item
    })
  }

  const onAddLinkClick = (nodeId) => {
    setSelectedNode(nodeId);
    setShow(true);
  }

  const addChildrens = (selectedColor) => {
    const childs = [{
      id: max + 1,
      color: selectedColor,
      childNodes: false
    }, {
      id: max + 2,
      color: selectedColor,
      childNodes: false
    }]
    setNodes(pushItemById(nodes, selectedNode, childs));
    setMax(m => m + 2);
    setShow(false);
  }

  const TreeNode = ({ data }) => (
    <ul className="tree">
      {data && data.map(item => (
        <li key={item.id}>
          <code>
            <div className="title" style={{ backgroundColor: item.color || "#fff" }}>{item.id}</div>
            {!item.childNodes ?
              <div className="content">
                <Button variant="link" onClick={() => onAddLinkClick(item.id)}>ADD</Button>
              </div>
              : null}
          </code>
          {item.childNodes && <TreeNode data={item.childNodes} />}
        </li>
      ))}
    </ul>
  );

  const downloadFile = async () => {
    const fileName = "jsonfile";
    const json = JSON.stringify(nodes);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <TreeNode data={nodes} />
      <Button className="export" onClick={() => downloadFile()} > Export Json </Button>
      {show ?
        <ChildModal
          show={show}
          setShow={(val) => setShow(val)}
          addChildrens={addChildrens}
        /> : null}
    </>
  );
}

const ChildModal = ({ show, setShow, addChildrens }) => {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  return (
    <Modal show={show} onHide={() => setShow(false)} backdrop="static">
      <Modal.Body style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Modal.Title>Select Child Color</Modal.Title>
        <Form.Control
          type="color"
          id="exampleColorInput"
          defaultValue="#ffffff"
          title="Choose your color"
          onChange={(e) => setSelectedColor(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}> Close </Button>
        <Button variant="primary" onClick={() => addChildrens(selectedColor)}> Add Childs </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Tree;