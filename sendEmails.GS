`function sendEmails() {`  
 `const groupEmail = "email@domain.net";`  
 `const sheetID = "XYZ";`  
 `const sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();`  
 `const data = sheet.getDataRange().getValues();`  
 `const headers = data.shift(); // Extract headers`  
 `const userEmailIndex = headers.indexOf("User");`  
 `const osIndex = headers.indexOf("Platform");`  
 `const deviceNameIndex = headers.indexOf("Device Name");`  
 `const serialNumberIndex = headers.indexOf("Hardware serial");`  
  `const subject = '[Action Required] Please Enroll Your Device';`  
 `const emailMap = {};`

 `// Loop through each row of employee data`  
 `data.forEach(row => {`  
   `const userEmail = row[userEmailIndex]; // Fetch the user email from the row`  
   `const os = row[osIndex]; // Fetch the OS from the row`  
   `const serialNumber = row[serialNumberIndex]; // Fetch the serial number from the row`  
   `const deviceName = row[deviceNameIndex]; // Fetch the device name from the row`

   `// Initialize the map for the user if not already present`  
   `if (!emailMap[userEmail]) {`  
     `emailMap[userEmail] = {`  
       `devices: {}, // Use an object to keep track of unique devices`  
     `};`  
   `}`

   ``const deviceIdentifier = `${deviceName}-${serialNumber}-${os}`; // Unique identifier``  
   `// Check for duplicates by using the device identifier`  
   `if (!emailMap[userEmail].devices[deviceIdentifier]) {`  
     `// Add new unique device`  
     `emailMap[userEmail].devices[deviceIdentifier] = {`  
       `deviceName: deviceName,`  
       `serialNumber: serialNumber,`  
       `os: os,`  
     `};`  
   `}`  
 `});`

  `// Loop through the emailMap and send consolidated emails`  
 `for (const userEmail in emailMap) {`  
   `const devices = Object.values(emailMap[userEmail].devices); // Convert to array`  
   `const htmlContent = createEmailTemplate(userEmail, devices);     // Create email content using the template`

   `// Send Email`  
   `try {`  
   `GmailApp.sendEmail(userEmail, subject, '', {`  
     `replyTo: groupEmail,`  
     `htmlBody: htmlContent,`  
     `from: groupEmail`  
   `});`  
   `} catch (error) {`  
     ``Logger.log(`Failed to send email to ${userEmail}: ${error.message}`);``  
 `}`  
`}`  
`}`

`function createEmailTemplate(userEmail, devices) {`  
 `// Load the HTML template`  
 `const template = HtmlService.createTemplateFromFile('Email Template - November2024.html');`  
 `template.userEmail = userEmail; // Optionally add userEmail if you want to personalize the email`  
 `template.devices = devices;`  
 `return template.evaluate().getContent();`  
`}`  