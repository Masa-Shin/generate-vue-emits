# generate-vue-emits
A cli tool to generate `emits` option from Vue files.

The tool analizes all `emit` call in the files and creates `emits` option from them, then inserts it into the original files. It supports both composition and options API.

## 🚀 Usage

```bash
$ npx generate-vue-emits generate -- ./src/**/*.vue
```

Here is an example output:

```diff
export default {
  name: 'UserList',
  components: {},
+    emits: { click: () => true,  input: (payload: string) => true, },
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

Note that the tool does not format the output itself. It is strongly recommended that you use it with some formatter.

You can specify the position that the option should be inserted (By default it would be inserted as the third item of the options).

```bash
$ npx auto-insert-emits generate -p 0 -- ./src/**/*.vue # inserted on the top.
```

## 📄 License

MIT.

## 🙏 Special Thanks

This repository uses [kawamataryo](https://github.com/kawamataryo)'s wounderful [suppress-ts-errors](https://github.com/kawamataryo/suppress-ts-errors) repository as a boilerplate.