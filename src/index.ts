import { getUrlParams } from "./utils/UrlParams";
import { AdvPlayer } from "./AdvPlayer";
import { createApp } from "./utils/createApp";

const { id, tl, at, renderer } = getUrlParams();

let app;
if (renderer) {
    if (renderer.toLocaleLowerCase() === 'gl') {
        console.log("Using WebGL renderer");
        app = await createApp('webgl');
    }
    else if (renderer.toLocaleLowerCase() === 'gpu') {
        console.log("Using WebGPU renderer");
        app = await createApp('webgpu');
    }
}
else {
    app = await createApp();
}

const advplayer = AdvPlayer.create(); //create Adv Player
await advplayer.init(); // init Adv Player
if (app) {
    advplayer.addTo(app.stage);
} else {
    throw new Error("Failed to create app.");
}

// advplayer.loadAndPlay('1000000');
// advplayer.loadAndPlay('110081');
// advplayer.loadAndPlay('2001206');
// advplayer.loadAndPlay('110081'); 
// advplayer.loadAndPlay('1010110', 'zhcn');
// 1010119

if (id) {
  advplayer.loadAndPlay(id, tl, at);
} else {
  let _id = prompt("Please enter the story Id", "1000000");
  _id && advplayer.loadAndPlay(_id, tl, at);
}