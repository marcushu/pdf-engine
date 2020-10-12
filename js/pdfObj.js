const PDFDocument = require('pdfkit');

class PdfObj {

  DEFAULTMARGIN = 50;
  DEFAULTTEXTSIZE = 12;

  // Construct with an array of instruction objects.
  //////////////////////////////////////////////////

  constructor(docElements) {
    this.docElements = docElements;
    this._doc = null;
    this.pdfErr = [];
    this.currentFont = "Times-Roman";
    this.currentFontSize = this.DEFAULTTEXTSIZE;
    this.margins = {
      top: this.DEFAULTMARGIN,
      bottom: this.DEFAULTMARGIN,
      left: this.DEFAULTMARGIN,
      right: this.DEFAULTMARGIN
    };
  }


  // Add text to document
  ///////////////////////

  writeText = element => {
    const DEFAULTTEXTCOLOR = "black";

    if (element.fontfamily) this.currentFont = element.fontfamily;
    if (element.fontSize) this.currentFontSize = element.fontSize;

    let textSettings = element.settings ? element.settings : {};

    try {
      this._doc.font(this.currentFont)
        .fontSize(this.currentFontSize)
        .fillColor(element.textColor ? element.textColor : DEFAULTTEXTCOLOR)
        .text(element.text, textSettings);

    } catch (err) {
      this.pdfErr.push("Text write error: " + err.message);
    }

  }


  // Create a list
  ////////////////

  writeList = element => {
    const DEFAULTTEXTCOLOR = "black";

    try {
      // set for this element only
      const listFont = element.fontfamily ? element.fontfamily : this.currentFont;
      const listTextSize = element.fontSize ? element.fontSize : this.currentFontSize;

      this._doc
        .font(listFont)
        .fontSize(listTextSize)
        .fillColor(element.textColor ? element.textColor : DEFAULTTEXTCOLOR)
        .list(element.listdata); 

    } catch (err) {
      this.pdfErr.push("List write error: " + err.message);
    }

  }


  // Manually set the (horizontal) starting position.
  // The value will persist untill being re-set.
  ///////////////////////////////////////////////////

  setXposition = element => {
    const MINX = 20;
    const MAXX = 500;

    try {
      if (element.xPosition < MINX
        || element.xPosition > MAXX
        || !Number.isInteger(element.xPosition)
      )
        throw new Error(`Position values should be integers between ${MINX} and ${MAXX}`);

      this._doc.text("", element.xPosition);

    } catch (err) {
      this.pdfErr.push("Set line start position error: " + err.message);
    }
  }


  // Set the margins for the document.
  // This setting is optional, a default 50 all arround is provided
  // if this method is not called. The left margin can be adjusted 
  // at any time with the setXposition.
  // Setting margin values throught this method will take effect on 
  // the next page, so it' best to call this first, before writing 
  // anything to the document.
  /////////////////////////////////////////////////////////////////

  setMargin = element => {
    const MINMARGIN = 0;
    const MAXMARGIN = 250;

    try {
      for (const prop in element.margin) {
        if (element.margin[prop] < MINMARGIN
          || element.margin[prop] > MAXMARGIN
          || !Number.isInteger(element.margin[prop])
        )

          throw new Error(`Value must be an ineger between ${MINMARGIN} and ${MAXMARGIN}`);
      }

      this.margins = element.margin;

    } catch (err) {
      this.pdfErr.push("Error setting margin: " + err.message);
    }
  }


  // Iterate through an array of instructions and create
  // a pdf document.  
  // Returns a promise with the document.
  //////////////////////////////////////////////////////

  createPDF = () => {
    if (this.docElements[0].type === "SETMARGIN")
      this.setMargin(this.docElements[0]);

    this._doc = new PDFDocument({ margins: this.margins });

    return new Promise((resolve, reject) => {
      this.docElements.forEach(element => {
        switch (element.type) {
          case "TEXT":
            this.writeText(element);
            break;
          case "LIST":
            this.writeList(element);
            break;
          case "LINEBREAK":
            this._doc.moveDown();
            break;
          case "NEXTPAGE":
            this._doc.addPage();
            break;
          case "SETXPOSITION":
            this.setXposition(element);
            break;
          case "SETMARGIN":
            this.setMargin(element);
            break;
          default:
            this.pdfErr.push("Unknown directive: " + element.type);
            break;
        }
      });

      // close out the document
      this._doc.end();

      if (this.pdfErr.length)
        reject(this.pdfErr);

      resolve(this._doc);
    });
  }

}

module.exports = { PdfObj }