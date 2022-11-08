<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
    <section>
      <h2> My Freets </h2>
      <section 
          v-if="$store.state.myfreets.length"
        >
          <FreetComponent
            v-for="freet in $store.state.myfreets"
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
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    FreetComponent,
  },
  data(){
    return{
      myFreets:this.$store.state.myfreets,
    };
  },
  async mounted() {
    if(this.$store.state.username){
        await this.getAllFreets("0");
    }else{
      this.$store.commit("updateFreets", []);
    }
  },
  methods: {
    async getAllFreets(mode) {
      const url = `/api/freets?author=${this.$store.state.username}`;
      
      const r = await fetch(url);
      const res = await r.json();
      if(!r.ok) {
          throw new Error(res.error);
      }
      console.log("My freets");
      console.log(res);
      // this.myFreets = res;
      this.$store.commit('updateMyFreets', res);
    }
  }
};
</script>
