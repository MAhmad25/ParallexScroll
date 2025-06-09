import Lenis from "lenis";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { randomNumber } from "./randomNumber";

gsap.registerPlugin(SplitText, ScrollTrigger);
const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
            return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll;
      },
      getBoundingClientRect() {
            return {
                  top: 0,
                  left: 0,
                  width: window.innerWidth,
                  height: window.innerHeight,
            };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed",
});
lenis.on("scroll", ScrollTrigger.update);

function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
lenis.on("scroll", ({ scroll }) => {
      document.querySelectorAll("[data-scroll-speed]").forEach((el) => {
            const speed = parseFloat(el.dataset.scrollSpeed);
            el.style.transform = `translateY(${-scroll * (1 - speed)}px)`;
            el.style.willChange = "transform";
      });
});
const text = document.querySelector(".h1");
const split = new SplitText(text, { type: "chars" });

split.chars.forEach((letter) => {
      const randomY = randomNumber(70, 110);
      gsap.fromTo(
            letter,
            {
                  yPercent: -randomY * 13,
                  opacity: 0,
            },
            {
                  yPercent: 0,
                  opacity: 1,
                  stagger: 0.1,
                  ease: "none",
                  scrollTrigger: {
                        trigger: text,
                        start: "top bottom",
                        end: "bottom 60%",
                        scrub: 1.1,
                  },
            }
      );
});
