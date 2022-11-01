<template>
    <article class="group">
        <h3 @click="viewGroup">
            {{ group.groupName}}
        </h3>
        <div @click="deleteGroup(group._id)">
            Delete 
        </div>
</article>
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
    methods: {
        async deleteGroup(groupId){
            const url = `/api/groups/delete/${groupId}`;
            try{
            const r = await fetch(url,{method: 'DELETE'});
            const res = await r.json();
            if(!r.ok) {
                throw new Error(res.error);
            }
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
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
  margin: 5px;
  width: 200px;
  height: 250px;
}
</style>