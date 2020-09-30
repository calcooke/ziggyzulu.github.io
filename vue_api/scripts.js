const eventBus = new Vue();


const app = new Vue({

    el: '#main',

    data: {

        result: "",
        responseAvailable: false,
        categories: [],
        tabs: ["Home", "Categories", "Random"],
        selectedCategory: "",
        selectedTab: "Home",
        selectedMenuITem: 0,
        selectionIndex: 0,
        randomCategory:""

    },
    mounted() {

        //Call api data to populate html upon loading. Default selected navigation tab is blank to revieve entire API
        this.fetchAPIData(this.selectedCategory);
       
        //Listening for navigation through the sitemap from Footer component
        eventBus.$on('page-navigation', (tab) => {
            this.selectedTab = tab
            this.update();
        })

        //Listening for the index of the item which was selected
        //from the side menu, in order to select it's corresponding details from the api response
        eventBus.$on('selected-index', (index) => {
            this.selectionIndex = index;
        })

        eventBus.$on('populate-categories', (categories) => {
            this.categories = categories;
        })

        eventBus.$on('selected-category', (category) => {

            //Reset selected index to avoid errors such as index out of bounds
            this.selectionIndex = 0;
            this.selectedCategory = category;
            this.update();

        })

    },
    methods: {

        //Update the API call, whenever a new category is selected
        update() {

            if (this.selectedTab !== "Random") {

                this.fetchAPIData(this.selectedCategory);

            } else {

                //Select random category if the random tab is selected, or random button is clicked
                this.randomCategory = this.categories[Math.floor(Math.random() * this.categories.length)];
                this.fetchAPIData(this.randomCategory);

            }

        },
        fetchAPIData(selectedCategory) {
    
            this.responseAvailable = false;
            fetch(`https://swapi.dev/api/${selectedCategory.toLowerCase()}`, {
                "method": "GET",
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    alert("Server returned " + response.status + " : " + response.statusText);
                }
            })
            .then(response => {

                //If no category is selected yet, it means it's the first time
                // the app has called. Retrieve the entire API
                if(this.selectedCategory == ""){

                    this.result = response;

                    //Then populate the categories array
                    for(let key in this.result){

                        this.categories.push(key);
                    }

                    //Choosing a default category to be selected when the Categories page loads
                    this.selectedCategory = this.categories[0];
                        
                } else {
                //If a category is actually selected, get it's details from the response's results object
                this.result = response.results;
                }
                    
                //Indicate we have a successful response
                this.responseAvailable = true;
                    
            })
            .catch(err => {
                console.log(err);
            });
        },   
    }
})

Vue.component('nav-bar',{

    props:{

        tabs:{
            type: Array
        },
        selectedTab:{ 
            type: String
        }

    },
    methods:{
        //Emit event to switch between pages
        selectTab(tab){

            eventBus.$emit('page-navigation', tab)

        }

    },
    template:`

    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">

                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <a @click="selectTab('Home')" id="menuBar" class="navbar-brand" href="#" >Star Wars info</a>

            </div>
            <div class="collapse navbar-collapse" id="myNavbar">

                <ul class="nav navbar-nav">
                    <li v-for="(tab, index) in tabs" :key="index" 
                    @click="selectTab(tab)"
                    :class="{active: selectedTab == tab}"> <a id="menuBar" href="#">{{tab}}</a></li>                    
                </ul>

            </div>
        </div>
    </nav>
    `,

})

Vue.component('side-menu',{

    props:{
        //Api call result passed in from parent
        result: {
            type: Array
        },
        //Make sure an API response is available
        responseAvailable:{ 
            type: Boolean
        },
        selectedCategory:{
            type: String
        },
        selectedTab:{
            type:String
        },
        categories:{
            type:Array
        },
        selectionIndex:{
            type: Number
        }

    },
    methods:{

        //Emitting the index of the selected item
        // from the side menu in order to display the details
        selectIndex(index){

            eventBus.$emit('selected-index', index)

        },
        //Emitting an event when switching between categories
        updateCategory(event){

            eventBus.$emit('selected-category', event.target.value)

        }

    },
    template: `

    <div class="col-sm-2 sidenav">
    
        <label style="color: yellow" for="category">Select category:</label>

        <select id="category" @change="updateCategory($event)" :value="selectedCategory">
            <option v-for="category in categories">{{category}}</option>       
        </select>
    
        <ul v-show="selectedCategory !== 'films' ">
            <li  class="sideList" v-for="(value, index) in result" @click="selectIndex(index)" :class="{selected: selectionIndex == index}">{{value.name}} </li>
        </ul>

        <ul v-show="selectedCategory === 'films'">
            <li  class="sideList" v-for="(value, index) in result" @click="selectIndex(index)" :class="{selected: selectionIndex == index}">{{value.title}}</li>
        </ul>

    </div>

    `,
})

