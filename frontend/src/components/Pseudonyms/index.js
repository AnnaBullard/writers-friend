import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Modal} from '../../context/Modal';
import PseudoForm from "./PseudoForm";
import ConfirmDelete from "./ConfirmDelete";
import {getAuthorFormattedPseudonym} from "../Workshop/utils";

export default function Pseudonyms () {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("edit");
    const [pseudo, setPseudo] = useState();
    
    useEffect(()=>{
        setIsLoaded(true);
        document.title = `Writer's Friend - Pseudonyms`;
    },[])

    const pseudonyms = useSelector(state => state.pseudonyms)

    return isLoaded && <>
    <h1>Pseudonyms</h1>
    <div className="pseudonym-list">
        {pseudonyms.map(pseudo => <div key={`pseudo-${pseudo.id}`} >
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
    <div className="profile-controls">
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