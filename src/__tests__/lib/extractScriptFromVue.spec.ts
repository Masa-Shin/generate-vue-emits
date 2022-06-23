import { describe, it, expect } from "vitest";
import { extractScriptFromVue } from "../../lib/extractScriptFromVue";

describe("extractScriptFromVue", () => {
  it.each([
    {
      source: `
      <template>
        <div class="hello">hello</div>
      </template>

      <script lang="ts">
        import Vue from 'vue'

        export Vue.extend({
          name: 'HelloWorld',
          data() {
            return {
              message: 'Hello World!'
            }
          }
        })
      </script>

      <style>
        .hello {
          color: red;
        }
      </style>
      `,
      expected: `
        import Vue from 'vue'

        export Vue.extend({
          name: 'HelloWorld',
          data() {
            return {
              message: 'Hello World!'
            }
          }
        })
      `,
    },
    {
      source: `
      <template>
        <div class="hello">hello</div>
      </template>

      <script>
        import Vue from 'vue'

        // export
        export Vue.extend({
          name: 'HelloWorld',
          data() {
            return {
              message: 'Hello World!'
            }
          }
        })
      </script>

      <style>
        .hello {
          color: red;
        }
      </style>
      `,
      expected: `
        import Vue from 'vue'

        // export
        export Vue.extend({
          name: 'HelloWorld',
          data() {
            return {
              message: 'Hello World!'
            }
          }
        })
      `,
    },
  ])("extractScript", ({ source, expected }) => {
    const result = extractScriptFromVue(source);

    expect(result.script).toEqual(expected);
  });
});
