<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <section>
  <nav>
    <button
      @click="leaveSearch()"
      v-if="$store.state.isSearch"
      class="backButton"
      >
      <img class="navimg" src="../../public/back.svg">
    </button>
    
    <div class="logo">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="right">
      <div class="tagged-search" v-if="$store.state.username">
      <input
          class="searchInput"
          v-model="search_tag"
          placeholder="Search topic..."
      >
      <!-- <button @click="search()">Search</button> -->
      <button>
      <img v-if="$store.state.username" @click="search"  src="../../public/search.svg">
    </button>
      </div>
      <!-- <button class="postButton" > ➕ </button> -->

      <img v-if="$store.state.username" @click="startPosting()" class="navimg" src="../../public/createpost.svg">

    <router-link 
      @click.native="leaveGroup();"
      v-if="$store.state.username"
      to="/groups">
        Groups
      </router-link>
      <!-- <router-link to="/">
        Home
      </router-link> -->
      <router-link
        @click.native="enterAccount();"
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
  <section>
  <div id="overlay"
  v-if="is_posting"
        >
        <div class="make-post">
            <div >
                <h3>make post</h3>
            </div>
            <div v-if="stage == 1" class="stage1">
            <button @click="isImage = false; stage = 2">Make Text Post</button>
            <button @click="isImage = true; stage = 2">Make Image Post</button>
            <br>
            <br>
            </div>
            <div v-else-if="stage == 2">
            <div v-if="!isImage">
              <h3>Create Textual Freet</h3>
              <div>
                <p>Content:</p>
                <textarea id="content" name="content" v-model="textContent"></textarea>
              </div>
              <div>

              <input type="file" id="image" name="image"  accept="image/png, image/jpeg"  @change="uploadImage">
              </div>
            </div>

            <div v-else>
              <h3>Create Image Freet</h3>
              <div>
              <input type="file" id="image" name="image"  accept="image/png, image/jpeg" @change="uploadImage">
              </div>
              <img v-bind:src="imageContent"  class="uploading-image" contain/>
            </div>
            <br>
            <button @click="stage=3"> Next </button>
            <br>
            <button @click="stage=1; textContent = null; imageContent = null;">back</button>
          </div>
          <div v-else-if="stage == 3">
            <h3> Add Tags </h3>
            <input v-model="tag">
            <button @click="(tag  && !tags.includes(tag)) ? tags.push(tag) : null;"> Add tag</button>
            <p v-for="tagg in tags"> {{tagg}} </p>
            
            <button @click="stage=2; tags = []; tag = '';">back</button>
          <br>
          <br>
          <button @click="isImage ? makeImagePost() : makeTextPost()">MakePost</button>
          <div v-if="message"> {{message}}</div>
          <br>
          <br>
        </div> 

        <button @click="stopPosting()">Close</button>
      </div>
          
        
  </div> 
  </section>
  </section>
</template>

<script>
import BlockForm from '@/components/common/BlockForm.vue';
import router from '../../router.ts';

