# v-for

Vue 3 for loop component similar to laravel blade's `foreach` directive.

---

## Install

```bash
npm install --save v-for
```

## Setup

```js
import { createApp } from "vue";
import App from "./App.vue";

import vFor from "v-for";

const app = createApp(App);
app.use(vFor);
app.mount("#app");
```

## Usage

The `for` component accepts a `of` prop which can be passed an **Array**, and exposes `item` and `$loop` data via the default scoped slot. The `$loop` variable here is similar to the `$loop` variable present in blade's `foreach` directive.

```vue
<template>
    <for v-slot="{ item, $loop }" :of="[1, 2, 3]">
        <div :key="item">
            {{ $loop.index }} .
            {{ item }}
            <br />
        </div>
    </for>
</template>
```

## `$loop`

The `$loop` variable exposes the following properties:

|   Name    |  Type   | Desctiption                                                                         |
| :-------: | :-----: | ----------------------------------------------------------------------------------- |
|   index   | Number  | The current index for the loop _(starts from 0)_                                    |
| iteration | Number  | Iteration count for the loop _(starts from 1)_                                      |
| remaining | Number  | Count of remaining elements in the Array to loop over                               |
|   count   | Number  | Total elements in the Array                                                         |
|   first   | Boolean | `true` if it is the first iteration of the loop, `false` otherwise                  |
|   last    | Boolean | `true` if it is the last iteration of the loop, `false` otherwise                   |
|   even    | Boolean | `true` for even iterations of the loop, `false` otherwise                           |
|    odd    | Boolean | `true` for odd iterations of the loop, `false` otherwise                            |
|   depth   | Number  | The depth of the loop; starts at _1_ and increases by _1_ for nested loop instances |

## Break and Continue

There is **limited** support for break and continue statements within the loop via `break` and `continue` components.

```vue
<template>
    <for v-slot="{ item, $loop }" :of="[1, 2, 3]">
        <div :key="item">
            {{ $loop.index }} .

            <continue v-if="item === 1" />

            {{ item }}

            <break v-if="item === 2" />

            <br />
        </div>
    </for>
</template>
```

The support is **limited** in the sense that theses components cannot be used inside the slot of another custom component in the loop.

```vue
<template>
    <for v-slot="{ item, $loop }" :of="[1, 2, 3]">
        <div :key="item">
            {{ $loop.index }} .
            <custom-component>
                {{ item }}
                <br />

                <!--  "continue" is present inside  "custom-component"  -->
                <!-- this will not work -->
                <continue v-if="item === 1" />
            </custom-component>
        </div>
    </for>
</template>
```

## Nested loops

Loops can be nested as well. The `$loop` variable for nested loops can be aliased so as to have access to parent loop's `$loop` variable as well.

```vue
<template>
    <for v-slot="{ item, $loop }" :of="[1, 2, 3]">
        <div :key="item">
            {{ $loop.depth }} .
            {{ item }}
            <br />
            <for v-slot="{ item: item2, $loop: $loop2 }" :of="[4, 5, 6]">
                <div :key="item2">
                    {{ $loop2.depth }} . {{ $loop.depth }} .
                    {{ item2 }}
                    <br />
                </div>
            </for>
        </div>
    </for>
</template>
```
