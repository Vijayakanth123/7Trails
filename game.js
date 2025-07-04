// localStorage.clear('gen_number');
// localStorage.clear('input_numbers');
// localStorage.clear('je');
// localStorage.clear('pp');


document.getElementById('body').addEventListener('keydown', (event)=>{
    if(event.key === 'Enter') click_enter_button();
});

let currRow = JSON.parse(localStorage.getItem('curr_row')) || 1;


let wins = JSON.parse(localStorage.getItem('w')) || 0;
document.getElementById('wins_display').innerText=wins;
localStorage.setItem('w',JSON.stringify(wins));


let generatednumber_as_array = JSON.parse(localStorage.getItem('gen_number')) || [];



if(generatednumber_as_array.length === 0){
    generateNumber();
    localStorage.setItem('gen_number',JSON.stringify(generatednumber_as_array));
}



let pp = JSON.parse(localStorage.getItem('pp')) || [];     //perfectly placed,just exist
let je = JSON.parse(localStorage.getItem('je')) || [];

document.getElementById('demo_2').innerHTML=`${pp} ;; ${je}`;

let inputnumbers = JSON.parse(localStorage.getItem('input_numbers')) || [];


genHtmlGame();


//gets a random integer used to create a number
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//creates three random unidentical digits in an array (generatednumber_as_array)
function generateNumber(){
    
    let ones,tens,hundreds;
    ones=getRandomInt(1,9);
    tens=getRandomInt(1,9);
    hundreds=getRandomInt(1,9);

    
    while(tens===ones){
        tens=getRandomInt(1,9);
    }
    
    while(ones===hundreds || tens===hundreds){
        hundreds = getRandomInt(1,9);
    }
    generatednumber_as_array[0]= hundreds ;
    generatednumber_as_array[1]= tens ;
    generatednumber_as_array[2]= ones ;

    localStorage.setItem('gen_number',JSON.stringify(generatednumber_as_array));

    
}


//works when key is pressed while a cell is focussed
function checkKeydown(x, event ,xid) {
    
    // Check if the pressed key is a number less than 10 and greater than 0
    if (!isNaN(event.key) && event.key >= 1 && event.key <= 9) {
        x.innerHTML = `${event.key}`; //update the element to show the number
        goNext(x,xid); //and goes to next cell
    }

    //check if key pressed is enter
    else if ( `${event.key}` === 'Enter'){
        click_enter_button(x);
    }
    
}


function click_enter_button(elem){
    if(elem) elem.blur();
    if(checkValue()){
        saveDigits();
        check_positioning();
        if(checkWin()){
            wins++;
           
            generateNumber();
            generatednumber_as_array = JSON.parse(localStorage.getItem('gen_number')) || [];

            currRow = 1;
            pp = [];     
            je = [];
            inputnumbers = [];
            
            document.getElementById('wins_display').innerHTML=wins;
            document.getElementById('demo_2').innerHTML=`${pp} ;; ${je}`;
            
            localStorage.setItem('w',JSON.stringify(wins));
            localStorage.setItem('pp',JSON.stringify(pp));
            localStorage.setItem('je',JSON.stringify(je));
            localStorage.setItem('curr_row',JSON.stringify(currRow));
            localStorage.setItem('input_numbers',JSON.stringify(inputnumbers));
        }else{
            currRow++;
            localStorage.setItem('curr_row',JSON.stringify(currRow));
        }
        genHtmlGame();
    }
    document.getElementById(`_${currRow}_1`).focus();
}



function focusCell(elem,elem_id) {
    elem.classList.add("cell_focussed");  //adds outline 
    
    //eventlistener is added that runs checkkeydown function on keydown
    elem.addEventListener("keydown", (event) => checkKeydown(elem, event, elem_id));
}


function defocusCell(elem,elem_id){
    elem.classList.remove("cell_focussed"); //removes outline 

    //event listener is removed
    elem.removeEventListener("keydown",checkKeydown(elem,Event,elem_id));
}

function check_positioning(){
    pp.push(0);
    je.push(0);

    inputnumbers[currRow-1].forEach( (element1,index1) => {
        generatednumber_as_array.forEach( (element2, index2 ) => {
            if(element1 == element2 && index1===index2) pp[currRow-1] ++;
            else if(element1 == element2) je[currRow-1]++;
        }  )
    });
    localStorage.setItem('pp',JSON.stringify(pp));
    localStorage.setItem('je',JSON.stringify(je));
    document.getElementById('demo_2').innerHTML=`${pp} ;; ${je}`;
}



function checkValue(){

   //creates an array with elements of current row 
    let arra=[ document.getElementById(`_${currRow}_1`).innerText,document.getElementById(`_${currRow}_2`).innerText,document.getElementById(`_${currRow}_3`).innerText];
    
    //returns true if all three digits are different
    if (arra[2] !== arra[0] && arra[2] !== arra[1] && arra[0] !== arra[1]) return true;
    else return false;

}

//true if all three digits are in perfect positions
function checkWin(){
    if(pp[currRow-1] == '3') return true;
    else return false;
}


function genHtmlGame(){
    let html='';
    inputnumbers.push(['','','']);
    for(let i=0;i<currRow;i++){
        html += 
        `<div class="number">
                    <div id="_${i+1}_1" class="cell _${i+1}">${inputnumbers[i][0]}</div>
                    <div id="_${i+1}_2" class="cell _${i+1}">${inputnumbers[i][1]}</div>
                    <div id="_${i+1}_3" class="cell _${i+1}">${inputnumbers[i][2]}</div>
        </div>`
    }
    inputnumbers.pop();
    document.getElementById('middle').innerHTML=html;
    giveSelectability();
}


function goNext(elem,elemidnum){
    elem.blur();
    if(elemidnum!==3) document.getElementById(`_${currRow}_${elemidnum+1}`).focus();
}

function saveDigits(){
    let arra=[ document.getElementById(`_${currRow}_1`).innerText,document.getElementById(`_${currRow}_2`).innerText,document.getElementById(`_${currRow}_3`).innerText];
    inputnumbers.push(arra);

    localStorage.setItem('input_numbers',JSON.stringify(inputnumbers));
}


function giveSelectability(){
    let elements = [document.getElementById(`_${currRow}_1`),document.getElementById(`_${currRow}_2`),document.getElementById(`_${currRow}_3`)]

    elements.forEach( (value,index) => {
        value.setAttribute("tabindex", "0");
        value.setAttribute("onfocus", `focusCell(this,${index+1})`);
        value.setAttribute("onblur", `defocusCell(this,${index+1})`);
    } );
}