export default {
  name: 'NavBar',
  data(){
    return{
      search_tag: '',
      is_posting: false,
      isImage: false,
      stage: null, 
      textContent: null,
      imageContent: null,
      tags:[],
      tag: '',
      message: '',
    };
  },
  methods: {
    enterAccount(){
      this.$store.commit("updateIsInAccount", true); 
      this.$store.commit("updateIsSearch", false);
      this.search_tag = '';
    },
    uploadImage(e){
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e =>{
            this.imageContent = e.target.result;
        };
    },
    async search(){
      const url = `/api/tag?tagname=${this.search_tag}`;
      const r = await fetch(url);
      const res = await r.json();
      if(r.ok){
        // this.$store.commit("updateSearchPosts", res);
      }
      this.$store.commit("updateSearchedWord", this.search_tag);
      this.$store.commit("updateIsSearch", true);
      if(! (this.$router.history.current.name === "Feed")){
        router.push({path: '/feed'});
      }
      else{
        this.$store.commit("updateFreets", res);
      }
    },
    async leaveGroup(){
      this.search_tag = '';
      if(this.$store.state.groupId){
        const url = `/api/groups/session`;
        const r = await fetch(url,{method: 'DELETE'});
        const res = await r.json();
      }
      this.$store.commit('updateFreets', []);
      this.$store.commit('setGroupId', null);
      this.$store.commit("updateIsSearch", false);
      this.$store.commit("updateIsInAccount", false);
      this.$store.commit('refreshGroups');

    },
    async leaveSearch(){
      const url = '/api/tag/search';
      const r = await fetch(url, {method: 'DELETE'});
      this.search_tag = '';
      this.$store.commit("updateIsSearch", false);
      this.$store.commit("updateSearchedWord", null);
      this.$store.commit("updateIsInAccount", false);
      this.$store.commit('updateFreets', []);
      if(this.$store.state.groupId){
        this.getAllFreets("0");
      }else{
        this.$router.back();
      }
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
      
        const r = await fetch(url, options);
        const res = await r.json();
        if(r.ok) {
          console.log("My freets");
          console.log(res);
          this.$store.commit('updateFreets', res);
        }
    },
    startPosting(){
      this.is_posting = true;
      this.stage = 1;

    },
    stopPosting(){
      this.is_posting = false;
      this.stage = null;
      this.textContent = null;
      this.imageContent = null;
      this.tags=[];
      this.tag = '';
    },
    async makeTextPost(){
      const url = `/api/freets`;
      const fields = new Object();
      fields.content = this.textContent;
      fields.image = this.imageContent;
      const options = {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin',
          body: JSON.stringify(fields),
      };

        const r = await fetch(url, options);
        const res = await r.json();
        if(r.ok) {
          console.log(res);
          const tags = await this.addTags(res.freet._id);
          this.$store.commit('refreshMyFreets');
          this.message = res.message;
      }else{
        this.message = res.error;
      }
      
    },
    async makeImagePost(){
      const url = `/api/freets/imageFreet`;
      const fields = new Object();
      fields.contentContent = '';
      fields.image = this.imageContent;
      
      const options = {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          credentials: 'same-origin',
          body: JSON.stringify(fields),
      };
      
        const r = await fetch(url, options);
        const res = await r.json();
        if(r.ok) {
          console.log(res);
          await this.addTags(res.freet._id);
          this.$store.commit('refreshMyFreets');
          console.log("refreshed freets");
          console.log(this.$store.state.myfreets);
          this.message = res.message;
      }else{
        this.message = res.error;
      }
    },
    async addTags(freetId){
      for(const teig of this.tags){
        const url = `/api/tag`;
        const fields = new Object();
        fields.freetId = freetId;
        fields.tag = teig;
        
        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
            body: JSON.stringify(fields),
        };
        
        const r = await fetch(url, options);
        const res = await r.json();
      }

    }
  }
};
</script>



<style scoped>

.tagged-search{
  height: 38px;
  display: flex;
  font-size: 20px;
}

nav {
    padding: 1vw 2vw;
    background-color: #78c5df;
    /* display: flex; */
    justify-content: space-between;
    align-items: center;
    width:100%;
    position: fixed;
    z-index: 1;
    height: 75px;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}
.logo{
  display: flex;
  float: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.right {
  float: right;
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
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

#overlay .make-post{
    background-color: white;
    width:50%;
    aspect-ratio : 1 / 1;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.stage1{
  /* display: flex; */
  align-items: center;
}
.backButton{
  float: left;
  font-size: 30px;
  background-color:  #78c5df;
  border: none;
  width: 50px;
  z-index: 1;
  padding-top: 5px;
}

.groupsLink{
  padding-top: 10px;
  text-align: center;
  background-color:#78c5df;
  height:50px;
  width: 70px;
}
.postButton{
  border: 3px solid black;
  background-color: #78c5df;
  width:40px;
  height:40px;
  font-size: 25px;
  /* text-align: center; */
  padding:0px;
}

.navimage {
  width: 30px;
  height: 30px;

}
</style>
