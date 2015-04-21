var _actualResults = "actual";
var _expectedResults = "expected";
 
function vendor_reportResult()
{
    if (_actualResults == _expectedResults)
       document.getElementById("result").setAttribute("class", "passed");
     else          
       document.getElementById("result").setAttribute("class", "failed");
}