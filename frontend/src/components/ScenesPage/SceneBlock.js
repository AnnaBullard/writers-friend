import {Draggable} from "react-beautiful-dnd";
import {useState} from "react";
import ConfirmDelete from "./ConfirmDelete";
import {Modal} from '../../context/Modal';
import SceneEditor from "./Editor";
import sanitizeHtml from 'sanitize-html';

export default function SceneBlock ({scene, index, joinFn, isLast}) {
    const [splitMode, setSplitMode] = useState(false);

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
        let leftTree = document.createElement(currentNode.nodeName);
        let rightTree = document.createElement(currentNode.nodeName);
        
        let children = currentNode.childNodes;
        if (ancestorsSet.has(currentNode) && currentNode.children.length ===0){
                leftTree.innerHTML = currentNode.innerHTML.slice(0,position);
                rightTree.innerHTML = currentNode.innerHTML.slice(position);
            } else {
                let passed = false;
                children.forEach(child => {
                    if (!ancestorsSet.has(child) && !passed) {
                        leftTree.appendChild(child.cloneNode(true));
                    } else if (!ancestorsSet.has(child) && passed) {
                        rightTree.appendChild(child.cloneNode(true));
                    } else {
                        let result = split(child, ancestorsSet, position);
                        leftTree.appendChild(result.leftTree);
                        rightTree.appendChild(result.rightTree);
                        passed = true;
                    }
                })

            }

            return {leftTree, rightTree}
    }

    const onSplit = (e) => {
        let selection = window.getSelection();
        let ancestorsArray = ancestors(e.target);
        
        let result = split(e.currentTarget, ancestorsArray, selection.anchorOffset)
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
                    {splitMode && <div className="scene-text" onClick={e=>onSplit(e)} dangerouslySetInnerHTML={{__html: scene.temp?sanitizeHtml(scene.temp):sanitizeHtml(scene.text)}}></div>}
                    {!splitMode &&  <SceneEditor id={scene.id} text={scene.text} isLast={isLast}/> }
                    <div className="scene-handle">
                        <i className="fas fa-arrows-alt-v" {...provided.dragHandleProps}></i>
                        <i className="fas fa-cut" onClick={()=>setSplitMode(!splitMode)} ></i>
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
