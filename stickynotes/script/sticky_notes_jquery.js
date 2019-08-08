$(document).ready(function(){
    
   
    
    $('#snappable').click(function(){       //THIS MAKES THE NOTES SNAP TOGETHER
              
        $(".newNote").draggable({
            snap: true
        });
  
    });
    
    $('#notSnappable').click(function(){
              
        $(".newNote").draggable({
            snap: false
        });
  
    });
    
    $('#deleteAll').click(function(){    //Delete all notes
              
        $('.newNote').remove();
        saveText();
  
    });
    
    
    loadNotes(); // CREATE A STICKY NOTE ON DOUBLECLICK CALLED HERE!!!
    
    $("#board").dblclick( function(e){
        
        var placeholder = "Type here..."
        var position = {
            top: event.pageY,
            left: event.pageX,
        };
   
        createNote(placeholder, position);    //created by calling this function DOWN BELOW
        
            
        saveText();        //SAVES POSITION TO LOCAL STORAGE
            
   
    });
        
        
});

    $(document).on("mousedown", '.newNote', function (e) {    // BRINGS THE SELECTED STICKY NOTE TO THE FRONT
        
        
           $('.newNote').css("zIndex", '1');
            $(this).css('zIndex', '1000');
        
    });


    $(document).on("click", '#deleteButton', function (e) {  //Deletes sticky notes
        
        
        $(event.target).parent().fadeOut(200, function () { $(this).remove(), saveText(); });
        
        
    });


    function loadNotes(){                                           //LOAD NOTES - LOAD NOTES - LOAD NOTES
       
        var notes = JSON.parse(localStorage.stickyNote || "[]");
        
        $.each(notes, function (i, note) {
        
            createNote(note.text, note.position);
        
        })
        
        return notes
              
    };
    

    function saveText(){                                              //SAVE NOTES - SAVE NOTES - SAVE NOTES
        
 
        notes = $("#board .newNote").map(function (i) {
            
            return {
                text: $("#textArea", this).val(),
                position: $(this).offset()
            }

        }).get()

        localStorage.stickyNote = JSON.stringify(notes)

    };
    
    function createNote(text, position){                               //CREATE NOTES - CREATE NOTES - CREATE NOTES
        
        
        var sticky = $("<div class='newNote' > <button id='deleteButton'>X</button> </div>").draggable({
            
            stop: saveText,
            
            
            }).css({
            
                position: "absolute",
                top: position.top,
                left: position.left,                   //CREATE THE DIV
                height: 250,
                width: 200,
                zIndex: 1000
           
        
   
            }).dblclick(function(e){
        
                event.stopPropagation();
        
        
            });
        
        
        var stickyText = $('<textarea id="textArea" class="theText">' + text + '</textarea>').css({      //CREATE THE TEXT AREA

            'resize' : "none"

            }).dblclick(function(e){

            event.stopPropagation();
        
        });
        
        
        stickyText.appendTo(sticky);                                //PUT THE TEXT AREA INTO THE DIV
        
        stickyText.keyup(saveText);                                       // SAVING TO LOCAL STORAGE CALLED HERE
                        
        $(sticky).prependTo($("#board"));                               //STICK NOTE TO BOARD
        
        
        
       
    };

    
 

