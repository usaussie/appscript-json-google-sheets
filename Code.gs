const JSON_SOURCE_URL = 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json';
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/YOUR-SHEET-ID/edit#gid=0";
const GOOGLE_SHEET_RESULTS_TAB_NAME = "Sheet1";

function set_sheet_headers_one_time() {
  
  var results_sheet = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName(GOOGLE_SHEET_RESULTS_TAB_NAME);
  results_sheet.appendRow(["audit_date", "domain_count", "domains", "web_page_count", "web_pages", "name", "alpha_two_code", "state-province", "country"]);
  
}

function get_and_write_the_data() {
 
  var my_data = getJSONDataFromUrl(JSON_SOURCE_URL);
  var ss = SpreadsheetApp.openByUrl(GOOGLE_SHEET_URL).getSheetByName(GOOGLE_SHEET_RESULTS_TAB_NAME);
  var do_write = writeJSONDataToSheet(ss, my_data);
  
}

function getJSONDataFromUrl(url) {
  
  var response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  var parsedJsonData = JSON.parse(response.getContentText());
  return parsedJsonData;
  
}

function writeJSONDataToSheet(ss, json_data) 
{
 
  var audit_date = new Date();

  var rows = [], data;
  
  for (i = 0; i < json_data.length; i++) {
    data = json_data[i];
    
    var name = data.name;
    var alpha_two_code = data.alpha_two_code;
    var state_province = data['state-province'];
    var country = data.country;
    
    var web_page_count = data.web_pages.length;
    var domain_count = data.domains.length;
    
    var web_pages = data.web_pages.join(', ');
    
    // treat domains as the the main element, so loop through domains to write the other rows. IE: For each domain, write the whole data set (including string for web_pages)
    for (var this_domain of data.domains)
    {
      rows.push([audit_date, domain_count, this_domain, web_page_count, web_pages, name, alpha_two_code, state_province, country]);
      
      // let's push into the sheet, and clear the memory every 1000 rows just so we dont run into any issues with memory limits in appscript.
      if(rows.length > 1000) {
        ss.getRange(ss.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
        
        rows = [];
      }
      
    }

  }
  
  // write any remaining rows to the sheet
  ss.getRange(ss.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  
}
