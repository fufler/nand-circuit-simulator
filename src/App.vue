<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">About</router-link>
      <router-link to="/circuit-simulator">Circuit simulator</router-link>
    </div>
    <div class="wrapper">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
  html, body {
    padding: 0;
    margin: 0;

    height: 100vh;
  }

  html {
    --color1: #424b54;
    --color2: #7c90db;
    --color3: #f5e663;
    --color4: #bc4b51;
    --color5: #73a580;
    --color6: #273043;
    --color7: #eff6ee;
  }
</style>

<style scoped lang="scss">
#app {
  height: 100%;

  display: flex;
  flex-direction: column;

  .nav {
    background-color: var(--color1);

    box-shadow: 0 0 10px var(--color2);

    padding: 10px 0;

    display: flex;
    column-gap: 10px;
    justify-content: center;

    a {
      color: var(--color7);
      text-decoration: none;

      position: relative;

      &.router-link-exact-active {
        color: var(--color3);

        &:after {
          content: '';

          position: absolute;
          bottom: -5px;
          left: 0;

          height: 3px;
          width: 100%;

          background-color: var(--color3);
        }
      }
    }
  }

  .wrapper {
    flex: 1;

    display: flex;
  }
}
</style>
