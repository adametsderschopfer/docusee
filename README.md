# Docusee
Docusee created for create web site with documentation from json-object

## Install 
```
$ npm install -g docusee
```
## Usage


First, you need to create a file with the * .json extension, and fill it with the template below
These fields are required
```
{
    "title": "Docusee",
    "content": [
        {
            "title": "First block title", 
            "list": [ 
                {    
                    "title": "First subblock subtitle",
                    "contetn": [
                        "your html code or plain text"
                    ]   
                },   
            ]
        }
    ]
}
```

Also you can add a start preview page add to the template
```
{
   "title":"Docusee",
   "preview":{
      "title":"Docusee",
      "description":"Docusee - created for example bla bla bla"
   }
   ...
}
```

---

Next, you must run the following command in the console
```
$ docusee ./path/to/your/docs.json
```
Then next to the specified json file a folder will appear called "docs-html"

----

## Use in code
if you want to use this generator as a function, you need to do the previous step with creating a * .json file, then perform the following
```
const {ready} = require('docusee');

ready("./path/to/your/docs.json");
````