Vue.component('selection-details', {

    props: {

        //Api call result passed in from parent
        result: {
            type: Array 
        },
        //Index of selected person/planet from menu, passed in from parent
        selectionIndex:{

            type: Number
        } 

    },
    computed :{

        //Details of person/planet to be displayed in table
        details(){

            //Use the selected index as a key
            return this.result[this.selectionIndex];

        },   
    },
    template: `

    <div class="col-sm-10 text-left">
    
        <table class="table">
        <thead>
            <tr>
                <th><h3>Detail</h3></th>
                <th><h3>Description</h3></th>    
            </tr>
        </thead>
        <tbody>
            <tr v-for="(value, name) in details">
                <td>{{name}}</td>
                <td>{{value}}</td>
            </tr>
        </tbody>
        </table>

    </div>
    `,
    
})


Vue.component('footer-sitemap', {

    props:{

        //Navigation menu tabs
        tabs:{
            type : Array
        }

    },
    methods:{

        //Emit event to switch between pages
        selectTab(tab){

            eventBus.$emit('page-navigation', tab)

        }

    },
    template: `
    
        <footer class="container-fluid  text-left">

        <label>Sitemap</label>
            <ul>
                <li v-for="(tab, index) in tabs" :key="index" @click="selectTab(tab)"> 
                <a id="menuBar" href="#">{{tab}}</a></li>
            </ul>
        </footer>`,

})

Vue.component('home-page',{
    props:{
        //Result from api call
        result:{
            type: Array
        },
        //Make sure an API response is available
        responseAvailable:{ 
            type: Boolean
        },
        categories:{
            type: Array
        }     
    },
    data(){
        return{
            reversed: false
        }
    },
    methods:{

        //Switch list of categories between ascending or descending
        sort(){

            if(this.reversed == true){
            this.categories = this.categories.sort()
            this.reversed = false
            } else{
            this.categories = this.categories.reverse()
            this.reversed = true
            }

        },
        viewCategory(category){

            //Select category to show, and transition to that category page
            eventBus.$emit('selected-category', category)
            eventBus.$emit('page-navigation', "Categories")

        }
    },
    template:`
    
    <div class="col-sm-12 text-middle">

        <div class="text">

            <h2> Welcome to the star wars info database</h2>
            <h3>The force is with you</h3>
            <p>Your one stop shop for everything Star Wars. What would you like to find out about??</p>

            <ul>
            <button class="actionButton" @click="sort()">Sort A-Z</button>
            <li class="list" v-for="(category, index) in categories" @click="viewCategory(category)">{{category}}</li>
            </ul>

        </div>

     </div>
    
    `
})

Vue.component('random-page',{
    props:{

        //Random category API call result, called when navigating into the Random page
        //on the Nav bar.
        result:{
            type: Array
        },
        //The random category's name
        randomCategory:{
            type: String
        }

    },
    computed:{

        randomChoice(){

            //Random choice to display from the API result
            return this.result[Math.floor(Math.random() * this.result.length)];

        }

    },
    methods:{

        generateNew(){

            //Triggering a reload of the page to generate another random result.
            //Random results are generated in the main component's 'update' method.
            eventBus.$emit('page-navigation', "Random")

        }

    },
    template:`
    
    <div class="col-sm-12 text-middle">  
        <ul class="text">

            <li><h3>Quickfire {{randomCategory}} Trivia!</h3></li> 
            <li><button class="actionButton" @click="generateNew()">Generate another fact?</button></li>
            <li  v-for="(value, name) in randomChoice"><strong>{{name}}:</strong> {{value}}</li>

        </ul>

     </div>
    
    `
})