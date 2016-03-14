
function addcategory(name) {
b ='INSERT INTO category (title) VALUES (' + name + ');' ;
return b}

console.log(addcategory("'Action'"));