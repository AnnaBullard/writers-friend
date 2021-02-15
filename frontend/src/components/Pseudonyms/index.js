import {useSelector, useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {getPseudonyms} from "../../store/pseudonyms";
import {Modal} from '../../context/Modal';
import PseudoForm from "./PseudoForm";
import ConfirmDelete from "./ConfirmDelete";
import {getAuthorFormattedPseudonym} from "../Profile/utils";
import "./Pseudonyms.css";

export default function PseudonymsList () {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("edit");
    const [pseudo, setPseudo] = useState();
    
    useEffect(()=>{
        dispatch(getPseudonyms()).then(res => {
            setIsLoaded(true)
        })
    },[dispatch])

    const pseudonyms = useSelector(state => state.pseudonyms)

    return isLoaded && <><div className="pseudonym-list">
        {pseudonyms.map(pseudo => <div>
            <span>
                {pseudo.isActive?<i className="fas fa-user"></i>:<i className="far fa-user"></i>}
                {" "+getAuthorFormattedPseudonym(pseudo)}
            </span>
            <span>
                <i className="fas fa-pen-nib" onClick={()=>{
                    setPseudo(pseudo);
                    setModalType("edit")
                    setShowModal(true)
                }} ></i>
                <i className="fas fa-eraser" onClick={()=>{
                    setPseudo(pseudo);
                    setModalType("delete")
                    setShowModal(true)
                }} ></i>
            </span>
        </div>)}
    </div>
    <div className="story-controls">
        <button onClick={()=>{
            setPseudo(undefined);
            setModalType("edit")
            setShowModal(true)
        }}>Add new</button>
    </div>
    {showModal && <Modal onClose={() => setShowModal(false)}>
        {modalType==="edit" && <PseudoForm pseudo={pseudo}  onClose={() => setShowModal(false)}/>}
        {modalType==="delete" && <ConfirmDelete pseudo={pseudo}  onClose={() => setShowModal(false)}/>}
    </Modal>}
    </>
}