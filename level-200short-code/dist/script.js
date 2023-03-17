{
var storePassKey = 72 ; // 32 < key < 1095
var transactionPassKey = 3600; //1296 < key < 36655
var datePassKey = 1084; // 0 <= key < 3000
}
// The above passKeys could be altered to maintain some level of security but it is limited (also acts as a buffer to maintain a 9 digit unique code)

//preferably wanted to use AES encryption but there is no instructions allowing for HTML reconfiguration thus AES was not possible.


// TODO: Modify this function
function generateShortCode(storeId, transactionId) {
    var encodedStoreId = (storeId + storePassKey).toString(36);
    var encodedTransactionId = ((transactionId + transactionPassKey) *2).toString(30); // the multiplication ensures that parseInt(encodedTransaction, 30) remains even.
    var newDate = new Date() ;
    var dateString = newDate.getMonth().toString().padStart(2, '0') + newDate.getDate().toString().padStart(2, '0') + newDate.getYear().toString().padStart(3, "0"); // works till year 2899
    dateString = parseInt(dateString, 10)+ datePassKey ;
    dateString= dateString.toString(36) ;
    var result = dateString + encodedStoreId + encodedTransactionId;
    var scramble = result.substring(8,9) + result.substring(2,3)+ result.substring(5,6)+ result.substring(0,1)+ result.substring(6,7)+ result.substring(1,2)+ result.substring(3,4)+ result.substring(4,5)+ result.substring(7,8);
  
    return scramble;
}

// TODO: Modify this function
function decodeShortCode(shortCode) {
    // Logic goes here
    var unscramble = shortCode.substring(3,4) +shortCode.substring(5,6) + shortCode.substring(1,2) +shortCode.substring(6,7) +shortCode.substring(7,8) +shortCode.substring(2,3) +shortCode.substring(4,5) +shortCode.substring(8,9) +shortCode.substring(0,1) ;
    var encodedStoreId = unscramble.substring(4,6);
    var encodedTransactionId = unscramble.substring(6,9);
    var dateString = unscramble.substring(0,4);
    decodedStoreId = parseInt(encodedStoreId, 36) - storePassKey;
    decodedTransactionId = (parseInt(encodedTransactionId,30)/2)  - transactionPassKey; // if the divison leads to a long value it is certain that the shortCode is not legitamate.
    var dateInt = parseInt(dateString, 36) - datePassKey;
    dateInt = dateInt.toString(10).padStart(7, "0");
    intMonth = parseInt(dateInt.substring(0,2));
    intDate = parseInt(dateInt.substring(2,4)) ;
    intYear = parseInt(dateInt.substring(4,7)) +1900; //javascript rules on getYear()
    const newDate = new Date();
    newDate.setMonth(intMonth);
    newDate.setDate(intDate);
    newDate.setYear(intYear);
   
    return {
        storeId: decodedStoreId, // store id goes here,
        shopDate: newDate, // the date the customer shopped,
        transactionId: decodedTransactionId, // transaction id goes here
    };
}

// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {

    var storeIds = [175, 42, 0, 9]
    var transactionIds = [9675, 23, 123, 7]

    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId);
            var decodeResult = decodeShortCode(shortCode);
            $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            AddTestResult("Length <= 9", shortCode.length <= 9);
            AddTestResult("Is String", (typeof shortCode === 'string'));
            AddTestResult("Is Today", IsToday(decodeResult.shopDate));
            AddTestResult("StoreId", storeId === decodeResult.storeId);
            AddTestResult("TransId", transactionId === decodeResult.transactionId);
        })
    })
}

function IsToday(inputDate) {
    // Get today's date
    var todaysDate = new Date();
    // call setHours to take the time out of the comparison
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

function AddTestResult(testName, testResult) {
    var div = $("#test-results").append("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}