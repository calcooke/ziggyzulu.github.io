// JavaScript Document
"use strict()";

window.onload = function(){
	
		populateTable();   //Function to populate the table from local storage 
	
};
    
function populateTable(){   

	var newTable = document.getElementById("theTable");     //Putting the blank table into a variable to work with it
      
	var pastMembers = JSON.parse(localStorage.getItem("keyItem"));   //Parsing the objects in local storage to a string and store in a variable
       
    for(var i = 0; i < pastMembers.length; ++i) {   //Loop through this variable
		
        row = newTable.insertRow(i);  //Create a row, and insert it into the blank table
        cell = row.insertCell(0);
        cell.innerHTML = pastMembers[i].firstName;  //Create cells in the table and populate with each object's details.
        cell = row.insertCell(1);
        cell.innerHTML = pastMembers[i].lastName;
        cell = row.insertCell(2);
        cell.innerHTML = pastMembers[i].paymentDate; 
        cell = row.insertCell(3);
		cell.innerHTML = pastMembers[i].amountPaid; 
        cell = row.insertCell(4);
		cell.innerHTML = pastMembers[i].memberType;
		cell = row.insertCell(5); 
		cell.innerHTML = '<button id="delteRow" onclick = "deleteRow(this)">Delete</button';  //Create a button with HTMl and call a delete 							    																							function from it
		
    }
	
	/*if(typeof(localStorage.getItem("keyItem")) !== undefined)
	{
		
		alert(window.localStorage.getItem("keyItem"));
	
	}*/
	
}
				
var members = [];       //Create an empty array called members

    function create()      //Create function, which is called from a button in the HTMl
    {

    	var info = {

			firstName: document.getElementById("firstName").value,
			lastName: document.getElementById("lastName").value,
			paymentDate: document.getElementById("paymentDate").value,     //Store all th values of the form in an object called "info"
			amountPaid: document.getElementById("amountPaid").value,
			memberType: document.getElementById("memberType").value
			
		 };

         members.push(info);    //push info into the members array
		 
		 window.localStorage.setItem("keyItem", JSON.stringify(members));    // Convert to JSON format to store locally.
		 
		 addToTable(); //Calls the add to table function
		 
	}
	
	function addToTable()
	{
				
		var theTable = document.getElementById("theTable");  //Store the empty table in a variable
		
		theTable.innerHTML = " ";  //Clear the inner HTMl for updating
					
		for(var i = 0; i < members.length; ++i) {   //Loop through the members array 
			
			row = theTable.insertRow(i);
			cell = row.insertCell(0);
			cell.innerHTML = members[i].firstName;
			cell = row.insertCell(1);
			cell.innerHTML = members[i].lastName; 
			cell = row.insertCell(2);
			cell.innerHTML = members[i].paymentDate;      //Put the information in each object in a cell's inner html.
			cell = row.insertCell(3);
			cell.innerHTML = members[i].amountPaid; 
			cell = row.insertCell(4);
			cell.innerHTML = members[i].memberType;
			cell = row.insertCell(5); 
			cell.innerHTML = '<button id="delteRow" onclick = "deleteRow(this)">Delete</button>';
			
        }		
			
 	}
	
	function sortArrayName()            //Called from clicking on the First name table header.
            {

                members.sort(function(a, b)       
                {    
					/*return a.firstName.toLowerCase() -  b.firstName.toLowerCase();*/
				
                    var nameA = a.firstName.toLowerCase(),    //Convert to lower case for sorting
                        nameB = b.firstName.toLowerCase()     
						if (nameA < nameB)         return -1    //If the result is -1, Sort A lower than B - in ascending order.
                        if (nameA > nameB)         return 1    
                        return 0
                })
				
				addToTable();

            }
			
	function sortArrayLastName()    //Called from clicking the last name header
            {

                members.sort(function(a, b)
                {    
					/*return a.lastName.toLowerCase() -  b.lastName.toLowerCase();*/
				
                    var nameA = a.lastName.toLowerCase(),
                        nameB = b.lastName.toLowerCase()     
						if (nameA < nameB)         return -1    
                        if (nameA > nameB)         return 1    
                        return 0
                })
				
				addToTable();

            }
			
	function sortPayment(){           //Called from clicking the payment amount header
			
			members.sort(function(a, b)
			{    
									
					return a.amountPaid - b.amountPaid;   //Sort ascending
					
			})
					
			addToTable();
				
	}
		
	function sortArrayDate(){             //Called from clicking the date header 
					
			members.sort(function(a,b)
			{ 
	
    				return new Date(a.paymentDate) - new Date(b.paymentDate);   //Concert the dates to a Dat type, and sort in ascending order.
	
			});
			
			addToTable();
	
	}
	
	function sortMembershipType(){    //Called from the membership type header
	
			members.sort(function(a, b)
            {    
				
                    var nameA = a.memberType.toLowerCase(),
                        nameB = b.memberType.toLowerCase()     
						if (nameA < nameB)         return -1    
                        if (nameA > nameB)         return 1    
                        return 0
            })
				
			addToTable()
	}
			
	function deleteRow(e) {
		
			var i = e.parentNode.parentNode.rowIndex;   //Put the row index of the parent node of the event's parent node into a variable
		
			document.getElementById("theTable").deleteRow(i); //Delete the row index
			
			delete members[i];
			
	}
