export function getAuthorFormatted(entity) {
    let author = "";
    if (entity.Pseudonym) {
        author += entity.Pseudonym.firstName?entity.Pseudonym.firstName.replace(/\s+/ig, " ").split(" ").map(word=>word[0]+".").join(" "):"";
        author += entity.Pseudonym.middleName?entity.Pseudonym.middleName.replace(/\s+/ig, " ").split(" ").map(word=>word[0]+".").join(" "):"";
        author += entity.Pseudonym.lastName?entity.Pseudonym.lastName.replace(/\s+/ig, " "):"";
    }
    return author;
}

export function getAuthorFormattedPseudonym(pseudonym) {
    let author = "";
    if (pseudonym) {
        author += pseudonym.firstName?pseudonym.firstName.replace(/\s+/ig, " ").split(" ").map(word=>word[0]+".").join(" "):"";
        author += pseudonym.middleName?" "+pseudonym.middleName.replace(/\s+/ig, " ").split(" ").map(word=>word[0]+".").join(" "):"";
        author += pseudonym.lastName?" "+pseudonym.lastName.replace(/\s+/ig, " "):"";
    }
    return author;
}

export function getType(entity){
    switch (entity.typeId) {
        case 4: 
            return <i className="fas fa-globe" title="world" ></i>
        case 3:
            return <i className="fas fa-swatchbook" title="book series" ></i>
        case 2:
            return <i className="fas fa-book" title="book" ></i>
        default:
            if (entity.parentId === null)
                return <i className="fas fa-file-alt" title="story" ></i>
            else 
                return <i className="fas fa-file-alt" title="chapter" ></i>
    }
}

export function flattenTree (entities, level = 0, limit = 1) {
    let arr = []
  
    entities.forEach(entity=>{
      if (entity.typeId > limit){
        arr.push({
          id: entity.id,
          title: entity.title || "untitled",
          author: getAuthorFormatted(entity),
          level
        })
        if (entity.children && entity.children.length) {
            arr.push(...flattenTree(entity.children, level+1, limit))
        }
      }
    })
    
    return arr
  }

export function repeat(times, char){
    let str =""
    for (let i=0; i< times; i++) {
        str += char
    }
    return str
}

export function getPath(id, entities) {
    let queue = [...entities];
    let i = 0;
    let target = null;

    while (i < queue.length) {
        let current = queue[i];

        if (current.id === id) {
            target = current;
            i = queue.length;
        } else if(current.children) {
            queue.push(...current.children)
        }
        i++;
    }
    if (!target) return [];

    return [...getPath(target.parentId, entities), {...target} ]
    
}

export function getTarget(id, entities) {
    let queue = [...entities];
    let i = 0;
    let target = null;

    while (i < queue.length) {
        let current = queue[i];

        if (current.id === id) {
            target = current;
            i = queue.length;
        } else if(current.children) {
            queue.push(...current.children)
        }
        i++;
    }
    if (!target) return null;

    return target;
    
}