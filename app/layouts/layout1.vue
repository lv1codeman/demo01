<template>
  <v-layout class="rounded rounded-md border">
    <v-app-bar>
      <NuxtLink to="/">
        <v-app-bar-title class="pl-4">課務輔助工具</v-app-bar-title>
      </NuxtLink>
    </v-app-bar>

    <!-- <v-app-bar title="Application bar"></v-app-bar> -->

    <v-navigation-drawer>
      <v-list nav>
        <v-list-item title="回首頁" link to="/"> </v-list-item>
        <v-list-item title="資料庫維護" link to="/DB/DBmaintain"> </v-list-item>
        <v-list-item
          title="班級轉換(113)"
          link
          to="/ClassConverter/ClassConverter113"
        >
        </v-list-item>
        <v-list-item
          title="班級轉換(114)"
          link
          to="/ClassConverter/ClassConverter114"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex align-center justify-center">
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>

<style scoped>
.v-app-bar a {
  text-decoration: none;
  color: inherit;
}
</style>
