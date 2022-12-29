# generate-vue-emits
A cli tool to generate `emits` options from Vue files.

The tool analizes all `emit` calls in script tags of Vue SFC files and creates `emits` option from them, then inserts it into the original files. It supports both composition and options API.

＊ It cannot detect `emit` calls in template tags.

## 🚀 Usage

```bash
$ npx generate-vue-emits generate -- ./src/**/*.vue
```

Here is an example output:

```diff
export default {
  name: 'UserList',
  components: {},
+    emits: { input: null, click: null },
  methods: {
    onClick() {
      this.$emit('click')
    }
    onInput(value: string) {
      this.$emit('input', value)
    }
  }
}
```

＊ Note that the tool does not format the output itself. ** It is strongly recommended that you use it with some formatter. **

If `-t` option is set, typed validation functions are inserted instead of `null`.

```bash
$ npx auto-insert-emits generate -t -- ./src/**/*.vue
```

```ts:example
export default {
  name: 'UserList',
  components: {},
+    emits: { input: (payload: string) => payload, click: () => true },
.
.
.
}
```

You can also specify the position where `emits` option should be inserted by `-p` option (By default it would be inserted as the third item of the options).

```bash
$ npx auto-insert-emits generate -p 0 ./src/**/*.vue # inserted on the top.
```

## 📄 License

MIT.

## 🙏 Special Thanks

This repository uses [kawamataryo](https://github.com/kawamataryo)'s wounderful [suppress-ts-errors](https://github.com/kawamataryo/suppress-ts-errors) repository as a boilerplate.
