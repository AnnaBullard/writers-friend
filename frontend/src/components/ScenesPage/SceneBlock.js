import {Draggable} from "react-beautiful-dnd";
import {useState} from "react";
import ConfirmDelete from "./ConfirmDelete";
import {Modal} from '../../context/Modal';
import SceneEditor from "./Editor";
import sanitizeHtml from 'sanitize-html';

export default function SceneBlock ({scene, index, joinFn, isLast}) {

    const ancestors = (child, parents = new Set(), n=0) => {
        if (child.classList.contains("scene-text")) {
            parents.add(child);
            return parents;
        };

        let parent = ancestors(child.parentNode, parents, ++n)
        parents.add(child,...parent);
        return parents;
    }

    const split = (currentNode, ancestorsSet, position) => {
        console.log(1, {currentNode, name:currentNode.nodeName})
        let leftTree = document.createElement(currentNode.nodeName);
        let rightTree = document.createElement(currentNode.nodeName);
        
        console.log(2, {currentNode, leftTree, rightTree})
        let children = currentNode.childNodes;
        console.log(3, {currentNode, children})
        if (ancestorsSet.has(currentNode) && currentNode.children.length ===0){
                console.log("4.1", {currentNode})
                leftTree.innerHTML = currentNode.innerHTML.slice(0,position);
                rightTree.innerHTML = currentNode.innerHTML.slice(position);
            } else {
                console.log("4.2", {currentNode})
                let passed = false;
                children.forEach(child => {
                    if (!ancestorsSet.has(child) && !passed) {
                        console.log("4.2.1", {currentNode, passed})
                        leftTree.appendChild(child.cloneNode(true));
                    } else if (!ancestorsSet.has(child) && passed) {
                        console.log("4.2.2", {currentNode, passed})
                        rightTree.appendChild(child.cloneNode(true));
                    } else {
                        console.log("4.2.3", {child, passed})
                        let result = split(child, ancestorsSet, position);
                        leftTree.appendChild(result.leftTree);
                        rightTree.appendChild(result.rightTree);
                        passed = true;
                    }
                })

            }

            return {leftTree, rightTree}
    }

    const getCaretIndex = (e) => {
        let selection = window.getSelection();
        //trace all ancestors
        let ancestorsArray = ancestors(e.target);
        
        let result = split(e.currentTarget, ancestorsArray, selection.anchorOffset)
        console.log({selection, current: e.currentTarget, target: e.target});
        console.log({left: result.leftTree.outerHTML, right: result.rightTree.outerHTML});
    }

    const [showModal, setShowModal] = useState(false);
    const [fromType, setFormType] = useState("delete");

    const onDelete = () =>{
        setFormType("delete")
        setShowModal(true)
    }

    return <Draggable draggableId={`scene-${scene.id}`} index={scene.order}>
        {provided => (
            <>
                {(index > 0 ) && <div className="connect-block" onClick={joinFn}>
                    <i className="fas fa-link"></i>
                </div>}
                <div className="scene-block" ref={provided.innerRef} {...provided.draggableProps}>
                    <div className="scene-text" onClick={e=>getCaretIndex(e)} dangerouslySetInnerHTML={{__html: scene.temp?sanitizeHtml(scene.temp):sanitizeHtml(scene.text)}}></div>
                    {/* <SceneEditor id={scene.id} text={scene.text} isLast={isLast}/> */}
                    <div className="scene-handle">
                        <i className="fas fa-arrows-alt-v" {...provided.dragHandleProps}></i>
                        {/* <i className="fas fa-cut"></i> */}
                        <i className="fas fa-eraser" onClick={onDelete}></i>
                    </div>
                </div>
                {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                {(fromType==="delete") &&
                    <ConfirmDelete onClose={() => setShowModal(false)} scene={scene}/>
                }
                </Modal>
            )}
            </>
        )}
    </Draggable>
}
