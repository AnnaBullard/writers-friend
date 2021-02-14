import {Editor, EditorState, RichUtils, 
    convertToRaw, convertFromHTML,
    ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {useDispatch} from "react-redux";
import {useState, useEffect} from "react";
import {editText,setUnsaved} from "../../store/scenes";

export default function SceneEditor ({id, text,isLast}) {
    const dispatch = useDispatch();
    const [isReady, setIsReady] = useState(false)
    const [prevState, setPrevState] = useState("")

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty()
    );

    useEffect(()=>{
        const blocksFromHtml = convertFromHTML(text);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(contentState));
    },[text])

    useEffect(()=>{
        const inputChange = setTimeout(()=>{
            const newState = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            if (isReady && prevState!== newState) {
                dispatch(setUnsaved(id, newState));
            }
            if (!isReady && ((prevState ==="" && newState !== "") || !text)) {
                setPrevState(newState)
                setIsReady(true)
                if (isLast){
                    setEditorState(EditorState.moveFocusToEnd(editorState))
                }
            }
        },1000)
        return () => {clearTimeout(inputChange)};
    },[editorState, isReady, prevState, id, text, dispatch])

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    return <div className="scene-text" >
    <Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={setEditorState} 
    onBlur={()=>{
        const newState = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        if (prevState !== newState) {
            dispatch(editText(id, newState));
            setPrevState(newState);
        }}} />
    </div>
}
