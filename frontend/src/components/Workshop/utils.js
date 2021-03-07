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
            return "world"
        case 3:
            return "book series"
        case 2:
            return "book"
        default:
            if (entity.parentId === null)
                return "story"
            else 
                return "chapter"
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