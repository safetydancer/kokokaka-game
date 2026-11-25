// The two strips in the atlas contain a pink eye and its matching painted iris.
(() => {
  const atlas = new Image();
  atlas.src = new URL('orange-creature-eyes.png', document.currentScript.src).href;
  const eyes = [
    {x:582, y:581, w:105, h:96, irisX:17, irisY:57},
    {x:827, y:665, w:81, h:91, irisX:8, irisY:54}
  ];
  class CreatureGaze extends HTMLElement {
    connectedCallback() {
      this.style.cssText = 'position:absolute;inset:0;pointer-events:none';
      const listeners = new AbortController();
      this.listeners = listeners;
      const options = {signal:listeners.signal};
      const nose = document.createElement('button');
      nose.type = 'button';
      nose.setAttribute('aria-label', "Bop the creature's nose");
      nose.style.cssText = 'position:absolute;left:64.54%;top:53.27%;width:3.06%;height:2.4%;clip-path:polygon(60% 0,70% 0,100% 100%,0 72%);pointer-events:auto;cursor:pointer;appearance:none;background:transparent;border:0;padding:0;margin:0;min-width:0;min-height:0';
      const thought = document.createElement('span');
      thought.className = 'studio-speech';
      thought.setAttribute('role','status');
      thought.style.cssText = 'position:absolute;bottom:3.8%;right:5.6%;max-width:88%;font-size:27px;text-align:right;pointer-events:none';
      this.append(nose,thought);
      const messages = ['Bop!', 'Got your nose!', "Boppin' your nose!"];
      let previous;
      let hideTimer;
      nose.addEventListener('click', event => {
        event.stopPropagation();
        const choices = messages.filter(message => message !== previous);
        previous = choices[Math.floor(Math.random() * choices.length)];
        thought.textContent = previous;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => { thought.textContent = ''; },3000);
      },options);
      listeners.signal.addEventListener('abort',() => clearTimeout(hideTimer),{once:true});
      const layers = eyes.map(({x,y,w,h}) => {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.style.cssText = `position:absolute;image-rendering:pixelated;left:${100*x/1145}%;top:${100*y/1374}%;width:${100*w/1145}%;height:${100*h/1374}%`;
        this.append(canvas);
        return canvas.getContext('2d');
      });
      let pointer;
      const draw = () => {
        if (!atlas.naturalWidth) return;
        const rect = this.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        eyes.forEach(({x,y,w,h,irisX,irisY},i) => {
          let shiftX = 0;
          let shiftY = 0;
          if (pointer) {
            const dx = (pointer.clientX-rect.left)*1145/rect.width-x-w/2;
            const dy = (pointer.clientY-rect.top)*1374/rect.height-y-h/2;
            const distance = Math.hypot(dx,dy,110);
            shiftX = 2*Math.round((w/2-irisX+w*.33*dx/distance)/2);
            shiftY = 2*Math.round((h/2-irisY+h*.24*dy/distance)/2);
          }
          const ctx = layers[i];
          ctx.clearRect(0,0,w,h);
          ctx.drawImage(atlas,0,i*120,w,h,0,0,w,h);
          ctx.globalCompositeOperation = 'source-atop';
          ctx.drawImage(atlas,108,i*120,92,120,shiftX-30,shiftY-12,92,120);
          ctx.globalCompositeOperation = 'destination-over';
          ctx.drawImage(atlas,212,i*120,w,h,0,0,w,h);
          ctx.globalCompositeOperation = 'source-over';
        });
      };
      const rest = () => { pointer = null; draw(); };
      window.addEventListener('pointermove',event => { pointer = event; draw(); },options);
      document.documentElement.addEventListener('pointerleave',rest,options);
      window.addEventListener('pointercancel',rest,options);
      window.addEventListener('blur',rest,options);
      window.addEventListener('resize',draw,options);
      atlas.addEventListener('load',draw,options);
      draw();
    }
    disconnectedCallback() {
      this.listeners.abort();
      this.replaceChildren();
    }
  }
  customElements.define('creature-gaze',CreatureGaze);
})();
