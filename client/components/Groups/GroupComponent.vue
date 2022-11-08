<template>
    
    <section class="wholegroup">
        <article class="group">
            <h2>
                {{ group.groupName}}
            </h2>
            <button  @click="viewGroup">
                Enter
            </button>
            <br>
            <button class="deleteButton" @click="deleteGroup(group._id)">
                Delete 
            </button>
        </article>
        <section class="groupalert">
        <article>
            <p>{{ alerts }}</p>
            <!-- <p>yoho</p> -->
        </article>
        </section>
    </section>
</template>

<script>
import router from '../../router.ts';

export default {
    name: 'GroupComponent',
    props: {
        group: {
            type: Object,
            required: true
        }
    },
    data(){
        return {
            alerts: '',
        };
    },
    methods: {
        async deleteGroup(groupId){
            const url = `/api/groups/delete/${groupId}`;
            try{
                const r = await fetch(url,{method: 'DELETE'});
                const res = await r.json();
                if(!r.ok) {
                    console.log(res.error);
                    throw new Error(res.error);
                    this.alerts = res.error;
                }
            } catch (e) {
                console.log(e);
                console.log(e.message);
                console.log(typeof e.message);
                this.alerts = e.message;
                console.log(this.alerts);
                setTimeout(() => this.alerts = '', 3000);   
            }
            this.$store.commit('refreshGroups');

        },
        async viewGroup(){
            const url = `/api/groups/session`;
            const fields = new Object();
            console.log(this.group._id);
            fields.groupId = this.group._id;
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

            const name = this.group._id;
            this.$store.commit('setGroupId', name);
            router.push({path: '/feed'})
        }
    },
    
}
</script>

<style scoped>
 .group{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  width: 200px;
  height: 250px;
  padding: 5px;
}

h2{
    margin-bottom: 50px;
    
}

button{
    width: 100px;
    height: 50px;
    background-color:  #78c5df;
    border: None;
    font-size: 20px;
}

.groupalert{
    z-index: 99;
    background-color: red;
    color: white;
    font-size: 12px;
    text-align: center;
}

/* .wholegroup{
    display: flex;
    justify-content: center;
    flex-direction: column;
} */
</style>