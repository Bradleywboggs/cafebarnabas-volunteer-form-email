const SPREADSHEET_ID = "1uqX8EWUGpB4EtKjsfX-MuAFHPW_KYGq_QQZjWjR-4_M"
const SPREADSHEET_NAME = "App"
const EMAIL_ADDRESSES = "bradleywboggs@gmail.com"
const EMAIL_CONTENT = `
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

<h2>Volunteer</h2>
{{VOLUNTEER_DATA}}
<p>In Christ's Service,<br/> 
The Cafe Barnabas Team</p>


<footer>
Topeka:West Ridge Mall |   <a href=mailto:Madisen@CafeBarnabas.org>Madisen@CafeBarnabas.org</a> <br/>
Topeka:17th St | <a href=mailto:ChristenB@CafeBarnabas.org>ChristenB@CafeBarnabas.org</a>  <br/>
KCMO:Truman Ave | <a href=mailto:LookingF@CafeBarnabas.org>LookingF@CafeBarnabas.org</a>  <br/>
</footer>
`
const FIELDS = {
  "Name": 1,
  "School": 2, 
  "Phone": 3,
  "Email": 4,
  "Why They Want To Volunteer": 5,
}


const fetchDataFromLastRow = () => {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet = ss.getSheetByName(SPREADSHEET_NAME)
  return sheet.getDataRange().getValues()[sheet.getLastRow() - 1]
}

const createLastRowDataObject = (data, fields) => {
    return Object.entries(fields).reduce((accum, [field, idx]) => {
      accum[field] = data[idx]
      return accum
    }, {})
}

const prepareHtml = (data) => {
  const volunteerData = Object.entries(data).reduce((accum, [key, val]) => {
    return `${accum}<strong>${key}:</strong> ${val} <br/>`
  }, "")
  return `${EMAIL_CONTENT.replace('{{VOLUNTEER_DATA}}', volunteerData)}`
}

const onUpdate = () => {
  // 1. grab the data from the last row
  const dataFromLastRow = fetchDataFromLastRow()
  // 2. aggregate just the needed fields in some way   as an object?
  const processedData = createLastRowDataObject(dataFromLastRow, FIELDS)
  // 3. Convert to email friendly text
  const emailBody = prepareHtml(processedData)

  // 4. Send emails
  MailApp.sendEmail(
    {
      "to": EMAIL_ADDRESSES,
      "htmlBody": emailBody,
      "subject": "New Volunteer Application!"
      }
    )
}
