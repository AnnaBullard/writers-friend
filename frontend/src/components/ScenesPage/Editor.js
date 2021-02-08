import {Editor, EditorState, RichUtils, 
    convertToRaw, convertFromHTML,
    ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {useState, useEffect} from "react";
// import "./BlocksList.css"

export default function SceneEditor ({id, text}) {
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
            console.log(newState)
        }
        if (!isReady && ((prevState ==="" && newState !== "") || !text)) {
            setPrevState(newState)
            setIsReady(true)
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

return <div className="scene-text" >
<Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={setEditorState} />
</div>
}