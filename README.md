# UI-Email-Automation-with-Javascript-and-HTML

This repository contains a Google Apps Script solution designed to automate the process of sending customized email notifications to users about their non-compliant devices. The script reads dynamic device and user data from a Google Sheet coming from a centralized location (think Silver table) with many sources, consolidates all devices belonging to a single user, and sends one concise email per user using a dynamic HTML template. Knowledge domains include HTML, Javascript, and some loop iteration knowledge.

The script was designed with IT and Security teams in mind for managing endpoint compliance and notifying users to enroll their devices in management systems like JAMF, Microsoft Intune, or Google MDM. It could be adapted to reach any group of users for many purposes, making it highly valuable in an organization looking to reduce reliance on external mail merge subscriptions.

## Features

-   **Data-Driven:** Pulls user and device information directly from a Google Sheet.
-   **Consolidated Emails:** Groups multiple devices under a single user to avoid sending spam.
-   **Duplicate Prevention:** Ensures that each unique device is listed only once per user.
-   **Dynamic HTML Templates:** Uses Google Apps Script's templating service to populate a rich HTML email with user-specific data.
-   **Error Handling:** Includes a `try...catch` block to log any failures during the email sending process.
-   **Easy Configuration:** Key variables like the Sheet ID and reply-to email are centralized for easy modification to allow others to send the notification or to align with company best standards.

## Prerequisites

1.  A Google Workspace account with access to Google Sheets, Gmail, and Google Apps Script.
2.  Permissions to run scripts that access `SpreadsheetApp` and `GmailApp`.
3.  A source Google Sheet containing device data. 

## Configurable Variables

In the `sendEmails.gs` file, update the following constant variables:

```javascript
// The email address for replies and the 'from' field.
const groupEmail = "it-support@your-company.com";

// The ID of your Google Sheet.
const sheetID = "YOUR_GOOGLE_SHEET_ID_HERE";

// The subject line for the notification email.
const subject = '[Action Required] Please Enroll Your Company Device';
```

Also, ensure the column header names match those in your Google Sheet. If they differ, update these lines:
```javascript
const userEmailIndex = headers.indexOf("User");
const osIndex = headers.indexOf("Platform");
const deviceNameIndex = headers.indexOf("Device Name");
const serialNumberIndex = headers.indexOf("Hardware serial");
```

## Walkthrough

### `sendEmails.gs`

The script performs the following actions:
1.  **Initialization**: Sets up constants for the source Sheet ID, reply-to email, and email subject. It opens the spreadsheet and gets all data.
2.  **Data Processing**: It iterates through each row of the sheet. For each row, it builds an `emailMap` object. The keys of this map are the user emails.
3.  **Consolidation**: Each user email key in the map points to an object that contains a nested `devices` object. This prevents duplicate device entries for the same user and consolidates all devices under that user. A unique identifier for each device is created from its name, serial number, and OS.
4.  **Email Generation**: After processing all rows, the script loops through the `emailMap`. For each user, it converts the `devices` object into an array and passes it to the `createEmailTemplate` function.
5.  **Sending Email**: It sends the generated HTML content to the user via `GmailApp.sendEmail`. Any errors are caught and logged using `Logger.log()`.

### `EmailTemplate.html`

This file is a standard HTML email template with special tags called **scriptlets**. Google Apps Script's `HtmlService` processes this file to dynamically insert data.

-   `<? ... ?>`: Standard scriptlet tags for control flow, like loops and conditionals.
-   `<?= ... ?>`: Printing scriptlets that output the value of a variable directly into the HTML.

The template iterates through the `devices` array passed from `sendEmails.gs` to create a list of devices in the email body:

```html
<ul>
  <? for (var i = 0; i < devices.length; i++) { ?>
    <li>
      <strong>Device Name:</strong> <?= devices[i].deviceName ?><br>
      <strong>Serial Number:</strong> <?= devices[i].serialNumber ?><br>
      <strong>Operating System:</strong> <?= devices[i].os ?>
    </li>
    <br>
  <? } ?>
</ul>
```

## License
Distributed under the MIT License.
