<template>
  <ul class="p-header__pulldown-list">
    <li><router-link to="/account">アカウント設定</router-link></li>
    <li><router-link to="/settings/member_list">管理設定</router-link></li>
    <li>
      <router-link to="/mailbox/mail_templates"
        >メールテンプレート設定</router-link
      >
    </li>
    <li>
      <router-link to="/comment_templates/new"
        >コメントテンプレート設定</router-link
      >
    </li>
    <li><ProtectedLink href="/logout">ログアウト</ProtectedLink></li>
  </ul>
</template>

<script setup lang="ts">
import { ProtectedLink } from 'lapras-frontend'

console.log(111)

// test4

</script>

<style lang="scss" scoped>
a {
  cursor: pointer;
  white-space: nowrap;
}
</style>
