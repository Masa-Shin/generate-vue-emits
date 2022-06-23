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

<script lang="ts">
export default {
  functional: true,
  props: ['level'],
  render(h, { props, data, children }) {
    return h(`h${props.level}`, data, children)
  }
  // no emit
}
</script>

<style lang="scss" scoped>
a {
  cursor: pointer;
  white-space: nowrap;
}
</style>
