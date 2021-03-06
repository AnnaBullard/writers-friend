![](/wiki/writers-friend.png)

[Live on Heroku](https://writers-friend.herokuapp.com/)

## Table of Contents

1. [Introduction](#introduction)
2.  [Dependencies](#dependencies)
3.  [Features](#features)
	- [Sign-up / Login](#signup)
	- [Entities](#entities)
	- [Chapters/stories](#chapter)
	- [Scenes](#scenes)
	- [Pseudonyms](#pseudonyms)
	- [Themes](#themes)

## Introduction

`Writer's Friend` is a visual tool to improve writing experience. It will allow users to to easily navigate through their works and and edit texts.

## Dependencies

<a href="https://www.heroku.com/"><img src="https://img.shields.io/badge/-Heroku-430098?logo=Heroku" /></a>
<a href="https://www.npmjs.com/package/express"><img src="https://img.shields.io/badge/-Express.js-000000?logo=Express" /></a>
<a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/-PostgreSQL-336791?logo=PostgreSQL" /></a>
<a href="https://reactjs.org/"><img src="https://img.shields.io/badge/-React-61DAFB?logo=React&logoColor=333333" /></a>
<a href="https://redux.js.org/"><img src="https://img.shields.io/badge/-Redux-764ABC?logo=Redux" /></a>
<a href="https://sequelize.org/"><img src="https://img.shields.io/badge/-Sequelize-039BE5" /></a>
<a href="https://www.npmjs.com/package/react-beautiful-dnd"> <img src="https://img.shields.io/badge/-React Beautiful DND-61DAFB?logo=React&logoColor=333333" /></a>
<a href="https://draftjs.org/"><img src="https://img.shields.io/badge/-Draft.js-843131" /></a>
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/-CSS3-1572B6?logo=CSS3" /></a>
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://img.shields.io/badge/-HTML5-E34F26?logo=HTML5&logoColor=ffffff" /></a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=JavaScript&logoColor=333333" /></a>

## Features

- ### Sign-up / Login <a id="signup" ></a>

- ### Entities
	Users can create entities, like trees with following levels:
	1. world
	2. book series
	3. book
	4. chapter/story

	<img src="./wiki/gifs/new-book.gif" alt="drawing" style="max-width:300px;"/>
	

	Entities are stored in Redux store as an ordered array of entities of highest level, with nested array of children-entities.
	Nesting goes up to 4 levels.

	Redux store updated using following function.
	```js
	export let updateEntity = (array, child) => {
		//finding original entity
		let oldChild = findEntity(array, child.id);
		//generating updated entity
		let newChild = {...oldChild, ...child};

		//if order parameter not passed - remove it
		if (child.order===undefined) delete newChild.order;
		
		//create a full copy of original array
		let newArray = deepCopy(array);

		//if position was changed
		if (oldChild.parentId !== newChild.parentId 
			|| (newChild.order!==undefined && oldChild.order !== newChild.order)) {
			
			//remove entity from original position
			newArray = removeEntity(array, oldChild.id);

			//adjust order
			if (newChild.order === "last" || newChild.parentId === null){
				delete newChild.order;
			} else if (oldChild.parentId === newChild.parentId && newChild.order > oldChild.order) {
				newChild.order--;
			}
			//add entity to the new position
			newArray = addEntity(newArray, newChild);
		} 
		//if position stayed the same
		else {
			if (oldChild.parentId === null) {
				//for top level - update entity
				newArray = updateFn(array, newChild)
			} else {
				//for deeper-level entity - copy array with callback function that would update entity when it get's to it
				let path = findPath(array, newChild.id)
				newArray = copyArray(array, newChild, path, updateFn)
			}
		}

		return newArray;

	}
	```

- ### Chapters/stories<a id="chapter" ></a>
	`Chapters` and `stories` are leaf-entities.
	
	There are 2 ways to `create new story/chapter`:
	1. Through entity creation form:

	<img src="./wiki/gifs/new-chapter.gif" alt="drawing" style="max-width:300px;"/>

	2. Pressing Start writing button - that would create story on the hiest level.

	<img src="./wiki/gifs/start-writing.gif" alt="drawing" style="max-width:300px;"/>

- ### Scenes
	- To write a text users can create several blocks of text - `scenes`.
	- Users can `re-order scenes`

		<img src="./wiki/gifs/switch-scenes.gif" alt="drawing" style="max-width:300px;"/>

	- Users can `join scenes`

		<img src="./wiki/gifs/join-scenes.gif" alt="drawing" style="max-width:300px;"/>
	
	- Users can `split scenes`

		<img src="./wiki/gifs/split-text.gif" alt="drawing" style="max-width:300px;" />

	- Users can `delete scenes` after a confirmation.
	
	- All of the changes preserved in the `Redux store` unless saved.
	- Users can `reset` unsaved changes after a confirmation.

- ### Pseudonyms
	- Users can create multiple `pseudonyms`.
	- Users can set one `pseudonym` to represent as themself.

		<img src="./wiki/gifs/pseudonym.gif" alt="drawing" style="max-width:300px;"/>

- ### Themes
	- User can change color theme of the app

		<img src="./wiki/gifs/themes.gif" alt="drawing" style="max-width:300px;"/>

	- Theme setting is preserved in cookies

	```js
	import Cookies from 'js-cookie';

	const [theme, setTheme] = useState("peach")
	// array of pre-defined themes
  	const themeList = useMemo(()=>["peach", "beach", "midnight", "dark"],[]);

	// check cookies for set theme
	useEffect(() => {
		dispatch(sessionActions.restoreUser())
		.then(() => {
			if (Cookies.get('color-theme') && themeList.includes(Cookies.get('color-theme'))) {
				setTheme(Cookies.get('color-theme'))
			} 
			else {
				Cookies.set('color-theme','peach')
			}
			setIsLoaded(true)
		});
	}, [dispatch, themeList]);

	//set theme-class to body
	useEffect(()=>{
		document.body.setAttribute("class", "")
		document.body.classList.add(theme)
	},[theme])
	```
	I used CSS variables to set colors for each theme

	```css
	.midnight {
		--bg-color1: #245579;
		--text-color1: #000;
		--text-hover1: #ffbc42;

		--bg-color2: #d81159;
		--text-color2: #333;
		--text-hover2: #ffbc42;
		
		...
	}
	```