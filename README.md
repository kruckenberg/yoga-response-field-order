# Reproduction of Issue #3256

[Issue #3256](https://github.com/dotansimha/graphql-yoga/issues/3256)
reports that a Yoga response can return fields in an order that fails to match
the request's field order.

This repository provides a reproduction of the issue and identifies its cause.

## Cause

Response fields with async resolvers can become mis-ordered when the `@graphql-tools/executor`
executor "transforms a JS object `Record<string, Promise<T>>` into
a `Promise<Record<string, T>>`". The `object` passed into `promiseForObject` has
properly ordered keys, but those keys are inserted into `resolvedObject` in the
[order in which their promise values are resolved](https://github.com/ardatan/graphql-tools/blob/master/packages/executor/src/execution/promiseForObject.ts#L23).

The bug was introduced in [commit `882440487551abcb5bdd4f626f3b56ac2e886f11`](https://github.com/ardatan/graphql-tools/commit/882440487551abcb5bdd4f626f3b56ac2e886f11).

## Reproductions

### Single Async Field Resolver

The bug can be reproduced with a simple schema containing one or more synchronous
field resolvers and a single asynchronous field resolver.

Run `npm run single-async` and execute the following query:

```graphql
{
  fieldOrder {
    first
    second
    third
    fourth
    fifth
  }
}
```

No matter what order you ask for the fields, `first` (the only asynchronously
resolved field) will always be returned last.

### Staggered Async Field Resolvers

To see that the order of fields in the response matches the order of promise
resolution, run `npm run staggered-async`, issue the same query, and
confirm that, regardless of the order in which the fields are requested, the
response will always order them from shortest delay (`fifth`) to longest delay
(`first`).
