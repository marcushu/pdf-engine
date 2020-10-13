# pdf-engine

Provides a single access point: `/pdf`, that expects an array of json objects in the body of a POST request,
and returns a pdf that can be saved or opened in the browser (the usual use case).  Access here:

`https://pdfengine.herokuapp.com/pdf`
 

**PDFKit** is used to generate the pdf.  Documentation for PDFKit can be found [here](https://pdfkit.org/index.html) if needed; not all
of the library features are exposed through this api. See below for information about the instruction set. 

A sample script called _samplePDFscript_ can be found in the _testing_ directory along with the generated document.  
'curl' with the following (from a directory containing the sample script) to produce the sample pdf: 


    curl -d "@samplePDFscript" -H "Content-Type: application/json" -X POST https://pdfengine.herokuapp.com/pdf --output example.pdf
    
    

## Instruction set 

### TEXT


Writes text to the document. Each call automaticaly begins a new line.  Only _type_ and _text_ are required.

    
    {
            "type" : "TEXT",
            "text" : "Sample text...blah blah blah",
            "fontSize" : 12,                            optional - setting will persist - default=12
            "fontfamily" :  "Times-Roman",              optional - setting will persist - defult=times roman
            "textColor" : "red",                        optional
            "settings" : {                              optional
                "align" : "left",                       optional - left | right | center
                "underline" : "false",                  optional
                "oblique" : "false",                    optional
                "link" : "http://www.lkjlk.com"         optional    
            }
    }
    
    

The above could also be called without optional properties:
    
    
    {
            "type" : "TEXT",
            "text" : "Sample text...blah blah blah"
    }
    
    
#### Available fonts:

* Courier 
* Courier-Bold 
* Courier-Oblique 
* Courier-BoldOblique 
* Helvetica 
* Helvetica-Bold 
* Helvetica-Oblique 
* Helvetica-BoldOblique 
* Symbol 
* Times-Roman 
* Times-Bold 
* Times-Italic 
* Times-BoldItalic 
* ZapfDingbats



### LIST

Add a list to the document.


    {
        "type" : "LIST",
        "fontSize" : 12,                                optional -this element only
        "fontfamily" : "Helvetica-Bold",                optional -this element only
        "fillColor" : "red",                            optional -this element only
        "listdata" : [
            "Marcus Procius Cato", 
            "Atticus", "Marcus Antonius", "Gaius Antonius"
        ]
    }
    
    
    
### LINEBREAK


    {
        "type" : "LINEBREAK"
    }


### NEXTPAGE
Starts a new page.

    {
        "type" : "NEXTPAGE"
    }
    

### SETXPOSITION

Set the horizontal position.  Available values are from 20 to 500.  This setting will persist for each new line untill being re-set.

    {
        "type" : "SETXPOSITION",
        "xPosition" : 400
    }



### SETMARGIN

Set document margins. Defaults to 50 all arround.  Settings take place on the next page.  Call this before writing to the document.

    {
        "type" : "SETMARGIN",
        "margin" : {
            "top" : 75,
            "bottom" : 75,
            "left" : 50,
            "right" : 50
        }
    }

See testing/samplePDFscript for the complete script.
