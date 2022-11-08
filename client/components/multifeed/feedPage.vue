<template>
    <main>
      <div 
        v-if="$store.state.isSearch"
        class="search-indicator"
        >
           <p > Search Results for tag {{$store.state.searchedWord}}</p>
          </div>
      <section class="fullFeed" v-if="condition">
        <div class="mode-toggle-container">
        <div class="mode-toggle">
          <button class="modebutton" @click="getAllFreets('0')">
            <img class="modeimg" src="../../public/all.svg"/>
            
          </button>
          <button @click="getAllFreets('1')">
            <img class="modeimg" src="../../public/doc.svg"/>
          </button>
          <button @click="getAllFreets('2')">
            <img class="modeimg" src="../../public/image.svg"/>
      
          </button>
        </div>
        </div>
      <section class="feed">
        <section 
          v-if="$store.state.freets.length"
        >
          <FreetComponent
            v-for="freet in $store.state.freets"
            :key="freet.id"
            :freet="freet"
          />
        </section>
        <article
          v-else
        >
          <h3>No freets found.</h3>
        </article>
      </section>
      <button v-if="!$store.state.isSearch" class="find-member" @click="findMember()"> <img class="finduserimg" src="../../public/finduser.svg">
</button>
      <div id="overlay"
        v-if="addMember"
        >
        <div class="find-user">
            <div id="find-user">
                <h3>Find User</h3>
                <label>User Name</label>
                <br>
                <input v-model="username_searched">
                <br>
                <button @click="searchUser()"> Search for User </button>
                <div v-if="has_searched">
                  <div v-if="userFound" class="search-result">
                  <p>{{userFound.user.username}} </p>
                  <div class="add-remove-buttons">
                      <button @click="add()"> Add</button>
                      <button @click="remove()"> Remove</button>
                    </div>
                    <div  class="response">
                    <p v-if="isSuccess"> {{successMessage}}</p>
                    <p v-else> {{errorMessage}}</p>
                    </div>
                  </div>
                  <p v-else> No Users found</p>
                </div>
                <button @click="stopFindMember()"> Close </button>
        </div>
        </div>
        </div> 
    </section>
      <section v-else>
        <h3> Must be in a group</h3>
      </section>
    </main>
  </template>
  
  <script>
  import FreetComponent from '@/components/Freet/FreetComponent.vue';

  export default {
    name: 'FeedPage',
    components: {FreetComponent},
    data(){
      return {
        addMember: false,
        userFound: null,
        username_searched: '',
        has_searched: false,
        isSuccess: false,
        successMessage: '',
        errorMessage: '',
        alerts: {}, // Displays success/error messages encountered during form submission
      };
    },
    mounted() {
        console.log(this.$store.state.groupId);
        if(this.$store.state.groupId || this.$store.state.isSearch){
            this.getAllFreets("0");
        }
    },
    computed: {
        condition() {
            return this.$store.state.groupId || this.$store.state.isSearch;
        }
    },
    methods: {
        async add() {
          const url = `/api/groups/add`;
          const fields = new Object();
          console.log(this.userFound);
          fields.userId= this.userFound.user._id;
          
          const options = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify(fields),
            };

          const r = await fetch(url, options);
          const res = await r.json();
          if(!r.ok) {
              this.isSuccess = false;
              this.errorMessage = res.error;
          }else{
          this.isSuccess = true;
          this.successMessage = `You have successfully added ${this.username_searched} to the group`;
          await this.getAllFreets("0");
          } 
        },
        async remove() {
          console.log(this.$store.state.groupId);
          const url = `/api/groups/remove/?groupId=${this.$store.state.groupId}&userId=${this.userFound.user._id}`;
            
            const r = await fetch(url,{method: 'DELETE'});
            const res = await r.json();
            if(!r.ok) {
                this.isSuccess = false;
                this.errorMessage = res.error;
            }
             else{
                this.isSuccess = true;
                await this.getAllFreets("0");
                this.successMessage = `successfully removed user ${this.username_searched}`;
            }
            

        },
        async searchUser(){
          
          const url = `/api/users/search`;
          const fields = new Object();
          console.log(this.username_searched);
          fields.username = this.username_searched;
          
          const options = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify(fields),
            };
            
            try{
                const r = await fetch(url, options);
                const res = await r.json();
                if(!r.ok) {
                    throw new Error(res.error);
                }
                this.successMessage = '';
                this.errorMessage = '';
                this.isSuccess = false;
                this.userFound = res;
                console.log(this.userFound.user.username);
  
            } catch (e) {
                console.log(e);
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
                this.userFound = null;
            }
            this.has_searched=true; 
        },
        findMember(){
          this.addMember = true;
          console.log(this.addMember);
          // this.$store.commit('refreshFreets');
        },
        stopFindMember(){
          this.addMember = false;
          this.userFound = null;
          this.username_searched= '';
          this.has_searched= false;
          this.isSuccess= false;
          this.successMessage= '';
          this.errorMessage= '';
        },
        async getAllFreets(mode) {
            const url = `/api/feed`;
            const fields = new Object();
            fields.mode = mode;
            
            const options = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify(fields),
            };
            
            try{
                const r = await fetch(url, options);
                const res = await r.json();
                if(!r.ok) {
                    throw new Error(res.error);
                }
                console.log("My freets");
                console.log(res);
                this.$store.commit('updateFreets', res);
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
  }
</script>

<style scoped>
    .mode-toggle-container{
      position:fixed;
      z-index: 1;
      height: 60px;
      background-color: white;
      width:100%;
      padding-top: 10px;
    }
    .mode-toggle{
        /* position:fixed;
        
        display:flex;
        height:50px;
        left: 50%;
        width: 30;
        margin-top: 0px;
        z-index: 1;
        background-color1: blue; */
        
        height: 100%;
        display: flex;
        width: 10%;
        margin-left: 40%;
        margin-right: 45%;
        
        /* margin-right: 25%; */
    }
    .feed{
        position: relative;
        top:60px;
        margin-left:23%;
        margin-right:23%;
    }
  .find-member{
    background-color: #78c5df;
    position: fixed;
    bottom: 50px;
    right: 50px; 
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: none;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    align-items: center;
    
}

#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
  cursor: pointer;
  display: flex;
  align-items: center;
}

#overlay .find-user{
    background-color: white;
    width:30%;
    aspect-ratio : 1 / 1;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-result{
  border-style: solid;
  padding: 10px;
}


.search-indicator{
  position: fixed;
  text-align: center;
  width: 25%;
  top: 50;
  left: 0;
  z-index : 2;
}

.modeimg{
  width: 30px;
  height: 30px;
}
  .finduserimage{
    width: 30px;
    height: 30px;
  }

</style>