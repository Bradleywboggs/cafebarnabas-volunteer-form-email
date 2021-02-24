const SPREADSHEET_ID = ''

// Cafe Locations
const WESTRIDGE_LOCATION = 'West Ridge Mall' 
const SEVENTEENTH_ST_LOCATION = '17th St' 
const KCMO_LOCATION = 'KCMO' 

// The DEFAULT_EMAIL_ADDRESSES are for testing or
// if you want to have one or more people always get the email in addition to the location specific email address
// If you don't want one person to get them all, simply set the value to an empty string: ''
const DEFAULT_EMAIL_ADDRESSES = ''

const EMAILS_BY_LOCATION = {
  [WESTRIDGE_LOCATION]: 'MadisenW@CafeBarnabas.org',
  [SEVENTEENTH_ST_LOCATION]:'ChristenB@CafeBarnabas.org',
  [KCMO_LOCATION]: 'LookingF@CafeBarnabas.org'
}

const EMAIL_SUBJECT = 'New Volunteer Application!'
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
<body>
  <h1>Hey World Changer!!!</h1>
  <h2>We have a new volunteer application. Thanks for seizing this relational opportunity in the next 24-48 hours!</h2>
  <h3>CREATING OUTSTANDING EXPERIENCES</h3>
  <p>
    <strong>Rom. 10:14-15</strong><br/>
    <em>
      How then will they call on him in whom they have not believed?<br/>
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
  <p>
    In Christ's Service,<br/> 
    The Cafe Barnabas Team
  </p>
</body> 
</html>
`
const FIELDS = {
  Name: {
    isMultiColumn: true,
    columnNumber: [1,2],
    separator: ' ',
    },
  School: {
    isMultiColumn: false,
    columnNumber: 37
    },
   Email: {
     isMultiColumn: false,
     columnNumber: 33
   },  
  Phone: {
    isMultiColumn: false,
    columnNumber: 7
    },
  'Why They Want To Volunteer':{
    isMultiColumn: false,
    columnNumber: 36
    },
  Location: {
    isMultiColumn: false,
    columnNumber: 34
  }
}

const fetchDataFromLastRow = () => {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet = ss.getActiveSheet()
  const data = sheet.getDataRange().getValues()
  return data[sheet.getLastRow() - 1]
}

const createLastRowDataObject = (data, fields) => {
  return Object.entries(fields).reduce((accum, [field, value]) => {
    if (value.isMultiColumn) {
      accum[field] = value.columnNumber.reduce((_accum, colNum) => {
        const prefix = _accum == '' ? _accum : `${_accum}${value.separator}`
        return `${prefix}${data[colNum]}`
      }, '')
      return accum
    } else {
      accum[field] = data[value.columnNumber]
      return accum
    }
  }, {})
}

const getEmailAddressByLocation = (location) => {
    if (location.includes(SEVENTEENTH_ST_LOCATION)) {
      return EMAILS_BY_LOCATION[SEVENTEENTH_ST_LOCATION]
    }
    if (location.includes(KCMO_LOCATION)) {
      return EMAILS_BY_LOCATION[KCMO_LOCATION]
    }
    return EMAILS_BY_LOCATION[WESTRIDGE_LOCATION]
}

const aggregateEmailAddresses = (emailByLocation, defaultEmails) => {
  if (defaultEmails === '') {
    return emailByLocation
  }
  return `${defaultEmails}, ${emailByLocation}`
}

const prepareHtml = (data, template) => {
  const volunteerData = Object.entries(data).reduce((accum, [key, val]) => {
    if (key === 'Location') {
      return accum
    } else {
    return `
    ${accum}
	    <tr>
      	      <td><strong>${key}</strong></td>
       	      <td>${val}</td>
      </tr>
      `
  }}, '')
  return `${template.replace('{{VOLUNTEER_DATA}}', volunteerData)}`
}

const onSubmit = () => {
  // 1. grab the data from the last row
  const dataFromLastRow = fetchDataFromLastRow()
  // 2. aggregate needed fields and values as an object
  const processedData = createLastRowDataObject(dataFromLastRow, FIELDS)
  // 3. get the location specific email addressee
  const emailByLocation = getEmailAddressByLocation(processedData.Location)
  // 4. aggregate the above email with any existing default email addressees
  const allEmailAddresses = aggregateEmailAddresses(emailByLocation, DEFAULT_EMAIL_ADDRESSES)
  // 5. Create HTML payload with processedData
  const emailBody = prepareHtml(processedData, EMAIL_TEMPLATE)
  // 6. Send emails
  MailApp.sendEmail(
    {
      'to': allEmailAddresses,
      'htmlBody': emailBody,
      'subject': EMAIL_SUBJECT
      }
    )
} 
