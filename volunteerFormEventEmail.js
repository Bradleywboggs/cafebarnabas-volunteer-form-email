const SPREADSHEET_ID = ""
const SPREADSHEET_NAME = ""
const EMAIL_ADDRESSES = "bradleywboggs@gmail.com"
const EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <style>
    table, th, td {
      border: 1px solid black;
      border-collapse: collapse;
    }
    td { 
    padding-left: 10px;
    padding-right: 10px;
 }
  </style>
</head>  
<h1>Hey World Changer!!!</h1>
<h2>We have a new volunteer application. Thanks for seizing this relational opportunity in the next 24-48 hours!</h2>
<h3>CREATING OUTSTANDING EXPERIENCES</h3>
<p><strong>Rom. 10:14-15</strong><br/>
<em>How then will they call on him in whom they have not believed?<br/>
And how are they to believe in him of whom they have never heard? <br/>
And how are they to hear without someone preaching? <br/>
And how are they to preach unless they are sent?<br/>
As it is written, “How beautiful are the feet of those who preach the good news!”
</em>
</p>

<h2>Volunteer Info</h2>
<table>
{{VOLUNTEER_DATA}}
</table>
<p>In Christ's Service,<br/> 
The Cafe Barnabas Team</p>


<footer>
Topeka:West Ridge Mall | <a href=mailto:Madisen@CafeBarnabas.org>Madisen@CafeBarnabas.org</a> <br/>
Topeka:17th St | <a href=mailto:ChristenB@CafeBarnabas.org>ChristenB@CafeBarnabas.org</a>  <br/>
KCMO:Truman Ave | <a href=mailto:LookingF@CafeBarnabas.org>LookingF@CafeBarnabas.org</a>  <br/>
</footer>
</html>
`


/* 
    FIELDS consists of an object whose keys are the field names for the email,
    whose values are the column numbers for the corresponding cells on the spread sheet
 */
const FIELDS = {
  "Name": 1,
  "School": 2, 
  "Phone": 3,
  "Why They Want To Volunteer": 4,
}


const fetchDataFromLastRow = () => {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SPREADSHEET_NAME)
  return sheet.getDataRange().getValues()[sheet.getLastRow() - 1]
}

const createLastRowDataObject = (data, fields) => {
    return Object.entries(fields).reduce((accum, [field, idx]) => {
      accum[field] = data[idx]
      return accum
    }, {})
}

const prepareHtml = (data, template) => {
  const volunteerData = Object.entries(data).reduce((accum, [key, val]) => {
    return `
    ${accum}
	    <tr>
      	      <td><strong>${key}</strong></td>
       	      <td>${val}</td>
      </tr>
      `
  }, "")
  return `${template.replace('{{VOLUNTEER_DATA}}', volunteerData)}`
}

const onUpdate = () => {
  // 1. grab the data from the last row
  const dataFromLastRow = fetchDataFromLastRow()
  // 2. aggregate only the needed fields as an object
  const processedData = createLastRowDataObject(dataFromLastRow, FIELDS)
  // 3. Create HTML payload with processedData
  const emailBody = prepareHtml(processedData, EMAIL_TEMPLATE)
  // 4. Send emails
  MailApp.sendEmail(
    {
      "to": EMAIL_ADDRESSES,
      "htmlBody": emailBody,
      "subject": "New Volunteer Application!"
      }
    )
} 