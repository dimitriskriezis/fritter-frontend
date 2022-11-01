<!-- v-on:click.native="viewGroup(group)" -->
<template>
    <main>
      <section>
        <header>
          <h2>Choose a group to continue</h2>
        </header>
      </section>
      <section
        v-if="$store.state.groups.length"
      >
      <div class="group-container">
        <div v-for="group in $store.state.groups">
        <GroupComponent
          :key="group.id"
          :group="group"
          
        />
        </div>
        <!-- <p v-if="">hallo</p> -->
        <!-- <div v-if="group.id==2"> hallo</div> -->
        <div @click = "addGroup" class="group">
            Add Group
        </div>
        </div>
        <div 
        id="overlay"
        v-if="makeGroup"
        >
        <div class="creategroupform">
            <div id="create-group">
                <h3>Create Group</h3>
                <label>Group Name</label>
                <br>
                <input v-model="groupname">
                <br>
                <div class="buttons">
                <button @click="cancelGroup()"> Cancel </button>
                <button @click="createGroup()"> Create Group</button>
                </div>
        </div>
        </div>
        </div> 
      </section>
      
    </main>
  </template>


<script>

import GroupComponent from '@/components/Groups/GroupComponent.vue';
import router from '../../router.ts';

export default {
    name: 'GroupsPage',
    components: {GroupComponent},
    data() {
        return {
            makeGroup: false,
            groupname: '',
        };
    },
    mounted() {
        this.getAllGroups()
    },

    methods: {
        cancelGroup(){
            this.makeGroup=false;
            this.groupname='';
        },
        async createGroup(){
            const url = `/api/groups/create`;
            const fields = new Object();
            fields.group_name = this.groupname;
            const options = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify(fields),
            };
            try{
                const r = await fetch(url, options);
                if(!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
            this.makeGroup = false
            this.$store.commit('refreshGroups');
        },
        async getAllGroups(){
            const url = `/api/groups`;
            try{
                const r = await fetch(url);
                const res = await r.json();
                if(!r.ok){
                    throw new Error(res.error);
                }
                console.log(res);
                this.$store.commit('updateGroups', res);
            }catch(e){
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async addGroup(){
            this.makeGroup = true;
        },
        async viewGroup(group) {
            // post to enter
            const url = `/api/groups/session`;
            const fields = new Object();
            console.log(group._id);
            fields.groupId = group._id;
            const options = {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                credentials: 'same-origin',
                body: JSON.stringify(fields),
            };
            try{
                const r = await fetch(url, options);
                if(!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }

            const name = group.groupName;
            this.$store.commit('setGroupId', group._id);
            router.push({path: '/feed'})
        }
    }
}
</script>

<style scoped>
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

#overlay .creategroupform{
    background-color: white;
    width:30%;
    aspect-ratio : 1 / 1;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.group-container{
    display:flex;
    gap: 20px;
}
.group-container .group{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  width: 200px;
  margin: 5px;
  text-align: center;

}
</style>