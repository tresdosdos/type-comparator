<img src="https://pp.userapi.com/c852036/v852036486/bbce5/DCotw_jzAKo.jpg" width="100" alt="Logo" align="right" />

![](https://img.shields.io/npm/v/type-comparator.svg?style=flat)
![](https://img.shields.io/npm/l/type-comparator.svg?style=flat)
![](https://img.shields.io/npm/dm/type-comparator.svg?style=flat)
![](https://img.shields.io/travis/lightness/type-comparator.svg?style=flat)
![Codecov](https://img.shields.io/codecov/c/github/lightness/type-comparator.svg?style=flat)

# Type Comparator

Useful comparator functions written on Typescript

## Table of Contents

  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [asc / desc](#ascdesc)
    - [reverse](#reverse)
    - [map](#map)
    - [if (functional way)](#if)
    - [if (chaining way)](#chainif)
    - [queue / use](#queue)
  - [Support](#support)
  - [Contributing](#contributing)

## Installation

```sh
npm i type-comparator
```

## Usage

<a name="ascdesc"></a>
### Base comparators: `asc` and `desc` 

`asc` is simple comparator contains just base comparison logic. 

It works well with numbers...

```ts
const array = [17, 4, -17, 42, -3, 0];

// [-17, -3, 0, 4, 17, 42]
array.sort(asc); 
array.sort(cmp().asc());
```

And with strings...

```ts
const array = ['aaa', 'bax', 'a', 'x', 'ax', 'ab', 'ba', 'bx'];

// ["a", "aaa", "ab", "ax", "ba", "bax", "bx", "x"]
array.sort(asc); 
array.sort(cmp().asc())
```

Even with dates...

```ts
const array = [new Date(2018, 0, 1), new Date(2017, 0, 1), new Date(2019, 0, 1)];

// [Date(2017, 0, 1), Date(2018, 0, 1), Date(2019, 0, 1)]
array.sort(asc); 
array.sort(cmp().asc()); 
```

Actually it works well with everything comparable by `>` and `<`. 

**NOTE** Every values which are neither `>` nor `<` are equal.

As you can see below, the initial order remains. If you want to sort by value of some item property, take a look on `map` function.

```ts
var array1 = [{a: 1}, {a: 5}];
var array2 = [{a: 5}, {a: 1}];

array1.sort(asc); // [{a: 1}, {a: 5}]
array2.sort(asc); // [{a: 5}, {a: 1}]
```

<a name="reverse"></a>
### Function `reverse(comparator)` and `.reverse()` chain
```ts
import { asc, cmp, reverse } from 'type-comparator';

const functionalCmp = reverse(asc);
const chainingCmp = cmp().reverse().use(asc);
const array = [17, 4, -17, 42, -3, 0];

// [ 42, 17, 4, 0, -3, -17 ]
array.slice().sort(functionalCmp);  
array.slice().sort(chainingCmp);
```

<a name="map"></a>
### Function `map(mapper, comparator)` and `.map(mapper)` chain
```ts
import { asc, cmp, map } from 'type-comparator';

const mapper = x => x.a;
const functionalCmp = map(mapper, asc);
const chainingCmp = cmp().map(mapper).use(asc);
const array = [{ a: 15 }, { a: 5 }];

// [ { a: 5 }, { a: 15 } ]
array.slice().sort(functionalCmp);  
array.slice().sort(chainingCmp);
```

<a name="if"></a>
### Function `condition(conditionFn, comparatorA, comparatorB)` 
```ts
import { asc, cmp, condition } from 'type-comparator';

const conditionFn = x => x % 2 === 0;
const functionalCmp = condition(conditionFn, asc, desc);
const array = [17, 4, -17, 42, -3, 0];

// [ 17, -3, -17, 0, 4, 42 ]
array.slice().sort(functionalCmp);
```

<a name="chainif"></a>
### Chain `.if(conditionFn)` 
```ts
import { asc, cmp, condition } from 'type-comparator';

const conditionFn = x => x % 4 === 0;
const conditionFn2 = x => x % 2 === 0;
const chainingCmp = cmp()
    .if(conditionFn).then(asc)
    .elif(conditionFn2).then(asc)
    .else(asc);
const array = [17, 4, -17, 42, -3, 0];

// [ -17, -3, 17, 42, 0, 4 ]
array.slice().sort(chainingCmp);
```

<a name="queue"></a>
### Function `queue(comparators)` and `.use(comparators)` chain
```ts
import { asc, cmp, desc, map, queue } from 'type-comparator';

const functionalCmp = queue([
    map(x => x.name, asc),
    map(x => x.age, desc),
]);
const chainingCmp = cmp().use([
    cmp().map(x => x.name).use(asc),
    cmp().map(x => x.age).use(desc),
]);
const array = [
    { name: 'Alex', age: 21 },
    { name: 'Jane', age: 19 },
    { name: 'Alex', age: 26 },
];

// [ 
//    { name: 'Alex', age: 26 },
//    { name: 'Alex', age: 21 },
//    { name: 'Jane', age: 19 } 
// ]
array.slice().sort(functionalCmp);
array.slice().sort(chainingCmp);    
```

### Something more complex?... Ok!
```ts
import { asc, cmp, desc } from 'type-comparator';

const comparator = cmp()
    .map(x => x.a)
    .use([
        cmp()
            .map(x => x.b)
            .use(desc),
        cmp()
            .if(x => (x.b + x.c) % 2 === 0)
            .map(x => x.c)
            .use(asc),
    ]);

const array = [
    { a: { b: 1, c: 7 } },
    { a: { b: 1, c: 6 } },
    { a: { b: 1, c: 5 } },
    { a: { b: 1, c: 4 } },
    { a: { b: 1, c: 3 } },
    { a: { b: 3, c: 2 } },
];

// [
//     { a: { b: 3, c: 2 } },
//     { a: { b: 1, c: 4 } },
//     { a: { b: 1, c: 6 } },
//     { a: { b: 1, c: 3 } },
//     { a: { b: 1, c: 5 } },
//     { a: { b: 1, c: 7 } },
// ]
array.slice().sort(comparator);
```
****
## Support

Please [open an issue](https://github.com/lightness/type-comparator/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/fraction/readme-boilerplate/compare/).