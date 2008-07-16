/* TestLib -- Simple Testing Library 
   Abstracts common browser inconsistencies where the purpose of the test case does not depent on testing the given functionality
*/

// [global scope]
function TestLibrary() { }
// [TestLib scope] addEvent( [in] Object  /* HTMLElement / HTMLDocument / Window */,
//                                              [in] String /* event name */,
//                                              [in] FunctionPointer /* JS function pointer variable */,
//                                              [in] Bool /* useCapture (optional)*/ )
TestLibrary.prototype.addEvent = function (ob, name, func, capture) 
{ 
   if (!ob || (typeof ob != 'object'))
	  throw new Error("Call to TestLib.addEvent([ob], name, func, capture): Please provide the object (element, document, window) to which the event should be attached.", "Call to TestLib.addEvent: Please provide the object (element, document, window) to which the event should be attached.");
   if (!name || (typeof name != 'string'))
      throw new Error("Call to TestLib.addEvent(ob, [name], func, capture): Please provide the name of the event to attach (sans the 'on' prefix). For example: 'click' not 'onclick'.", "Call to TestLib.addEvent(ob, [name], func, capture): Please provide the name of the event to attach (sans the 'on' prefix). For example: 'click' not 'onclick'.");
   if (!func || (typeof func != 'function'))
      throw new Error("Call to TestLib.addEvent(ob, name, [func], capture): Please provide the function pointer to be called when the event is raised. For example: function () { ... }", "Call to TestLib.addEvent(ob, name, [func], capture): Please provide the function pointer to be called when the event is raised. For example: function () { ... }");

   // Param 4 is optional. if specified it will be used--however, some browsers (IE) do not support the capture phase.
   if (capture == undefined)
      capture = false;
   if (document.addEventListener)
      return ob.addEventListener(name, func, capture);
   else // IE special case
      return ob.attachEvent("on" + name, func);
}

var TestLib = new TestLibrary();