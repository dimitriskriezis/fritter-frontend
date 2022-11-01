<template>
    <main>
      <section v-if="condition">
        <header>
        <div class="mode-toggle-container">
        <div class="mode-toggle">
          <div @click="getAllFreets('0')">
            All
          </div >
          <div @click="getAllFreets('1')">
            Text
          </div>
          <div @click="getAllFreets('2')">
            Image
          </div>
        </div>
        </div>
        </header>
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
      <button class="find-member" @click="findMember()">Find member</button>
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
                <button @click="stopFindMember()"> Cancel</button>
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
    async mounted() {
        console.log(this.$store.state.groupId);
        if(this.$store.state.groupId){
            await this.getAllFreets("0");
        }
    },
    computed: {
        condition() {
            return this.$store.state.groupId;
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
          this.isSucess = true;
          this.successMessage = `You have successfully added ${this.username_searched} to the group`;
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
                this.successMessage = `successfully removed user ${this.searched_username}`;
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
      background-color: white;
      z-index: 1;
    }
    .mode-toggle{
        position:fixed;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        display:flex;
        height:50px;
        margin-left: 20%;
        margin-top: 0px;
        z-index: 1;
        background: white;
        /* margin-right: 25%; */
    }
    .feed{
        position: relative;
        top:50px;
        margin-left:300px;
        margin-right:300px;
    }
    .find-member{
    position: fixed;
    padding: 20px;
    bottom: 50px;
    right: 50px; 
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

</style>