import {Draggable} from "react-beautiful-dnd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import ConfirmDelete from "./ConfirmDelete";
import {Modal} from '../../context/Modal';
import SceneEditor from "./Editor";
import {splitScenes} from "../../store/scenes";
import sanitizeHtml from 'sanitize-html';

export default function SceneBlock ({scene, index, joinFn, isLast, splitBlock, setSplitBlock}) {
    const dispatch = useDispatch();

    const [splitMode, setSplitMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fromType, setFormType] = useState("delete");

    useEffect(()=>{
        if (splitBlock === scene.id) {
            setSplitMode(true);
        } else {
            setSplitMode(false);
        }
    },[splitBlock])

    // Split textblock
    const ancestors = (child, parents = new Set()) => {
        if (child.nodeName !== "#text" && child.classList.contains("split-mode")) {
            parents.add(child);
            return parents;
        };

        let parent = ancestors(child.parentNode, parents)
        parents.add(child,...parent);
        return parents;
    }

    const split = (currentNode, ancestorsSet, position, targetNode) => {

        if (currentNode === targetNode && (currentNode.nodeName==="#text")){
            let leftTree = document.createTextNode( currentNode.wholeText.slice(0,position))
            let rightTree = document.createTextNode( currentNode.wholeText.slice(position))

            return {leftTree, rightTree}
        } 
        
        let leftTree = document.createElement(currentNode.nodeName);
        let rightTree = document.createElement(currentNode.nodeName);
        
        let children = currentNode.childNodes;
            
        if (currentNode === targetNode) {
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
                    let result = split(child, ancestorsSet, position, targetNode);
                    leftTree.appendChild(result.leftTree);
                    rightTree.appendChild(result.rightTree);
                    passed = true;
                }
            })

        }

        return {leftTree, rightTree}
        
    }

    const onSplit = (e) => {
        if (e.target !== e.currentTarget) {
            let selection = window.getSelection();
            let ancestorsArray = ancestors(selection.anchorNode);
            
            let result = split(e.currentTarget, ancestorsArray, selection.anchorOffset, selection.anchorNode)
            dispatch(splitScenes(scene.id,result.leftTree.innerHTML, result.rightTree.innerHTML ));
        }
    }

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
                    {splitMode && <div className="scene-text split-mode" onClick={e=>onSplit(e)} dangerouslySetInnerHTML={{__html: scene.temp?sanitizeHtml(scene.temp):sanitizeHtml(scene.text)}}></div>}
                    {!splitMode &&  <SceneEditor id={scene.id} text={scene.text} isLast={isLast}/> }
                    <div className="scene-handle">
                        <i className="fas fa-arrows-alt-v" {...provided.dragHandleProps}></i>
                        <i className="fas fa-cut" onClick={()=>{
                            if(splitBlock===scene.id) setSplitBlock(0)
                            else setSplitBlock(scene.id)
                        }} ></i>
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
