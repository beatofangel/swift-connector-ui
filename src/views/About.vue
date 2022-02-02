<template>
  <v-container>
    <v-row>
      <v-col>
          <v-card
            class="overflow-y-auto"
            max-height="calc(100vh - 24px)"
          >
            <v-card-title>
              {{ $t("label.about") }} &lt;swift-connector&gt;
            </v-card-title>
            <v-card-text>
              <div>
                <p>The MIT License (MIT)</p>
                <p>Copyright © 2013-2021 Eric Wang &lt;beatofangel@gmx.com&gt;</p>
                <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                <p>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
      name: 'about'
  }
</script>