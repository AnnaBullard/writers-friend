import {Editor, EditorState, RichUtils, 
        convertToRaw, convertFromHTML,
        ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {useState, useEffect} from "react";
import "./BlocksList.css"

export default function Block ({id, text}) {
    const [prevState, setPrevState] = useState(text)
    
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty()
      );
    
    useEffect(()=>{
        const blocksFromHtml = convertFromHTML(text);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(contentState));
    },[])
    
    useEffect(()=>{
        const inputChange = setTimeout(()=>{
            const newState = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            if (prevState != newState) {
                console.log(newState)
                setPrevState(newState);
            }
        },1000)
        return () => {clearTimeout(inputChange)};
    },[editorState])

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command)
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    }
    const onItalicClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))
    }

    const onUnderlineClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
      }
    
    const onBoldClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))
    }

    return <>
    <h1>Editor test</h1>
    <button onClick={onItalicClick}>
        <i>I</i>
    </button>
    <button onClick={onBoldClick}>
        <b>B</b>
    </button>
    <button onClick={onUnderlineClick}>
        <u>U</u>
    </button>
    <Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={setEditorState} />
    </>
}
