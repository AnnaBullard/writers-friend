export function getAuthorFormatted(entity) {
    let author = "";
    if (entity.Pseudonym) {
        author += entity.Pseudonym.firstName?entity.Pseudonym.firstName.replace(/\s+/ig, " ").split(" ").map(word=>word[0]+".").join(" "):"";
        author += entity.Pseudonym.middleName?entity.Pseudonym.middleName.replace(/\s+/ig, " ").split(" ").map(word=>word[0]+".").join(" "):"";
        author += entity.Pseudonym.lastName?entity.Pseudonym.lastName.replace(/\s+/ig, " "):"";
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

export function flattenTree (entities, level = 0) {
    let arr = []
  
    entities.forEach(entity=>{
      if (entity.typeId !== 1){
        arr.push({
          id: entity.id,
          title: entity.title || "untitled",
          author: getAuthorFormatted(entity),
          level
        })
        if (entity.children.length) {
            console.log(level, level+1)
            arr.push(...flattenTree(entity.children, level+1))
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